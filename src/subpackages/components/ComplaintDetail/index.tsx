import { COMPLAINT_TYPE } from '@/constant';
import { View, Text, Image } from '@tarojs/components';
import { Popup } from '@chatui/core';
import { FC, useEffect, useState } from 'react';
import { AtActivityIndicator } from 'taro-ui';
import { getComplaintDetail } from '@/services/service';
import { jsonParse } from '@/utils';

const ComplaintDetail: FC<any> = (props) => {
  const { open, setOpen, complaintId } = props;

  const [detail, setDetail] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && complaintId) {
      setLoading(true);
      getComplaintDetail(complaintId)
        .then((res) => {
          const problemPicture = res.data?.problemPicture
            ? jsonParse(res.data?.problemPicture)
            : [];
          setDetail({ ...res.data, problemPicture });
          setOpen(true);
        })
        .finally(() => setLoading(false));
    }
  }, [open, complaintId]);

  return (
    <View>
      {/* @ts-ignore */}
      <Popup
        active={open}
        title='投诉详情'
        onClose={() => {
          setOpen(false);
        }}>
        <AtActivityIndicator isOpened={loading} />
        {!loading && (
          <View className='px-3 pb-5 text-sm font-normal'>
            <View className='mb-2'>
              <View className='text-gray-600 mb-1'>问题类型：</View>
              <Text className='font-medium'>
                {COMPLAINT_TYPE[detail.complaintType]}
              </Text>
            </View>
            <View className='mb-2'>
              <View className='text-gray-600 mb-1'>问题描述：</View>
              <Text
                className='font-medium break-keep whitespace-normal'
                style={{ wordWrap: 'break-word' }}>
                {detail.complaintProblem}
              </Text>
            </View>
            <View className='mb-2'>
              <View className='text-gray-600 mb-1'>问题截图材料：</View>
              {detail.problemPicture?.map((url) => (
                <View className='w-full'>
                  <Image src={url} className='mb-2' />
                </View>
              ))}
            </View>
          </View>
        )}
      </Popup>
    </View>
  );
};

export default ComplaintDetail;
