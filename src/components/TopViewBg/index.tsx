import { View, Image } from '@tarojs/components';
import { PropsWithChildren } from 'react';
import './index.less';

export default function TopViewBg({
  children,
  imageBg,
  height,
}: PropsWithChildren<any>) {
  // children 是将要会渲染的页面
  return (
    <View className='text-white top-bg'>
      <Image
        src={imageBg}
        className='w-full absolute bg-img'
        style={{ height }}
      />
      <View className='size-full top-content flex flex-col'>{children}</View>
    </View>
  );
}
