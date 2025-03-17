import { View, Text } from '@tarojs/components';
import { useState, useImperativeHandle } from 'react';
import Taro from '@tarojs/taro';
import './index.less';
import CustomCheckbox from '@/components/CustomCheckBox';
import {
  AtButton,
  AtModal,
  AtModalAction,
  AtModalContent,
  AtModalHeader,
} from 'taro-ui';

export interface PolicyBoxRef {
  checkPolicy: () => void;
}

interface PolicyBoxProps {
  checked?: boolean;
  onChange: (checked: boolean) => void;
  forwardRef?: React.RefObject<PolicyBoxRef>;
}

const PolicyBox = ({
  checked = false,
  onChange,
  forwardRef,
}: PolicyBoxProps) => {
  const [isChecked, setIsChecked] = useState(checked);
  const [showModal, setShowModal] = useState(false);

  const handleCheck = (checked: boolean) => {
    setIsChecked(checked);
    onChange(checked);
  };

  const handleConfirm = () => {
    handleCheck(true);
    setShowModal(false);
  };

  // 提供给父组件调用的方法
  const checkPolicy = () => {
    if (isChecked) return;
    // 显示自定义弹窗
    setShowModal(true);
  };

  useImperativeHandle(forwardRef, () => ({
    checkPolicy,
  }));

  return (
    <>
      <View className='w-full flex'>
        <CustomCheckbox
          className='pr-[16rpx]'
          checked={isChecked}
          onChange={handleCheck}
        />
        <View className='text-xs text-[#6F7276]'>
          <Text>我已阅读并同意</Text>
          <Text
            className='text-[#4F7FFF]'
            onClick={() => {
              Taro.navigateTo({
                url: '/subpackages/appdocs/agreement-doc/index',
              });
            }}>
            《用户协议》
          </Text>
          <Text
            className='text-[#4F7FFF]'
            onClick={() => {
              Taro.navigateTo({
                url: '/subpackages/appdocs/privacy-doc/index',
              });
            }}>
            《隐私政策》
          </Text>
          <View>
            点击勾选即代表您同意上述法律文书的相关条款并签署上述法律文书
          </View>
        </View>
      </View>

      {/* 自定义Modal */}
      <AtModal isOpened={showModal} onClose={() => setShowModal(false)}>
        <AtModalHeader>提示</AtModalHeader>
        <AtModalContent>
          <View className='text-sm'>
            <Text>我已阅读并同意</Text>
            <Text
              className='text-[#4F7FFF]'
              onClick={() => {
                Taro.navigateTo({
                  url: '/subpackages/appdocs/agreement-doc/index',
                });
              }}>
              《用户协议》
            </Text>
            、
            <Text
              className='text-[#4F7FFF]'
              onClick={() => {
                Taro.navigateTo({
                  url: '/subpackages/appdocs/privacy-doc/index',
                });
              }}>
              《隐私政策》
            </Text>
          </View>
        </AtModalContent>
        <AtModalAction>
          <AtButton className='!h-9' onClick={() => setShowModal(false)}>
            <View className='text-sm flex items-center h-full'>取消</View>
          </AtButton>
          <AtButton className='!h-9' type='primary' onClick={handleConfirm}>
            <View className='text-sm flex items-center h-full'>同意</View>
          </AtButton>
        </AtModalAction>
      </AtModal>
    </>
  );
};

export default PolicyBox;
