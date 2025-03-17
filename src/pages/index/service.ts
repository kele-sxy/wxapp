import appRequest from '@/utils/request';

export const userInfo = () => {
  return appRequest.post({
    url: '/user/userInfo',
  });
};
