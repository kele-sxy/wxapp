import { View, Image, Text } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import {
  REPORT_ENUM,
  REPORT_TYPE_ENUM,
  RP_TYPE_CODE_MENU,
  type REPORT_ITEM_ENUM,
} from '@/constant';
import './index.less';

import COMMON from '@/subpackages/report/images/common';
import ADV from '@/subpackages/report/images/advanced';
// const COMMON = require('@/subpackages/report/images/common.png');
// const ADV = require('@/subpackages/report/images/advanced.png');
interface ListItemProps {
  info: REPORT_ITEM_ENUM;
  onClick?: (params: { [key: string]: string | number }) => void;
}

export default function Index(props: ListItemProps) {
  const { info, onClick = () => {} } = props;
  const isADV = info.level === RP_TYPE_CODE_MENU.ADV;
  const textColor = isADV ? '#2B7DFF' : '#684FFF';
  return (
    <View className='report-list-item text-white relative'>
      <Image src={isADV ? ADV : COMMON} className='size-full absolute' />
      <View className='inherit size-full px-7 pt-7 pb-6'>
        <View className='flex items-center justify-between'>
          <View className='grow font-semibold'>
            <Text className='text-xl mr-2'>{REPORT_ENUM[info.type]}</Text>
            <Text className='text-base'>{`(${REPORT_TYPE_ENUM[info.level]})`}</Text>
          </View>
          <AtButton
            circle
            className='h-8 leading-none bg-white border-0 flex items-center'
            onClick={() =>
              onClick({
                info: JSON.stringify(info),
              })
            }>
            <Text
              className='text-base font-medium'
              style={{ color: textColor }}>
              立即查询
            </Text>
          </AtButton>
        </View>
        <View className='at-row at-row--wrap mt-4'>
          {info.functionList?.map((i) => {
            return (
              <Text key={i.key} className='function-list text-sm at-col-6 mb-2'>
                {i.value}
              </Text>
            );
          })}
        </View>
      </View>
    </View>
  );
}
