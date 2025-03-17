import { View } from '@tarojs/components';
import { FC, useState } from 'react';
import { getNoticeList } from '@/services/home';
import ListUnit from '../components/ListUnit';
import { useDidShow } from '@tarojs/taro';
import EmptyStatus from '@/components/Empty';
import empty from '@/assets/empty-list';
import CustomNavBar from '@/components/CustomNavBar';

interface AnnouncementProps {}

const Announcement: FC<AnnouncementProps> = () => {
  const [list, setList] = useState<{ title: string; noticeId: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // const list = [
  //   {
  //     title: '用户操作规范',
  //     target:
  //       '/subpackages/announcement/notice-content/index?type=USER_OPERATION_SPECIFICATION',
  //   },
  //   {
  //     title: '平台说明',
  //     target:
  //       '/subpackages/announcement/notice-content/index?type=PLATFORM_DESCRIPTION',
  //   },
  //   {
  //     title: '其他公告',
  //     target:
  //       '/subpackages/announcement/notice-content/index?type=OTHER_NOTICE',
  //   },
  // ];

  useDidShow(() => {
    setLoading(true);
    getNoticeList()
      .then((res) => {
        setList(
          res.data?.map((item) => ({
            ...item,
            target: `/subpackages/announcement/notice-content/index?noticeId=${item.noticeId}&title=${item.title}`,
          })),
        );
      })
      .finally(() => setLoading(false));
  });

  return (
    <View className='bg-base-bg px-[32px] h-[100vh]'>
      <CustomNavBar color='#0E1836' title='公告' gradient={false} />
      {!list.length && !loading && (
        <EmptyStatus title='暂无公告' icon={empty} />
      )}
      {!!list.length && <ListUnit list={list} />}
    </View>
  );
};

export default Announcement;
