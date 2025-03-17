import {
  addMessage,
  getHistoryMessage,
  getLackMessage,
} from '@/services/service';
import { jsonParse } from '@/utils';

export interface ChatListItemProps {
  // 唯一标识
  id: string;
  // 名称
  name: string;
  // 创建时间 时间戳
  createdAt: number;
  // 消息内容
  content: {
    type?: string;
    // 文本
    text?: string;
    // 图片
    picUrl?: string;
  };
  // 是否已读
  isRead: boolean;
  // 头像图片地址
  avatar?: string;
}

export enum MESSAGE_TYPE {
  TEXT = 'TEXT',
  IMG = 'IMG',
  FEEDBACK = 'FEEDBACK',
}

// 后端给的数据结构
type MessageTypeFromServer = {
  messageId: string;
  seq: number;
  createTime: number;
  isSystem: number; // 0 客服 1 客户
  content: any;
  messageType: string;
  senderId?: string;
  name?: string;
  phone?: string;
  avatar?: string;
};

// 组件内使用的消息类型
export type MessageItem = {
  type: string;
  content: {
    text?: string;
    picUrl?: string;
    clientId?: string;
  };
  position?: 'left' | 'right';
  createdAt?: number;
  status?: 'pending' | 'sent' | 'fail';
  seq?: number;
  _id: string;
  [key: string]: any;
};

type SendMessageType = {
  type: MESSAGE_TYPE;
  content: {
    text?: string;
    picUrl?: string;
  };
};

type ChatInfoType = {
  chatId: string;
  // 当前登录人的信息
  agentInfo: {
    name: string;
    avatar: string;
  };
  // 客户的信息
  customerInfo: {
    name: string;
    avatar: string;
  };
};

/**
 * 默认提供的hooks 不好用！！同步获取的问题比较难解决
 */
export class ChatStore {
  private chatId: string;
  private chatInfo: ChatInfoType | null;
  private updateListener:
    | React.Dispatch<React.SetStateAction<string>>
    | null
    | undefined = null;
  // 消息有可能不是按顺序排的，概率很小，但是有可能，所以记录当前会话展示的最大和最小Seq
  private maxSeq = 0;
  private minSeq = Number.MAX_SAFE_INTEGER;

  // 加载历史数据，防止多次请求，数据可能会乱，所以加个标
  private isGettingHistory = false;

  messageList: MessageItem[] = [];
  otherState = {
    hasMore: false,
    moreLoading: false,
    initialLoading: true,
  };

  constructor(
    chatInfo: ChatInfoType,
    updateListener?: React.Dispatch<React.SetStateAction<string>>,
  ) {
    this.chatInfo = chatInfo;
    this.chatId = chatInfo.chatId;
    // 绑定监听
    this.updateListener = updateListener;
  }

  private getMaxMinSeqInMessage(messages: MessageItem[]) {
    messages.forEach((item) => {
      if (typeof item.seq === 'number') {
        this.maxSeq = Math.max(this.maxSeq, item.seq!);
        this.minSeq = Math.min(this.minSeq, item.seq!);
      }
    });
  }

  private formatMessage(data: MessageTypeFromServer): MessageItem {
    const position = data.isSystem === 0 ? 'left' : 'right';
    return {
      ...data,
      content: jsonParse(data.content),
      createdAt: data.createTime,
      _id: data.messageId,
      type: data.messageType,
      position,
      user:
        position === 'left'
          ? this?.chatInfo?.customerInfo
          : this?.chatInfo?.agentInfo,
    };
  }

  private formatMessages(messages?: MessageTypeFromServer[]): MessageItem[] {
    if (Array.isArray(messages)) {
      return messages.map((item) => {
        return this.formatMessage(item);
      });
    }
    return [];
  }

  private triggerUpdate() {
    // 触发更新
    this.updateListener?.(`${Date.now()}`);
  }

  // private setMessageList(messages: MessageItem[]) {
  //   this.messageList = messages;
  //   this.getMaxMinSeqInMessage(messages);
  //   this.triggerUpdate();
  // }
  /**
   *
   * @param messages 要插入的消息
   * @param index 从哪开始，默认插入末尾
   */
  private pushMessages(messages: MessageItem[], index?: number) {
    if (typeof index === 'number') {
      // 从指定位置插入
      this.messageList.splice(index, 0, ...messages);
    } else {
      // 默认插入末尾
      this.messageList.push(...messages);
    }
    this.getMaxMinSeqInMessage(messages);
    this.triggerUpdate();
  }

  /**
   *
   * @param messages 根据给定的消息更新seq指标
   */
  private updateSeq(messages: MessageItem[]) {
    this.getMaxMinSeqInMessage(messages);
  }

  /**
   *
   * @param messages 要插入的消息
   * @param index 从哪开始，默认插入末尾
   */
  private addHistoryMessages(messages: MessageItem[]) {
    this.messageList = messages.concat(this.messageList);
    this.getMaxMinSeqInMessage(messages);
    this.triggerUpdate();
  }

  private setOtherState(
    newState: Partial<typeof this.otherState>,
    isUpdate = true,
  ) {
    // 这里绑定，react中一个对应的状态
    this.otherState = {
      ...this.otherState,
      ...newState,
    };
    if (isUpdate) this.triggerUpdate();
  }

  private getExpectSeq() {
    return this.maxSeq + 1;
  }

  private onSendMessage(msg: SendMessageType) {
    // b端id
    const mockId = `C-${Date.now()}`;
    const msgQuote: MessageItem = {
      ...msg,
      content: {
        ...msg.content,
        // 为了判断推送给我消息，不是我刚刚发的消,
        clientId: mockId,
      },
      user: this?.chatInfo?.agentInfo,
      position: 'right',
      status: 'pending',
      _id: mockId,
    };
    this.pushMessages([msgQuote]);
    return addMessage({
      content: JSON.stringify(msgQuote.content),
      messageType: msg.type,
      chatId: this.chatId,
    })
      .then((res) => {
        const { messageId, seq } = res.data;
        msgQuote._id = messageId;
        msgQuote.seq = seq;
        msgQuote.status = 'sent';
        // 先更新ui，再获取缺失的消息
        this.updateSeq([msgQuote]);
        this.triggerUpdate();
        this.checkLackMessage(seq);
      })
      .catch(() => {
        msgQuote.status = 'fail';
        this.triggerUpdate();
      });
  }

  private checkIsMySendMsg(msg: MessageItem) {
    if (!msg.content.clientId) {
      return false;
    }
    return this.messageList.some((item) => {
      return (
        item.content.clientId && item.content.clientId === msg.content.clientId
      );
    });
  }

  private checkMessageIsExist(messageId: string) {
    return this.messageList.some((item) => item._id === messageId);
  }

  // 只针对新消息
  private checkLackMessage(messageSeq: number) {
    if (messageSeq < this.getExpectSeq()) {
      console.log('......旧消息'); // 不做处理 返回null
      return Promise.resolve(null);
    }
    if (messageSeq === this.getExpectSeq()) {
      // 说明是想要的消息， 没有缺失消息的情况, 旧消息上面已经给提示了
      return Promise.resolve([]);
    }

    // 获取缺失的消息， 必然是messageSeq > getExpectSeq(), 如果是小的，说明后端返回有问题。
    // 那就是去拿缺失的，start为当前最大的， 到messageSeq之间的数据
    return getLackMessage({
      startSeq: this.maxSeq,
      endSeq: messageSeq,
      chatId: this.chatId,
    }).then((res) => {
      if (res.data?.messageList && res.data?.messageList.length > 0) {
        const diffMessages = this.formatMessages(res.data.messageList);
        const index = this.messageList.findIndex(
          (item) => item.seq === messageSeq,
        );
        this.pushMessages(diffMessages, index);
      }
    });
  }

  // 加载历史消息
  private getHistoryMessage(seq?: number) {
    return getHistoryMessage({
      chatId: this.chatId,
      seq,
    })
      .then((res) => {
        const list = res.data.messageList || [];
        this.setOtherState(
          {
            initialLoading: false,
            moreLoading: false,
            hasMore: res.data.hasNext,
          },
          false,
        );
        this.addHistoryMessages(this.formatMessages(list));
      })
      .finally(() => {
        this.isGettingHistory = false;
      });
  }

  // 初始加载当前会话的消息
  init() {
    // 初始加载没有seq
    this.setOtherState({
      initialLoading: true,
    });
    this.getHistoryMessage();
  }

  loadMore() {
    if (this.isGettingHistory) {
      return Promise.resolve();
    }
    // 加载更多
    this.isGettingHistory = true;
    this.setOtherState({
      moreLoading: true,
    });
    return this.getHistoryMessage(this.minSeq);
  }

  // 接受消息
  receiveMessage(msg: MessageTypeFromServer) {
    const msgItem = this.formatMessage(msg);
    if (this.checkIsMySendMsg(msgItem)) {
      return;
    }
    if (this.checkMessageIsExist(msgItem._id)) return;
    if (typeof msgItem.seq !== 'undefined') {
      // 已入库的消息
      this.pushMessages([msgItem]);
      this.checkLackMessage(msgItem.seq);
    }
  }

  // 发送消息
  sendMessage(msg: SendMessageType) {
    return this.onSendMessage(msg);
  }

  // 添加不落库的消息
  addMockMessage(msg: Partial<MessageItem>) {
    this.messageList.push(msg as MessageItem);
    this.triggerUpdate();
  }

  destory() {
    this.chatInfo = null;
    this.updateListener = null;
  }
}
