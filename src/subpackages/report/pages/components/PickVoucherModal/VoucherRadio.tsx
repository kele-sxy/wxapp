import { View, Text } from '@tarojs/components';
import { FC } from 'react';
import { REPORT_ENUM, REPORT_TYPE_ENUM } from '@/constant';
import { formatTime } from '@/subpackages/components/VoucherCard/utils';
import './index.less';
import { AtIcon } from 'taro-ui';

interface VoucherCardProps {
  checked: boolean;
  voucher: any;
  onCheck: (data: any) => void;
  reportType: string;
  reportLevel: string;
}

const VoucherRadio: FC<VoucherCardProps> = (props) => {
  const { voucher, reportType, reportLevel, checked, onCheck } = props;
  const { amount: voucherAmount, name, endTime, voucherRecordUserId } = voucher;

  return (
    <View className='bg-[#EDF6FF] rounded-xl mb-5 voucher-radio overflow-hidden relative'>
      <View className='flex items-center min-h-[156rpx] max-h-[156rpx] px-5'>
        <View className='flex items-baseline text-[#118DFF] text-xl font-medium min-w-[28%]'>
          ¥
          <Text
            className={`${`${voucherAmount / 100}`?.length > 4 ? 'text-2xl' : 'text-3xl'} font-semibold ml-1`}>
            {voucherAmount / 100}
          </Text>
        </View>
        <View className='px-3 max-w-[70%]'>
          <View className='text-[#193059] text-base font-medium pb-2 truncate'>
            {name}
          </View>
          <View className='text-[#00427E] text-xs truncate'>
            {`有效期至${formatTime(endTime)}`}
          </View>
        </View>
        <View
          onClick={() => {
            if (checked)
              onCheck({ voucherRecordUserId: undefined, voucherAmount: 0 });
            else onCheck({ voucherRecordUserId, voucherAmount });
          }}
          className={`circle ${checked && 'checked'} absolute top-4 right-4 flex items-center justify-center`}>
          {checked && <AtIcon color='#fff' size='13rpx' value='check' />}
        </View>
      </View>
      <View className='px-5 py-2.5 text-[#00427E] text-xs bg-[#D3EBFF] border-0 border-t-2 border-dashed border-[#4F7FFF]'>
        购买{REPORT_ENUM[reportType]}报告{REPORT_TYPE_ENUM[reportLevel]}
      </View>
    </View>
  );
};

export default VoucherRadio;
