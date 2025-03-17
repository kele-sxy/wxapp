import appRequest from '@/utils/request';

export const userDelete = (data: any) => {
  return appRequest.post({
    url: '/user/delete',
    data,
  });
};
