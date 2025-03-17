import { View } from '@tarojs/components';
import { FC, useState } from 'react';
import { AtActivityIndicator } from 'taro-ui';
import { getVoucherList } from '@/services/voucher';
import { useDidShow } from '@tarojs/taro';
import { VOUCHER_STATUS_ENUM } from '@/constant';
import VoucherCard from '../components/VoucherCard';
import EmptyStatus from '@/components/Empty';
import CustomNavBar from '@/components/CustomNavBar';

const InvalidCoupon: FC<any> = () => {
  const [loading, setLoading] = useState(false);

  const [couponList, setCouponList] = useState<any[]>([]);

  const getCouponList = () => {
    setLoading(true);
    setCouponList([]);
    getVoucherList({ status: VOUCHER_STATUS_ENUM.EXPIRED })
      .then((res) => {
        setCouponList(res?.data ?? []);
      })
      .finally(() => setLoading(false));
  };

  useDidShow(() => {
    getCouponList();
  });

  return (
    <View className='bg-base-bg min-h-[100vh] overflow-hidden'>
      <CustomNavBar color='#0E1836' title='无效优惠券' gradient={false} />
      <AtActivityIndicator isOpened={loading} mode='center' />
      {!couponList.length && !loading && <EmptyStatus title='暂无无效优惠券' />}
      {couponList?.map((item) => <VoucherCard invalid voucher={item} />)}
    </View>
  );
};

export default InvalidCoupon;
