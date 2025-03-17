import appRequest from '@/utils/request';

// 重新发起查询
export const reportResubmit = (data: { reportId: string, jsCode: string }) => {
  return appRequest.post({
    url: '/report/order/resubmit',
    data,
  });
};

// 报告列表
export const reportDelete = (data: { reportId: string }) => {
  return appRequest.delete({
    url: '/report/order/delete',
    data,
  });
};

