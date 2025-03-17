import { View } from "@tarojs/components";
import { FC } from "react";

interface IProps {
  title: string;
  status: string;
  config?: {
    textColor: string;
    bgColor: string;
  }
};

const componentName: FC<IProps> = (props) => {
  const { title, status, config } = props;
  let textColor = config?.textColor;
  let bgColor = config?.bgColor
  if (status === 'success') {
    textColor = '#4F7FFF'
    bgColor = '#C6DBFC'
  }
  if (status === 'undo') {
    bgColor = '#fafafa'
    textColor = 'rgba(0, 0, 0, 0.88)'
  }
  return <View style={{
    backgroundColor: bgColor,
    color: textColor,
    borderRadius: '24rpx',
  }} className="text-[24px] px-[24rpx] py-[8rpx] w-[122rpx] my-[8rpx]">{title}</View>
};

export default componentName;