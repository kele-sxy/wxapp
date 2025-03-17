import Taro, { type CanvasContext } from '@tarojs/taro';

/**
 * canvas 导入图片结果
 */
export interface ToDataURLResult {
  tempFilePath: string;
  errMsg: string;
}

/**
 * 获取 canvas 的尺寸
 */
export const getCanvasSize = async (
  canvasId: string,
): Promise<{ height: number; width: number }> => {
  return new Promise((resolve) => {
    const query = Taro.createSelectorQuery();
    query
      .select('#' + canvasId)
      .boundingClientRect()
      .exec(([size]) => resolve(size));
  });
};

/**
 * 将 canvas 内容转换成 base64 字符串
 */
export const toDataURL = async (
  canvasId: string,
  canvas?: CanvasContext,
  options?: any,
  drawCuntinue: boolean = true,
): Promise<ToDataURLResult> => {
  if (!canvas) return { errMsg: 'canvas is null', tempFilePath: '' };

  return new Promise((resolve, reject) => {
    canvas.draw(drawCuntinue, () => {
      Taro.canvasToTempFilePath({
        canvasId: canvasId,
        fileType: 'png',
        ...options,
        success: (res) => resolve(res),
        fail: (err) => reject(err),
      });
    });
  });
};
