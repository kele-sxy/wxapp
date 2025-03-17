import Taro, { type CanvasContext, useReady, useRouter } from '@tarojs/taro';
import { View, Canvas, Text } from '@tarojs/components';
import { useRef, useState } from 'react';
import { AtButton } from 'taro-ui';
import { toDataURL } from '@/utils/canvasUtils';

export default function SignPage() {
  const context = useRef<CanvasContext>();
  // 绘制轨迹信息
  const lineInfo = useRef({ startX: 0, startY: 0 });

  const router = useRouter();

  const [isDrawing, setIsDrawing] = useState(false);

  //   const setWaterText = async (ctx: CanvasContext) => {
  //     const { width, height } = await getCanvasSize('signCanvas');
  //     ctx.setFontSize(20);
  //     ctx.setTextBaseline('middle');
  //     ctx.setFillStyle('#000000');
  //     const text = '请在此处手写签名';
  //     const textWidth = ctx.measureText(text).width;
  //     ctx.fillText(text, (width - textWidth) / 2, height / 2);
  //     ctx.draw();
  //   };

  const setBaseInfo = (ctx: CanvasContext) => {
    ctx.setStrokeStyle('#000000');
    ctx.setLineWidth(4);
    ctx.setLineCap('round');
    ctx.setLineJoin('round');
  };

  useReady(() => {
    const query = Taro.createSelectorQuery();
    query
      .select('#signCanvas')
      .context((res) => {
        if (!res.context) return;
        setBaseInfo(res.context as CanvasContext);
        context.current = res.context as CanvasContext;
      })
      .exec();
  });

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    lineInfo.current.startX = e.changedTouches[0].clientX;
    lineInfo.current.startY = e.changedTouches[0].clientY;
    context.current?.beginPath();
  };

  const continueDrawing = (e) => {
    e.preventDefault();
    let x = e.changedTouches[0].clientX;
    let y = e.changedTouches[0].clientY;
    context.current?.moveTo(lineInfo.current.startX, lineInfo.current.startY);
    context.current?.lineTo(x, y);
    context.current?.stroke();
    context.current?.draw(true);
    lineInfo.current.startX = x;
    lineInfo.current.startY = y;
  };

  const onClear = async () => {
    context.current?.draw();
    setIsDrawing(false);
    setBaseInfo(context.current as CanvasContext);
  };

  const onSubmit = async () => {
    const result = await toDataURL('signCanvas', context.current, {
      fileType: 'jpg',
      quality: 1,
    });
    if (!result) return console.error('签名失败');
    // 用事件总线把导出的签名图发射出去
    Taro.eventCenter.trigger(router.params.type || 'doc-signing', {
      url: result.tempFilePath,
    });
    Taro.navigateBack({ delta: 1 });
  };

  return (
    <View className='relative'>
      <Canvas
        canvasId='signCanvas'
        id='signCanvas'
        className='w-screen h-screen'
        style={{
          backgroundColor: isDrawing ? 'rgb(229 231 235)' : 'transparent',
        }}
        disableScroll
        onTouchStart={startDrawing}
        onTouchMove={continueDrawing}
      />
      {!isDrawing && (
        <Text className='absolute top-0 left-0 size-full text-gray-400 bg-gray-200 text-xl -z-10 flex items-center justify-center'>
          请在此处手写签名
        </Text>
      )}
      <View className='absolute w-screen bottom-2.5 flex justify-center'>
        <AtButton
          type='primary'
          className='text-[16px] h-4 leading-[0rpx] items-center px-2.5 mx-2'
          onClick={onClear}>
          重置
        </AtButton>
        <AtButton
          type='primary'
          className='text-[16px] h-4 leading-[0rpx] items-center px-2.5 mx-2'
          onClick={onSubmit}>
          保存签名
        </AtButton>
      </View>
    </View>
  );
}
