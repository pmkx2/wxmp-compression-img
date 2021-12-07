# wxmp-compression-img
小程序-canvas图片压缩组件

此图片压缩组件使用canvas的方式进行压缩，算是提供了另外一种的图片压缩方式


| 属性  | 类型  | 默认值  | 必填  | 说明  |
|:----------|:----------|:----------|:----------|:----------|
| canvasId    | string    | 'compressImageCanvas'    | 否    | 画布ID    |
| range    | number    | 400    | 否    | 范围值：大小超出了此范围的图片才进行压缩，单位为kb    |
| tempFilePath    | string    |     | 是    | 图片在小程序的临时路径    |
| ratio    | number    |  1   | 否    |  压缩尺寸比例：0～1，1 为 100%，默认100%  |
| quality    | number    |  0.8   | 否    |  压缩质量比：0～1，1 为 100%，默认75%  |


