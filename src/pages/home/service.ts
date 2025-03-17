import appRequest from '@/utils/request';

export const appletList = () => {
  return appRequest.post({
    url: '/carousel/applet/list',
  });
};
