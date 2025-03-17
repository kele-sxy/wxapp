import CustomNavBar from '@/components/CustomNavBar';
import { getBannerDetail } from '@/services/home';
import { parseRichText } from '@/utils';
import { View, RichText } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { useState } from 'react';
import { AtCurtain } from 'taro-ui';
import './index.less';

export default function BannerNotice() {
  const router = useRouter();
  const { carouselId } = router?.params;

  const [bannerDetail, setBannerDetail] = useState<any>({});

  const [loading, setLoading] = useState<boolean>(false);

  useDidShow(() => {
    if (!carouselId) return;
    Taro.showLoading();
    setLoading(true);
    getBannerDetail(carouselId)
      .then((res) => {
        setBannerDetail(res.data);
      })
      .finally(() => {
        Taro.hideLoading();
        setLoading(false);
      });
  });

  return (
    <View className='notice-detail'>
      <AtCurtain isOpened={loading} onClose={() => {}} />
      <CustomNavBar
        gradient={false}
        color='#193059'
        border
        title={bannerDetail.title}
      />
      <View className='at-article'>
        {bannerDetail.memo && (
          <View className='at-article__h2 mt-0'>{bannerDetail.memo}</View>
        )}
        <View className='at-article__content'>
          <View className='at-article__section'>
            <View className='at-article__p'>
              {bannerDetail.richTextDesc && (
                <RichText
                  nodes={parseRichText(bannerDetail.richTextDesc) as any}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
