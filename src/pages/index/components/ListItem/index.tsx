import { View, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { AtBadge } from 'taro-ui';
import './index.less';

function ListItem({ item, redDot }) {
  const { title, icon, target } = item;
  // console.log('target', target);

  return (
    <View
      onClick={() => {
        Taro.navigateTo({
          url: target,
        });
      }}
      className='flex justify-between items-center justify-items-center bg-[#fff] rounded-[48px] px-[40px] py-[12px]'>
      <View className='flex items-center justify-items-center'>
        {icon && (
          <View className='flex items-center justify-items-center'>
            <Image src={icon} className='w-[48px] h-[48px]' />
          </View>
        )}
        <View className='ml-[36px]'>
          <View className='text-[28px] text-base-black'>{title}</View>
        </View>
      </View>
      <View>
        {redDot && <AtBadge dot />}
        <View className='arrow ml-2'></View>
      </View>
    </View>
  );
}

export default ListItem;
