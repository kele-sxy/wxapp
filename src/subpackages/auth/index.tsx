import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { AtButton, AtForm, AtInput } from 'taro-ui';
import { livingAuth } from './service';

const Face = () => {
  const [idCard, setIdCard] = useState<any>('');
  const [name, setName] = useState<any>('');
  const [loading, setLoading] = useState<boolean>(false);

  const isEmpty = (name) => {
    return (
      name === null || name === undefined || name === '' || name.length === 0
    );
  };

  const isValidIdCard = (idCard) => {
    // 验证码为6位数字的校验逻辑
    const idCardRegex =
      /^(1[1-5]|2[1-3]|3[1-7]|4[1-6]|5[0-4]|6[1-5]|71|8[1-2])\d{4}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])\d{3}[0-9Xx]$/;
    return idCardRegex.test(idCard);
  };

  const curLivingAuth = async () => {
    try {
      setLoading(true);
      const {
        data: { code, message = '' },
      } = await livingAuth({
        name,
        idcard: idCard,
      });
      if (code === 200) {
        Taro.showToast({
          title: message,
          icon: 'success',
        });
        setTimeout(() => {
          Taro.switchTab({
            url: '/pages/index/index',
            // url: '/pages/home/index',
          });
        }, 300);
      } else {
        Taro.showToast({
          title: message || '认证失败',
          icon: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = () => {
    if (isEmpty(name)) {
      Taro.showToast({
        title: '姓名不能为空',
        icon: 'error',
        duration: 1000,
      });
      return;
    }
    if (!isValidIdCard(idCard)) {
      Taro.showToast({
        title: '身份证校验不通过',
        icon: 'error',
        duration: 1000,
      });
      return;
    }
    curLivingAuth();
  };

  const text = `请您提供完整的身份证号码与姓名完成实名认证`;
  return (
    <View className='bg-base-bg px-[32px] h-[100vh] pt-6'>
      <View className='bg-[#fff] px-[24px] pt-[36px] pb-[48px] rounded-[32px]'>
        <View className='text-[#B3B3B3] text-[24px]'>{text}</View>
        <AtForm className='mt-[24px]' onSubmit={onSubmit}>
          <AtInput
            cursor={-1}
            name='idCard'
            type='idcard'
            placeholder='请输入身份证'
            value={idCard}
            onChange={(value) => {
              setIdCard(value);
            }}
          />
          <AtInput
            cursor={-1}
            name='name'
            type='text'
            placeholder='请输入姓名'
            value={name}
            onChange={(value) => {
              setName(value);
            }}
          />
          <AtButton
            loading={loading}
            type='primary'
            circle={true}
            className='mt-[72px]'
            formType='submit'>
            实名认证
          </AtButton>
        </AtForm>
      </View>
    </View>
  );
};

export default Face;
