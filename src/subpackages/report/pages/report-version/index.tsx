import { View, Text } from '@tarojs/components';
import { useDidShow, useLoad, useRouter } from '@tarojs/taro';
import { AtIcon } from 'taro-ui';
import { useState } from 'react';
import TopViewBg from '@/components/TopViewBg';
import ListItem from '@/components/ListItem';
import { REPORT_ENUM, type REPORT_ITEM_ENUM } from '@/constant';
import Taro from '@tarojs/taro';
import { formatBigNumber } from '@/utils';
import './index.less';
import { getReportCount, getReportInfoList } from '@/services/report';
import imageBg from '../../images/report-bg';
import CustomNavBar from '@/components/CustomNavBar';
import { checkLoginStatus } from '@/utils';

// const imageBg = require('@/assets/images/report-bg.png');

export default function Index() {
  const [viewCount, setViewCount] = useState<number>(0);
  const [reportTypes, setReportTypes] = useState<REPORT_ITEM_ENUM[]>([]);

  const router = useRouter();
  const params = router?.params;
  const type = params?.type ?? 'homemaking';

  useLoad(() => {
    console.log('Page loaded.');
  });

  const topList = [
    '专业资质',
    '权威数据',
    '安全隐私',
    '客观实时',
    '覆盖面广',
    '多维数据',
  ];

  useDidShow(() => {
    getReportCount(type).then((res) => {
      setViewCount(res.data.purchaseNum ?? 0);
    });
    getReportInfoList(type).then((res) => {
      setReportTypes(res.data);
    });
  });

  return (
    <View>
      <TopViewBg imageBg={imageBg}>
        <CustomNavBar
          title={<Text className='text-base font-semibold'>报告查询</Text>}
          titleIcon='report'
        />
        <View className='flex items-center flex-1 text-center text-xs my-2'>
          <View className='px-9 at-row at-row--wrap at-row__justify--between'>
            {topList.map((label) => {
              return (
                <View
                  key={label}
                  className='flex items-center justify-center at-col-4 mb-4'>
                  <AtIcon size='18rpx' value='check-circle' className='mr-1' />
                  <Text>{label}</Text>
                </View>
              );
            })}
          </View>
        </View>
        <View className='flex items-center py-3.5 mx-3 bg-white text-[#96A2B8] text-sm custom-tips'>
          <AtIcon
            prefixClass='icon'
            value='speaker'
            color='#4f7fff'
            className='ml-4 mr-2'
          />
          已有<Text className='count-num'>{formatBigNumber(viewCount)}</Text>
          人查询了{REPORT_ENUM[type]}报告
        </View>
      </TopViewBg>
      <View className='mt-3 mx-2'>
        {reportTypes?.map((item) => {
          return (
            <ListItem
              info={item}
              onClick={(params) => {
                //将对象 params 处理成 & 拼接的字符串
                // const requestStr = paramsToQueryString(params);
                Taro.setStorageSync('searchReportVersion', params);
                checkLoginStatus().then((res) => {
                  if (res)
                    Taro.navigateTo({
                      url: `/subpackages/report/pages/report-search/index`,
                    });
                  else Taro.navigateTo({ url: '/pages/login/index' });
                });
              }}
            />
          );
        })}
      </View>
    </View>
  );
}
