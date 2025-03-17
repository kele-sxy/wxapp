import { View, Text } from '@tarojs/components';
import { FC, useRef } from 'react';
import ListUnit from '../components/ListUnit';
import CustomNavBar from '@/components/CustomNavBar';
import Taro, { useShareAppMessage } from '@tarojs/taro';

interface IProps {}

const ReportList: FC<IProps> = () => {
  const info = Taro.getStorageSync('menuButtonInfo');
  const listUnitRef = useRef<any>(null);

  useShareAppMessage(() => {
    const { reportId, reportType } = listUnitRef.current.getReportInfo();

    return {
      title: '信誉护航，让信任看得见',
      imageUrl: `${process.env.TARO_APP_API_URL}/share.png`,
      path: `/subpackages/report-detail/pages/common/index?type=${reportType}&reportId=${reportId}`,
      promise: listUnitRef.current.handleShareReport,
    };
  });

  return (
    <View>
      <CustomNavBar
        color='#193059'
        gradient={false}
        title={<Text className='text-base font-semibold'>已完成报告</Text>}
        backUrl='/pages/index/index'
      />
      <View
        className='bg-base-bg'
        style={{ paddingTop: `${info.bottom + 30}px` }}>
        <ListUnit type={'completed'} forwardRef={listUnitRef}></ListUnit>
      </View>
    </View>
  );
};

export default ReportList;
