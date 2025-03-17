import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { AtButton } from 'taro-ui';
import { reportResubmit, reportDelete } from './service';
import { getJsCode } from '@/utils';
import {
  REPORT_EXPIRE_DESC,
  REPORT_IS_EXPIRE,
  REPORT_STATUS,
  REPORT_TITLE_ENUM,
} from '@/constant';

function ListItem({ item, reload }) {
  const {
    type,
    reportId,
    reportType,
    queryName,
    queryMobile,
    queryTime,
    status,
    expire, //标识报告是否过期
  } = item || {};

  const curReportResubmit = async (reportId) => {
    const jsCode = await getJsCode();
    const res = await reportResubmit({ reportId, jsCode });
    const { payInfo, needPay } = res.data;
    if (!needPay) {
      // 订单金额为 0 不拉微信支付
      Taro.redirectTo({
        url: `/subpackages/report/pages/report-list/index`,
      });
      return;
    }
    if (payInfo && needPay) {
      Taro.requestPayment({
        ...payInfo,
        package: payInfo.packageValue,
        success: () => {
          // 支付成功跳转报告list页面
          Taro.showToast({
            title: '重新获取成功',
            icon: 'success',
          });
          Taro.navigateTo({
            url: `/subpackages/report/pages/report-list/index`,
          });
        },
        fail: () => {
          Taro.showToast({
            title: '支付失败',
            icon: 'none',
          });
        },
      });
    }
  };

  const curReportDelete = async (reportId) => {
    const { code } = await reportDelete({ reportId });
    if (code === 200) {
      reload();
      Taro.showToast({
        title: '删除成功',
        icon: 'success',
      });
    }
  };

  return (
    <View className='bg-[#fff] px-[36px] py-[42px] my-[36px] rounded-[32px]'>
      <View className='text-[32px] font-semibold'>
        {REPORT_TITLE_ENUM[reportType]}
      </View>
      <View className='mt-4 bg-[#F5F9FF] py-3 px-4 rounded-[16px] text-[28px]'>{`查询人：${queryName}`}</View>
      {expire === REPORT_IS_EXPIRE.YES && (
        <View className='text-xs mt-3 text-red-500'>{REPORT_EXPIRE_DESC}</View>
      )}
      <View className='mt-2 text-xs text-[#767676]'>{`手机号：${queryMobile}`}</View>
      <View className='mt-2 text-xs text-[#ACACAC]'>{`申请时间：${queryTime}`}</View>
      <View className='mt-1 mb-3 flex items-center text-xs'>
        <View className='truncate text-[#ACACAC]'>{`订单编号：${reportId}`}</View>
        {/* 竖向分割线 */}
        <View className='w-[2px] h-2 bg-[#ACACAC] mx-2'></View>
        <View
          className='text-right min-w-fit'
          onClick={() => {
            Taro.setClipboardData({
              data: reportId,
              success: () => {
                Taro.showToast({
                  title: '复制成功',
                  icon: 'success',
                });
              },
            });
          }}>
          复制
        </View>
      </View>
      {type === 'uncompleted' ? (
        <View className='flex justify-end'>
          <View>
            <AtButton
              onClick={() => {
                curReportDelete(reportId);
              }}
              className='border-[#4F7FFF] text-[#4F7FFF] text-[28px] w-[192px] !h-[72px] leading-[72px]'
              circle={true}>
              删除
            </AtButton>
          </View>
          <View>
            <AtButton
              onClick={() => {
                curReportResubmit(reportId);
              }}
              className='ml-[24px] text-[28px] w-[192px] !h-[72px] leading-[72px]'
              circle={true}
              type='primary'>
              重新获取
            </AtButton>
          </View>
        </View>
      ) : (
        <View className='flex justify-end'>
          <View>
            <AtButton
              onClick={() => {
                Taro.navigateTo({
                  url: `/subpackages/report-detail/pages/common/index?type=${reportType}&reportId=${reportId}`,
                });
              }}
              className='text-[28px] w-[192px] !h-8 flex-center'
              circle={true}
              disabled={status !== REPORT_STATUS.SUCCESS}
              loading={status === REPORT_STATUS.QUERYING}
              type='primary'>
              {status === REPORT_STATUS.QUERYING ? '查询中' : '查看'}
            </AtButton>
          </View>
        </View>
      )}
    </View>
  );
}

export default ListItem;
