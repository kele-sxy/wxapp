import { View } from "@tarojs/components";
import { FC } from "react";
import { AtAvatar, AtIcon } from "taro-ui";
import Tag from '@/components/Tag'
import { avatar } from '@/assets/base64'

interface IProps {
  info: any
};

const Header: FC<IProps> = ({ info }: any) => {
  // const isLogin = true;

  return <View className="flex items-center my-[48px]">
    <AtAvatar circle={true} className="mx-[48px]" image={info?.avatar || avatar}></AtAvatar>
    <View>
      <View className="flex justify-center items-center">
        <AtIcon color="#6F7276" size='16rpx' prefixClass='icon' value='phone' />
        <View className="text-base-black text-[32rpx] font-semibold ml-[8rpx]">{info?.phone}</View>
      </View>
      {info?.verifiedStatus === 'VERIFIED' ? <Tag title={'已实名'} status={'success'} /> : <Tag title={'未实名'} status={'undo'} />}
    </View>
  </View>
};

export default Header;