import appRequest from '@/utils/request';

// 报告列表
export const reportList = (data: any) => {
  return appRequest.post({
    url: '/report/order/page',
    data,
  });
};
