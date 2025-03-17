import { FC } from 'react';
import { View } from '@tarojs/components';
import PigItem from './PigItem';
import './index.less';

interface IProps {}

const Normal: FC<IProps> = () => {
  return (
    <View className='flex flex-row mx-3'>
      <View className='flex flex-col justify-between pr-[32px] flex-1'>
        <PigItem title='家政服务' subTitle='' mainKey='homemaking' />
        {/* 4F7FFF */}
        <PigItem title='婚恋服务' subTitle='' mainKey='marriage' />
        <PigItem title='学前教育' subTitle='' mainKey='pre_education' />
      </View>
      <View className='flex flex-col flex-1'>
        <PigItem title='用人用工' subTitle='' mainKey='lease' />
        <PigItem title='安保服务' subTitle='' mainKey='security' />
        <PigItem title='个人风险' subTitle='' mainKey='personal_risk' />
      </View>
    </View>
  );
};

export default Normal;
