import { View } from '@tarojs/components';
import { useState } from 'react';
import ReportItem from '../ReportItem';
import historyIcon from '@/assets/svg/his.svg';
import undoIcon from '@/assets/svg/undo.svg';
import { reportStatistics } from './service';
import { checkLoginStatus, formatBigNumber } from '@/utils';
import { useDidShow } from '@tarojs/taro';

function ReportList() {
  const [list, setList] = useState<any[]>([
    {
      title: '未完成报告',
      icon: undoIcon,
      num: '*',
      target: '/subpackages/report/pages/report-list-undo/index',
    },
    {
      title: '历史报告',
      icon: historyIcon,
      num: '*',
      target: '/subpackages/report/pages/report-list/index',
    },
  ]);

  const [effective, setEffective] = useState(false);

  const curReportStatistics = async () => {
    const { code, data } = await reportStatistics({});
    if (code === 200) {
      const { uncompleted, completed } = data || {};
      setList([
        {
          title: '未完成报告',
          icon: undoIcon,
          num: formatBigNumber(uncompleted),
          target: '/subpackages/report/pages/report-list-undo/index',
        },
        {
          title: '历史报告',
          icon: historyIcon,
          num: formatBigNumber(completed),
          target: '/subpackages/report/pages/report-list/index',
        },
      ]);
    }
  };

  useDidShow(() => {
    checkLoginStatus().then((res) => {
      if (res) {
        setEffective(true);
        curReportStatistics();
      } else setEffective(false);
    });
  });

  return (
    <View className='flex justify-between'>
      {(list || []).map((item: any, index: number) => {
        return <ReportItem item={item} effective={effective} index={index} />;
      })}
    </View>
  );
}

export default ReportList;
