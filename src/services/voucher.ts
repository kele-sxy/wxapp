import appRequest from '@/utils/request';

// 获取当前用户待使用代金券数量
export const getVoucherNum = () => {
  return appRequest.post({
    url: '/voucher/count',
  });
};

// 查询代金券列表
/**
 * status 代金券状态 待领取 :UNCLAIMED 已领取 :CLAIMED 已核销 :USED 已过期 :EXPIRED
 * productType: homemaking-家政服务、security-安保服务、lease-租赁服务、personal_risk-个人风险、marriage-婚恋服务、pre_education-学前教育
 * productLevel: string[] 报告版本
 */
export const getVoucherList = (data: any) => {
  return appRequest.post({
    url: '/voucher/list',
    data,
  });
};

// 领取代金券
export const getMyVoucher = (voucherRecordUserId: string) => {
  return appRequest.get({
    url: '/voucher/claim',
    data: { voucherRecordUserId },
  });
};

// 查询代金券对应报告列表
export const getVoucherReportList = (voucherRecordUserId: string) => {
  return appRequest.get({
    url: '/voucher/product/list',
    data: { voucherRecordUserId },
  });
};
