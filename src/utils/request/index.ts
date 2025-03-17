import AppRequest from './request';

// 判断是否是h5
const IS_H5 = process.env.TARO_ENV === 'h5';
const API_PREFIX = '/gaia/v1/credit';

const BASE_URL = IS_H5
  ? API_PREFIX
  : `${process.env.TARO_APP_API_URL}${API_PREFIX}` || '';
const TIME_OUT = 10000;
const appRequest = new AppRequest(BASE_URL, TIME_OUT);

export default appRequest;
