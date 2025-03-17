import { View } from '@tarojs/components';
import { FC } from 'react';
import ListUnit from '../components/ListUnit';
import CustomNavBar from '@/components/CustomNavBar';

interface AccountProps {}

const Account: FC<AccountProps> = () => {
  const list = [
    { title: '用户协议', target: '/subpackages/appdocs/agreement-doc/index' },
    { title: '隐私政策', target: '/subpackages/appdocs/privacy-doc/index' },
    { title: '授权书', target: '/subpackages/appdocs/authorize-doc/index' },
  ];

  return (
    <View className='bg-base-bg px-[32px] h-[100vh] pt-[16px]'>
      <CustomNavBar color='#0E1836' title='我的协议' gradient={false} />
      <ListUnit list={list} />
    </View>
  );
};

export default Account;
