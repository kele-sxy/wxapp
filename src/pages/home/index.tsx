import { View, Text, Image } from '@tarojs/components';
import { MainTitle, Normal, Other } from './compnents';
import { useState } from 'react';
import { useDidShow, useShareAppMessage } from '@tarojs/taro';
import { getVoucherNum } from '@/services/voucher';
import colourSpeaker from '@/assets/svg/colour-speaker.svg';
import serviceCenter from '@/assets/svg/service-center.svg';
import Taro from '@tarojs/taro';
import { checkBuriedPointCode, checkLoginStatus } from '@/utils';
import './index.less';
import ViewTitle from '../../components/ViewTitle';
import { addUserVisit } from '@/services/home';

export default function Index() {
  const [voucherNum, setVoucherNum] = useState(0);
  const [showService, setShowService] = useState(false);

  useShareAppMessage(() => {
    return {
      path: `/pages/home/index`,
    };
  });

  useDidShow(() => {
    // 查询当前用户待领取代金券数量
    checkLoginStatus().then((res) => {
      setShowService(!!res);
      if (res) {
        getVoucherNum().then((res) => {
          setVoucherNum(res?.data ?? 0);
        });
      }
    });
    checkBuriedPointCode().then((code) => {
      // 首页访问数据埋点
      addUserVisit({ pageUrl: 'pages/home/index', code });
    });
  });

  return (
    <View className='bg-gradient-to-b from-[#3F77F7] to-[#F3F4F8] min-h-screen pt-5'>
      {/* <CustomNavBar
        color='#0E1836'
        title='信誉护航'
        leftIconType=''
        gradient={false}
      /> */}
      <View>
        <MainTitle />
        {!!voucherNum && (
          <View
            className='flex items-center mx-3 mt-3 py-2.5 rounded-lg bg-white text-[#828CA1] text-xs'
            onClick={() => {
              Taro.navigateTo({
                url: '/subpackages/receive-voucher/index',
              });
            }}>
            <Image src={colourSpeaker} className='w-4 h-4 ml-4 mr-2' />
            <Text>您有新的优惠券到账，请尽快领取！！！</Text>
          </View>
        )}
        <View className='mt-5'>
          <ViewTitle title={'民生服务'} />
          <Normal />
        </View>
        <View className='mt-1 pb-5'>
          <ViewTitle title={'其他服务'} />
          <Other />
        </View>
      </View>
      {showService && (
        <View className='fixed bottom-32 right-2'>
          <Image
            className='w-14 h-14 z-50'
            src={serviceCenter}
            onClick={() => {
              Taro.navigateTo({ url: '/subpackages/answer-center/index' });
            }}></Image>
        </View>
      )}
    </View>
  );
}
