import appRequest from '@/utils/request';

export const userInfo = () => {
  return appRequest.post({
    url: '/user/userInfo',
  });
};

// 是否存在未读消息
export const getUnreadMessage = (signal?: AbortSignal) => {
  return appRequest.post({
    url: '/c-chat/unread',
    signal,
  });
};
