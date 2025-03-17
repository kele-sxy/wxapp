import appRequest from '@/utils/request';

export const reportStatistics = (data: any) => {
  return appRequest.get({
    url: '/report/order/statistics',
    data,
  });
};
