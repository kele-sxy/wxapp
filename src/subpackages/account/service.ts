import appRequest from '@/utils/request';

export const userLogout = (data: any) => {
  return appRequest.post({
    url: '/user/logout',
    data,
  });
};
