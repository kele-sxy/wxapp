import Taro from '@tarojs/taro';
import { parseDocument, DomUtils } from 'htmlparser2';
import CryptoJS from 'crypto-js';
import { MINIO_PREFIX } from '@/constant';
import { checkTokenStatus } from '@/services/login';
import { generateCode } from '@/services/home';

// 升级 - 更新小程序 isForce 强制升级
export const updateWeapp = (isForce?: boolean): void => {
  const tipModal = (updateManager) => {
    Taro.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否马上重启小程序？',
      success: (res) => {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          try {
            Taro.clearStorageSync();
          } catch (e) {
            // Do something when catch error
          }
          updateManager.applyUpdate();
        } else {
          if (isForce) {
            tipModal(updateManager);
          }
        }
      },
    });
  };
  if (process.env.TARO_ENV === 'weapp') {
    const updateManager = Taro.getUpdateManager();
    updateManager.onCheckForUpdate((res) => {
      // 请求完新版本信息的回调
      console.log('是否有新版本: ', res.hasUpdate);
    });

    updateManager.onUpdateReady(() => {
      tipModal(updateManager);
    });

    updateManager.onUpdateFailed(() => {
      // 新的版本下载失败
      console.log('新的版本下载失败');
    });
  }
};

// 获取 jsCode
export const getJsCode = async () => {
  return new Promise((resolve: (value: string) => void, reject) => {
    Taro.login({
      success: (res) => {
        if (res.code) {
          resolve(res.code);
        } else {
          reject('登录失败！' + res.errMsg);
        }
      },
      fail: (err) => {
        reject('登录接口调用失败！' + err.errMsg);
      },
    });
  });
};

// 时间格式化,默认2023/08/08 16:27:59
export const formatTime = (date, fill = '/', time: boolean = false) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  if (!time) {
    return [year, month, day].map(formatNumber).join(fill);
  }
  return (
    [year, month, day].map(formatNumber).join(fill) +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  );
};

// 10内数字补充0
export const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

// 获取当前页面栈
export const path = () => {
  const pages = Taro.getCurrentPages();
  return pages[pages.length - 1];
};

// 强行睡觉,默认800
export const sleep = (time: number = 800) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(true);
    }, time),
  );
};

// 判断对象是否有空值
export const hasEmptyProperty = (obj) => {
  for (const key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      (obj[key] === null || obj[key] === undefined || obj[key] === '')
    ) {
      return true;
    }
  }
  return false;
};

export const paramsToQueryString = (params: any) => {
  return Object.keys(params)
    .map((key) => key + '=' + params[key])
    .join('&');
};

/**
 * 统一处理jsonParse
 * @param param jsonString
 * @returns object
 */
export const jsonParse = (param: any) => {
  if (typeof param === 'string') {
    try {
      return JSON.parse(param);
    } catch {
      return {};
    }
  }
  return param;
};

// 滚动到页面底部
export const scrollToBottom = () => {
  Taro.createSelectorQuery()
    .selectViewport() // 选择当前视口（viewport）
    .scrollOffset((res: any) => {
      //获取当前滚动偏移量和页面总高度
      Taro.pageScrollTo({
        scrollTop: res.scrollHeight,
        duration: 300, // 滚动的时间（毫秒）
      });
    })
    .exec();
};

//格式化富文本
export const parseRichText = (htmlString) => {
  const content = htmlString
    .replace(/<table/g, '<table class="table"')
    .replace(/<tr/g, '<tr class="tr"')
    .replace(/<th/g, '<tr class="th"')
    .replace(/<td/g, '<td class="td"');

  const document = parseDocument(content);
  const nodes = DomUtils.getChildren(document);

  const transformNode = (node) => {
    if (node.name === 'img' && node.attribs.src?.includes(MINIO_PREFIX)) {
      node.attribs.src = process.env.TARO_APP_API_URL + node.attribs.src;
      if (!node.attribs.style) node.attribs.style = 'width: 100%;';
    }

    if (node.name === 'p' && !node.attribs.style) {
      node.attribs.style = 'min-height:18px;';
    }

    if (node.type === 'text') {
      return { type: 'text', text: node.data };
    }

    const { name, attribs, children } = node;
    const nodeObj = {
      name,
      attrs: attribs,
      children: children.map(transformNode),
    };

    return nodeObj;
  };

  return nodes.map(transformNode);
};

export const formatBigNumber = (number: number) => {
  if (number >= 1e12) {
    const count = (number / 1e12).toFixed(1);
    return count + '万亿';
  } else if (number >= 1e9) {
    const count = (number / 1e9).toFixed(1);
    return count + '十亿';
  } else if (number >= 1e6) {
    const count = (number / 1e6).toFixed(1);
    return count + '百万';
  } else if (number >= 1e3) {
    const count = (number / 1e3).toFixed(1);
    return count + '千';
  } else {
    return number;
  }
};

/**
 * 获取两次md5加密后的密码
 * @param password
 */
export const getMd5Password = (password) => {
  return password
    ? CryptoJS.MD5(CryptoJS.MD5(password).toString()).toString()
    : null;
};

export const isValidPhoneNumber = (phone) => {
  // 简单的手机号码格式校验逻辑
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-=_+{};':"\\|,.<>\/?]).{8,15}$
export const isValidPassword = (password) => {
  // 简单的手机号码格式校验逻辑
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-=_+{};':"\\|,.<>\/?]).{8,15}$/;
  return passwordRegex.test(password);
};

/**
 * 获取当前路由
 * @returns
 */
export const getCurrentPageUrl = () => {
  const pages = Taro.getCurrentPages(); // 获取当前页面栈
  const currentPage = pages[pages.length - 1]; // 获取当前页面对象
  return currentPage.route; // 返回当前页面的路由
};

// set token
export const setToken = (token: string) =>
  Taro.setStorageSync('__weapp_token__', token);

// get token
export const getToken = () => Taro.getStorageSync('__weapp_token__');

// clear token
export const clearToken = () => {
  Taro.removeStorageSync('__weapp_token__');
};

// 判断缓存中是否存在 token 存在 token 调用形参中的函数参数 不存在跳 登录 页面
export const checkLoginStatus = async () => {
  const token = getToken(); // 拿到本地缓存中存的token
  let effective = false;
  if (token) {
    const res = await checkTokenStatus();
    effective = res?.data;
  }
  if (!effective) clearToken();
  return effective;
};

// aes加密
export const aesEncrypt = (plaintext, secretKey) => {
  const key = CryptoJS.enc.Utf8.parse(secretKey);
  const iv = CryptoJS.enc.Utf8.parse(secretKey.substring(0, 16)); // 取密钥前16字节作为IV
  const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString(); // 返回 Base64 格式密文
};

// 扫码进入
// 现在有两种二维码：1 携带渠道 id 2 携带代金券凭证
export const scanCode = (query, path) => {
  // 扫了代金券的码 渠道码的 path 是首页 pages/home/index
  const scanVoucher = path.includes('subpackages/receive-voucher/index');
  // url 中可能是 代金券凭证 也可能是 渠道码
  const scene = query?.scene ? decodeURIComponent(query.scene) : null;
  if (scene && scanVoucher) Taro.setStorageSync('voucherRecordId', scene);
  if (scene && !scanVoucher) {
    Taro.setStorageSync('channelId', scene);
    Taro.removeStorageSync('voucherRecordId');
  }
};

// 存储埋点唯一 code
export const setBuriedPointCode = (code) => {
  Taro.setStorageSync('buriedPointCode', code);
};

// 获取埋点唯一 code
export const getBuriedPointCode = () => {
  return Taro.getStorageSync('buriedPointCode');
};

// 判断缓存是否有埋点 code 没有生成一个存入
export const checkBuriedPointCode = async () => {
  let code = getBuriedPointCode();
  if (!code) {
    const res = await generateCode();
    code = res.data.code;
    setBuriedPointCode(res.data.code);
  }
  return code;
};
