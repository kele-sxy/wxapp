import EmptyStatus from '@/components/Empty';
import { myOrderList } from '@/services/report';
import { View } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import { FC, useState } from 'react';
import { AtActivityIndicator } from 'taro-ui';
import empty from '@/assets/empty-list';
import OrderItem from './components/OrderItem';

interface OrderProps {}

const Order: FC<OrderProps> = () => {
  const [orders, setOrders] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useDidShow(() => {
    setLoading(true);
    myOrderList({ pageNum: 1, pageSize: 9999 })
      .then((res) => {
        setOrders(res?.data?.list ?? []);
      })
      .finally(() => setLoading(false));
  });

  return (
    <View className='bg-base-bg px-4 min-h-screen py-2'>
      <AtActivityIndicator isOpened={loading} mode='center' />
      {orders.map((item) => (
        <OrderItem item={item} />
      ))}
      {!orders?.length && !loading && (
        <EmptyStatus title='暂无数据' icon={empty} />
      )}
    </View>
  );
};

export default Order;
