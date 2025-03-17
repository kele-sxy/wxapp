import { ReactNode } from 'react';
import { View } from '@tarojs/components';
import cls from 'classnames';
import './index.less';

export interface InfoCardProps {
  title: ReactNode | string | undefined;
  children?: ReactNode | undefined;
  extra?: ReactNode | string | undefined;
  extraStyle?: object;
  noShadow?: boolean;
  type?: string; // 不同类型报告页面
}

export default function InfoCard(props: InfoCardProps) {
  const {
    children = null,
    title,
    extra,
    extraStyle,
    noShadow = false,
    type,
  } = props;
  return (
    <View
      className='info-card bg-white overflow-auto'
      style={noShadow ? { boxShadow: 'none' } : undefined}>
      {title && (
        <View className='card__header flex justify-butween'>
          <View
            className={cls(
              'card__header-title flex items-center',
              `card__header-title-${type}`,
            )}>
            {title}
          </View>
          <View style={extraStyle}>{extra}</View>
        </View>
      )}
      <View
        className='card__content'
        style={{ paddingTop: title ? '0px' : '10px' }}>
        {children}
      </View>
    </View>
  );
}
