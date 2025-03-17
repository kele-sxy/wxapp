import { View } from '@tarojs/components';
import { FC } from 'react';
import ListItem from '../ListItem';

interface IProps {
  list: any[];
}

const ListUnit: FC<IProps> = (props) => {
  const { list } = props;
  return (
    <View className='bg-[#fff] rounded-2xl py-2 mb-3'>
      {(list || []).map((item: any) => {
        return <ListItem item={item} />;
      })}
    </View>
  );
};

export default ListUnit;
