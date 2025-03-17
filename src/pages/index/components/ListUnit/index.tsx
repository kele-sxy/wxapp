import { View } from '@tarojs/components';
import { FC } from 'react';
import ListItem from '../ListItem';

interface IProps {
  list: any[];
}

const componentName: FC<IProps> = (props) => {
  const { list } = props;
  return (
    <View className='bg-[#fff] rounded-2xl py-3 my-4'>
      {(list || []).map((item: any) => {
        return <ListItem item={item} redDot={item.redDot} />;
      })}
    </View>
  );
};

export default componentName;
