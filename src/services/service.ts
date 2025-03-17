import { FTP_UPLOAD_FULL_URL, MINIO_PREFIX } from '@/constant';
import { getToken, jsonParse } from '@/utils';
import appRequest, { API_PREFIX } from '@/utils/request';
import { fetchEventSource } from '@microsoft/fetch-event-source';

// 上传图片
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('content', file);
  const res = await appRequest.post({
    url: FTP_UPLOAD_FULL_URL,
    data: formData,
  });
  if (res.data.content) return `${MINIO_PREFIX}${res.data.content}`;
  return '';
};

// 获取 FAQ 列表
export const getFAQList = (title?: string) => {
  return appRequest.post({
    url: '/help/list',
    data: { title },
  });
};

// 帮助中心和知识库检索
export const getHelpAndKnowledge = (title?: string) => {
  return appRequest.post({
    url: '/help/smartQA',
    data: { title },
  });
};

// 获取 FAQ 详情
export const getFAQDetil = (helpId: string) => {
  return appRequest.post({
    url: '/help/detail',
    data: { helpId },
  });
};

// 获取投诉记录
export const getComplaintList = () => {
  return appRequest.post({
    url: '/complaint/record',
  });
};

// 投诉详情
export const getComplaintDetail = (complaintId: string) => {
  return appRequest.post({
    url: '/complaint/detail',
    data: { complaintId },
  });
};

interface ComplaintParams {
  complaintType: string; // 投诉类型
  complaintProblem: string; //描述
  problemPicture?: string[]; // 问题截图
}

// 发起投诉
export const addComplaint = (data: ComplaintParams) => {
  return appRequest.post({
    url: '/complaint/add',
    data,
  });
};

// 创建会话
export const createChat = () => {
  return appRequest.post({
    url: '/c-chat/create',
  });
};

// 关闭会话
export const closeChat = (connectId: string) => {
  return appRequest.post({
    url: '/c-chat/close',
    data: { connectId },
  });
};

// 发送消息
export const addMessage = (data: any) => {
  return appRequest.post({
    url: '/c-chat/send',
    data,
  });
};

// 获取历史消息
export const getHistoryMessage = (data: any) => {
  return appRequest.post({
    url: '/c-chat/history',
    data,
  });
};

// 获取缺失消息
export const getLackMessage = (data: any) => {
  return appRequest.post({
    url: '/c-chat/miss',
    data,
  });
};

// 提交评价
export const evaluateComplaint = (data: any) => {
  return appRequest.post({
    url: '/c-chat/evaluate',
    data,
  });
};

// 是否存在未读消息
export const getUnreadMessage = (signal?: AbortSignal) => {
  return appRequest.post({
    url: '/c-chat/unread',
    signal,
  });
};

export const SSE_LINK = `${API_PREFIX}/c-chat/create/connect`;

export interface ICreateChatSSE {
  chatId: string;
  connectId: string;
  ctrl: AbortController;
  onMessage?: (chatMessageInfo: any) => void;
  onClose?: (event: CloseEvent) => void;
  connect: () => void;
  close: () => void;
}

export function CreateChatSSE(this: ICreateChatSSE, chatId: string) {
  this.chatId = chatId;
  this.connectId = '';
  this.onMessage = void 0;
  this.onClose = void 0;
}

CreateChatSSE.prototype.connect = function () {
  this.ctrl = new AbortController();
  const token = getToken();
  fetchEventSource(`${SSE_LINK}?chatId=${this.chatId}`, {
    openWhenHidden: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    signal: this.ctrl.signal,
    onmessage: (event) => {
      const data = jsonParse(event.data) || {};
      if (data.connectId) {
        this.connectId = data.connectId;
      }
      if (data.chatMessageInfo && this.onMessage) {
        // 有新消息
        this.onMessage.call(this, data.chatMessageInfo);
      }
    },
    onerror: (error) => {
      console.log('🚀 ~ error:', error.message);
      // this.connect()
    },
    onopen: async (response) => {
      if (response.status !== 200) {
        console.warn('sse 打开失败...', response);
      }
    },
    onclose: () => {
      if (this.onClose) {
        this.onClose.call(this);
      }
    },
  });
};

CreateChatSSE.prototype.close = function () {
  this.ctrl?.abort();
  if (this.connectId) {
    closeChat(this.connectId);
  }
};
