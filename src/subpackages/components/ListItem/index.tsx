import { View, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';

function ListItem({ item }) {
  const { title, icon, target } = item;
  const curClassName = icon ? 'ml-[36px]' : '';
  return (
    <View
      onClick={() => {
        Taro.navigateTo({
          url: target,
        });
      }}
      className='flex justify-between items-center justify-items-center bg-[#fff] rounded-[48px] px-[40px] py-[16px]'>
      <View className='flex items-center justify-items-center'>
        {icon && (
          <View className='flex items-center justify-items-center'>
            <Image src={icon} className='w-[48px] h-[48px]' />
          </View>
        )}
        <View className={curClassName}>
          <View className='text-[32px] text-base-black'>{title}</View>
        </View>
      </View>
      <View className='arrow'></View>
    </View>
  );
}

export default ListItem;
