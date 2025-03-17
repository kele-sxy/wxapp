import { View } from '@tarojs/components';
// import Taro from '@tarojs/taro';
import { FC, useState } from 'react';
import { AtActivityIndicator } from 'taro-ui';
import VoucherCard from '../components/VoucherCard';
import { getVoucherList, getVoucherScanList } from '@/services/voucher';
import { useDidShow } from '@tarojs/taro';
import { VOUCHER_STATUS_ENUM } from '@/constant';
import EmptyStatus from '@/components/Empty';
import Taro from '@tarojs/taro';

const ReceiveCoupon: FC<any> = () => {
  const [loading, setLoading] = useState(false);

  const [couponList, setCouponList] = useState<any[]>([]);
  // 扫码获得的代金券凭证
  const [scanVoucherRecordId, setScanVoucherRecordId] = useState<string>('');

  const getCouponList = () => {
    setLoading(true);
    setCouponList([]);
    getVoucherList({ status: VOUCHER_STATUS_ENUM.UNCLAIMED })
      .then((res) => {
        setCouponList(res?.data ?? 0);
      })
      .finally(() => setLoading(false));
  };
  const getScanList = (voucherRecordId: string) => {
    setLoading(true);
    setCouponList([]);
    getVoucherScanList(voucherRecordId)
      .then((res) => {
        setCouponList(res?.data ?? 0);
      })
      .finally(() => setLoading(false));
  };

  useDidShow(() => {
    const voucherRecordId = Taro.getStorageSync('voucherRecordId');
    setScanVoucherRecordId(voucherRecordId);
    if (voucherRecordId) getScanList(voucherRecordId);
    else getCouponList();
  });

  return (
    <View className='bg-base-bg min-h-[100vh] overflow-hidden'>
      <AtActivityIndicator isOpened={loading} mode='center' />
      {!couponList.length && !loading && <EmptyStatus />}
      {couponList?.map((item) => (
        <VoucherCard
          unclaimed
          used={item.status === VOUCHER_STATUS_ENUM.USED}
          invalid={item.status === VOUCHER_STATUS_ENUM.EXPIRED}
          voucher={item}
          scanVoucherRecordId={scanVoucherRecordId}
        />
      ))}
    </View>
  );
};

export default ReceiveCoupon;
