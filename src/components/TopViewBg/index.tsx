import { View, Image } from '@tarojs/components';
import { PropsWithChildren } from 'react';
import Taro from '@tarojs/taro';
import './index.less';

export default function TopViewBg({
  children,
  imageBg,
  height,
}: PropsWithChildren<any>) {
  const info = Taro.getStorageSync('menuButtonInfo');
  // children 是将要会渲染的页面
  return (
    <View className='text-white top-bg'>
      <Image
        src={imageBg}
        className='w-full absolute bg-img'
        style={{ height }}
      />
      <View
        className='size-full top-content flex flex-col'
        style={{ paddingTop: `${info.top + info.height + 30}px` }}>
        {children}
      </View>
    </View>
  );
}
