import { View } from '@tarojs/components';
import { useEffect, useState } from 'react';
import './index.less';
import Taro from '@tarojs/taro';

interface WaterMarkProps {
  text?: string;
  gapX?: number;
  gapY?: number;
  fontSize?: number;
  opacity?: number;
  // timestamp?: number;
}

export default function WaterMark({
  text = '',
  gapX = 150,
  gapY = 150,
  fontSize = 14,
  opacity = 1,
  // timestamp = Date.now(),
}: WaterMarkProps) {
  const [watermarks, setWatermarks] = useState<{ left: number; top: number }[]>(
    [],
  );

  // 计算水印位置
  const calculateWatermarks = () => {
    const marks: { left: number; top: number }[] = [];
    // 获取文档实际高度，而不是窗口高度
    const sys = Taro.getSystemInfoSync();
    const screenWidth = sys.windowWidth;
    let screenHeight = sys.windowHeight;
    const query = Taro.createSelectorQuery();
    query
      .select('.watermark-container')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (res?.[0]) {
          screenHeight = res[0].height;
          console.log('🚀 ~ .exec ~ screenHeight:', screenHeight);
          for (let y = 0; y < screenHeight; y += gapY) {
            for (let x = 0; x < screenWidth; x += gapX) {
              marks.push({ left: x, top: y });
            }
          }
          setWatermarks(marks);
          console.log('🚀 ~ .exec ~ marks:', marks);
        }
      });
  };

  useEffect(() => {
    calculateWatermarks();
  }, [text]);

  return (
    <View className='watermark'>
      {watermarks.map((pos, index) => (
        <View
          key={index}
          className='watermark-item'
          style={{
            left: `${pos.left}px`,
            top: `${pos.top}px`,
            fontSize: `${fontSize}px`,
            opacity,
          }}>
          {text}
        </View>
      ))}
    </View>
  );
}
