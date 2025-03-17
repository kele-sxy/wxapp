import { useState, useRef } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter, useShareAppMessage } from '@tarojs/taro';
import './index.less'; // 如果需要其他样式文件
import CustomNavBar from '@/components/CustomNavBar';
import CustomLogin from './CustomLogin';
import { AtDivider, AtButton, AtIcon } from 'taro-ui';
import PolicyBox from './PolicyBox';
import { wxLogin } from '@/services/login';
import { setToken } from '@/utils';
const Login = () => {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const info = Taro.getStorageSync('menuButtonInfo');

  const router = useRouter();
  const params = router?.params;
  const redirect = decodeURIComponent(params?.redirect ?? '');

  // 区分微信认证登录和手机号登录
  const [loginType, setLoginType] = useState<'wechat' | 'phone'>('wechat');

  const policyBoxRef = useRef<any>(null);

  useShareAppMessage(() => {
    return {
      title: '信誉护航，让信任看得见',
      imageUrl: `${process.env.TARO_APP_API_URL}/common_share.png`,
      path: `/pages/home/index`,
    };
  });

  const handleLogin = (e: any) => {
    // 获取微信用户绑定的手机号码
    if (loading) return;
    const code = e.detail.code;
    if (code) {
      setLoading(true);
      // 走后续登录逻辑
      wxLogin({ code })
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
    }
  };

  return (
    <View
      className='login-container h-screen flex flex-col items-center bg-transparent font-PingFangSC'
      style={{ paddingTop: `${info.top + info.height + 30}px` }}>
      <View
        className='w-full h-[485rpx] absolute top-0 left-0 -z-10'
        style={{
          background: 'linear-gradient(180deg, #B8DDFF 0%, #FEFEFE 100%)',
        }}
      />
      <CustomNavBar
        color='#0E1836'
        leftIconType='home'
        backUrl='/pages/home/index'
        title={
          <>
            <Text className='w-[60rpx] text-center font-medium text-[#0E1836]'>
              登录
            </Text>
          </>
        }
      />
      <View className='w-full flex flex-col px-9 pb-7 flex-1'>
        {loginType === 'wechat' ? (
          <View className='flex flex-col flex-1'>
            <View className='flex flex-col'>
              <Text className='text-lg font-semibold mb-4 text-base-black'>
                微信登录
              </Text>
              <Text className='h-4 font-normal text-xs text-[#BFBFBF] leading-4 tracking-[1rpx] text-left'>
                未注册的手机号码将自动注册
              </Text>
            </View>
            <View className='flex-col flex-1 items-center mt-20'>
              <AtButton
                loading={loading}
                type='primary'
                className='w-full py-4 mb-4 h-12 rounded-3xl'
                openType={checked ? 'getPhoneNumber' : undefined}
                onClick={() => {
                  if (loading) return;
                  if (!checked) {
                    policyBoxRef.current?.checkPolicy();
                    return;
                  }
                }}
                onGetPhoneNumber={handleLogin}>
                <View className='text-base font-medium flex items-center h-full'>
                  用户一键登录
                </View>
              </AtButton>
              <PolicyBox
                checked={checked}
                onChange={setChecked}
                forwardRef={policyBoxRef}
              />
            </View>
          </View>
        ) : (
          <CustomLogin />
        )}
        <View className='w-full h-40 flex-col items-center'>
          <AtDivider content='其他登录方式' fontSize={24} fontColor='#6F7276' />
          <View className='flex-center'>
            {loginType === 'phone' && (
              <View
                className='flex-col flex-center w-fit'
                onClick={() => {
                  setLoginType('wechat');
                }}>
                <View className='text-center mb-4'>
                  <AtIcon
                    prefixClass='icon'
                    value='wechat'
                    size='32'
                    color='#6F7276'
                  />
                </View>
                <View className='text-[#6F7276] text-xs'>微信登录</View>
              </View>
            )}
            {loginType === 'wechat' && (
              <View
                className='flex-col flex-center w-fit'
                onClick={() => {
                  setLoginType('phone');
                }}>
                <View className='text-center mb-4'>
                  <AtIcon
                    prefixClass='icon'
                    value='phone-login'
                    size='32'
                    color='#6F7276'
                  />
                </View>
                <View className='text-[#6F7276] text-xs'>手机号登录</View>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Login;
