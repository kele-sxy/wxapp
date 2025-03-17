// BASE_INFO("个人基本信息验证"),
// RESTRICT_HIGH_CONSUMER_RECORD("限高记录"),
// BAD_RECORD("不良记录"),
// CREDIT_RECORD("信贷记录"),
// DISHONESTY_RECORD("失信记录"),
// EXECUTION_RECORD("执行记录"),
// GAMBLING_RECORD("赌博记录"),
// NETWORK_RECORD("网络记录"),
// ONLINE_LOAN_RECORD("网贷记录"),
// TELECOM_FRAUD_RECORD("电诈记录"),

export const MINIO_PREFIX = '/gaia/v1/minio/';
export const FTP_UPLOAD_FULL_URL = `/storage/info/information/upload`;

export type REPORT_ITEM_ENUM = {
  /**
   * 报告的类型
   * homemaking-家政服务 security-安保服务 lease-用人用工 personal_risk-个人风险 marriage-婚恋服务 pre_education-学前教育
   * @default ''
   */
  type: string;
  /**
   * 报告等级
   */
  level: string;
  /**
   * 功能清单
   */
  functionList: { key: string; value: string }[];
  /**
   * 单价，/分
   */
  amount: number;
};

export const REPORT_KEY_ENUM = {
  homemaking: 'homemaking',
  security: 'security',
  lease: 'lease',
  personal_risk: 'personal_risk',
  marriage: 'marriage',
  pre_education: 'pre_education',
};

export const REPORT_ENUM = {
  [REPORT_KEY_ENUM.homemaking]: '家政服务',
  [REPORT_KEY_ENUM.security]: '安保服务',
  [REPORT_KEY_ENUM.lease]: '用人用工',
  [REPORT_KEY_ENUM.personal_risk]: '个人风险',
  [REPORT_KEY_ENUM.marriage]: '婚恋服务',
  [REPORT_KEY_ENUM.pre_education]: '学前教育',
};

export const REPORT_TITLE_ENUM = {
  [REPORT_KEY_ENUM.homemaking]: '家政报告',
  [REPORT_KEY_ENUM.security]: '安保报告',
  [REPORT_KEY_ENUM.lease]: '用人用工报告',
  [REPORT_KEY_ENUM.personal_risk]: '个人风险报告',
  [REPORT_KEY_ENUM.marriage]: '婚恋报告',
  [REPORT_KEY_ENUM.pre_education]: '学前教育报告',
};

export const RP_TYPE_CODE_MENU = {
  COMMON: 'COMMON',
  ADV: 'SENIOR',
};

export const REPORT_TYPE_ENUM = {
  [RP_TYPE_CODE_MENU.COMMON]: '普通版',
  [RP_TYPE_CODE_MENU.ADV]: '高级版',
};

export const REPORT_STATUS = {
  SUCCESS: 'success',
  QUERYING: 'querying',
  WAIT: 'wait_pay',
  FAILED: 'pay_failed',
};

// 优惠券状态
export const VOUCHER_STATUS_ENUM = {
  UNCLAIMED: 'UNCLAIMED', // 待领取
  CLAIMED: 'CLAIMED', // 已领取 但未使用
  USED: 'USED', // 已核销
  EXPIRED: 'EXPIRED', // 已过期
};

export const VOUCHER_TYPE_KEY = {
  CASH: 'CASH', // 现金券 所有报告可用
  COUPONS: 'COUPONS', // 优惠券 部分（选中）报告可用
};

export const VOUCHER_TYPE_MENU = {
  [VOUCHER_TYPE_KEY.CASH]: '现金券',
  [VOUCHER_TYPE_KEY.COUPONS]: '优惠券',
};

// 投诉类型
export const COMPLAINT_TYPE_KEY = {
  PAY_FAIL: 'PAY_FAIL',
  REPORT_ABNORMAL: 'REPORT_ABNORMAL',
  DATA_OBJECTION: 'DATA_OBJECTION',
  REFUND_REQUEST: 'REFUND_REQUEST',
  UNKNOWN: 'UNKNOWN',
};

export const COMPLAINT_TYPE = {
  [COMPLAINT_TYPE_KEY.PAY_FAIL]: '支付失败',
  [COMPLAINT_TYPE_KEY.REPORT_ABNORMAL]: '报告发生异常',
  [COMPLAINT_TYPE_KEY.DATA_OBJECTION]: '数据异议',
  [COMPLAINT_TYPE_KEY.REFUND_REQUEST]: '退款',
  [COMPLAINT_TYPE_KEY.UNKNOWN]: '未知',
};

// 投诉状态
export const COMPLAINT_STATUS_KEY = {
  UNDISTRIBUTED: 'UNDISTRIBUTED',
  FOLLOWING: 'FOLLOWING',
  ARCHIVED: 'ARCHIVED',
};

export const COMPLAINT_STATUS = {
  [COMPLAINT_STATUS_KEY.UNDISTRIBUTED]: '未分配',
  [COMPLAINT_STATUS_KEY.FOLLOWING]: '跟进中',
  [COMPLAINT_STATUS_KEY.ARCHIVED]: '已完结',
};

// 0：未开，1，已开蓝票，2，已开红票
export const REPORT_INVOICE_TYPE = {
  EMPTY: 0,
  BLUE: 1,
  RED: 2,
};

// 报告是否过期
export const REPORT_IS_EXPIRE = {
  YES: 1,
  NO: 0,
};

// 报告过期提示文案
export const REPORT_EXPIRE_DESC =
  '报告已超过有效时限，如需查看最新结果，请重新查询';
