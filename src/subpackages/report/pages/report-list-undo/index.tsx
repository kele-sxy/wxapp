import { FC } from 'react';
import ListUnit from '../components/ListUnit';
import { View, Text } from '@tarojs/components';
import CustomNavBar from '@/components/CustomNavBar';

interface IProps {}

const ReportListUndo: FC<IProps> = () => {
  return (
    <View className='bg-base-bg'>
      <CustomNavBar
        color='#193059'
        gradient={false}
        title={<Text className='text-base font-semibold'>未完成报告</Text>}
        backUrl='/pages/index/index'
      />
      <ListUnit type={'uncompleted'}></ListUnit>
    </View>
  );
};

export default ReportListUndo;
