import { View } from '@tarojs/components';
import { FC, useState } from 'react';
import Header from './components/Header';
import Notice from './components/Notice';
import Settings from './components/Settings';
import ReportList from './components/ReportList';
import Taro, { useDidShow, useShareAppMessage } from '@tarojs/taro';
import { userInfo } from './service';
import { checkLoginStatus } from '@/utils';
import UnLoginHeader from './components/UnLoginHeader';
import MyService from './components/MyService';

interface IProps {}

const My: FC<IProps> = () => {
  const menuButtonInfo = Taro.getStorageSync('menuButtonInfo');
  const [info, setInfo] = useState<any>({});
  const [effective, setEffective] = useState(false);
  const curUserInfo = async () => {
    try {
      const { data } = await userInfo();
      setInfo(data);
      Taro.setStorageSync('userInfo', data);
    } catch {
    } finally {
    }
  };

  useShareAppMessage(() => {
    return {
      title: '信誉护航，让信任看得见',
      imageUrl: `${process.env.TARO_APP_API_URL}/common_share.png`,
      path: `/pages/home/index`,
    };
  });

  useDidShow(() => {
    checkLoginStatus().then((res) => {
      setEffective(!!res);
      if (res) curUserInfo();
    });
  });
  return (
    <View className='bg-gradient-to-b from-[#C0E0FE] to-[#F3F4F8] min-h-screen'>
      <View
        className='bg-transparent px-3 pb-4'
        style={{
          paddingTop: `${menuButtonInfo.top + menuButtonInfo.height + 30}px`,
        }}>
        {effective ? <Header info={info} /> : <UnLoginHeader />}
        <ReportList />
        {effective && <MyService info={info} />}
        <Notice />
        {effective && <Settings info={info} />}
      </View>
    </View>
  );
};

export default My;
