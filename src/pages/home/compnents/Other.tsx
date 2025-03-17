import { FC } from 'react';
import { View, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import './index.less';
import reportIcon from '@/assets/svg/report.svg';
import Taro from '@tarojs/taro';
import { checkLoginStatus } from '@/utils';

interface IProps {}

const Other: FC<IProps> = () => {
  return (
    <View className='flex justify-between items-center justify-items-center bg-[#fff] rounded-[48px] mx-3 px-[32px] py-[24px]'>
      <View className='flex'>
        <View>
          <Image src={reportIcon} className='w-[96px] h-[96px]' />
        </View>
        <View className='ml-[36px]'>
          <View className='text-[36px] font-semibold text-[#203D71]'>
            我的历史报告
          </View>
          <View className='text-[32px] text-[#96A2B8] mt-[4px]'>
            回看历史报告内容
          </View>
        </View>
      </View>
      <View>
        <AtButton
          onClick={() => {
            checkLoginStatus().then((res) => {
              if (res)
                Taro.navigateTo({
                  url: '/subpackages/report/pages/report-list/index',
                });
              else Taro.navigateTo({ url: '/pages/login/index' });
            });
          }}
          size={'small'}
          className={`bg-[#4F7FFF]`}
          circle={true}>
          <View style={{ color: '#fff', fontSize: 12 }} className='flex-center'>
            进入
            <View className='white-arrow'></View>
            {/* <AtIcon color='#fff' size={'12px'} value='chevron-right' /> */}
          </View>
        </AtButton>
      </View>
    </View>
  );
};

export default Other;
