import appRequest from '@/utils/request';

export const livingAuth = (data: any) => {
  return appRequest.post({
    url: '/user/livingAuth',
    data
  });
};
