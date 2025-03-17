import { View, Text } from '@tarojs/components';
import { FC } from 'react';
import ListUnit from '../components/ListUnit';
import CustomNavBar from '@/components/CustomNavBar';

interface IProps {}

const ReportList: FC<IProps> = () => {
  return (
    <View className='bg-base-bg'>
      <CustomNavBar
        color='#193059'
        gradient={false}
        title={<Text className='text-base font-semibold'>已完成报告</Text>}
        backUrl='/pages/index/index'
      />
      <ListUnit type={'completed'}></ListUnit>
    </View>
  );
};

export default ReportList;
