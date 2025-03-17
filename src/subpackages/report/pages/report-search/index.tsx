import { View, Text, Image } from '@tarojs/components';
import TopViewBg from '@/components/TopViewBg';
import CustomNavBar from '@/components/CustomNavBar';
import { useEffect, useMemo, useState } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import InfoCard from '@/components/InfoCard';
import { hasEmptyProperty, isValidPhoneNumber } from '@/utils';
import FunctionItem from '@/components/FunctionItem';
import { AtButton, AtForm, AtIcon, AtInput } from 'taro-ui';
import CustomCheckbox from '@/components/CustomCheckBox';
import { sendSmsCode } from '@/services/login';
import imageBg from '@/subpackages/report/images/search-bg';
import { checkIdentity } from '@/services/report';
import voucherRed from '@/assets/svg/voucher-red.svg';
import PickVoucherModal from '../components/PickVoucherModal';
import { getVoucherList } from '@/services/voucher';
import { VOUCHER_STATUS_ENUM } from '@/constant';

interface SearchInfoProps {
  queryName?: string; //姓名
  queryIdcard?: string; // 身份证号
  queryMobile?: string; // 手机号
  verificationCode?: string; // 验证码
}

export default function Index() {
  const baseInfo = Taro.getStorageSync('searchReportVersion');
  console.log('🚀 ~ Index ~ baseInfo:', baseInfo);

  const [pickedVoucher, setPickedVoucher] = useState<any>({
    voucherRecordUserId: undefined,
    voucherAmount: 0,
  });

  const [isOpened, setIsOpened] = useState(false);

  const [searchInfo, setSearchInfo] = useState<SearchInfoProps>({
    queryName: '',
    queryIdcard: '',
    queryMobile: '',
    verificationCode: '',
  });

  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [checked, setChecked] = useState(false);

  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [couponList, setCouponList] = useState<any[]>([]);

  const btnDisabled = useMemo(() => {
    // 判断 searchInfo 是否有属性为空
    return hasEmptyProperty(searchInfo) || !checked;
  }, [searchInfo, checked]);

  // 验证码倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = () => {
    if (countdown > 0 || isSending) return;
    if (!isValidPhoneNumber(searchInfo.queryMobile)) {
      Taro.showToast({ title: '请输入正确的手机号码', icon: 'none' });
      return;
    }
    setIsSending(true);
    sendSmsCode({ phone: searchInfo.queryMobile, type: 'REPORT' })
      .then(() => {
        setCountdown(60);
        Taro.showToast({
          title: '验证码发送成功',
          icon: 'success',
        });
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const onSubmit = () => {
    const { queryName, queryIdcard, queryMobile, verificationCode } =
      searchInfo;
    if (!isValidPhoneNumber(queryMobile)) {
      Taro.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
      });
      return;
    }
    setSearching(true);
    // 查询身份一致性校验
    checkIdentity({
      queryName,
      queryIdcard,
      queryMobile,
      verificationCode,
    })
      .then(() => {
        Taro.setStorageSync('searchInfo', {
          ...searchInfo,
          reportType: baseInfo.type,
          reportLevel: baseInfo.level,
          payAmount: baseInfo.amount,
          voucherRecordUserId: pickedVoucher.voucherRecordUserId,
        });
        Taro.navigateTo({
          url: '/subpackages/report/pages/doc-signing/index',
        });
      })
      .finally(() => {
        setSearching(false);
      });
  };

  // 根据reportType reportLevel 查询可以使用的优惠券
  const getCouponList = () => {
    if (!baseInfo) return;
    setLoading(true);
    setCouponList([]);
    getVoucherList({
      status: VOUCHER_STATUS_ENUM.CLAIMED,
      productType: baseInfo.type,
      productLevel: baseInfo.level,
      isValid: true,
    })
      .then((res) => {
        setCouponList(res?.data ?? []);
        if (!res?.data?.length) {
          setPickedVoucher({
            voucherRecordUserId: undefined,
            voucherAmount: 0,
          });
          return;
        }
        // 如果列表里不包含当前选中的id 则清掉
        const ids = res?.data?.map((item: any) => item.voucherRecordUserId);
        if (
          ids?.length &&
          pickedVoucher?.voucherRecordUserId &&
          !ids?.includes(pickedVoucher.voucherRecordUserId)
        )
          setPickedVoucher({
            voucherRecordUserId: undefined,
            voucherAmount: 0,
          });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useDidShow(() => {
    const { voucherRecordUserId = '', voucherAmount = '' } = baseInfo;
    if (voucherRecordUserId)
      setPickedVoucher({ voucherRecordUserId, voucherAmount });
    else setPickedVoucher({ voucherRecordUserId: undefined, voucherAmount: 0 });
    getCouponList();
  });

  const getReportAmount = () => {
    if (!pickedVoucher.voucherRecordUserId) return baseInfo?.amount / 100;
    const { voucherAmount } = pickedVoucher;
    return voucherAmount > baseInfo?.amount
      ? 0
      : (baseInfo?.amount - voucherAmount) / 100;
  };

  return (
    <View>
      <TopViewBg imageBg={imageBg}>
        <CustomNavBar title={<Text className='font-semibold'>报告查询</Text>} />
      </TopViewBg>
      <View className='mx-3 pb-6 -mt-10'>
        <InfoCard title='基本信息'>
          <AtForm>
            <AtInput
              clear
              cursor={-1}
              name='queryName'
              title='姓名'
              type='text'
              placeholder='请输入被查询人真实姓名'
              placeholderClass='placeholder'
              value={searchInfo.queryName}
              onChange={(v: string) => {
                if (v === searchInfo.queryName) return;
                setSearchInfo((prev) => ({
                  ...prev,
                  queryName: v,
                }));
              }}
            />
            <AtInput
              clear
              cursor={-1}
              name='queryIdcard'
              title='身份证号'
              type='idcard'
              placeholder='请输入被查询人身份证号码'
              placeholderClass='placeholder'
              value={searchInfo.queryIdcard}
              onChange={(v: string) => {
                if (v === searchInfo.queryIdcard) return;
                setSearchInfo((prev) => ({
                  ...prev,
                  queryIdcard: v,
                }));
              }}
            />
            <AtInput
              clear
              cursor={-1}
              name='queryMobile'
              title='手机号'
              type='phone'
              placeholder='请输入被查询人手机号'
              placeholderClass='placeholder'
              value={searchInfo.queryMobile}
              onChange={(v: string) => {
                if (v === searchInfo.queryMobile) return;
                setSearchInfo((prev) => ({
                  ...prev,
                  queryMobile: v,
                }));
              }}
            />
            <AtInput
              clear
              cursor={-1}
              name='verificationCode'
              title='验证码'
              type='number'
              placeholder='请输入手机验证码'
              placeholderClass='placeholder'
              value={searchInfo.verificationCode}
              onChange={(v: string) => {
                if (v === searchInfo.verificationCode) return;
                setSearchInfo((prev) => ({
                  ...prev,
                  verificationCode: v,
                }));
              }}>
              <Text
                className='link-button'
                style={{ color: countdown === 0 ? '#4F7FFF' : '#D5D5D5' }}
                onClick={handleSendCode}>
                {countdown > 0 ? `${countdown}s后重新获取` : '获取验证码'}
              </Text>
            </AtInput>
            <View
              className='py-2 flex items-center justify-between'
              onClick={() => {
                setIsOpened(true);
              }}>
              <View className='flex items-center'>
                <Image className='w-5 h-5' src={voucherRed} />
                <Text className='text-xs text-[#0B1933] ml-2'>优惠券选择</Text>
              </View>
              <View
                className={`flex items-center ${!!couponList?.length && !pickedVoucher.voucherRecordUserId ? 'text-white bg-red-500 rounded-xl py-1' : ''}`}>
                {!couponList?.length && !loading && (
                  <Text className='text-gray-400 text-xs'>无可用优惠券</Text>
                )}
                {!!couponList?.length && !pickedVoucher.voucherRecordUserId && (
                  <Text className='text-xs pl-1.5'>{`未选优惠券，${couponList?.length}张可用`}</Text>
                )}
                {pickedVoucher.voucherRecordUserId && (
                  <Text className='text-red-500 text-xs'>
                    -¥{pickedVoucher.voucherAmount / 100}
                  </Text>
                )}
                <AtIcon size='16rpx' value='chevron-right' />
              </View>
            </View>
            <View className='flex pt-2.5'>
              <CustomCheckbox
                className='pr-[16rpx]'
                checked={checked}
                onChange={setChecked}
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
                <Text
                  className='text-[#4F7FFF]'
                  onClick={() => {
                    Taro.navigateTo({
                      url: '/subpackages/appdocs/authorize-doc/index',
                    });
                  }}>
                  《授权书》
                </Text>
                <View>
                  点击勾选即代表您同意上述法律文书的相关条款并签署上述法律文书
                </View>
              </View>
            </View>
            <AtButton
              type='primary'
              circle
              className='!mt-3 !h-10 flex-center'
              disabled={btnDisabled}
              loading={searching}
              onClick={() => onSubmit()}>
              立即查询 ¥ {getReportAmount()}
            </AtButton>
          </AtForm>
        </InfoCard>
        <InfoCard title='报告内容'>
          <FunctionItem list={baseInfo?.functionList ?? []} />
        </InfoCard>
      </View>
      <PickVoucherModal
        reportType={baseInfo.type}
        reportLevel={baseInfo.level}
        couponList={couponList}
        isOpened={isOpened}
        setIsOpened={setIsOpened}
        value={pickedVoucher}
        loading={loading}
        onChange={(data) => {
          setPickedVoucher(data);
          setIsOpened(false);
        }}
      />
    </View>
  );
}
