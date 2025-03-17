/**
 * 客服聊天，后台客服端
 */

import { AtActivityIndicator } from 'taro-ui';
import Chat from './chat';
import { useEffect, useState } from 'react';
import { useRouter } from '@tarojs/taro';
import CustomNavBar from '@/components/CustomNavBar';
import { createChat } from '@/services/service';
import { Empty } from '@chatui/core';

function ChatLoadBox() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = router?.params;
  const complaintId = params?.code;

  const [chatId, setChatId] = useState<string>(params?.chatId ?? '');

  useEffect(() => {
    if (complaintId) return;
    setLoading(true);
    createChat()
      .then((res) => {
        setChatId(res?.data?.chatId);
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
  return chatId ? (
    <Chat chatId={chatId} complaintId={complaintId} />
  ) : (
    <Empty className='text-base mt-14' tip='暂无对话' />
  );
}

export default function ChatBox() {
  return (
    <div className='w-full h-full bg-base-bg lean-padding'>
      <CustomNavBar color='#0E1836' title='人工客服' gradient={false} />
      <ChatLoadBox />
    </div>
  );
}
