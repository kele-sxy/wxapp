import { View, Text, RichText } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { AtButton, AtIcon } from 'taro-ui';
import { userDelete } from './service';
import { useState } from 'react';
import { clearToken, parseRichText } from '@/utils';
import { getViewProtocol } from '@/services/report';
import CustomNavBar from '@/components/CustomNavBar';

function DestroyAccount() {
  const [richTextString, setRichTextString] = useState('');

  const richTextNodes: any = parseRichText(richTextString);

  const info = Taro.getStorageSync('menuButtonInfo');

  const curUserDelete = async () => {
    const { code } = await userDelete({});
    if (code === 200) {
      console.log('注销成功');
      clearToken();
      Taro.reLaunch({
        url: '/pages/login/index',
      });
    }
  };

  useDidShow(() => {
    getViewProtocol({ type: 'ACCOUNT_CANCEL' }).then((res) => {
      if (res.data) {
        setRichTextString(res.data.content);
      }
    });
  });

  return (
    <View className='w-full px-[32rpx] destroy-account'>
      <CustomNavBar color='#0E1836' title='注销帐号' gradient={false} />
      <View
        className='fixed left-0 right-0 py-2 px-[32rpx] text-[#6F7276] text-xs flex items-center'
        style={{
          background: '#E6EDFF',
          top: `${info.height + info.top + 10}px`,
        }}>
        <AtIcon
          color='#F94A52'
          size={'18rpx'}
          value='alert-circle'
          className='mr-2'
        />
        <Text>请阅读完协议才可完成注销</Text>
      </View>
      <View className='pb-[160rpx]'>
        <RichText nodes={richTextNodes} />
      </View>
      <View className='fixed bottom-0 bg-white py-4 right-0 left-0'>
        <View
          style={{
            width: 'calc(100vw - 64rpx)',
          }}
          className='flex justify-between'>
          <AtButton
            onClick={() => {
              const pages = Taro.getCurrentPages();
              if (pages.length < 2) {
                window.history.go(-1);
              } else Taro.navigateBack({ delta: 1 });
            }}
            className='border-1 text-[#4F7FFF] flex-center !h-10 text-[32px] rounded-[64rpx] w-40'>
            取消
          </AtButton>
          <AtButton
            className='flex-center !h-10 text-[32px] rounded-[64rpx] w-40'
            onClick={() => {
              curUserDelete();
            }}
            type='primary'>
            同意注销
          </AtButton>
        </View>
      </View>
    </View>
  );
}

export default DestroyAccount;
