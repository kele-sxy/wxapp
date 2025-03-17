import { Text } from '@tarojs/components';
import ListUnit from '../ListUnit';
import voucher from '@/assets/svg/voucher.svg';
import orders from '@/assets/svg/orders.svg';
import service from '@/assets/svg/service.svg';
import { getUnreadMessage } from '@/services/service';
import { useDidHide, useDidShow, useTabItemTap } from '@tarojs/taro';
import { useRef, useState } from 'react';

function MyService(props: any) {
  const { info } = props;
  const [hasUnread, setHasUnread] = useState(false);

  const timerRef = useRef<any>(null);
  const controllerRef = useRef<AbortController>();

  const getStatus = () => {
    const abort = (controllerRef.current = new AbortController());
    return getUnreadMessage(abort.signal).then((res) => {
      setHasUnread(res?.data?.unread);
    });
  };

  const loopGet = () => {
    timerRef.current = setTimeout(() => {
      getStatus().then(() => loopGet());
    }, 10000);
  };

  useDidShow(() => {
    getStatus().finally(() => {
      loopGet();
    });
  });

  useDidHide(() => {
    controllerRef.current?.abort();
    clearTimeout(timerRef.current);
  });

  useTabItemTap(() => {
    controllerRef.current?.abort();
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
    },
  ];

  return <ListUnit list={list} redDot={hasUnread} />;
}

export default MyService;
