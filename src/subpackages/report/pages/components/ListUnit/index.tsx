import { View } from '@tarojs/components';
import { useEffect, useRef, useState } from 'react';
import ListItem from '../ListItem';
import { reportList } from './service';
import { AtIcon, AtInput } from 'taro-ui';
import './index.less';
import { useDidHide, useDidShow } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import { REPORT_STATUS } from '@/constant';
import EmptyStatus from '@/components/Empty';
import empty from '@/assets/empty-list';

function ListUnit({ type }) {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [queryStr, setQueryStr] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
        return <ListItem reload={reload} item={item} />;
      })}
    </View>
  );
}

export default ListUnit;
