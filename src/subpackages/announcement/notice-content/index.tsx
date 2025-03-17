import CustomNavBar from '@/components/CustomNavBar';
import { getNoticeDetail } from '@/services/home';
import { parseRichText } from '@/utils';
import { View, RichText } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { useState } from 'react';

export default function BannerNotice() {
  // 获取胶囊按钮位置信息 info.left 为按钮左边界坐标
  const info = Taro.getStorageSync('menuButtonInfo');

  const router = useRouter();
  const { noticeId, title } = router?.params;

  const [noticeDetail, setNoticeDetail] = useState<any>({});

  useDidShow(() => {
    if (!noticeId) return;
    getNoticeDetail(noticeId).then((res) => {
      if (res.data) setNoticeDetail(res.data);
    });
  });

  return (
    <View>
      <CustomNavBar gradient={false} color='#193059' border title={title} />
      <View className='at-article' style={{ paddingTop: `${info.bottom}px` }}>
        <View className='at-article__h2'>{noticeDetail.title}</View>
        <View className='at-article__info mt-2'>
          {noticeDetail.author}
          &nbsp;&nbsp;&nbsp;
          {noticeDetail.updateTime}
          &nbsp;&nbsp;&nbsp;
          {noticeDetail.address}
        </View>
        <View className='at-article__content'>
          <View className='at-article__section'>
            <View className='at-article__p'>
              {noticeDetail.richTextDesc && (
                <RichText
                  nodes={parseRichText(noticeDetail.richTextDesc) as any}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
