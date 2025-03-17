import { View } from '@tarojs/components';
// import Taro from '@tarojs/taro';
import { FC, useState } from 'react';
import { AtActivityIndicator } from 'taro-ui';
import VoucherCard from '../components/VoucherCard';
import { getVoucherList } from '@/services/voucher';
import { useDidShow } from '@tarojs/taro';
import { VOUCHER_STATUS_ENUM } from '@/constant';
import EmptyStatus from '@/components/Empty';
import CustomNavBar from '@/components/CustomNavBar';

const ReceiveCoupon: FC<any> = () => {
  const [loading, setLoading] = useState(false);

  const [couponList, setCouponList] = useState<any[]>([]);

  const getCouponList = () => {
    setLoading(true);
    setCouponList([]);
    getVoucherList({ status: VOUCHER_STATUS_ENUM.UNCLAIMED })
      .then((res) => {
        setCouponList(res?.data ?? 0);
      })
      .finally(() => setLoading(false));
  };

  useDidShow(() => {
    getCouponList();
  });

  return (
    <View className='bg-base-bg min-h-[100vh] overflow-hidden'>
      <CustomNavBar color='#0E1836' title='优惠券领取' gradient={false} />
      <AtActivityIndicator isOpened={loading} mode='center' />
      {!couponList.length && !loading && <EmptyStatus />}
      {couponList?.map((item) => <VoucherCard unclaimed voucher={item} />)}
    </View>
  );
};

export default ReceiveCoupon;
