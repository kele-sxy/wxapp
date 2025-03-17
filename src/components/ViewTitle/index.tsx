import { View } from "@tarojs/components";
import { FC } from "react";

interface IProps {
  title: any;
};

const ViewTitle: FC<IProps> = (props) => {
  const { title } = props;
  return <View className='text-white text-[40px] mb-[24px] mx-3 font-semibold'>
    {title}
  </View>
};

export default ViewTitle;