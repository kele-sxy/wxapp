import { View, Text } from '@tarojs/components';
import { REPORT_ITEM_ENUM } from '@/constant';
import './index.less';

// const BG_IMG_MAP = {
//   BASE_INFO: require('../../assets/svg/BASE_INFO.svg'),
//   RESTRICT_HIGH_CONSUMER_RECORD: require('../../assets/svg/RESTRICT_HIGH_CONSUMER_RECORD.svg'),
//   BAD_RECORD: require('../../assets/svg/BAD_RECORD.svg'),
//   CREDIT_RECORD: require('../../assets/svg/CREDIT_RECORD.svg'),
//   DISHONESTY_RECORD: require('../../assets/svg/DISHONESTY_RECORD.svg'),
//   EXECUTION_RECORD: require('../../assets/svg/EXECUTION_RECORD.svg'),
//   DEFAULT: require('../../assets/svg/BASE_INFO.svg'),
// };

export default function FunctionItem(props: {
  list: REPORT_ITEM_ENUM['functionList'];
}) {
  const { list = [] } = props;
  return (
    <View className='function-box flex flex-wrap'>
      {list.map((item) => (
        <View className='function-item' key={item.key}>
          <Text>{item.value}</Text>
          {/* <Image src={BG_IMG_MAP[item.key] ?? BG_IMG_MAP.DEFAULT} /> */}
        </View>
      ))}
    </View>
  );
}
