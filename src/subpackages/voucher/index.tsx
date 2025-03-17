import { View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { FC, useState } from 'react';
import {
  AtActivityIndicator,
  AtIcon,
  AtModal,
  AtModalContent,
  AtModalHeader,
  AtTabs,
  AtTabsPane,
} from 'taro-ui';
import './index.less';
import VoucherCard from '../components/VoucherCard';
import { getVoucherList, getVoucherReportList } from '@/services/voucher';
import { REPORT_ENUM, REPORT_TYPE_ENUM, VOUCHER_STATUS_ENUM } from '@/constant';
import { paramsToQueryString } from '@/utils';
import EmptyStatus from '@/components/Empty';

const Coupon: FC<any> = () => {
  // const userInfo = Taro.getStorageSync('userInfo');
  const [current, setCurrent] = useState(0);

  const [loading, setLoading] = useState(false);

  const [showFloat, setShowFloat] = useState(false);

  const [couponList, setCouponList] = useState<any[]>([]);

  const [reportList, setReportList] = useState<any[]>([]);

  const [currentVoucher, setCurrentVoucher] = useState<any>(null);

  const goToReportSearch = (report: any, voucher?: any) => {
    const { voucherRecordUserId, amount: voucherAmount } =
      voucher ?? currentVoucher;
    const info = JSON.stringify({
      ...report,
      voucherRecordUserId,
      voucherAmount: Number(voucherAmount),
    });
    const requestStr = paramsToQueryString({ info });
    Taro.navigateTo({
      url: `/subpackages/report/pages/report-search/index?${requestStr}`,
    });
  };

  const openFloat = (voucher: any) => {
    setCurrentVoucher(voucher);
    const { voucherRecordUserId } = voucher;
    getVoucherReportList(voucherRecordUserId).then((res) => {
      if (res?.data?.length === 1) {
        const [report] = res.data;
        goToReportSearch(report, voucher);
        return;
      }
      setReportList(res?.data ?? []);
      setShowFloat(true);
    });
  };

  const status_map = {
    0: VOUCHER_STATUS_ENUM.CLAIMED,
    1: VOUCHER_STATUS_ENUM.USED,
  };

  const getCouponList = (type: number) => {
    setLoading(true);
    setCouponList([]);
    getVoucherList({ status: status_map[type] })
      .then((res) => {
        setCouponList(res?.data ?? []);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useDidShow(() => {
    setShowFloat(false);
    getCouponList(current);
  });

  return (
    <View className='bg-base-bg min-h-[100vh] overflow-hidden'>
      <AtTabs
        tabList={[{ title: '待使用' }, { title: '已使用' }]}
        current={current}
        onClick={(v) => {
          getCouponList(v);
          setCurrent(v);
        }}>
        <AtTabsPane current={current} index={0}>
          {couponList?.map((item) => (
            <VoucherCard openFloat={() => openFloat(item)} voucher={item} />
          ))}
        </AtTabsPane>
        <AtTabsPane current={current} index={1}>
          {couponList?.map((item) => (
            <VoucherCard
              used
              openFloat={() => openFloat(item)}
              voucher={item}
            />
          ))}
        </AtTabsPane>
      </AtTabs>
      <AtActivityIndicator isOpened={loading} mode='center' />
      <AtModal
        isOpened={showFloat}
        onClose={() => setShowFloat(false)}
        className='float-layout'>
        <AtModalHeader>
          <AtIcon
            onClick={() => setShowFloat(false)}
            value='close'
            size='20'
            color='#ccc'
          />
        </AtModalHeader>
        <AtModalContent>
          <View className='px-10 pb-10'>
            <View className='text-base mb-4 font-semibold text-[#193059] text-center'>
              请选择报告类型
            </View>
            {reportList?.map((report) => {
              return (
                <View
                  className='text-base rounded-2xl mb-4 py-2 bg-gradient-to-r from-[#00B6FF] to-[#118DFF] text-white text-center'
                  onClick={() => {
                    goToReportSearch(report);
                  }}>
                  {`${REPORT_ENUM[report.type]}报告${REPORT_TYPE_ENUM[report.level]}`}
                </View>
              );
            })}
          </View>
        </AtModalContent>
      </AtModal>
      {!couponList?.length && !loading && (
        <EmptyStatus
          title={current === 1 ? '暂无已使用优惠券' : '暂无可用优惠券'}
        />
      )}
      {!loading && !current && (
        <View
          className='bg-base-bg pb-8 flex items-center justify-center text-[#A8A8A8] text-xs w-full pl-1'
          onClick={() => {
            Taro.navigateTo({
              url: '/subpackages/invalid-voucher/index',
            });
          }}>
          查看无效优惠券 <AtIcon size={'14px'} value='chevron-right' />
        </View>
      )}
    </View>
  );
};

export default Coupon;
