import { PropsWithChildren } from 'react';
import { useDidShow, useLaunch } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import './variables.scss';
import './assets/iconfont/iconfont.css';
import './app.less';
import './chatui/chat-ui.less';
import './chatui/icons-2.0.2';
import { checkTokenStatus } from './services/login';
import {
  aesDecrypt,
  clearToken,
  getToken,
  setIsWebView,
  setToken,
} from './utils';
import { userInfo } from './pages/index/service';

function App({ children }: PropsWithChildren<any>) {
  useLaunch(({ query }) => {
    console.log('App launched.');

    const wxappToken = query?.token;
    setIsWebView(!!wxappToken);

    const height = Taro.getSystemInfoSync().screenHeight;
    const top = Number((height * 0.03).toFixed(0));
    let info = { top: top, height: top, bottom: top * 2 };
    Taro.setStorageSync('menuButtonInfo', info);

    const style = document.createElement('style');
    style.innerHTML = `
      taro-view-core:has(> .nav-box),
      div:has(> .nav-box),
      .index-page-container {
        padding-top: ${top * 2 + 30}px;
      }
      .destroy-account:has(> .nav-box) {
        padding-top: ${top * 2 + 60}px;
      }
      .lean-padding:has(> .nav-box) {
        padding-top: ${top * 2 + 10}px !important;
      }
      .taro-tabbar__panel {
        padding-bottom: ${wxappToken ? '0' : '60px'};
      }
    `;
    const head = document.getElementsByTagName('head')[0];
    head?.appendChild(style);

    // 渠道信息进缓存
    const channelId = query?.scene ? decodeURIComponent(query.scene) : null;
    if (channelId) Taro.setStorageSync('channelId', channelId);
    else Taro.removeStorageSync('channelId');
  });

  useDidShow(async ({ query }: any) => {
    console.log('🚀 ~ useDidShow ~ query:', query);

    // webView 传入的 token
    const wxappToken = query?.token;
    const secretKey = '1234567890123456';
    if (wxappToken) {
      setIsWebView(true);
      // 解密
      const decryptedText = aesDecrypt(wxappToken, secretKey);
      setToken(decryptedText);
      const { data } = await userInfo();
      Taro.setStorageSync('userInfo', data);
    } else setIsWebView(false);

    // 渠道信息进缓存
    const channelId = query?.scene ? decodeURIComponent(query.scene) : null;
    if (channelId) Taro.setStorageSync('channelId', channelId);

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
