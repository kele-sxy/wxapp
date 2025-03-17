import { FC } from 'react';
import ListUnit from '../components/ListUnit';
import { View, Text } from '@tarojs/components';
import CustomNavBar from '@/components/CustomNavBar';
import Taro from '@tarojs/taro';

interface IProps {}

const ReportListUndo: FC<IProps> = () => {
  const info = Taro.getStorageSync('menuButtonInfo');
  return (
    <View>
      <CustomNavBar
        color='#193059'
        gradient={false}
        title={<Text className='text-base font-semibold'>未完成报告</Text>}
        backUrl='/pages/index/index'
      />
      <View
        className='bg-base-bg'
        style={{ paddingTop: `${info.bottom + 30}px` }}>
        <ListUnit type={'uncompleted'}></ListUnit>
      </View>
    </View>
  );
};

export default ReportListUndo;
