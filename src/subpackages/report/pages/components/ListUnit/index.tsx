import { View } from '@tarojs/components';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import ListItem from '../ListItem';
import { reportList, shareReport } from './service';
import {
  AtIcon,
  AtInput,
  AtButton,
  AtModal,
  AtModalAction,
  AtModalContent,
  AtModalHeader,
} from 'taro-ui';
import './index.less';
import { useDidHide, useDidShow } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import { REPORT_STATUS } from '@/constant';
import EmptyStatus from '@/components/Empty';
import empty from '@/assets/empty-list';

import { isValidPhoneNumber } from '@/utils';

function ListUnit({ type, forwardRef }) {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [queryStr, setQueryStr] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [reportInfo, setReportInfo] = useState<any>({});

  const curGetList = async (res: any, closeLoading = false) => {
    if (loading) return;
    try {
      if (!closeLoading) {
        Taro.showLoading();
        setLoading(true);
      }
      const { code, data } = await reportList({
        pageNum: 1,
        pageSize: 9999,
        ...res,
      });
      if (code === 200) {
        setData(
          (data.list || []).map((item) => {
            return {
              ...item,
              type,
            };
          }),
        );
      }
    } finally {
      Taro.hideLoading();
      setLoading(false);
    }
  };

  useEffect(() => {
    // 有查询中报告时 列表接口轮询 并隐藏 loading
    const hasPendingReports = data.some(
      (item) => item.status === REPORT_STATUS.QUERYING,
    );
    if (hasPendingReports) {
      timerRef.current = setInterval(() => {
        curGetList({ status: type, query: queryStr }, true);
      }, 5000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    // 清除定时器
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [data]);

  useDidHide(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  });

  const reload = () => {
    curGetList({ status: type, query: queryStr });
  };
  useDidShow(() => {
    curGetList({ status: type, query: queryStr });
  });

  const [showShareModal, setShowShareModal] = useState(false);
  const [sharePhone, setSharePhone] = useState('');

  const handleShare = (reportId, reportType) => {
    setSharePhone('');
    setShowShareModal(true);
    setReportInfo({ reportId, reportType });
  };

  const handeShareClose = () => {
    setSharePhone('');
    setShowShareModal(false);
    setReportInfo({});
  };

  const handleShareReport = async () => {
    if (!sharePhone) {
      Taro.showToast({
        title: '请输入手机号码',
        icon: 'none',
      });
      return;
    }

    if (!isValidPhoneNumber(sharePhone)) {
      Taro.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
      });
      return;
    }

    return shareReport({
      reportId: reportInfo.reportId,
      shareMobile: sharePhone,
    }).finally(() => {
      handeShareClose();
    });
  };

  useImperativeHandle(forwardRef, () => ({
    handleShareReport,
    getReportInfo: () => reportInfo,
  }));

  return (
    <View className='bg-base-bg px-[32px] min-h-[100vh] h-[100%] pb-[32px]'>
      <View className='search-container'>
        <AtInput
          type='text'
          clear
          cursor={-1}
          border={false}
          name='queryStr'
          className='search-input flex'
          placeholder='请输入手机号码、姓名进行搜索'
          value={queryStr}
          onChange={(v: string) => {
            const query = v || '';
            setQueryStr(query);
            curGetList(
              {
                query,
                status: type,
              },
              true,
            );
          }}
        />
        <View className='search-icon'>
          <AtIcon
            value='search'
            size='20'
            color='#4F7FFF'
            onClick={() => {
              curGetList({
                query: queryStr,
                status: type,
              });
            }}
          />
        </View>
      </View>
      {!data?.length && !loading && (
        <EmptyStatus title='暂无数据' icon={empty} />
      )}
      {(data || []).map((item: any) => {
        return (
          <ListItem reload={reload} handleShare={handleShare} item={item} />
        );
      })}
      {showShareModal && (
        <AtModal
          isOpened={showShareModal}
          onClose={() => setShowShareModal(false)}>
          <AtModalHeader>转发给朋友</AtModalHeader>
          <AtModalContent>
            <View className='py-4'>
              <AtInput
                clear
                cursor={-1}
                name='phone'
                placeholderClass='text-[#BFBFBF] text-sm'
                placeholder='请输入被分享人的手机号码'
                value={sharePhone}
                type='phone'
                onChange={(v: any) => setSharePhone(v)}
              />
            </View>
          </AtModalContent>
          <AtModalAction>
            <AtButton className='!h-9' onClick={() => setShowShareModal(false)}>
              <View className='text-sm flex items-center h-full'>取消</View>
            </AtButton>
            <AtButton
              className='!h-9'
              type='primary'
              openType={
                sharePhone && isValidPhoneNumber(sharePhone)
                  ? 'share'
                  : undefined
              }
              onClick={() => handleShareReport()}>
              <View className='text-sm flex items-center h-full'>确定</View>
            </AtButton>
          </AtModalAction>
        </AtModal>
      )}
    </View>
  );
}

export default ListUnit;
