import { View, Image } from '@tarojs/components';
import { FC, useState } from 'react';
import { useDidShow } from '@tarojs/taro';
import { getBannerList } from '@/services/home';
import { Swiper, SwiperItem } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { MINIO_PREFIX } from '@/constant';

interface IProps {}

const MainTitle: FC<IProps> = () => {
  const [bannerList, setBannerList] = useState<any[]>([]);

  useDidShow(() => {
    getBannerList().then((res) => {
      setBannerList(res.data ?? []);
    });
  });

  return (
    <View className='mx-3 h-40'>
      <Swiper
        indicatorColor='#999'
        indicatorActiveColor='#333'
        circular
        indicatorDots
        autoplay
        className='size-full'>
        {bannerList.map((item) => {
          return (
            <SwiperItem>
              <View
                className='size-full relative'
                onClick={() => {
                  Taro.navigateTo({
                    url: `/subpackages/banner-notice/index?carouselId=${item.carouselId}`,
                  });
                }}>
                <Image
                  className='size-full absolute top-0 left-0 -z-10'
                  src={`${process.env.TARO_APP_API_URL}${MINIO_PREFIX}${item?.background?.url}`}
                />
                {/* <View
                  className='px-4 py-2 text-white bg-gradient-to-r from-[#8ADAFF] to-[#03A7FF] rounded-[34rpx] absolute left-6 bottom-5 flex items-center'
                  // onClick={() => {
                  //   Taro.navigateTo({
                  //     url: `/subpackages/banner-notice/index?carouselId=${item.carouselId}`,
                  //   });
                  // }}
                >
                  <Text>立即查看</Text>
                  <AtIcon color='#fff' size={'14px'} value='chevron-right' />
                </View> */}
              </View>
            </SwiperItem>
          );
        })}
      </Swiper>
    </View>
  );
};

export default MainTitle;
