import appRequest from '@/utils/request';

export const userChangePhone = (data: any) => {
  return appRequest.post({
    url: '/user/changePhone',
    data,
  });
};
