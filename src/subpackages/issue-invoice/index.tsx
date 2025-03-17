import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useDidShow } from '@tarojs/taro';
import { FC, useState } from 'react';
import { AtActivityIndicator, AtIcon, AtInput } from 'taro-ui';
import './index.less';
import { applyInvoice } from '@/services/report';

const InvoiceType = {
  company: '0',
  personal: '1',
};

interface InvoiceProps {}

const Invoice: FC<InvoiceProps> = () => {
  const safeArea = Taro.getWindowInfo().safeArea;
  const router = useRouter();
  const params = router?.params;

  const [loading, setLoading] = useState<boolean>(false);

  const [checkedList, setCheckedList] = useState<any>([]);

  const [payAmount, setPayAmount] = useState<number>(0);

  const [showMore, setShowMore] = useState<boolean>(false);

  const [invoiceInfo, setInvoiceInfo] = useState<any>({
    type: InvoiceType.company, // 抬头类型 0 单位 1 个人
    title: '', // 抬头名称
    taxNumber: '', // 税号
    companyAddress: '', // 单位地址
    telephone: '', // 手机号码
    bankName: '', // 开户行
    bankAccount: '', //银行账号
  });

  const [receiveEmail, setReceiveEmail] = useState<string>('');
  // const [receivePhone, setReceivePhone] = useState<string>('');

  const isCompany = invoiceInfo.type === InvoiceType.company;

  useDidShow(() => {
    if (params?.reportId) {
      setCheckedList([
        {
          reportId: params.reportId,
          payAmount: Number(params?.payAmount),
        },
      ]);
      setPayAmount(Number(params?.payAmount));
    }
    // const params = Taro.getCurrentInstance().preloadData;
    // if (params?.checkedList) {
    //   setCheckedList(params?.checkedList);
    //   setPayAmount(
    //     params?.checkedList?.reduce(
    //       (acc, cur) => acc + Number(cur.payAmount),
    //       0,
    //     ),
    //   );
    // }
  });

  const onsubmit = () => {
    console.log('🚀 ~ checkedList:', checkedList);
    if (loading) return;
    if (!invoiceInfo.title) {
      Taro.showToast({
        title: '请填写发票抬头',
        icon: 'none',
      });
      return;
    }
    if (isCompany && !invoiceInfo.taxNumber) {
      Taro.showToast({
        title: '请填写税号',
        icon: 'none',
      });
      return;
    }
    if (!receiveEmail) {
      Taro.showToast({
        title: '请填写电子邮箱',
        icon: 'none',
      });
      return;
    }
    // 申请成功跳回我的订单列表
    setLoading(true);
    applyInvoice({
      payAmount,
      orderList: checkedList,
      ...invoiceInfo,
      receiveEmail,
      // receivePhone,
    })
      .then(() => {
        Taro.navigateBack({ delta: 1 }).then(() => {
          Taro.showToast({ title: '开票成功，请及时查阅邮箱', icon: 'none' });
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View className='bg-base-bg px-3 min-h-screen pt-2 pb-14 text-neutral-700 issue-invoice'>
      <View className='bg-white px-4 py-4 my-4 rounded-2xl text-sm'>
        <View className='at-row'>
          <View className='at-col-4'>开票金额</View>
          <View className='at-col text-[#4F7FFF] text-sm'>
            ¥ {payAmount / 100}
          </View>
        </View>
      </View>
      <View className='bg-white px-4 pt-4 pb-2 my-4 rounded-2xl text-sm'>
        <View className='at-row mb-3'>
          <View className='at-col-4'>发票类型</View>
          <View className='at-col text-right'>普通发票-电子</View>
        </View>
        <View className='at-row mb-3'>
          <View className='at-col-4'>抬头类型</View>
          <View className='at-col flex radio-check items-center justify-end'>
            <View
              className='flex-center'
              onClick={() => {
                setInvoiceInfo((prev) => ({
                  ...prev,
                  type: InvoiceType.company,
                }));
              }}>
              <View
                className={`circle ${isCompany && 'checked'} flex items-center justify-center mr-2`}>
                {isCompany && (
                  <AtIcon color='#fff' size='13rpx' value='check' />
                )}
              </View>
              <Text>企业单位</Text>
            </View>
            <View
              className='flex-center ml-4'
              onClick={() => {
                setInvoiceInfo({
                  type: InvoiceType.personal,
                  title: '',
                  taxNumber: '',
                  companyAddress: '',
                  telephone: '',
                  bankName: '',
                  bankAccount: '',
                });
              }}>
              <View
                className={`circle ${!isCompany && 'checked'} flex items-center justify-center mr-2`}>
                {!isCompany && (
                  <AtIcon color='#fff' size='13rpx' value='check' />
                )}
              </View>
              <Text>个人/事业单位</Text>
            </View>
          </View>
        </View>
        <View className='at-row mb-3'>
          <View className='at-col-4'>发票抬头</View>
          <View className='at-col'>
            <AtInput
              clear
              border={false}
              className='p-0 text-right mb-0'
              cursor={-1}
              name='title'
              placeholder={isCompany ? '请输入单位名称' : '请输入个人姓名'}
              placeholderClass='placeholder'
              value={invoiceInfo.title}
              onChange={(v: string) => {
                if (v === invoiceInfo.title) return;
                setInvoiceInfo((prev) => ({
                  ...prev,
                  title: v,
                }));
              }}>
              {isCompany && (
                <AtIcon
                  color='#000'
                  size='16'
                  onClick={() => {
                    Taro.chooseInvoiceTitle({
                      success: (res) => {
                        setInvoiceInfo((prev) => ({
                          ...prev,
                          ...res,
                        }));
                      },
                    });
                  }}
                  value='list'
                />
              )}
            </AtInput>
          </View>
        </View>
        {isCompany && (
          <View className='at-row mb-3'>
            <View className='at-col-4'>税号</View>
            <View className='at-col'>
              <AtInput
                clear
                border={false}
                className='p-0 text-right mb-0'
                cursor={-1}
                name='taxNumber'
                placeholder='请输入纳税人识别号'
                placeholderClass='placeholder'
                value={invoiceInfo.taxNumber}
                onChange={(v: string) => {
                  if (v === invoiceInfo.taxNumber) return;
                  setInvoiceInfo((prev) => ({
                    ...prev,
                    taxNumber: v,
                  }));
                }}
              />
            </View>
          </View>
        )}
        {showMore && isCompany && (
          <>
            <View className='at-row mb-3'>
              <View className='at-col-4'>开户银行</View>
              <View className='at-col'>
                <AtInput
                  clear
                  border={false}
                  className='p-0 text-right mb-0'
                  cursor={-1}
                  name='bankName'
                  placeholder='选填'
                  placeholderClass='placeholder'
                  value={invoiceInfo.bankName}
                  onChange={(v: string) => {
                    if (v === invoiceInfo.bankName) return;
                    setInvoiceInfo((prev) => ({
                      ...prev,
                      bankName: v,
                    }));
                  }}
                />
              </View>
            </View>
            <View className='at-row mb-3'>
              <View className='at-col-4'>银行帐号</View>
              <View className='at-col'>
                <AtInput
                  clear
                  border={false}
                  className='p-0 text-right mb-0'
                  cursor={-1}
                  name='bankAccount'
                  placeholder='选填'
                  placeholderClass='placeholder'
                  value={invoiceInfo.bankAccount}
                  onChange={(v: string) => {
                    if (v === invoiceInfo.bankAccount) return;
                    setInvoiceInfo((prev) => ({
                      ...prev,
                      bankAccount: v,
                    }));
                  }}
                />
              </View>
            </View>
            <View className='at-row mb-3'>
              <View className='at-col-4'>单位地址</View>
              <View className='at-col'>
                <AtInput
                  clear
                  border={false}
                  className='p-0 text-right mb-0'
                  cursor={-1}
                  name='companyAddress'
                  placeholder='选填'
                  placeholderClass='placeholder'
                  value={invoiceInfo.companyAddress}
                  onChange={(v: string) => {
                    if (v === invoiceInfo.companyAddress) return;
                    setInvoiceInfo((prev) => ({
                      ...prev,
                      companyAddress: v,
                    }));
                  }}
                />
              </View>
            </View>
            <View className='at-row mb-3'>
              <View className='at-col-4'>单位电话</View>
              <View className='at-col'>
                <AtInput
                  clear
                  border={false}
                  className='p-0 text-right mb-0'
                  cursor={-1}
                  name='telephone'
                  placeholder='选填'
                  placeholderClass='placeholder'
                  value={invoiceInfo.telephone}
                  onChange={(v: string) => {
                    if (v === invoiceInfo.telephone) return;
                    setInvoiceInfo((prev) => ({
                      ...prev,
                      telephone: v,
                    }));
                  }}
                />
              </View>
            </View>
          </>
        )}
        {isCompany && (
          <View
            className='at-row justify-center py-2'
            onClick={() => setShowMore(!showMore)}>
            <AtIcon
              color='#000'
              size='16'
              value={showMore ? 'chevron-up' : 'chevron-down'}
            />
          </View>
        )}
      </View>
      <View className='bg-white px-4 py-4 my-4 rounded-2xl text-sm'>
        <View className='at-row'>
          <View className='at-col-4'>电子邮箱</View>
          <View className='at-col'>
            <AtInput
              clear
              border={false}
              className='p-0 text-right mb-0'
              cursor={-1}
              name='receiveEmail'
              placeholder='用于向您发送电子发票邮件'
              placeholderClass='placeholder'
              value={receiveEmail}
              onChange={(v: string) => {
                if (v === receiveEmail) return;
                setReceiveEmail(v);
              }}
            />
          </View>
        </View>
        {/* <View className='at-row'>
          <View className='at-col-4'>手机号码</View>
          <View className='at-col'>
            <AtInput
              clear
              border={false}
              className='p-0 text-right mb-0'
              cursor={-1}
              name='receivePhone'
              placeholder='用于向您发送短信通知'
              placeholderClass='placeholder'
              value={receivePhone}
              onChange={(v: string) => {
                if (v === receivePhone) return;
                setReceivePhone(v);
              }}
            />
          </View>
        </View> */}
      </View>
      <View
        className='fixed bottom-0 left-0 right-0 px-3 pt-2 bg-white'
        style={{ paddingBottom: `${safeArea?.top ?? 0}rpx` }}>
        <View
          className='rounded-2xl bg-[#118DFF] text-white py-2 text-sm flex items-center justify-center'
          onClick={() => onsubmit()}>
          提交申请
          {loading && (
            <AtActivityIndicator
              size={30}
              color='#fff'
              isOpened={loading}
              className='inline-block ml-1'
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default Invoice;
