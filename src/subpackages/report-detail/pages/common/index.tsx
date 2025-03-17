import { View, Text } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { useState } from 'react';
import cls from 'classnames';
// import CoverNavBar from '../../components/CoverNavBar';
import ModuleCard from '../../components/ModuleCard';
import RadarChart from '../../components/Canvas';
import {
  CANVAS_COLOR_MAP,
  ReportDetailProps,
  STATUS_MAP,
  type REPORT_DEAC_TYPE,
} from '../../constant';
import {
  REPORT_EXPIRE_DESC,
  REPORT_IS_EXPIRE,
  REPORT_KEY_ENUM,
} from '@/constant';
import { getReportConfig, getReportDetail } from '@/services/report';
import success from '../../images/success';
import failed from '../../images/failed';
import normal from '../../images/normal';
import abnormal from '../../images/abnormal';
import married from '../../images/married';
import unmarried from '../../images/unmarried';
import divorce from '../../images/divorce';
import yes from '../../images/yes';
import no from '../../images/no';
import exist from '../../images/exist';
import notExist from '../../images/not-exist';
import CustomNavBar from '@/components/CustomNavBar';

const INFO_CHECK_STATUS = {
  [STATUS_MAP.NORMAL]: success,
  [STATUS_MAP.ABNORMAL]: failed,
};

const RECORD_CHECK_STATUS = {
  [STATUS_MAP.NORMAL]: normal,
  [STATUS_MAP.ABNORMAL]: abnormal,
  [STATUS_MAP.MARRIED]: married,
  [STATUS_MAP.UNMARRIED]: unmarried,
  [STATUS_MAP.DIVORCE]: divorce,
  [STATUS_MAP.TRUE]: yes,
  [STATUS_MAP.FALSE]: no,
  [STATUS_MAP.EXIST]: exist,
  [STATUS_MAP.NOT_EXIST]: notExist,
};

export default function Index() {
  const info = Taro.getStorageSync('menuButtonInfo');

  const router = useRouter();
  const params = router?.params;
  const type = params?.type ?? REPORT_KEY_ENUM.homemaking;
  const reportId = params?.reportId;

  const COLOR_MAP = CANVAS_COLOR_MAP[type];

  const [reportFullInfo, setReportFullInfo] = useState<ReportDetailProps>();

  const [reportDetail, setReportDetail] =
    useState<ReportDetailProps['detail']['reportDetail']>();

  const [reportConfig, setReportConfig] = useState<REPORT_DEAC_TYPE>();

  useDidShow(() => {
    if (!reportId) return;
    Taro.showLoading({
      title: '加载中',
    });
    getReportConfig().then((res) => {
      if (res.data) {
        setReportConfig(res.data);
      }
    });
    getReportDetail({ reportId })
      .then((res) => {
        if (res.data) {
          setReportFullInfo(res.data);
          setReportDetail(res.data.detail.reportDetail);
        }
      })
      .finally(() => Taro.hideLoading());
  });

  // useShareAppMessage(() => {
  //   return {
  //     title: '报告详情',
  //     path: `/subpackages/report-detail/pages/common/index?type=${type}&reportId=${reportId}`,
  //   };
  // });

  if (!reportId) return <></>;

  return (
    <View className='h-screen flex flex-col items-center bg-transparent'>
      <CustomNavBar
        color='#193059'
        title={<Text className='text-base font-semibold'>报告详情</Text>}
      />
      <View
        className='w-full min-h-screen absolute top-0 left-0 -z-10'
        style={{
          background: COLOR_MAP.bgLinearGradint,
        }}>
        <View
          className='w-full px-3 pb-6'
          style={{ paddingTop: `${info.bottom + 30}px` }}>
          <View className='mb-5 h-72'>
            {reportFullInfo?.detail.scoreStatistics?.detail?.length && (
              <RadarChart
                canvasId='radarCanvas'
                data={reportFullInfo.detail.scoreStatistics.detail}
                fullScore={reportFullInfo.detail.scoreStatistics.totalPoints}
                type={type}
              />
            )}
          </View>
          {reportFullInfo?.detailSummary && (
            <ModuleCard title='报告概况' type={type}>
              {reportFullInfo.expire === REPORT_IS_EXPIRE.YES && (
                <View className='text-xs mb-1.5 text-red-500'>
                  {REPORT_EXPIRE_DESC}
                </View>
              )}
              报告生成时间：{reportFullInfo.detailSummary.queryTime}
              <View
                className={cls(
                  'rounded-md p-3 mt-1.5 flex flex-col',
                  COLOR_MAP.cardBgColor,
                )}>
                <Text className={cls('mb-1 before-dot', `before-dot-${type}`)}>
                  报告一共解读
                  <Text className={cls('px-1', COLOR_MAP.textColor)}>
                    {reportFullInfo.detailSummary.totalCount ?? 0}
                  </Text>
                  项内容
                </Text>
                <Text className={cls('before-dot', `before-dot-${type}`)}>
                  报告中有
                  <Text className={cls('px-1', COLOR_MAP.textColor)}>
                    {reportFullInfo.detailSummary.followCount ?? 0}
                  </Text>
                  项内容需关注
                </Text>
              </View>
            </ModuleCard>
          )}
          {reportFullInfo?.baseInfo && (
            <ModuleCard title='基本信息' type={type}>
              <View
                className={cls(
                  'rounded-md p-3 mb-3 flex items-center justify-around',
                  COLOR_MAP.cardBgColor,
                )}>
                <View className='flex-col-center'>
                  <Text className='label'>姓名</Text>
                  <Text>{reportFullInfo.baseInfo.name}</Text>
                </View>
                <View className='flex-col-center'>
                  <Text className='label'>性别</Text>
                  <Text>{reportFullInfo.baseInfo.sex}</Text>
                </View>
                <View className='flex-col-center'>
                  <Text className='label'>年龄</Text>
                  <Text>{reportFullInfo.baseInfo.age}</Text>
                </View>
                <View className='flex-col-center'>
                  <Text className='label'>星座</Text>
                  <Text>{reportFullInfo.baseInfo.starSign}</Text>
                </View>
              </View>
              <View className='flex justify-between items-center'>
                <Text className='label'>身份证号</Text>
                <Text>{reportFullInfo.baseInfo.idcard}</Text>
              </View>
              <View className='flex justify-between items-center'>
                <Text className='label'>身份证首次发证地</Text>
                <Text>{reportFullInfo.baseInfo.district}</Text>
              </View>
              <View className='flex justify-between items-center'>
                <Text className='label'>手机号</Text>
                <Text>{reportFullInfo.baseInfo.mobile}</Text>
              </View>
            </ModuleCard>
          )}
          {reportDetail?.identity && (
            <ModuleCard
              title='身份核验'
              divide
              imageUrl={INFO_CHECK_STATUS[reportDetail.identity.checkStatus]}
              type={type}>
              查询时间：{reportDetail.identity.queryTime}
              {reportDetail.identity.checkStatus === STATUS_MAP.NORMAL && (
                <Text className={cls('success-text', COLOR_MAP.textColor)}>
                  恭喜！身份证号码与姓名核对一致
                </Text>
              )}
              {reportDetail.identity.checkStatus === STATUS_MAP.ABNORMAL && (
                <Text className='error-text'>身份证号码与姓名核对不一致</Text>
              )}
              <Text className='label'>{reportConfig?.identity}</Text>
            </ModuleCard>
          )}
          {reportDetail?.mobile && (
            <ModuleCard
              title='手机号码核验'
              divide
              imageUrl={INFO_CHECK_STATUS[reportDetail.mobile.checkStatus]}
              type={type}>
              查询时间：{reportDetail.mobile.queryTime}
              {reportDetail.mobile.checkStatus === STATUS_MAP.NORMAL && (
                <Text className={cls('success-text', COLOR_MAP.textColor)}>
                  恭喜！身份证号码与姓名和手机号号码核对一致
                </Text>
              )}
              {reportDetail.mobile.checkStatus === STATUS_MAP.ABNORMAL && (
                <Text className='error-text'>
                  身份证号码与姓名和手机号号码核对不一致
                </Text>
              )}
              <Text className='label'>{reportConfig?.mobile}</Text>
            </ModuleCard>
          )}
          {reportDetail?.matrimonyStatus && (
            <ModuleCard
              title='婚姻状态'
              divide
              imageUrl={
                RECORD_CHECK_STATUS[reportDetail.matrimonyStatus.checkStatus]
              }
              type={type}>
              查询时间：{reportDetail.matrimonyStatus.queryTime}
              {reportDetail.matrimonyStatus.checkStatus !==
                STATUS_MAP.MARRIED && (
                <Text className={cls('success-text', COLOR_MAP.textColor)}>
                  {reportDetail.matrimonyStatus.checkStatus ===
                  STATUS_MAP.DIVORCE
                    ? '离异'
                    : '未婚'}
                </Text>
              )}
              {reportDetail.matrimonyStatus.checkStatus ===
                STATUS_MAP.MARRIED && <Text className='error-text'>已婚</Text>}
              <Text className='label'>{reportConfig?.matrimonyStatus}</Text>
            </ModuleCard>
          )}
          {reportDetail?.defective && (
            <ModuleCard
              title='不良核验'
              divide
              imageUrl={RECORD_CHECK_STATUS[reportDetail.defective.checkStatus]}
              type={type}>
              查询时间：{reportDetail.defective.queryTime}
              {reportDetail.defective.checkStatus === STATUS_MAP.NORMAL && (
                <Text className={cls('success-text', COLOR_MAP.textColor)}>
                  该用户未见异常
                </Text>
              )}
              {reportDetail.defective.checkStatus === STATUS_MAP.ABNORMAL && (
                <Text className='error-text'>有异常</Text>
              )}
              <Text className='label'>{reportConfig?.defective}</Text>
            </ModuleCard>
          )}
          {reportDetail?.deadbeat && (
            <ModuleCard
              title='老赖查询'
              divide
              imageUrl={RECORD_CHECK_STATUS[reportDetail.deadbeat.checkStatus]}
              type={type}>
              查询时间：{reportDetail.deadbeat.queryTime}
              {reportDetail.deadbeat.checkStatus === STATUS_MAP.NORMAL && (
                <Text className={cls('success-text', COLOR_MAP.textColor)}>
                  该用户信用正常，不是老赖
                </Text>
              )}
              {reportDetail.deadbeat.checkStatus === STATUS_MAP.ABNORMAL && (
                <Text className='error-text'>有异常</Text>
              )}
              <Text className='label'>{reportConfig?.deadbeat}</Text>
            </ModuleCard>
          )}
          {reportDetail?.personSubjectToExecution && (
            <ModuleCard
              title='法院被执行人查询'
              divide
              imageUrl={
                RECORD_CHECK_STATUS[
                  reportDetail.personSubjectToExecution.checkStatus
                ]
              }
              type={type}>
              查询时间：{reportDetail.personSubjectToExecution.queryTime}
              {reportDetail.personSubjectToExecution.checkStatus ===
                STATUS_MAP.NORMAL && (
                <Text className={cls('success-text', COLOR_MAP.textColor)}>
                  未见异常
                </Text>
              )}
              {reportDetail.personSubjectToExecution.checkStatus ===
                STATUS_MAP.ABNORMAL && (
                <Text className='error-text'>有异常</Text>
              )}
              <Text className='label'>
                {reportConfig?.personSubjectToExecution}
              </Text>
            </ModuleCard>
          )}
          {reportDetail?.restrictingConsumers && (
            <ModuleCard
              title='限制消费人员查询'
              divide
              imageUrl={
                RECORD_CHECK_STATUS[
                  reportDetail.restrictingConsumers.checkStatus
                ]
              }
              type={type}>
              查询时间：{reportDetail.restrictingConsumers.queryTime}
              {reportDetail.restrictingConsumers.checkStatus ===
                STATUS_MAP.NORMAL && (
                <Text className={cls('success-text', COLOR_MAP.textColor)}>
                  未见异常
                </Text>
              )}
              {reportDetail.restrictingConsumers.checkStatus ===
                STATUS_MAP.ABNORMAL && (
                <Text className='error-text'>有异常</Text>
              )}
              <Text className='label'>
                {reportConfig?.restrictingConsumers}
              </Text>
            </ModuleCard>
          )}
          {reportDetail?.loanApplicationRecords && (
            <ModuleCard
              title='贷款类申请记录核验'
              divide
              imageUrl={
                RECORD_CHECK_STATUS[
                  reportDetail.loanApplicationRecords.checkStatus
                ]
              }
              type={type}>
              查询时间：{reportDetail.loanApplicationRecords.queryTime}
              {reportDetail.loanApplicationRecords.checkStatus ===
                STATUS_MAP.NORMAL && (
                <Text className={cls('success-text', COLOR_MAP.textColor)}>
                  未见异常
                </Text>
              )}
              {reportDetail.loanApplicationRecords.checkStatus ===
                STATUS_MAP.ABNORMAL && (
                <Text className='error-text'>有异常</Text>
              )}
              <Text className='label'>
                {reportConfig?.loanApplicationRecords}
              </Text>
            </ModuleCard>
          )}
          {reportDetail?.loanRecords && (
            <ModuleCard
              title='贷款类借贷记录核验'
              divide
              imageUrl={
                RECORD_CHECK_STATUS[reportDetail.loanRecords.checkStatus]
              }
              type={type}>
              查询时间：{reportDetail.loanRecords.queryTime}
              {reportDetail.loanRecords.checkStatus === STATUS_MAP.NORMAL && (
                <Text className={cls('success-text', COLOR_MAP.textColor)}>
                  未见异常
                </Text>
              )}
              {reportDetail.loanRecords.checkStatus === STATUS_MAP.ABNORMAL && (
                <Text className='error-text'>有异常</Text>
              )}
              <Text className='label'>{reportConfig?.loanRecords}</Text>
            </ModuleCard>
          )}
          {reportDetail?.exceptionList && (
            <ModuleCard
              title='异常行为'
              divide
              imageUrl={
                RECORD_CHECK_STATUS[reportDetail.exceptionList.checkStatus]
              }
              type={type}>
              查询时间：{reportDetail.exceptionList.queryTime}
              {reportDetail.exceptionList.checkStatus === STATUS_MAP.NORMAL && (
                <Text className={cls('success-text', COLOR_MAP.textColor)}>
                  未见异常
                </Text>
              )}
              {reportDetail.exceptionList.checkStatus ===
                STATUS_MAP.ABNORMAL && (
                <Text className='error-text'>有异常</Text>
              )}
              <Text className='label'>{reportConfig?.exceptionList}</Text>
            </ModuleCard>
          )}
          {reportDetail?.promise && (
            <ModuleCard
              title='守约核验'
              divide
              imageUrl={RECORD_CHECK_STATUS[reportDetail.promise.checkStatus]}
              type={type}>
              查询时间：{reportDetail.promise.queryTime}
              {reportDetail.promise.checkStatus === STATUS_MAP.NORMAL && (
                <Text className={cls('success-text', COLOR_MAP.textColor)}>
                  未见异常
                </Text>
              )}
              {reportDetail.promise.checkStatus === STATUS_MAP.ABNORMAL && (
                <Text className='error-text'>有异常</Text>
              )}
              <Text className='label'>{reportConfig?.promise}</Text>
            </ModuleCard>
          )}
          {reportDetail?.work && (
            <ModuleCard
              title='劳动争议'
              divide
              imageUrl={RECORD_CHECK_STATUS[reportDetail.work.checkStatus]}
              type={type}>
              查询时间：{reportDetail.work.queryTime}
              {reportDetail.work.checkStatus === STATUS_MAP.NORMAL && (
                <Text className={cls('success-text', COLOR_MAP.textColor)}>
                  未见异常
                </Text>
              )}
              {reportDetail.work.checkStatus === STATUS_MAP.ABNORMAL && (
                <Text className='error-text'>有异常</Text>
              )}
              <Text className='label'>{reportConfig?.work}</Text>
            </ModuleCard>
          )}
          {reportDetail?.network && (
            <ModuleCard
              title='网络行为'
              divide
              imageUrl={RECORD_CHECK_STATUS[reportDetail.network.checkStatus]}
              type={type}>
              查询时间：{reportDetail.network.queryTime}
              {reportDetail.network.checkStatus === STATUS_MAP.NORMAL && (
                <Text className={cls('success-text', COLOR_MAP.textColor)}>
                  未见异常
                </Text>
              )}
              {reportDetail.network.checkStatus === STATUS_MAP.ABNORMAL && (
                <Text className='error-text'>有异常</Text>
              )}
              <Text className='label'>{reportConfig?.network}</Text>
            </ModuleCard>
          )}
          {reportDetail?.careerCheck && (
            <ModuleCard
              title='企业主核验'
              divide
              imageUrl={
                RECORD_CHECK_STATUS[reportDetail.careerCheck.checkStatus]
              }
              type={type}>
              查询时间：{reportDetail.careerCheck.queryTime}
              {reportDetail.careerCheck.checkStatus === STATUS_MAP.TRUE && (
                <Text className={cls('success-text', COLOR_MAP.textColor)}>
                  是
                </Text>
              )}
              {reportDetail.careerCheck.checkStatus === STATUS_MAP.FALSE && (
                <Text className='error-text'>否</Text>
              )}
              <Text className='label'>{reportConfig?.careerCheck}</Text>
            </ModuleCard>
          )}
          {reportDetail?.certificate && (
            <ModuleCard
              title='职业核验'
              divide
              imageUrl={
                RECORD_CHECK_STATUS[reportDetail.certificate.checkStatus]
              }
              type={type}>
              查询时间：{reportDetail.certificate.queryTime}
              {reportDetail.certificate.checkStatus === STATUS_MAP.EXIST && (
                <Text className={cls('success-text', COLOR_MAP.textColor)}>
                  有证书
                </Text>
              )}
              {reportDetail.certificate.checkStatus ===
                STATUS_MAP.NOT_EXIST && (
                <Text className='error-text'>无证书</Text>
              )}
              {reportDetail.certificate.checkStatus === STATUS_MAP.EXIST && (
                <View
                  className={cls(
                    'rounded-md p-3 mb-2',
                    COLOR_MAP.textColor,
                    COLOR_MAP.cardBgColor,
                  )}>
                  {reportDetail.certificate?.details?.join('、')}
                </View>
              )}
              <Text className='label'>{reportConfig?.certificate}</Text>
            </ModuleCard>
          )}
          {/* <View className='text-[#AFB6C3] text-sm px-[40rpx]'>
            <View className='pb-1.5'>报告说明</View>
            <View>
              本报告的数据由用户本人明确授权后，我们才向相关合法存有用户个人数据的机构调取本报告相关内容，本平台只做大数据的获取与分析，仅向用户个人展示参考。报告有效期
              <Text className='text-[#A2ACBD] font-medium'>30天</Text>
              ，过期自动删除。
            </View>
            <View>
              若您的数据不全面，可能是数据具有延迟性或者合作信息机构未获取到您的数据。若数据有错误请联系客服。
            </View>
          </View> */}
        </View>
      </View>
    </View>
  );
}
