/**
 * 客服聊天，后台客服端
 */

import { AtActivityIndicator } from 'taro-ui';
import { useEffect, useState } from 'react';
// import { useDidShow } from '@tarojs/taro';
import {
  ChatContext,
  getChatInfo,
  MessageItem,
  useChatContext,
  useChatProvider,
} from './chat-store';
import Chat from './chat';
import CustomNavBar from '@/components/CustomNavBar';

// 每次重新mount
function ChatLoadBox() {
  const [loading, setLoading] = useState(true);
  // const [initialMessages, setInitialMessages] = useState<any[]>([]);
  const { updateMessage, messages } = useChatContext();

  useEffect(() => {
    setLoading(true);
    getChatInfo()
      .then((res: MessageItem | MessageItem[] | null) => {
        // 左侧聊天的信息和没有位置的聊天信息，是对方发过来的，展示用户信息
        if (res) updateMessage(Array.isArray(res) ? res : [res]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className='w-full h-full flex justify-center items-center'>
        <AtActivityIndicator isOpened={loading} content='加载中...' />
      </div>
    );
  }
  return <Chat initialMessages={messages} />;
}

export default function ChatBox() {
  const chatState = useChatProvider();

  return (
    <div className='w-full h-full bg-base-bg lean-padding'>
      <CustomNavBar color='#0E1836' title='客服中心' gradient={false} />
      <ChatContext.Provider value={chatState}>
        <ChatLoadBox />
      </ChatContext.Provider>
    </div>
  );
}
