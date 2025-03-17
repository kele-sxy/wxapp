import { View, Text, RichText } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { AtButton, AtIcon } from 'taro-ui';
import { userDelete } from './service';
import { useState } from 'react';
import { clearToken, parseRichText } from '@/utils';
import { getViewProtocol } from '@/services/report';

function DestroyAccount() {
  const [richTextString, setRichTextString] = useState('');

  const richTextNodes: any = parseRichText(richTextString);

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
    <View className='w-full px-[32rpx]'>
      <View
        className='fixed top-0 left-0 right-0 h-[75rpx] px-[32rpx] text-[#6F7276] text-xs flex items-center'
        style={{ background: '#E6EDFF' }}>
        <AtIcon
          color='#F94A52'
          size={'18rpx'}
          value='alert-circle'
          className='mr-2'
        />
        <Text>请阅读完协议才可完成注销</Text>
      </View>
      <View className='mt-[75rpx] pb-[160rpx]'>
        <RichText nodes={richTextNodes} />
      </View>
      <View className='fixed bottom-0 bg-white py-4'>
        <View
          style={{
            width: 'calc(100vw - 64rpx)',
          }}
          className='flex justify-between'>
          <AtButton
            onClick={() => {
              Taro.navigateBack();
            }}
            className='border-1 text-[#4F7FFF] text-[32rpx] rounded-[64rpx] w-[314rpx]'>
            取消
          </AtButton>
          <AtButton
            className='w-[314rpx] text-[32rpx] rounded-[64rpx]'
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
