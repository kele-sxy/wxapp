import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { REPORT_INVOICE_TYPE, REPORT_TITLE_ENUM } from '@/constant';

function OrderItem({ item }) {
  const {
    reportId,
    reportType,
    queryName,
    queryMobile,
    queryTime,
    payAmount = 0,
    isRefunded,
    isInvoiced, // 0：未开，1，已开蓝票，2，已开红票
  } = item || {};

  return (
    <View className='bg-white px-4 py-4 my-4 rounded-2xl relative overflow-hidden'>
      {isRefunded && (
        <View className='absolute text-[#FF8E22] text-xs top-0 right-0 w-16 py-1 bg-[#FFF3E8] text-center rounded-bl-[30rpx]'>
          已退款
        </View>
      )}
      {!isRefunded &&
        (isInvoiced === REPORT_INVOICE_TYPE.BLUE ||
          isInvoiced === REPORT_INVOICE_TYPE.RED) && (
          <View className='absolute text-[#FF8E22] text-xs top-0 right-0 w-16 py-1 bg-[#FFF3E8] text-center rounded-bl-[30rpx]'>
            已开票
          </View>
        )}
      {!isRefunded &&
        isInvoiced === REPORT_INVOICE_TYPE.EMPTY &&
        Number(payAmount) === 0 && (
          <View className='absolute text-[#FF8E22] text-xs top-0 right-0 w-16 py-1 bg-[#FFF3E8] text-center rounded-bl-[30rpx]'>
            无法开票
          </View>
        )}
      {!isRefunded &&
        isInvoiced === REPORT_INVOICE_TYPE.EMPTY &&
        Number(payAmount) !== 0 && (
          <View className='absolute text-[#0062D8] text-xs top-0 right-0 w-16 py-1 bg-[#118dff24] text-center rounded-bl-[30rpx]'>
            未开票
          </View>
        )}
      <View className='text-base font-semibold'>
        {REPORT_TITLE_ENUM[reportType]}
      </View>
      <View className='text-xs text-gray-600'>
        <View className='mt-3'>查询人：{queryName}</View>
        <View className='mt-2'>查询时间：{queryTime}</View>
        <View className='at-row mt-2 items-center'>
          <View className='at-col at-col-5'>手机号：{queryMobile}</View>
          <View className='at-col at-col-5'>
            支付金额：
            <Text className='text-[#4F7FFF] text-sm'>
              ¥ {Number(payAmount) / 100}
            </Text>
          </View>
        </View>
      </View>
      {!isRefunded &&
        isInvoiced === REPORT_INVOICE_TYPE.EMPTY &&
        Number(payAmount) !== 0 && (
          <View
            className={`absolute z-10 right-4 top-10 rounded-2xl bg-[#118DFF] text-white px-4 py-[12px] text-xs text-center`}
            onClick={() => {
              Taro.navigateTo({
                url: `/subpackages/issue-invoice/index?reportId=${reportId}&payAmount=${payAmount}`,
              });
              // Taro.navigateTo({
              //   url: `/subpackages/order-invoicing/index?reportId=${reportId}&payAmount=${payAmount}`,
              // });
            }}>
            申请开票
          </View>
        )}
    </View>
  );
}

export default OrderItem;
