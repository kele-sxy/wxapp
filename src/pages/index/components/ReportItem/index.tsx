import { View, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';

function ReportItem({ item, effective, index }) {
  const { title, icon, num, target } = item || {};
  return (
    <View
      onClick={() => {
        if (effective)
          Taro.navigateTo({
            url: target,
          });
        else Taro.navigateTo({ url: '/pages/login/index' });
      }}
      className={`flex justify-between items-center justify-items-center bg-white rounded-3xl px-5 py-4 flex-1 ${index ? 'ml-2' : 'mr-2'}`}>
      <View className='flex items-center justify-items-center'>
        <Image src={icon} className='w-7 h-7' />
      </View>
      <View className='flex flex-col items-baseline ml-1'>
        <View className='flex justify-between items-center justify-items-center '>
          <View className='text-sm text-base-black font-bold'>{title}</View>
          <View className='arrow ml-1'></View>
        </View>
        <View className='flex items-baseline pt-2'>
          <View className='text-[#4F7FFF] text-2xl px-1'>{num}</View>
          {effective && <View className='text-[#878592] text-xs'>份</View>}
        </View>
      </View>
    </View>
  );
}

export default ReportItem;
