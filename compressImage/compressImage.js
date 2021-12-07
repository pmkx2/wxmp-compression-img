

const app = getApp()

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },

  properties: {
    // 画布ID
    canvasId: {
      type: 'string',
      value: 'compressImageCanvas'
    },
    // 范围值：kb
    range: {
      type: 'number',
      value: 400
    },
    // 图片在小程序的临时路径
    tempFilePath: {
      type: 'string',
      value: ''
    },
    // 压缩尺寸比例：0～1，1 为 100%，默认100%
    ratio: {
      type: 'number',
      value: 1
    },
    // 压缩质量比：0～1，1 为 100%，默认75%
    quality: {
      type: 'number',
      value: 0.75
    },
    // 格式限制：图片格式限制由控件自身去控制
    // formats: {
    //   type: 'array',
    //   value: ['jpg', 'jpeg', 'png']
    // }
  },

  data: {
    cWidth: 0,
    cHeight: 0,
    defaultImgInfo: {}
  },

  observers: {
    'tempFilePath': function() {
      if (!this.properties.tempFilePath || this.properties.tempFilePath === '') return
      this.compressImage()
    }
  },

  methods: {
    compressImage() {
      let cWidth = 0
      let cHeight = 0
      let prop = this.properties

      // 获取压缩后的图片信息
      this.getImageInfo(prop.tempFilePath).then(info => {
        // ---------- 判断是否超过范围值 --------------
        // console.log(info)
        if (info && info.size <= (this.properties.range * 1000)) {
          this.triggerEvent('compressEnd', {
            compress: false,
            data: info,
            default: info
          })
          return
        }

        // ---------- 设置画布大小和写入图片的详情 --------------
        cWidth = parseInt(info.width * prop.ratio),
        cHeight = parseInt(info.height * prop.ratio)
        this.setData({
          cWidth,
          cHeight,
          defaultImgInfo: info
        })

        // ---------- 绘制图形并取出图片路径 --------------
        var ctx = wx.createCanvasContext(prop.canvasId, this)
        ctx.drawImage(this.properties.tempFilePath, 0, 0, cWidth, cHeight)
        ctx.draw(false, () => {
          wx.canvasToTempFilePath({
            canvasId: prop.canvasId,
            quality: prop.quality,
            fileType: 'jpg',
            destWidth: cWidth,
            destHeight: cHeight,
            success: (res) => {
              // 获取压缩后的图片信息
              this.getImageInfo(res.tempFilePath).then(info => {
                this.triggerEvent('compressEnd', {
                  compress: true, // 是否执行了压缩操作
                  data: info,     // 压缩后的图片信息
                  default: this.data.defaultImgInfo
                })
              })
            },
            fail: (err) => {
              console.error(err.errMsg)
            }
          }, this)
        })
      }).fail(error => {
        console.error(error)
      })
    },

    // 获取图片信息
    getImageInfo(filePath) {
      return new Promise(resolve => {
        wx.getFileInfo({
          filePath,
          success(res) {
            wx.getImageInfo({
              src: filePath,
              success(res2) {
                resolve({
                  size: res.size,
                  ...res2
                })
              },
              fail: (res) => {
                console.error('imageInfoError: ' + res.errMsg)
              }
            })
          },
          fail: (err) => {
            console.error('fileInfoError: ' + err.errMsg)
          }
        })
      })
    }

  }
})
