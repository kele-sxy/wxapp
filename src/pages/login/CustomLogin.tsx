import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter, useShareAppMessage } from '@tarojs/taro';
import './index.less'; // 如果需要其他样式文件
import { AtButton, AtIcon, AtInput } from 'taro-ui';
import classNames from 'classnames';
import { loginRequest, sendSmsCode } from '@/services/login';
import { getMd5Password, isValidPhoneNumber, setToken } from '@/utils';
import PolicyBox, { PolicyBoxRef } from './PolicyBox';

interface PassWordProps {
  value: string;
  onChange: (value: string) => void;
}

interface CodeProps {
  value: string;
  onChange: (value: string) => void;
  hidden?: boolean;
  handleGetCode: () => Promise<any>;
}

const PassWord = ({ value, onChange }: PassWordProps) => {
  const [canSee, setCanSee] = useState(false);
  return (
    <View className='w-full mb-4 hide-input-after'>
      <AtInput
        clear
        cursor={-1}
        name='password'
        className='h-[80rpx] w-full border-x-0 border-t-0 border-b-[1rpx] border-solid border-[#D5D5D5] !mx-0 bg-transparent p-0'
        placeholderClass='text-[#BFBFBF] text-sm'
        // password={!canSee}
        placeholder='请输入密码'
        value={value}
        onChange={onChange}
        type={canSee ? 'text' : 'password'}>
        <View
          onClick={() => {
            setCanSee((v) => !v);
          }}>
          {canSee && (
            <AtIcon
              className='h-[48rpx] leading-[48rpx]'
              value='eye'
              size='20'
              color='#ccc'
            />
          )}
          {!canSee && (
            <AtIcon
              className='h-[48rpx]'
              prefixClass='icon'
              value='close-eye'
              size='20'
              color='#ccc'
            />
          )}
        </View>
      </AtInput>
      {/* <View
        className='absolute right-4 bottom-[50rpx] cursor-pointer z-10'
        onClick={() => {
          setCanSee((v) => !v);
        }}>
        <AtIcon value='eye' size='20' color='#ccc' className='cursor-pointer' />
        {!canSee && (
          <View className='absolute w-[40rpx] h-[4rpx] bg-[#d5d5d5] -rotate-45 bottom-[20rpx] cursor-pointer' />
        )}
      </View> */}
    </View>
  );
};

const Code = ({ value, onChange, hidden, handleGetCode }: CodeProps) => {
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // useEffect(() => {
  //   if (loading) {
  //     Taro.showLoading();
  //     return;
  //   }
  //   Taro.hideLoading();
  // }, [loading]);

  const getCode = () => {
    if (countdown !== 0) return;
    if (loading) return;
    setLoading(true);
    handleGetCode()
      .then(() => {
        setCountdown(60);
        Taro.showToast({ title: '验证码已发送', icon: 'success' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //不会影响倒计时
  if (hidden) return <></>;
  return (
    <View className='w-full mb-4 relative'>
      <AtInput
        clear
        cursor={-1}
        type='number'
        name='code'
        className='h-[80rpx] w-full border-x-0 border-t-0 border-b-[1rpx] border-solid border-[#D5D5D5] !mx-0 bg-transparent p-0'
        placeholderClass='text-[#BFBFBF] text-sm'
        placeholder='请输入验证码'
        value={value}
        onChange={onChange}>
        <Text
          className='link-button h-[80rpx] text-lg leading-[80rpx]'
          style={{ color: countdown === 0 ? '#4F7FFF' : '#D5D5D5' }}
          onClick={getCode}>
          {countdown > 0 ? `${countdown}s后重新获取` : '获取验证码'}
        </Text>
      </AtInput>
    </View>
  );
};

const CustomLogin = () => {
  const router = useRouter();
  const params = router?.params;
  const type = params?.type ?? ('code' as any);
  const redirect = decodeURIComponent(params?.redirect ?? '');

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loginType, setLoginType] = useState<'password' | 'code'>(type);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const policyBoxRef = useRef<PolicyBoxRef>(null);

  useShareAppMessage(() => {
    return {
      title: '信誉护航，让信任看得见',
      imageUrl: `${process.env.TARO_APP_API_URL}/common_share.png`,
      path: `/pages/home/index`,
    };
  });

  const handleLogin = () => {
    if (!canLogin) return;
    if (loading) return;
    if (!checked) {
      //   Taro.showToast({
      //     title: '请先阅读并同意用户协议和隐私政策',
      //     icon: 'none',
      //   });
      policyBoxRef.current?.checkPolicy();
      return;
    }

    setLoading(true);

    // 如果 password 存在，则进行两次 MD5 加密
    const encryptedPassword = getMd5Password(password);

    loginRequest(loginType, {
      phone,
      password: encryptedPassword, //md5加密两次
      code,
    })
      .then((res) => {
        Taro.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 300,
          mask: true,
        });
        setToken(res.data);
        if (redirect) {
          Taro.navigateBack({
            delta: 1,
          });
          return;
        }
        setTimeout(() => {
          Taro.switchTab({
            url: '/pages/home/index',
          });
        }, 300);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const canLogin = useMemo(() => {
    const isValidCode = (code) => {
      // 验证码为6位数字的校验逻辑
      const codeRegex = /^\d{6}$/;
      return codeRegex.test(code);
    };
    // 对手机号格式进行校验
    if (!isValidPhoneNumber(phone)) return false;
    if (loginType === 'password') {
      // 对密码式进行校验
      return password?.length >= 6;
    }
    if (loginType === 'code') {
      // 对6位数数字验证码进行校验
      return isValidCode(code);
    }
  }, [loginType, phone, code, password]);

  useEffect(() => {
    setPassword('');
    setCode('');
  }, [loginType]);

  return (
    <View className='w-full flex flex-col flex-1'>
      <Text className='text-lg font-semibold mb-4 text-base-black'>
        {loginType === 'code' ? '验证码登录' : '密码登录'}
      </Text>
      <Text className='h-4 font-normal text-xs text-[#BFBFBF] leading-4 tracking-[1rpx] text-left'>
        {loginType === 'code'
          ? '未注册的手机号码将自动注册'
          : '如未设置密码，请使用验证码登录/注册'}
      </Text>
      <View className='w-full mb-8 mt-9'>
        <AtInput
          clear
          cursor={-1}
          name='phone'
          className='h-[80rpx] w-full border-x-0 border-t-0 border-b-[1rpx] border-solid border-[#D5D5D5] !mx-0 bg-transparent p-0'
          placeholderClass='text-[#BFBFBF] text-sm'
          placeholder='请输入您的手机号码'
          value={phone}
          type='phone'
          onChange={(v: any) => setPhone(v)}
        />
      </View>
      {loginType === 'password' && (
        <PassWord value={password} onChange={setPassword} />
      )}
      <Code
        value={code}
        onChange={setCode}
        hidden={loginType !== 'code'}
        handleGetCode={() => {
          console.log('🚀 ~ Login ~ phone:', phone);
          if (!phone || !isValidPhoneNumber(phone)) {
            Taro.showToast({ title: '请输入正确的手机号码', icon: 'none' });
            return Promise.reject();
          }
          // debugger;
          return sendSmsCode({ phone, type: 'LOGIN' });
        }}
      />
      <PolicyBox
        checked={checked}
        onChange={setChecked}
        forwardRef={policyBoxRef}
      />
      <AtButton
        loading={loading}
        type='primary'
        className={classNames('w-full py-4 mt-4 h-12 rounded-3xl', {
          'bg-[#D8D8D8] border-[#D8D8D8]': !canLogin,
        })}
        onClick={handleLogin}>
        <View className='text-base font-medium flex items-center h-full'>
          登录
        </View>
      </AtButton>
      <View className='w-full flex justify-between text-blue-500 mt-[39rpx]'>
        {/* 占位，目前没有忘记密码流程 */}
        <Text></Text>
        {/* {loginType === 'password' && (
        <Text className='font-normal text-[24rpx] text-[#757575] leading-[33rpx] text-left normal-case'>
          忘记密码
        </Text>
      )} */}
        {loginType === 'password' && (
          <Text
            onClick={() => setLoginType('code')}
            className='font-normal text-[28rpx] text-[#757575] leading-[33rpx] text-left normal-case'>
            验证码登录
          </Text>
        )}
        {loginType === 'code' && (
          <Text
            onClick={() => setLoginType('password')}
            className='font-normal text-[28rpx] text-[#757575] leading-[33rpx] text-left normal-case'>
            密码登录
          </Text>
        )}
      </View>
    </View>
  );
};

export default CustomLogin;
