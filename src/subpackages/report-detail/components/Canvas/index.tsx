import { useEffect, useRef, useState } from 'react';
import { View, Canvas, Image } from '@tarojs/components';
import Taro, { useReady, useUnload } from '@tarojs/taro';
import { CANVAS_COLOR_MAP } from '../../constant';
import { REPORT_KEY_ENUM } from '@/constant';

type RadarChartProps = {
  canvasId: string;
  fullScore?: number | string;
  data?: any[];
  fieldProps?: { label: string; value: string; maxValue: string };
  type?: string; // 报告类型
};

const RadarChart = (props: RadarChartProps) => {
  const {
    canvasId,
    data = [],
    fullScore,
    fieldProps = { label: 'name', value: 'score', maxValue: 'total' },
    type = REPORT_KEY_ENUM.homemaking,
  } = props;
  const chartRef = useRef<any>(null);
  const COLOR_MAP = CANVAS_COLOR_MAP[type];
  let ctx: Taro.CanvasContext | null = null;

  const [imageUrl, setImageUrl] = useState<string>('');

  const drawChart = () => {
    const query = Taro.createSelectorQuery();
    query
      .select(`#${canvasId}`)
      .fields({ node: true, size: true })
      .exec((res) => {
        if (res?.[0] && data.length) {
          drawRadarChart(res[0]);
        }
      });
  };

  useReady(() => {
    drawChart();
  });

  useEffect(() => {
    drawChart();
  }, [data]);

  // useDidShow(() => {
  //   drawChart();
  // });

  useUnload(() => {
    // 在页面卸载时销毁 canvasContext
    if (ctx && chartRef.current) {
      ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);
      ctx = null;
    }
  });

  const drawRadarChart = async (params: { width: number; height: number }) => {
    const { width = 600, height = 600 } = params;
    ctx = Taro.createCanvasContext(canvasId);
    ctx.scale(2, 2);
    const circles = 5;
    const center = { x: width / 2, y: height / 2 };
    // 最外层圆的半径
    const minW = width > height ? height : width;
    const radius = minW / 2 - 130;
    // 每个点之间的角度
    const angleStep = (2 * Math.PI) / data.length;

    // 绘制背景五边形及外阴影
    for (let level = circles - 1; level >= 0; level--) {
      const r = (radius * (level + 1)) / circles;

      // 绘制阴影层
      if (level === circles - 1 || level === circles - 2) {
        ctx.setShadow(0, 0, 40, COLOR_MAP.shadowColor);
      }
      ctx.beginPath();
      for (let i = 0; i <= data.length; i++) {
        const x = center.x + r * Math.cos(i * angleStep - Math.PI / 2);
        const y = center.y + r * Math.sin(i * angleStep - Math.PI / 2);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.setFillStyle(
        COLOR_MAP.circleColors[level] ?? COLOR_MAP.circleColors[0],
      );
      ctx.fill();
      ctx.setShadow(0, 0, 0, 'rgba(0,0,0,0)'); // 重置阴影
    }

    // 绘制从中心到顶点的连线
    ctx.setStrokeStyle(COLOR_MAP.baseColor);
    for (let i = 0; i < data.length; i++) {
      const x =
        center.x + (radius + 15) * Math.cos(i * angleStep - Math.PI / 2);
      const y =
        center.y + (radius + 15) * Math.sin(i * angleStep - Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // 绘制数据区域
    ctx.beginPath();
    const gradient = ctx.createCircularGradient(center.x, center.y, radius);
    gradient.addColorStop(0, COLOR_MAP.linearColor[0]);
    gradient.addColorStop(1, COLOR_MAP.linearColor[1]);
    ctx.setFillStyle(gradient);
    for (let i = 0; i <= data.length; i++) {
      const value = Number(data[i % data.length][fieldProps.value]);
      const maxValue = Number(data[i % data.length][fieldProps.maxValue]);
      const x =
        center.x +
        ((radius * value) / maxValue) * Math.cos(i * angleStep - Math.PI / 2);
      const y =
        center.y +
        ((radius * value) / maxValue) * Math.sin(i * angleStep - Math.PI / 2);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.setStrokeStyle(COLOR_MAP.lineColor);
    ctx.stroke(); // 添加描边色彩

    // 绘制白色圈圈
    for (let level = circles; level >= 0; level--) {
      ctx.beginPath();
      const realRadius = level === circles ? radius + 15 : radius;
      const r = (realRadius * level) / circles;
      if (level !== 3) {
        ctx.arc(center.x, center.y, r, 0, 2 * Math.PI);
        ctx.setStrokeStyle(`rgba(255, 255, 255, ${level / circles})`);
        ctx.stroke();
      }
    }

    // 绘制五个角的点
    ctx.setFillStyle(COLOR_MAP.baseColor);
    for (let i = 0; i < data.length; i++) {
      const x =
        center.x + (radius + 15) * Math.cos(i * angleStep - Math.PI / 2);
      const y =
        center.y + (radius + 15) * Math.sin(i * angleStep - Math.PI / 2);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }

    // 绘制标签和对应数字
    ctx.setFontSize(14);
    for (let i = 0; i < data.length; i++) {
      ctx.setFillStyle('rgba(50, 52, 59, 1)');
      const angle = i * angleStep - Math.PI / 2;
      const x = center.x + (radius + 25) * Math.cos(angle);
      const y = center.y + (radius + 25) * Math.sin(angle);
      // 根据 x y 位置设置每个 text 的偏移
      const value = data[i][fieldProps.label];
      const txtW = ctx.measureText(value + '').width;
      let offsetX = 0,
        offsetY = 0;
      if (x === center.x) {
        offsetX = -txtW / 2;
        offsetY = -15;
      }
      if (x > center.x && y < center.y) {
        offsetX = 0;
        offsetY = -10;
      }
      if (x > center.x && y > center.y) {
        offsetX = 5;
        offsetY = 20;
      }
      if (x < center.x && y > center.y) {
        offsetX = -txtW - 5;
        offsetY = 20;
      }
      if (x < center.x && y < center.y) {
        offsetX = -txtW - 5;
        offsetY = -10;
      }
      ctx.setFontSize(26);
      ctx.fillText(value, x + offsetX, y + offsetY);
    }
    ctx.draw(false, () => {
      // 绘制中心分数
      if (ctx) {
        ctx.setFontSize(74);
        ctx.setFillStyle('#FFFFFF');
        const txtW = ctx.measureText(fullScore + '').width;
        ctx.fillText(`${fullScore}`, center.x - txtW / 2, center.y + 15);

        ctx.draw(true, () => {
          Taro.canvasToTempFilePath({
            canvasId: canvasId,
            fileType: 'png',
            success: (res) => {
              setImageUrl(res.tempFilePath);
            },
          });
        });
      }
    });
  };

  return (
    <View className='radar-chart size-full text-center'>
      <Image src={imageUrl} className='bg-transparent w-[600rpx] h-[600rpx]' />
      <Canvas
        ref={chartRef}
        canvasId={canvasId}
        id={canvasId}
        width='1200'
        height='1200'
        className='absolute top-0 left-[-5000px] scale-[0.5] origin-top-left w-[1200rpx] h-[1200rpx]'
      />
    </View>
  );
};

export default RadarChart;
