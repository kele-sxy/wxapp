import { View } from '@tarojs/components';
import { FC } from 'react';
import { AtAvatar, AtIcon } from 'taro-ui';
import { avatar } from '@/assets/base64';
import Taro from '@tarojs/taro';

const UnLoginHeader: FC<any> = () => {
  return (
    <View className='flex items-center my-[48px]'>
      <AtAvatar circle={true} className='mx-[48px]' image={avatar}></AtAvatar>
      <View
        className='flex items-center text-base-black text-[36rpx] font-semibold'
        onClick={() => {
          // 去登录
          Taro.navigateTo({
            url: '/pages/login/index',
          });
        }}>
        <View>登录/注册</View>
        <AtIcon size='16rpx' value='chevron-right' />
      </View>
    </View>
  );
};

export default UnLoginHeader;
