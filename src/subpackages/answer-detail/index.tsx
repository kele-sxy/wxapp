import CustomNavBar from '@/components/CustomNavBar';
import EmptyStatus from '@/components/Empty';
import { getFAQDetil } from '@/services/service';
import { parseRichText } from '@/utils';
import { View, RichText } from '@tarojs/components';
import { useDidShow, useRouter } from '@tarojs/taro';
import { useState } from 'react';
import { AtActivityIndicator } from 'taro-ui';
import empty from '@/assets/empty-list';

export default function BannerNotice() {
  const router = useRouter();
  const { questionId } = router?.params;

  const [questionDetail, setQuestionDetail] = useState<any>({});

  const [loading, setLoading] = useState<boolean>(false);

  useDidShow(() => {
    if (!questionId) return;
    setLoading(true);
    getFAQDetil(questionId)
      .then((res) => {
        if (res.data) setQuestionDetail(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  return (
    <View className='notice-detail bg-base-bg min-h-full lean-padding'>
      <CustomNavBar color='#0E1836' title='客服公告' gradient={false} />
      <AtActivityIndicator mode='center' isOpened={loading} />
      {!loading && !questionDetail.title && (
        <EmptyStatus title='内容已下架' icon={empty} />
      )}
      {!loading && questionDetail.title && (
        <View className='at-article'>
          <View className='at-article__h2 mt-0 pt-4'>
            {questionDetail.title}
          </View>
          <View className='at-article__content'>
            <View className='at-article__section'>
              <View className='at-article__p'>
                {questionDetail.content && (
                  <RichText
                    nodes={parseRichText(questionDetail.content) as any}
                  />
                )}
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
