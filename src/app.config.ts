export default defineAppConfig({
  pages: ['pages/home/index', 'pages/index/index', 'pages/login/index'],
  subPackages: [
    {
      root: 'subpackages/report',
      pages: [
        'pages/report-list/index', // 报告列表
        'pages/report-list-undo/index', // 报告列表
        'pages/report-version/index',
        'pages/report-search/index',
        'pages/doc-signing/index',
        'pages/sign-page/index',
      ],
    },
    {
      root: 'subpackages/account',
      pages: [
        'index',
        'change-phone/index',
        'change-pwd/index',
        'destroy-account/index',
      ],
    },
    {
      root: 'subpackages/announcement',
      pages: ['index', 'notice-content/index'],
    },
    {
      root: 'subpackages/my-agreement',
      pages: ['index'],
    },
    {
      root: 'subpackages/auth',
      pages: ['index'],
    },
    {
      root: 'subpackages/appdocs',
      pages: [
        'agreement-doc/index',
        'privacy-doc/index',
        'authorize-doc/index',
      ],
    },
    {
      root: 'subpackages/banner-notice',
      pages: ['index'],
    },
    {
      root: 'subpackages/report-detail',
      pages: ['pages/common/index'],
    },
    {
      root: 'subpackages/voucher',
      pages: ['index'],
    },
    {
      root: 'subpackages/receive-voucher',
      pages: ['index'],
    },
    {
      root: 'subpackages/invalid-voucher',
      pages: ['index'],
    },
    {
      root: 'subpackages/answer-center',
      pages: ['index'],
    },
    {
      root: 'subpackages/staff-service',
      pages: ['index'],
    },
    {
      root: 'subpackages/answer-detail',
      pages: ['index'],
    },
    {
      root: 'subpackages/complaint-center',
      pages: ['index'],
    },
    {
      root: 'subpackages/complaint-record',
      pages: ['index'],
    },
    {
      root: 'subpackages/my-orders',
      pages: ['index'],
    },
    {
      root: 'subpackages/order-invoicing',
      pages: ['index'],
    },
    {
      root: 'subpackages/issue-invoice',
      pages: ['index'],
    },
  ],
  tabBar: {
    color: '#CDD1EA',
    selectedColor: '#4F7FFF',
    list: [
      {
        text: '首页',
        pagePath: 'pages/home/index',
        iconPath: './assets/images/home.png',
        selectedIconPath: './assets/images/home_s.png',
      },
      {
        text: '我的',
        pagePath: 'pages/index/index',
        iconPath: './assets/images/my.png',
        selectedIconPath: './assets/images/my_s.png',
      },
    ],
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F3F4F8',
  },
  lazyCodeLoading: 'requiredComponents',
  // animation: false,
  animation: {
    duration: 100,
    delay: 50,
  },
});
