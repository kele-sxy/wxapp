import { View, Text, Image } from '@tarojs/components';
import { FC, useState } from 'react';
import { used as usedUrl, invalid as invalidUrl } from './images';
import { VOUCHER_TYPE_MENU } from '@/constant';
import './index.less';
import { AtIcon } from 'taro-ui';
import { getMyVoucher } from '@/services/voucher';
import Taro from '@tarojs/taro';
import { formatTime, getAllUsage, handleVoucherUsage } from './utils';

interface VoucherCardProps {
  voucher: any;
  invalid?: boolean; //是否失效
  used?: boolean; // 是否已使用
  unclaimed?: boolean; // 待领取
  openFloat?: () => void;
}

const VoucherCard: FC<VoucherCardProps> = (props) => {
  const {
    voucher,
    openFloat = () => {},
    invalid = false,
    used = false,
    unclaimed = false,
  } = props;
  const {
    amount,
    name,
    endTime,
    startTime,
    writeOffTime,
    voucherRecordUserId,
    type,
    isValid, // 代金券是否可用
  } = voucher;

  const [fold, setFold] = useState<boolean>(true);

  const disabled = used || invalid;
  return (
    <View
      className={`bg-white rounded-xl mx-3 mb-5 voucherCard ${disabled ? 'disabled' : ''}`}>
      <View className='at-row overflow-hidden'>
        <View
          className={`at-col max-w-[28%] ${disabled ? 'bg-[#C4C4C4]' : 'bg-[#118DFF]'} flex flex-col items-center text-white`}>
          <View
            className={`flex pl-2 items-baseline justify-center w-full text-base font-medium min-h-[186rpx] pt-[96rpx]`}>
            ¥
            <Text
              className={`${`${amount / 100}`?.length > 4 ? 'text-2xl' : 'text-3xl'} font-semibold ml-1`}>
              {amount / 100}
            </Text>
          </View>
        </View>
        <View className='at-col flex flex-col overflow-hidden'>
          <View className='at-row items-center flex-1 relative min-h-[186rpx]'>
            <View
              className={`at-col flex-none ${unclaimed ? 'w-[63%]' : 'w-[70%]'} px-2 ${disabled ? 'text-[#B7B7B7]' : 'text-[#193059]'}`}>
              <View className='text-base font-medium pb-2 truncate'>
                {name}
              </View>
              <View className='text-xs truncate'>
                {/* 正常有效期的优惠券 */}
                {!disabled && isValid && `${formatTime(endTime)}后失效`}
                {/* 已使用的优惠券 */}
                {used && `${formatTime(writeOffTime)}使用`}
                {/* 已失效的优惠券 */}
                {invalid && `有效期至${formatTime(endTime)}`}
                {/* 未来的优惠券 */}
                {!disabled && !isValid && `${formatTime(startTime)}起生效`}
                {/* {unclaimed && `${formatTime(startTime)}-${formatTime(endTime)}`} */}
              </View>
            </View>
            {disabled && (
              <Image
                className='absolute right-0 top-0'
                src={used ? usedUrl : invalidUrl}
              />
            )}
            {!disabled && !unclaimed && (
              <View
                className={`at-col mr-4 rounded-2xl ${isValid ? 'bg-[#118DFF]' : 'bg-[#C4C4C4]'} text-white px-4 py-[12rpx] text-xs text-center`}
                onClick={() => {
                  if (!isValid) return;
                  openFloat();
                }}>
                去使用
              </View>
            )}
            {unclaimed && (
              <>
                <View className='absolute text-[#0062D8] text-xs top-0 right-0 w-16 py-1 bg-[#118dff24] text-center rounded-bl-[30rpx]'>
                  {VOUCHER_TYPE_MENU[type]}
                </View>
                <View
                  className='at-col mr-4 rounded-2xl bg-[#118DFF] text-white px-4 py-[12rpx] text-xs text-center'
                  onClick={() => {
                    getMyVoucher(voucherRecordUserId).then(() => {
                      Taro.navigateTo({
                        url: '/subpackages/voucher/index',
                      }).then(() => {
                        Taro.showToast({ title: '领取成功', icon: 'success' });
                      });
                    });
                  }}>
                  立即领取
                </View>
              </>
            )}
          </View>
          <View className='detail text-xs pl-3 mr-2'>
            <View
              className='flex items-center py-2'
              onClick={() => {
                if (!used) setFold(!fold);
              }}>
              {handleVoucherUsage(voucher, used)}
              {!used && (
                <AtIcon
                  size={'14px'}
                  color={invalid ? '#B7B7B7' : '#414141'}
                  value={fold ? 'chevron-right' : 'chevron-down'}
                />
              )}
            </View>
            {!fold && (
              <View>
                {getAllUsage(voucher)}
                <View className='pb-2 text-[20rpx] text-[#B7B7B7]'>
                  有效期: {`${formatTime(startTime)}-${formatTime(endTime)}`}
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default VoucherCard;
