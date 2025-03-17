import { View, Text, Image, Canvas, RichText } from '@tarojs/components';
import Taro, { useDidShow, useReachBottom } from '@tarojs/taro';
import TopViewBg from '@/components/TopViewBg';
import CustomNavBar from '@/components/CustomNavBar';
import InfoCard from '@/components/InfoCard';
import { AtButton, AtIcon } from 'taro-ui';
import CustomCheckbox from '@/components/CustomCheckBox';
import { useEffect, useState } from 'react';
import { getCanvasSize, toDataURL } from '@/utils/canvasUtils';
import { getSignProtocol, sendReportSearch } from '@/services/report';
import { formatTime, parseRichText } from '@/utils';

import imageBg from '@/assets/report-bg-sm';
// const imageBg = require('@/assets/images/report-bg-sm.png');

export default function Index() {
  const [isBottom, setIsBottom] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const searchInfo = Taro.getStorageSync('searchInfo');

  const [signTextUrl, setSignTextUrl] = useState<string>('');

  const [dateUrl, setDateUrl] = useState<string>('');
  // 日期信息
  const [dateBase, setDateBase] = useState<string>('');

  // 签名信息
  const [nameBase, setNameBase] = useState<string>('');

  const [richTextString, setRichTextString] = useState('');

  const richTextNodes: any = parseRichText(richTextString);

  const placeholders = {
    '${name}': searchInfo.queryName,
    '${idCard}': searchInfo.queryIdcard,
  };

  // 替换占位符的函数
  const replacePlaceholders = (text) => {
    return text.replace(/\${\w+}/g, (match) => {
      return placeholders[match] || match;
    });
  };

  const [loading, setLoading] = useState(false);

  useReachBottom(() => {
    setIsBottom(true);
  });

  const generateSignature = async (
    canvasId: string,
    text: string,
    type: 'date' | 'name',
  ) => {
    const ctx = Taro.createCanvasContext(canvasId);
    const { width, height } = await getCanvasSize(canvasId);
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    ctx.setFillStyle('white');
    ctx.fillRect(0, 0, width, height);

    if (type === 'name') ctx.scale(2, 1);
    ctx.setFontSize(30);
    ctx.setFillStyle('#000000');
    // 绘制 text
    ctx.fillText(text, 0, 35);

    if (type === 'name') ctx.scale(0.5, 1);
    // 绘制
    const result = await toDataURL(canvasId, ctx, false);
    // h5 版本 result.tempFilePath 本身就是 完整base64
    if (type === 'date') {
      setDateUrl(result.tempFilePath);
      setDateBase(result.tempFilePath);
    } else {
      setSignTextUrl(result.tempFilePath);
      setNameBase(result.tempFilePath);
    }
    // 小程序的逻辑 h5 不需要
    // type === 'date'
    //   ? setDateUrl(result.tempFilePath)
    //   : setSignTextUrl(result.tempFilePath);
    // // 获取base64
    // Taro.getFileSystemManager().readFile({
    //   filePath: result.tempFilePath,
    //   encoding: 'base64',
    //   success: (fileRes) => {
    //     const base64 = 'data:image/png;base64,' + fileRes.data;
    //     type === 'date' ? setDateBase(base64) : setNameBase(base64);
    //   },
    //   fail: (err) => {
    //     console.error('读取文件失败:', err);
    //   },
    // });
  };

  // const handleSignature = (data) => {
  //   console.log('Received signature:', data.url);
  //   // 在这里处理签名文件路径
  //   setSignTextUrl(data.url);
  //   if (isBottom) {
  //     setTimeout(() => {
  //       scrollToBottom();
  //     }, 500); // 延迟，可以根据需要调整
  //   }
  // };

  // 获取内容的高度
  const getContentHeight = () => {
    const query = Taro.createSelectorQuery();
    query
      .select('#protocol') // 获取 ID 为 protocol 的元素
      .boundingClientRect()
      .exec(([size]) => setContentHeight(size?.height));
  };

  useDidShow(() => {
    getSignProtocol().then((res) => {
      if (res.data) {
        setRichTextString(replacePlaceholders(res.data.content));
        getContentHeight();
      }
    });
    // Taro.eventCenter.on('doc-signing', handleSignature);
  });

  // 如果内容高度小于或等于窗口高度，自动认为已经到底部
  useEffect(() => {
    const height = Taro.getSystemInfoSync().windowHeight;
    if (contentHeight && contentHeight <= height) {
      setIsBottom(true);
    }
  }, [contentHeight]);

  // useUnload(() => Taro.eventCenter.off('doc-signing', handleSignature));

  // useEffect(() => {
  //   const handleSignature = (data) => {
  //     console.log('Received signature:', data.url);
  //     // 在这里处理签名文件路径
  //     setSignTextUrl(data.url);
  //   };
  //   Taro.eventCenter.on('doc-signing', handleSignature);
  //   return () => {
  //     Taro.eventCenter.off('doc-signing', handleSignature);
  //   };
  // }, []);

  const submitSign = async () => {
    if (loading) return;
    // h5 版本 没有该方法
    // const code: string = await getJsCode();
    setLoading(true);
    sendReportSearch({
      ...searchInfo,
      signatureName: nameBase,
      signatureDate: dateBase,
      // jsCode: code,
    })
      .then((res) => {
        const { payInfo, needPay } = res.data;
        if (!needPay) {
          // 订单金额为 0 不拉微信支付
          Taro.redirectTo({
            url: `/subpackages/report/pages/report-list/index`,
          });
          return;
        }
        if (payInfo && needPay) {
          Taro.requestPayment({
            ...payInfo,
            package: payInfo.packageValue,
            success: () => {
              // 支付成功跳转报告list页面
              Taro.redirectTo({
                url: `/subpackages/report/pages/report-list/index`,
              });
            },
            fail: () => {
              Taro.showToast({
                title: '支付失败',
                icon: 'none',
              });
              Taro.redirectTo({
                url: `/subpackages/report/pages/report-list-undo/index`,
              });
            },
          });
        }
      })
      .finally(() => setLoading(false));
    // 将 signTextUrl 转为 base64
    // Taro.getFileSystemManager().readFile({
    //   filePath: signTextUrl,
    //   encoding: 'base64',
    //   success: async (fileRes) => {
    //     const base64 = 'data:image/png;base64,' + fileRes.data;
    //     const code: string = await getJsCode();
    //     setLoading(true);
    //     sendReportSearch({
    //       ...searchInfo,
    //       signatureName: base64,
    //       signatureDate: dateBase,
    //       jsCode: code,
    //     })
    //       .then((res) => {
    //         const { payInfo } = res.data;
    //         if (payInfo) {
    //           Taro.requestPayment({
    //             ...payInfo,
    //             package: payInfo.packageValue,
    //             success: () => {
    //               // 支付成功跳转报告list页面

    //               Taro.navigateTo({
    //                 url: `/subpackages/report/pages/report-list/index`,
    //               });
    //             },
    //             fail: () => {
    //               Taro.showToast({
    //                 title: '支付失败',
    //                 icon: 'none',
    //               });
    //               Taro.navigateTo({
    //                 url: `/subpackages/report/pages/report-list-undo/index`,
    //               });
    //             },
    //           });
    //         }
    //       })
    //       .finally(() => setLoading(false));
    //   },
    //   fail: (err) => {
    //     console.error('读取文件失败:', err);
    //   },
    // });
  };

  return (
    <View>
      <TopViewBg imageBg={imageBg} height='280rpx'>
        <CustomNavBar title={<Text className='font-semibold'>文档签署</Text>} />
        <View className='mx-3 pb-[260rpx] text-black' id='protocol'>
          <InfoCard title={false}>
            <RichText nodes={richTextNodes} />
            <View className='flex mt-4 text-[#000000] h-9'>
              <View className='flex flex-1 items-center'>
                <Text className='text-sm'>签名：</Text>
                {!signTextUrl && (
                  <Text className='text-[#BFBFBF] text-xs leading-[22rpx]'>
                    请点击下方签名签署
                  </Text>
                )}
                {signTextUrl && (
                  <Image src={signTextUrl} className='w-24 h-9' />
                )}
              </View>
              <View className='flex flex-1 items-center'>
                <Text className='text-sm'>日期：</Text>
                {!dateUrl && (
                  <Text className='text-[#BFBFBF] text-xs leading-[22rpx]'>
                    请点击下方日期签署
                  </Text>
                )}
                {dateUrl && <Image src={dateUrl} className='w-24 h-9' />}
              </View>
            </View>
          </InfoCard>
        </View>
      </TopViewBg>
      <View className='fixed bottom-0 w-full h-[245rpx] bg-white'>
        <View
          className='flex items-center h-9 px-8'
          style={{
            backgroundColor:
              dateUrl && signTextUrl && isBottom ? '#DCE4F9' : '#FFF2DE',
          }}>
          <View className='flex items-center mr-8'>
            {dateUrl && signTextUrl ? (
              <CustomCheckbox className='mr-2 !mt-2.5' checked={true} />
            ) : (
              <AtIcon
                className='mr-2 text-[#FFA714]'
                size='16rpx'
                prefixClass='icon'
                value='warning'
              />
            )}
            <View className='text-xs text-[#6F7276]'>需签署</View>
          </View>
          <View className='flex items-center'>
            {isBottom ? (
              <CustomCheckbox className='mr-2 !mt-2.5' checked={true} />
            ) : (
              <AtIcon
                className='mr-2 text-[#FFA714]'
                size='16rpx'
                prefixClass='icon'
                value='warning'
              />
            )}
            <View className='text-xs text-[#6F7276]'>需阅读至文档末尾</View>
          </View>
        </View>
        <View className='at-row items-center justify-between h-20 px-8 bg-white text-xs'>
          <View
            className='flex flex-col items-center h-full justify-center'
            onClick={() => {
              generateSignature('nameCanvas', searchInfo.queryName, 'name');
              // Taro.navigateTo({
              //   url: `/subpackages/report/pages/sign-page/index?type=doc-signing`,
              // });
            }}>
            <AtIcon size='22rpx' prefixClass='icon' value='sign' />
            <Text className='mt-1'>签名</Text>
          </View>
          <View
            className='flex flex-col items-center h-full justify-center'
            onClick={() => {
              const dateNow = formatTime(new Date(), '-');
              generateSignature('dateCanvas', dateNow, 'date');
            }}>
            <AtIcon size='22rpx' prefixClass='icon' value='date' />
            <Text className='mt-1'>日期</Text>
          </View>
          <AtButton
            type='primary'
            circle
            className='!m-0 w-[300rpx] !h-10 flex-center'
            loading={loading}
            disabled={!dateUrl || !signTextUrl || !isBottom}
            onClick={submitSign}>
            提交签署
          </AtButton>
        </View>
      </View>

      {/* 可见范围外的 canvas 用于生成当前日期图片 */}
      <Canvas
        id='dateCanvas'
        canvasId='dateCanvas'
        className='absolute -top-96 h-[100rpx]'
      />
      <Canvas
        id='nameCanvas'
        canvasId='nameCanvas'
        className='absolute -top-96 h-[100rpx]'
      />
    </View>
  );
}
