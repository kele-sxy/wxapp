import { FC } from 'react';
import { AtActivityIndicator, AtFloatLayout } from 'taro-ui';
import { View } from '@tarojs/components';
import VoucherRadio from './VoucherRadio';
import './index.less';
import EmptyStatus from '@/components/Empty';

type pickedVoucherType = {
  voucherRecordUserId?: string;
  voucherAmount: number;
};

interface PickVoucherModalProps {
  value: pickedVoucherType; // 代金券voucherRecordUserId
  onChange: (params: pickedVoucherType) => void;
  isOpened: boolean;
  setIsOpened: (v: boolean) => void;
  couponList: any[];
  reportType: string;
  reportLevel: string;
  loading?: boolean;
}
const PickVoucherModal: FC<PickVoucherModalProps> = (props) => {
  const {
    value,
    onChange,
    isOpened,
    setIsOpened,
    reportType,
    reportLevel,
    couponList,
    loading = false,
  } = props;

  return (
    <AtFloatLayout
      className='pick-voucher'
      title='优惠券'
      isOpened={isOpened}
      onClose={() => setIsOpened(false)}>
      <AtActivityIndicator isOpened={loading} mode='center' />
      <View className='overflow-y-scroll minx-h-[700rpx] px-2'>
        {couponList?.map((item) => {
          return (
            <VoucherRadio
              checked={value?.voucherRecordUserId === item.voucherRecordUserId}
              reportType={reportType}
              reportLevel={reportLevel}
              voucher={item}
              onCheck={({
                voucherRecordUserId,
                voucherAmount,
              }: pickedVoucherType) => {
                onChange({
                  voucherRecordUserId,
                  voucherAmount,
                });
              }}
            />
          );
        })}
        {!couponList.length && !loading && (
          <EmptyStatus title='暂无可使用优惠券' />
        )}
      </View>
    </AtFloatLayout>
  );
};
export default PickVoucherModal;
