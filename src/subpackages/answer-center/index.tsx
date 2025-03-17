import { aesEncrypt, clearToken, getToken } from '@/utils';
import { View, WebView } from '@tarojs/components';
import { FC } from 'react';

const ChatBox: FC = () => {
  let token = getToken();
  const secretKey = '1234567890123456';

  const handleMessage = (e) => {
    console.log('🚀 ~ handleMessage ~ e:', e);
    const { data } = e.detail; // 接收 H5 发送的数据
    const types = data?.map((i) => i.type);
    if (types.includes('TOKEN_EXPIRED')) {
      // 清空toekn 跳转到首页
      clearToken();
    }
  };

  return (
    <View>
      <WebView
        onMessage={handleMessage}
        src={`${process.env.TARO_APP_API_URL}/wxapp/#/subpackages/answer-center/index?token=${aesEncrypt(token, secretKey)}`}
      />
    </View>
  );
};

export default ChatBox;
