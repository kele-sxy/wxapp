import { getHelpAndKnowledge } from '@/services/service';
import kefuAvatar from '@/assets/svg/kefu.svg';
import { createContext, useContext, useState } from 'react';

export type MessageItem = {
  id: string;
  type: string;
  position?: 'left' | 'right' | 'center' | 'pop';
  content: {
    text?: string;
    picUrl?: string;
    list?: any[];
    title?: string;
  };
  user?: {
    avatar: string;
    name: string;
  };
};

export function getChatInfo(text?: string) {
  return getHelpAndKnowledge(text).then((res) => {
    const helpList = res?.data?.helpResults?.map((res) => ({
      id: res?.helpId,
      text: res?.title,
    }));
    const knowledgeContent = res?.data?.bestKnowledgeContent;
    if (!helpList?.length && !knowledgeContent && text)
      return {
        id: `${new Date().getTime()}-text`,
        type: 'text',
        content: {
          text: '抱歉，没理解您的问题，您换个问法再试试可以吗？',
        },
        user: {
          avatar: kefuAvatar,
          name: '智能机器人',
        },
      };
    if (!helpList?.length && !knowledgeContent && !text)
      return {
        id: `${new Date().getTime()}-text`,
        type: 'text',
        content: {
          text: '智能客服正在建设中，请您稍后再试',
        },
        user: {
          avatar: kefuAvatar,
          name: '智能机器人',
        },
      };
    const result: MessageItem[] = [];
    if (knowledgeContent) {
      result.push({
        id: `${new Date().getTime()}-text`,
        type: 'text',
        content: { text: knowledgeContent },
        user: {
          avatar: kefuAvatar,
          name: '智能机器人',
        },
      });
    }
    if (helpList?.length) {
      result.push({
        id: `${new Date().getTime()}-list`,
        type: 'list',
        content: {
          list: helpList,
          title: text ? '猜你想问' : '常见问题列表',
        },
        user: {
          avatar: kefuAvatar,
          name: '智能机器人',
        },
      });
    }
    return result;
  });
}

/**
 * 聊天相关 公共状态维护
 */

export const ChatContext = createContext<{
  messages: MessageItem[];
  updateMessage: (chatInfo: MessageItem[]) => void;
}>({
  messages: [],
  updateMessage: () => {},
});

export const useChatContext = () => {
  return useContext(ChatContext);
};

export function useChatProvider() {
  const [messages, setMessages] = useState<MessageItem[]>([]);

  const updateMessage = (chatInfo: MessageItem[]) => {
    setMessages(chatInfo);
  };

  return {
    messages,
    updateMessage,
  };
}
