import { View, Text, RichText } from '@tarojs/components';
import TopViewBg from '@/components/TopViewBg';
import CustomNavBar from '@/components/CustomNavBar';
import InfoCard from '@/components/InfoCard';
import { useState } from 'react';
import { parseRichText } from '@/utils';
import imageBg from '@/assets/report-bg-sm';
import { useDidShow } from '@tarojs/taro';
import { getViewProtocol } from '@/services/report';
// const imageBg = require('@/assets/images/report-bg-sm.png');

export default function Index() {
  const [richTextString, setRichTextString] = useState('');

  const richTextNodes: any = parseRichText(richTextString);

  useDidShow(() => {
    getViewProtocol({ type: 'AUTHORIZATION_LETTER' }).then((res) => {
      if (res.data) {
        setRichTextString(res.data.content);
      }
    });
  });

  return (
    <View>
      <TopViewBg imageBg={imageBg} height='280rpx'>
        <CustomNavBar title={<Text className='font-semibold'>授权书</Text>} />
        <View className='mx-3 text-black' id='protocol'>
          <InfoCard title={false}>
            <RichText nodes={richTextNodes} />
          </InfoCard>
        </View>
      </TopViewBg>
    </View>
  );
}
