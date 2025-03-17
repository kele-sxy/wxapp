import appRequest from '@/utils/request';

// 获取指定产品已购买报告数
export const getReportCount = (type: string) => {
  return appRequest.post({
    url: '/product/applet/statistic',
    data: { type },
  });
};

// 获取指定类型所有版本产品信息
export const getReportInfoList = (type: string) => {
  return appRequest.post({
    url: '/product/applet/list',
    data: { type },
  });
};

// 发起报告查询
export const sendReportSearch = (data: any) => {
  return appRequest.post({
    url: '/report/order/submit',
    data,
  });
};

// 查询报告详情
export const getReportDetail = (data: any) => {
  return appRequest.get({
    url: '/report/order/detail',
    data,
  });
};

// 获取待签署协议内容
export const getSignProtocol = () => {
  return appRequest.post({
    url: '/agreement/applet/sign/get',
  });
};

// 获取指定类型协议内容
export const getViewProtocol = (data?: any) => {
  return appRequest.post({
    url: '/agreement/applet/get',
    data,
  });
};

// 查询身份一致性检验
export const checkIdentity = (data: any) => {
  return appRequest.post({
    url: '/report/order/identityConsistencyCheck',
    data,
  });
};

// 获取报告项目信息描述
export const getReportConfig = (data?: any) => {
  return appRequest.post({
    url: '/commonInfo/getReportDesc',
    data,
  });
};

// 我的订单列表
export const myOrderList = (data: any) => {
  return appRequest.post({
    url: '/report/order/history/page',
    data,
  });
};

export interface OrderPay {
  reportId: string;
  payAmount: number;
}

interface invoiceData {
  payAmount: number; //开票金额
  type: string; // 抬头类型
  title: string; // 抬头名称
  taxNumber: string; // 税号
  companyAddress?: string; // 单位地址
  telephone?: string; // 单位电话
  bankName?: string; // 开户行
  bankAccount?: string; // 银行账号
  receiveEmail: string; // 邮箱
  receivePhone?: string; // 用于通知的电话号码
  orderList: OrderPay[];
}

// 申请开票
export const applyInvoice = (data: invoiceData) => {
  return appRequest.post({
    url: '/mgmt/invoice/apply',
    data,
  });
};
