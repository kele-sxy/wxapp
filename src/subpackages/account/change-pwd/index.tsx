import { View } from '@tarojs/components';
import { FC, useState } from 'react';
import { AtButton, AtForm } from 'taro-ui';
import { userSetPassword, userChangePassword } from './service';
import { clearToken, getMd5Password, isValidPassword } from '@/utils';
import Taro from '@tarojs/taro';
import PassWordOld from './pwd';
import PassWordNew from './pwd';
import PassWordConfirm from './pwd';

interface IProps {}

const ChangePwd: FC<IProps> = () => {
  const userInfo = Taro.getStorageSync('userInfo');
  const hasPwd = userInfo?.status === 'NORMAL';
  const [oldPwd, setOldPwd] = useState<any>('');
  const [newPwd, setNewPwd] = useState<any>('');
  const [confirmPwd, setConfirmPwd] = useState<any>('');

  const curUserSetPassword = async () => {
    const { code } = await userSetPassword({
      oldPwd: '',
      password: getMd5Password(newPwd),
    });
    if (code === 200) {
      Taro.showToast({
        title: '密码设置成功',
        icon: 'success',
        duration: 300,
        mask: true,
      });
      Taro.switchTab({
        url: '/pages/index/index',
      });
    }
  };

  const curUserChangePassword = async () => {
    const { code } = await userChangePassword({
      oldPwd: getMd5Password(oldPwd),
      password: getMd5Password(newPwd),
    });

    if (code === 200) {
      Taro.showToast({
        title: '修改密码成功，请重新登录',
        icon: 'success',
        duration: 300,
        mask: true,
      });
      clearToken();
      Taro.reLaunch({
        url: '/pages/login/index?type=password',
      });
    }
  };

  const onSubmit = () => {
    try {
      if (!isValidPassword(newPwd)) {
        Taro.showToast({ title: '密码格式校验不通过', icon: 'none' });
        return;
      }
      if (newPwd !== confirmPwd) {
        Taro.showToast({ title: '两次密码不一致', icon: 'none' });
        return;
      }
      if (hasPwd) {
        curUserChangePassword();
      } else {
        curUserSetPassword();
      }
    } catch {
    } finally {
    }
  };

  return (
    <View className='bg-base-bg px-[32px] h-[100vh] pt-[16px]'>
      <View className='bg-[#fff] px-[24px] pt-[36px] pb-[48px] rounded-[32px]'>
        {!hasPwd && (
          <View className='text-[#858585] text-[28px] mb-[8px]'>
            设置登录密码后，可使用密码登录。
          </View>
        )}
        <View className='text-[#B3B3B3] text-[24px]'>
          请输入8-15位密码，至少包含3种格式，包括：大小写字母、数字、符号
        </View>
        <AtForm className='mt-[24px]' onSubmit={onSubmit}>
          {hasPwd && (
            <PassWordOld
              value={oldPwd}
              onChange={setOldPwd}
              placeholder='请输入原密码'
            />
          )}
          <PassWordNew
            value={newPwd}
            onChange={setNewPwd}
            placeholder={hasPwd ? '请输入新密码' : '请输入密码'}
          />
          <PassWordConfirm
            value={confirmPwd}
            onChange={setConfirmPwd}
            placeholder={hasPwd ? '请确认新密码' : '请确认密码'}
          />
          <AtButton
            type='primary'
            circle={true}
            className='mt-[72px]'
            formType='submit'>
            确定
          </AtButton>
        </AtForm>
      </View>
    </View>
  );
};

export default ChangePwd;
