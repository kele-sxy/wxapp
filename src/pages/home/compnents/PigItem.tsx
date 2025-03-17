import { View } from '@tarojs/components';
import { FC } from 'react';
import { AtButton } from 'taro-ui';
import 'taro-ui/dist/style/components/button.scss'; // 引入 Taro UI 的按钮样式
import {
  personal_risk,
  pre_education,
  marriage,
  lease,
  security,
  homemaking,
} from '@/assets/base64';
import './index.less';
import Taro from '@tarojs/taro';

interface IProps {
  title: string;
  subTitle: string;
  icon?: any;
  mainKey: string;
}

const PigItem: FC<IProps> = (props) => {
  const { title, subTitle, mainKey } = props;

  const curMap = {
    personal_risk,
    pre_education,
    marriage,
    lease,
    security,
    homemaking,
  };

  // const rest =
  //   mainKey === 'security'
  //     ? { flex: 1 }
  //     : {
  //         marginBottom: 12,
  //       };

  return (
    <View
      onClick={() => {
        Taro.navigateTo({
          url: `/subpackages/report/pages/report-version/index?type=${mainKey}`,
        });
      }}
      style={{
        backgroundImage: `url(${curMap[mainKey]})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        marginBottom: 12,
      }}
      className={`pl-[32px] pt-[24px] hover:scale-110 transition-transform duration-300`}>
      <View className='text-[36px] pb-[4px]'>{title}</View>
      <View className='text-[24px] pb-[4px] text-[#475166]'>{subTitle}</View>
      <View className='justBtn pb-[24px]'>
        <AtButton
          size={'small'}
          className={`${mainKey}-background`}
          circle={true}>
          <View style={{ color: '#fff', fontSize: 12 }}>
            进入
            <View className='arrow'></View>
          </View>
        </AtButton>
      </View>
    </View>
  );
};

export default PigItem;
