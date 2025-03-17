import { REPORT_KEY_ENUM } from '@/constant';

type CheckDetail = {
  /**
   * 查询时间
   */
  queryTime: string;
  /**
   * 核验结果
   * normal-正常,abnormal-异常,married-已婚,unmarried-未婚,divorce-离异,exist-存在职业证书,notExist-不存在职业证书,false 不是企业主，true 是企业主
   */
  checkStatus: string;
};

export interface ReportDetailProps {
  /**
   * 报告是否过期
   * 0-未过期，1-已过期
   */
  expire: number;
  /**
   * 报告id
   */
  reportId: string;
  /**
   * 报告类型
   */
  reportType: string;
  /**
   * 报告级别
   */
  reportLevel: string;
  /**
   * 报告状态
   *  init-初始化,paying-支付中,pay_failed-支付失败,querying-查询中,query_failed-查询失败,success-查询成功
   */
  status: string;
  /**
   * 报告概况
   */
  detailSummary: {
    /**
     * 查询时间
     */
    queryTime: string;
    /**
     * 条目数量
     */
    totalCount: number;
    /**
     * 需关注数量
     */
    followCount: number;
  };
  /**
   * 基本信息
   */
  baseInfo: {
    /**
     * 姓名
     */
    name: string;
    /**
     * 性别
     */
    sex: string;
    /**
     * 年龄
     */
    age: string;
    /**
     * 星座
     */
    starSign: string;
    /**
     * 身份证
     */
    idcard: string;
    /**
     * 身份证始发地
     */
    district: string;
    /**
     * 手机号
     */
    mobile: string;
  };
  /**
   * 报告详情
   */
  detail: {
    /**
     * 报告分数统计
     */
    scoreStatistics: {
      /**
       * 总分
       */
      totalPoints: number;
      /**
       * 打分明细
       * 类型、分数
       */
      detail: { type: string; name: string; score: number }[];
    };
    reportDetail: {
      /**
       * 身份核验
       */
      identity?: CheckDetail;
      /**
       * 手机号码核验
       */
      mobile?: CheckDetail;
      /**
       * 不良核验
       */
      defective?: CheckDetail;
      /**
       * 异常行为
       */
      exceptionList?: CheckDetail;
      /**
       * 老赖查询
       */
      deadbeat?: CheckDetail;
      /**
       * 法院被执行人查询
       */
      personSubjectToExecution?: CheckDetail;
      /**
       * 限制消费人员查询
       */
      restrictingConsumers?: CheckDetail;
      /**
       * 贷款类申请记录核验
       */
      loanApplicationRecords?: CheckDetail;
      /**
       * 贷款类借贷记录核验
       */
      loanRecords?: CheckDetail;
      /**
       * 婚姻状态
       */
      matrimonyStatus?: CheckDetail;
      /**
       * 守约核验
       */
      promise?: CheckDetail;
      /**
       * 劳动争议
       */
      work?: CheckDetail;
      /**
       * 社交网络
       */
      network?: CheckDetail;
      /**
       * 企业主核验
       */
      careerCheck?: CheckDetail;
      /**
       * 职业核验
       */
      certificate?: CheckDetail & { details?: string[] };
    };
  };
}

export const STATUS_MAP = {
  NORMAL: 'normal',
  ABNORMAL: 'abnormal',
  MARRIED: 'married',
  UNMARRIED: 'unmarried',
  DIVORCE: 'divorce',
  EXIST: 'exist',
  NOT_EXIST: 'notExist',
  FALSE: 'false',
  TRUE: 'true',
};

export type REPORT_DEAC_TYPE = {
  /**
   * 身份核验
   */
  identity?: string;
  /**
   * 手机号码核验
   */
  mobile?: string;
  /**
   * 不良核验
   */
  defective?: string;
  /**
   * 异常行为
   */
  exceptionList?: string;
  /**
   * 老赖查询
   */
  deadbeat?: string;
  /**
   * 法院被执行人查询
   */
  personSubjectToExecution?: string;
  /**
   * 限制消费人员查询
   */
  restrictingConsumers?: string;
  /**
   * 贷款类申请记录核验
   */
  loanApplicationRecords?: string;
  /**
   * 贷款类借贷记录核验
   */
  loanRecords?: string;
  /**
   * 婚姻状态
   */
  matrimonyStatus?: string;
  /**
   * 守约核验
   */
  promise?: string;
  /**
   * 劳动争议
   */
  work?: string;
  /**
   * 社交网络
   */
  network?: string;
  /**
   * 企业主核验
   */
  careerCheck?: string;
  /**
   * 职业核验
   */
  certificate?: string;
};

export const CANVAS_COLOR_MAP = {
  [REPORT_KEY_ENUM.homemaking]: {
    bgLinearGradint:
      'linear-gradient( 180deg, #FFF2E3 0%, #FFFAF5 53%, #FFF8F2 100%)',
    cardBgColor: 'bg-[#FFF8EF]',
    textColor: 'text-[#FF8C00]',
    // 雷达图使用
    baseColor: 'rgba(255, 140, 0, 1)',
    linearColor: ['rgba(255, 231, 186, 1)', 'rgba(255, 169, 64, 1)'],
    // 数据区域描边色彩
    lineColor: 'rgba(255, 203, 17, 1)',
    shadowColor: 'rgba(249,192,124,0.6)',
    circleColors: [
      'rgba(255, 233, 206, 1)',
      'rgba(255, 233, 206, 1)',
      'rgba(255, 244, 229, 1)',
      'rgba(255, 255, 255, 1)',
      'rgba(253, 246, 238, 1)',
    ],
  },
  [REPORT_KEY_ENUM.security]: {
    bgLinearGradint:
      'linear-gradient(180deg, #CDE3FB 0%, #E9F4FF 38%, #F2F6F9 100%)',
    cardBgColor: 'bg-[#F5F9FF]',
    textColor: 'text-[#4F7FFF]',

    baseColor: 'rgba(64, 139, 248, 1)',
    linearColor: ['rgba(71, 155, 246, 1)', 'rgba(46, 97, 251, 1)'],
    lineColor: 'rgba(120, 224, 255, 1)',
    shadowColor: 'rgba(124,171,249, 0.6)',
    circleColors: [
      'rgba(199, 223, 253, 1)',
      'rgba(199, 223, 253, 1)',
      'rgba(226, 239, 254, 1)',
      'rgba(255, 255, 255, 1)',
      'rgba(227, 241, 253, 1)',
    ],
  },
  [REPORT_KEY_ENUM.lease]: {
    bgLinearGradint:
      'linear-gradient(180deg, #E3E6FF 0%, #F7F8FF 20%, #F1F3FF 100%)',
    cardBgColor: 'bg-[#F1F3FF]',
    textColor: 'text-[#6D80FF]',

    baseColor: 'rgba(141, 156, 255, 1)',
    linearColor: ['rgba(161, 173, 255, 1)', 'rgba(71, 93, 255, 1)'],
    lineColor: 'rgba(65, 90, 255, 1)',
    shadowColor: 'rgba(141, 156, 255, 0.6)',
    circleColors: [
      'rgba(225, 230, 255, 1)',
      'rgba(225, 230, 255, 1)',
      'rgba(239, 241, 255, 1)',
      'rgba(255, 255, 255, 1)',
      'rgba(247, 245, 255, 1)',
    ],
  },
  [REPORT_KEY_ENUM.personal_risk]: {
    bgLinearGradint:
      'linear-gradient(180deg, #EBFFE2 0%, #F5FFEE 18%, #F5FFF1 100%)',
    cardBgColor: 'bg-[#F2FFE6]',
    textColor: 'text-[#45BA0B]',

    baseColor: 'rgba(69, 186, 11, 1)',
    linearColor: ['rgba(194, 255, 147, 1)', 'rgba(65, 195, 0, 1)'],
    lineColor: 'rgba(133, 224, 79, 1)',
    shadowColor: 'rgba(167,238,102,0.6)',
    circleColors: [
      'rgba(206, 240, 188, 1)',
      'rgba(206, 240, 188, 1)',
      'rgba(229, 247, 220, 1)',
      'rgba(255, 255, 255, 1)',
      'rgba(250, 253, 246, 1)',
    ],
  },
  [REPORT_KEY_ENUM.marriage]: {
    bgLinearGradint:
      'linear-gradient(180deg, #FFEEF7 0%, #FFFBFD 20%, #FFEFF7 100%)',
    cardBgColor: 'bg-[#FFF2F9]',
    textColor: 'text-[#F759AB]',

    baseColor: 'rgba(247, 89, 171, 1)',
    linearColor: ['rgba(255, 177, 217, 1)', 'rgba(255, 71, 166, 1)'],
    lineColor: 'rgba(255, 94, 187, 1)',
    shadowColor: 'rgba(255,153,234,0.6)',
    circleColors: [
      'rgba(255, 214, 235, 1)',
      'rgba(255, 214, 235, 1)',
      'rgba(255, 234, 245, 1)',
      'rgba(255, 255, 255, 1)',
      'rgba(255, 241, 251, 1)',
    ],
  },
  [REPORT_KEY_ENUM.pre_education]: {
    bgLinearGradint:
      'linear-gradient(180deg, #FFF5F5 0%, #FFF5F5 18%, #FFF5F5 100%)',
    cardBgColor: 'bg-[#FFF5F5]',
    textColor: 'text-[#FF5959]',

    baseColor: 'rgba(255, 91, 91, 1)',
    linearColor: ['rgba(255, 207, 208, 1)', 'rgba(255, 73, 83, 1)'],
    lineColor: 'rgba(255, 73, 83, 1)',
    shadowColor: 'rgba(255,223,226,0.6)',
    circleColors: [
      'rgba(255, 224, 224, 1)',
      'rgba(255, 224, 224, 1)',
      'rgba(255, 239, 240, 1)',
      'rgba(255, 255, 255, 1)',
      'rgba(255, 243, 244, 1)',
    ],
  },
};
