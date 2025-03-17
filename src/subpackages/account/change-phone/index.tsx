import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { FC, useEffect, useState } from 'react';
import { AtButton, AtForm, AtInput } from 'taro-ui';
import { sendSmsCode } from '@/services/login';
import { isValidPhoneNumber } from '@/utils';
import { userChangePhone } from './service';

interface IProps {}

const ChangePhone: FC<IProps> = () => {
  const [phoneNum, setPhoneNum] = useState<any>('');
  const [smsCode, setSmsCode] = useState<any>('');
  const [countdown, setCountdown] = useState<any>(0);
  const [isSending, setIsSending] = useState<any>(false);

  const userInfo = Taro.getStorageSync('userInfo');

  const onSubmit = async () => {
    if (!isValidPhoneNumber(phoneNum)) {
      Taro.showToast({ title: '请输入正确的手机号码', icon: 'none' });
      return;
    }
    const { code } = await userChangePhone({
      phone: phoneNum,
      code: smsCode,
    });
    if (code === 200) {
      Taro.showToast({
        title: '修改手机号成功',
        icon: 'success',
      });
      Taro.switchTab({
        url: '/pages/home/index',
      });
    }
  };

  // 验证码倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = () => {
    if (countdown > 0 || isSending) return;
    if (!isValidPhoneNumber(phoneNum)) {
      Taro.showToast({ title: '请输入正确的手机号码', icon: 'none' });
      return;
    }
    setIsSending(true);
    sendSmsCode({ phone: phoneNum })
      .then(() => {
        setCountdown(60);
        Taro.showToast({
          title: '验证码发送成功',
          icon: 'success',
        });
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const text = `手机号为您的登录账户，更换手机号码后，可使用新的手机号码登录。当前手机号为：${userInfo?.phone || ''}`;
  return (
    <View className='bg-base-bg px-[32px] h-[100vh] pt-[16px]'>
      <View className='bg-[#fff] px-[24px] pt-[36px] pb-[48px] rounded-[32px]'>
        <View className='text-[#B3B3B3] text-[24px]'>{text}</View>
        <AtForm className='mt-[24px]' onSubmit={onSubmit}>
          <AtInput
            cursor={-1}
            name='phoneNum'
            type='phone'
            placeholder='请输入手机号'
            value={phoneNum}
            onChange={(value) => {
              setPhoneNum(value);
            }}
          />
          <AtInput
            cursor={-1}
            name='code'
            type='number'
            placeholder='请输入验证码'
            value={smsCode}
            onChange={(value) => {
              setSmsCode(value);
            }}>
            <Text
              className='link-button'
              style={{ color: countdown === 0 ? '#4F7FFF' : '#D5D5D5' }}
              onClick={handleSendCode}>
              {countdown > 0 ? `${countdown}s后重新获取` : '获取验证码'}
            </Text>
          </AtInput>
          <AtButton
            type='primary'
            circle={true}
            className='mt-[72px]'
            formType='submit'>
            提交
          </AtButton>
        </AtForm>
      </View>
    </View>
  );
};

export default ChangePhone;
