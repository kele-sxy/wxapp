import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { FC, useState } from 'react';
import {
  AtButton,
  AtModal,
  AtModalAction,
  AtModalContent,
  AtModalHeader,
} from 'taro-ui';
import ListUnit from '../components/ListUnit';
import { userLogout } from './service';
import { clearToken } from '@/utils';

interface AccountProps {}

const Account: FC<AccountProps> = () => {
  const [open, setVisible] = useState<boolean>(false);

  const userInfo = Taro.getStorageSync('userInfo');
  const hasPwd = userInfo?.status === 'NORMAL';
  const list = [
    {
      title: `${hasPwd ? '修改' : '设置'}登录密码`,
      target: '/subpackages/account/change-pwd/index',
      subDom: userInfo?.status === 'INIT' ? <>暂未设置密码</> : <></>,
    },
    // { title: '更换登录手机', target: '/subpackages/account/change-phone/index' },
  ];

  const curUserLogout = async () => {
    const { code } = await userLogout({});
    if (code === 200) {
      console.log('登出成功');
      clearToken();
      Taro.reLaunch({
        url: '/pages/login/index',
      });
    }
  };

  const handleConfirm = () => {
    try {
      curUserLogout();
    } catch {
      // 失败兜底逻辑
    } finally {
      setVisible(false);
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <View className='bg-base-bg px-[32px] h-[100vh] pt-[16px]'>
      <ListUnit list={list} />
      <AtButton
        onClick={() => {
          setVisible(true);
        }}
        className='bg-[#fff] mb-[32px] border-[#fff]'
        circle={true}>
        退出登录
      </AtButton>
      <AtButton
        onClick={() => {
          Taro.navigateTo({
            url: '/subpackages/account/destroy-account/index',
          });
        }}
        className='bg-[#fff] mb-[32px] border-[#fff]'
        circle={true}>
        注销账号
      </AtButton>
      <AtModal isOpened={open}>
        <AtModalHeader>退出登录</AtModalHeader>
        <AtModalContent>
          确定要退出登录吗？退出后将不会删除任何数据。
        </AtModalContent>
        <AtModalAction>
          <AtButton onClick={handleCancel}>取消</AtButton>
          <AtButton onClick={handleConfirm} type='primary'>
            确定
          </AtButton>
        </AtModalAction>
      </AtModal>
    </View>
  );
};

export default Account;
