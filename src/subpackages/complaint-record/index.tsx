import CustomNavBar from '@/components/CustomNavBar';
import { View, Image } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import { FC, useState } from 'react';
import { AtActivityIndicator, AtIcon } from 'taro-ui';
import Icon from '@/assets/svg/complaint.svg';
import './index.less';
import Taro from '@tarojs/taro';
import { COMPLAINT_STATUS, COMPLAINT_STATUS_KEY } from '@/constant';
import { getComplaintList } from '@/services/service';
import ComplaintDetail from '../components/ComplaintDetail';

interface ComplaintRecordProps {}

const ComplaintRecord: FC<ComplaintRecordProps> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [historyList, setHistoryList] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [complaintId, setComplaintId] = useState<string>('');

  useDidShow(() => {
    setLoading(true);
    getComplaintList()
      .then((res) => {
        setHistoryList(res.data ?? []);
      })
      .finally(() => setLoading(false));
  });

  return (
    <View className='bg-base-bg p-4 min-h-full font-normal'>
      <CustomNavBar color='#0E1836' title='投诉中心' gradient={false} />
      <AtActivityIndicator isOpened={loading} mode='center' />
      {!loading && !!historyList.length && (
        <View className='bg-white rounded-lg px-3 mb-3'>
          {historyList.map((item, index) => {
            return (
              <View
                key={item.complaintId}
                className='custom-list-item py-3 flex justify-between items-center text-sm text-[#0E1836]'
                onClick={() => {
                  if (item.complaintChatId) {
                    Taro.navigateTo({
                      url: `subpackages/staff-service/index?chatId=${item.complaintChatId}&code=${item.complaintId}`,
                    });
                  } else {
                    setComplaintId(item.complaintId);
                    setOpen(true);
                  }
                }}>
                <View className='flex-1 overflow-ellipsis overflow-hidden whitespace-nowrap'>
                  {index + 1}. {item.complaintProblem}
                </View>
                <View
                  className={`text-white text-xs rounded px-3 py-1 ${item.status === COMPLAINT_STATUS_KEY.ARCHIVED ? 'bg-[#B2B2B2]' : 'bg-[#4F7FFF]'}`}>
                  {COMPLAINT_STATUS[item.status] ?? '未知'}
                </View>
                <AtIcon
                  className='ml-2.5'
                  color='#193059'
                  size={18}
                  value='chevron-right'
                />
              </View>
            );
          })}
        </View>
      )}
      {!loading && (
        <View
          className='bg-white rounded-lg flex items-center justify-center py-3 text-base text-[#193059] mb-2'
          onClick={() => {
            Taro.navigateTo({ url: '/subpackages/complaint-center/index' });
          }}>
          <Image className='w-4 h-4 mr-1' src={Icon} />
          <View>发起投诉</View>
        </View>
      )}
      <ComplaintDetail
        complaintId={complaintId}
        open={open}
        setOpen={setOpen}
      />
    </View>
  );
};

export default ComplaintRecord;
