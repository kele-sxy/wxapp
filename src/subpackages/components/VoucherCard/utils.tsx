import { REPORT_ENUM, REPORT_TYPE_ENUM, VOUCHER_TYPE_KEY } from '@/constant';
import { View } from '@tarojs/components';

// 处理代金券可用的报告
export const handleVoucherUsage = (voucher: any, used?: boolean) => {
  const { type, productList = [], useProductType, useProductLevel } = voucher;
  if (used)
    return `购买${REPORT_ENUM[useProductType]}报告${REPORT_TYPE_ENUM[useProductLevel]}`;
  if (type === VOUCHER_TYPE_KEY.CASH) return '全部报告可用';
  if (!productList.length) return;
  const [{ productType, productLevel }] = productList;
  return (
    `${REPORT_ENUM[productType]}报告可用，支持` +
    `${productLevel?.map((key: string) => REPORT_TYPE_ENUM[key])?.join('、')}`
  );
};

// 可用报告有多份时 获取剩余可用的报告
export const getAllUsage = (voucher: any) => {
  const { productList = [] } = voucher;
  const restUses = productList?.slice(1);
  return restUses?.map(({ productType, productLevel }) => {
    return (
      <View className='pb-2'>
        {REPORT_ENUM[productType]}报告可用，支持
        {productLevel?.map((key: string) => REPORT_TYPE_ENUM[key])?.join('、')}
      </View>
    );
  });
};

// 格式化时间 2022-01-01 00:00:00 ---> 2022.01.01 00:00
export const formatTime = (datetime: string) => {
  if (!datetime) return '';
  // 将日期时间字符串按空格分开
  const [date, time] = datetime.split(' ');
  const formattedDate = date.replace(/-/g, '.');
  // 截取时间的前5个字符 (即 00:00)
  const formattedTime = time.slice(0, 5);
  return `${formattedDate} ${formattedTime}`;
};
