import appRequest from '@/utils/request';

// 首页轮播图
export const getBannerList = () => {
  return appRequest.post({
    url: '/carousel/applet/list',
  });
};

// 获取轮播图详情
export const getBannerDetail = (carouselId: string) => {
  return appRequest.post({
    url: '/carousel/applet/get',
    data: {
      carouselId,
    },
  });
};

// 获取公告列表
export const getNoticeList = () => {
  return appRequest.post({
    url: '/notice/applet/list',
  });
};

// 获取公告详情
export const getNoticeDetail = (noticeId: string) => {
  return appRequest.post({
    url: '/notice/applet/get',
    data: {
      noticeId,
    },
  });
};

// 用户访问记录
export const addUserVisit = (data: any) => {
  return appRequest.post({
    url: '/userVisits/add',
    data,
  });
};

// 生成唯一 code
export const generateCode = () => {
  return appRequest.get({
    url: '/userVisits/code',
  });
};
