import emptyIcon from '@/assets/empty-voucher';

import { View, Image } from '@tarojs/components';
import { FC } from 'react';

interface IProps {
  title?: any;
  icon?: any;
}

const EmptyStatus: FC<IProps> = (props) => {
  const { title = '暂无优惠券', icon } = props;
  return (
    <View className='flex flex-col justify-center items-center text-sm my-10 text-[#B7B7B7]'>
      <Image src={icon ? icon : emptyIcon} className='w-32 h-32 mb-4' />
      {title}
    </View>
  );
};

export default EmptyStatus;
