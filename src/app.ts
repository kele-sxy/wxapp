import { PropsWithChildren } from 'react';
import { useDidShow, useLaunch } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import './variables.scss';
import './assets/iconfont/iconfont.css';
import './app.less';
import { checkTokenStatus } from './services/login';
import { clearToken, getToken, scanCode } from './utils';

function App({ children }: PropsWithChildren<any>) {
  useLaunch(({ query, path }) => {
    // 扫码进入
    scanCode(query, path);
    if (!query.scene) {
      Taro.removeStorageSync('channelId');
      Taro.removeStorageSync('voucherRecordId');
    }

    const info = Taro.getMenuButtonBoundingClientRect();
    if (info) {
      Taro.setStorageSync('menuButtonInfo', info);
    }
  });

  useDidShow(({ query, path }: any) => {
    // 扫码进入
    scanCode(query, path);

    // 首先校验 token 是否有效，过期移除缓存 token
    const token = getToken();
    if (token) {
      checkTokenStatus().then((res) => {
        const effective = res?.data;
        if (!effective) clearToken();
      });
    }
  });

  // children 是将要会渲染的页面
  return children;
}

export default App;
