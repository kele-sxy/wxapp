import { useRef, useState } from 'react';
import { Text } from '@tarojs/components';
import ListUnit from '../ListUnit';
import voucher from '@/assets/svg/voucher.svg';
import orders from '@/assets/svg/orders.svg';
import service from '@/assets/service';
import { getUnreadMessage } from '../../service';
import { useDidHide, useDidShow, useTabItemTap } from '@tarojs/taro';

function MyService(props: any) {
  const { info } = props;
  const [hasUnread, setHasUnread] = useState(false);

  const timerRef = useRef<any>(null);

  const getStatus = () => {
    return getUnreadMessage().then((res) => {
      setHasUnread(res?.data?.unread);
    });
  };

  const loopGet = () => {
    timerRef.current = setTimeout(() => {
      getStatus().then(() => loopGet());
    }, 10000);
  };

  useDidShow(() => {
    clearTimeout(timerRef.current);
    getStatus().finally(() => {
      loopGet();
    });
  });

  useDidHide(() => {
    clearTimeout(timerRef.current);
  });

  useTabItemTap(() => {
    clearTimeout(timerRef.current);
  });

  const list = [
    {
      icon: orders,
      title: <>我的订单</>,
      target: '/subpackages/my-orders/index',
    },
    {
      icon: voucher,
      title: (
        <>
          我的优惠券 (
          <Text className='!text-[#4F7FFF]'>{info?.voucherCount ?? 0}</Text>)
        </>
      ),
      target: '/subpackages/voucher/index',
    },
    {
      icon: service,
      title: <>我的客服</>,
      target: '/subpackages/answer-center/index',
      redDot: hasUnread,
    },
  ];

  return <ListUnit list={list} />;
}

export default MyService;
