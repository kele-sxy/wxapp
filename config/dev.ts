import type { UserConfigExport } from '@tarojs/cli';

export default {
  logger: {
    quiet: false,
    stats: true,
  },
  mini: {},
  h5: {
    devServer: {
      proxy: {
        '/gaia': {
          // 代理的目标服务器，也就是你要发请求的那个服务器
          target: 'http://gaia-wxapp.lanxiang.com',
          changeOrigin: true,
          pathRewrite: {
            // 此处的路径替换是不做任何替换，也就是说api还是接着原来的api
            '^/gaia': '/gaia',
          },
        },
      },
    },
  },
} satisfies UserConfigExport;
