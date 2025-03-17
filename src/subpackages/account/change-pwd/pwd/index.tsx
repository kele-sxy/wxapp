import { View } from '@tarojs/components';
import { FC, useState } from 'react';
import { AtIcon, AtInput } from 'taro-ui';

interface IProps {
  value: any;
  onChange: any;
  placeholder: any;
}

const Pwd: FC<IProps> = ({ value, onChange, placeholder }: any) => {
  const [canSee, setCanSee] = useState(false);
  return (
    <View className='w-full mb-4 hide-input-after'>
      <AtInput
        clear
        cursor={-1}
        name='password'
        className='h-[60rpx] w-full border-x-0 border-t-0 border-b-[1rpx] border-solid border-[#D5D5D5] mb-[40rpx] !mx-0 bg-transparent p-0'
        placeholderClass='text-[#BFBFBF] text-[24rpx] leading-[33rpx]'
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type={canSee ? 'text' : 'password'}>
        <View
          onClick={() => {
            setCanSee((v) => !v);
          }}>
          {canSee && (
            <AtIcon
              className='h-[48rpx] leading-[48rpx]'
              value='eye'
              size='20'
              color='#ccc'
            />
          )}
          {!canSee && (
            <AtIcon
              className='h-[48rpx]'
              prefixClass='icon'
              value='close-eye'
              size='20'
              color='#ccc'
            />
          )}
        </View>
      </AtInput>
      {/* <View
        className='absolute right-4 bottom-[22rpx] cursor-pointer z-10'
        onClick={() => {
          setCanSee((v) => !v);
        }}>
        <AtIcon value='eye' size='20' color='#ccc' className='cursor-pointer' />
        {!canSee && (
          <View className='absolute w-[40rpx] h-[4rpx] bg-[#d5d5d5] -rotate-45 bottom-[20rpx] cursor-pointer' />
        )}
      </View> */}
    </View>
  );
};

export default Pwd;
