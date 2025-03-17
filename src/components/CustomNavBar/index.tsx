import { ReactNode, useState } from 'react';
import { AtIcon, AtNavBar } from 'taro-ui';
import Taro, { usePageScroll } from '@tarojs/taro';
import './index.less';
import { View, Text } from '@tarojs/components';

interface CustomNavBarProps {
  title: ReactNode | string;
  titleIcon?: string;
  color?: string;
  backUrl?: string; // 目标页面完整路径
  border?: boolean; // 下边框
  gradient?: boolean; // 渐变
  leftIconType?: string; // 自定义左上角按钮
}
export default function Index(props: CustomNavBarProps) {
  const {
    title,
    titleIcon,
    color,
    backUrl,
    border = false,
    gradient = true,
    leftIconType = 'chevron-left',
  } = props;

  const defaultColor = '#fff';

  const [bgColor, setBgColor] = useState(
    gradient ? 'rgba(255, 255, 255, 0)' : '#fff',
  );
  const [textColor, setTextColor] = useState(color ?? defaultColor);

  const [opc, setOpc] = useState(gradient ? 0 : 1);

  const info = Taro.getStorageSync('menuButtonInfo');
  // 监听页面滚动
  usePageScroll(({ scrollTop }) => {
    const navHeight = info.height + info.top;
    // 滚动过程中设置背景色渐变
    // 根据滚动位置计算透明度
    const opacity = gradient ? Math.min(1, scrollTop / navHeight) : 1;
    setOpc(opacity);
    setBgColor(`rgba(255, 255, 255, ${opacity.toFixed(2)})`);
    //根据透明度 设置 textColor
    // 设置字体颜色，透明度越高，颜色越接近灰色 (25, 48, 89)
    const textRed = Math.round(255 - (225 - 25) * opacity);
    const textGreen = Math.round(255 - (225 - 48) * opacity);
    const textBlue = Math.round(255 - (225 - 89) * opacity);
    if (!color) setTextColor(`rgba(${textRed}, ${textGreen}, ${textBlue}, 1)`);
  });

  // useDidShow(() => {
  //   setTextColor(color ?? defaultColor);
  // });

  return (
    <View
      style={{
        height: `${info.height + info.top + 10}px`,
        paddingTop: `${info.top}px`,
        paddingBottom: '10px',
        backgroundColor: bgColor,
        borderBottom: '1rpx solid transparent',
        borderBottomColor: `rgba(213, 213, 213, ${opc})`,
      }}
      className='fixed top-0 w-full z-50 nav-box'>
      <AtNavBar
        className='bg-transparent custom-bav-bar h-full'
        color={textColor}
        leftIconType={leftIconType}
        border={border}
        onClickLeftIcon={() => {
          if (
            backUrl &&
            ['/pages/home/index', '/pages/index/index'].includes(backUrl)
          ) {
            // 返回 tabbar page
            Taro.reLaunch({ url: backUrl });
            return;
          }
          if (backUrl) {
            Taro.navigateTo({ url: backUrl });
            return;
          }
          const pages = Taro.getCurrentPages();
          if (pages.length > 1) {
            Taro.navigateBack({ delta: 1 });
            return;
          }
          Taro.reLaunch({ url: '/pages/home/index' });
        }}>
        <View
          style={{ color: textColor }}
          className='flex justify-center items-center'>
          {titleIcon && (
            <AtIcon
              prefixClass='icon'
              value={titleIcon}
              size='16rpx'
              color={textColor}
              className='mr-[10rpx]'
            />
          )}
          <Text className='overflow-ellipsis overflow-hidden whitespace-nowrap'>
            {title}
          </Text>
        </View>
      </AtNavBar>
    </View>
  );
}
