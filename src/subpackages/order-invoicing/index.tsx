import EmptyStatus from '@/components/Empty';
import { myOrderList, type OrderPay } from '@/services/report';
import { View, Text } from '@tarojs/components';
import { useDidShow, useRouter } from '@tarojs/taro';
import { FC, useMemo, useState } from 'react';
import { AtActivityIndicator, AtIcon } from 'taro-ui';
import empty from '@/assets/empty-list';
import { REPORT_INVOICE_TYPE, REPORT_TITLE_ENUM } from '@/constant';
import Taro from '@tarojs/taro';

interface InvoicingProps {}

const Invoicing: FC<InvoicingProps> = () => {
  const router = useRouter();
  const params = router?.params;

  const safeArea = Taro.getWindowInfo().safeArea;

  const [orders, setOrders] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [checkedList, setCheckedList] = useState<OrderPay[]>([]);

  const checkAll = useMemo(() => {
    return !!orders.length && checkedList?.length === orders?.length;
  }, [checkedList, orders]);

  const getChecked = (reportId: string) => {
    const allId = checkedList?.map((item) => item.reportId) ?? [];
    return allId.includes(reportId);
  };

  useDidShow(() => {
    if (params?.reportId && !checkedList?.length)
      setCheckedList([
        {
          reportId: params?.reportId,
          payAmount: params?.payAmount ? Number(params?.payAmount) : 0,
        },
      ]);
    setLoading(true);
    myOrderList({
      pageNum: 1,
      pageSize: 9999,
      isRefunded: false,
      isInvoiced: REPORT_INVOICE_TYPE.EMPTY,
    })
      .then((res) => {
        setOrders(res?.data?.list ?? []);
      })
      .finally(() => setLoading(false));
  });

  return (
    <View className='bg-base-bg px-4 min-h-screen pt-2 pb-16 order-invoicing'>
      <AtActivityIndicator isOpened={loading} mode='center' />
      {orders.map(
        ({
          reportType,
          queryName,
          queryTime,
          queryMobile,
          reportId,
          payAmount = 0,
        }) => {
          const checked = getChecked(reportId);
          return (
            <View
              className='bg-white px-4 py-4 my-4 rounded-2xl relative'
              key={reportId}>
              <View className='text-base font-semibold'>
                {REPORT_TITLE_ENUM[reportType]}
              </View>
              <View className='flex items-center radio-check'>
                <View
                  onClick={() => {
                    if (checked) {
                      setCheckedList(
                        checkedList?.filter(
                          (item) => item.reportId !== reportId,
                        ),
                      );
                    } else
                      setCheckedList([...checkedList, { reportId, payAmount }]);
                  }}
                  className={`circle ${checked && 'checked'} flex items-center justify-center mr-2`}>
                  {checked && (
                    <AtIcon color='#fff' size='13rpx' value='check' />
                  )}
                </View>
                <View className='text-xs text-gray-600 flex-1'>
                  <View className='mt-3'>查询人：{queryName}</View>
                  <View className='mt-2'>查询时间：{queryTime}</View>
                  <View className='at-row mt-2 items-center'>
                    <View className='at-col at-col-6'>
                      手机号：{queryMobile}
                    </View>
                    <View className='at-col at-col-6 text-right'>
                      可开票金额：
                      <Text className='text-[#4F7FFF] text-sm'>
                        ¥ {payAmount / 100}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          );
        },
      )}
      <View
        className='fixed bottom-0 left-0 right-0 py-2 px-8 bg-white flex justify-between items-center'
        style={{ paddingBottom: `${safeArea?.top ?? 0}rpx` }}>
        {/* 全部选择 */}
        <View
          className='flex items-center radio-check'
          onClick={() => {
            const all = orders?.map((item: any) => ({
              reportId: item?.reportId,
              payAmount: item?.payAmount ?? 0,
            }));
            setCheckedList(checkAll ? [] : all);
          }}>
          <View
            className={`circle ${checkAll && 'checked'} flex items-center justify-center mr-2`}>
            {checkAll && <AtIcon color='#fff' size='13rpx' value='check' />}
          </View>
          <Text className='text-sm'>全选</Text>
        </View>
        <View
          className={`rounded-2xl bg-[#118DFF] text-white px-5 py-[12px] text-xs text-center`}
          onClick={() => {
            if (!checkedList?.length || !orders.length)
              return Taro.showToast({
                title: '请选择需要开票的订单',
                icon: 'none',
              });
            Taro.preload({ checkedList });
            Taro.navigateTo({
              url: '/subpackages/issue-invoice/index',
            });
          }}>
          下一步
        </View>
      </View>
      {!orders?.length && !loading && (
        <EmptyStatus title='暂无数据' icon={empty} />
      )}
    </View>
  );
};

export default Invoicing;
