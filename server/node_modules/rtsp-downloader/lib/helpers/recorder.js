//
//  recorder.js
//  rtsp-downloader
//

const moment = require('moment')
const childProcess = require('child_process')
const path = require('path')
const FileHandler = require('./fileHandler')

const fh = new FileHandler()

const RTSPRecorder = class {
  constructor(config = {}) {
    this.config = config
    this.name = config.name
    this.url = config.url
    this.folderSizeLimit = config.folderSizeLimit || 30; // 单位 G
    this.timeLimit = config.timeLimit || 60
    this.folder = config.folder || 'media/'
    this.categoryType = config.type || 'video'
    this.directoryPathFormat = config.directoryPathFormat || 'MMM-Do-YY'
    this.fileNameFormat = config.fileNameFormat || 'YYYY-M-D-h-mm-ss'
    fh.createDirIfNotExists(this.getDirectoryPath())
    fh.createDirIfNotExists(this.getTodayPath())
  }

  getFolderSizeLimit() {
    return Math.pow(2, 30) * this.folderSizeLimit;
  }

  getDirectoryPath() {
    return path.join(this.folder, (this.name ? this.name : ''))
  }

  getTodayPath() {
    return path.join(this.getDirectoryPath(), moment().format(this.directoryPathFormat))
  }

  getMediaTypePath() {
    return path.join(this.getTodayPath(), this.categoryType)
  }

  getFilename(folderPath) {
    return path.join(folderPath, moment().format(this.fileNameFormat) + this.getExtenstion())
  }

  getExtenstion() {
    if (this.categoryType === 'audio') {
      return '.avi'
    }
    if (this.categoryType === 'image') {
      return '.jpg'
    }

    return '.mp4'
  }

  getArguments() {
    if (this.categoryType === 'audio') {
      return ['-vn', '-acodec', 'copy']
    }
    if (this.categoryType === 'image') {
      return ['-vframes', '1']
    }
    return ['-acodec', 'copy', '-vcodec', 'copy']
  }

  getChildProcess(fileName) {
    var args = ['-i', this.url]
    const mediaArgs = this.getArguments()
    mediaArgs.forEach((item) => {
      args.push(item)
    })
    args.push(fileName)
    return childProcess.spawn('ffmpeg',
      args,
      { detached: false, stdio: 'ignore' })
  }

  stopRecording() {
    this.disableStreaming = true
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    if (this.writeStream) {
      this.killStream()
    }
  }

  startRecording() {
    if (!this.url) {
      console.log('URL Not Found.')
      return true
    }
    this.recordStream()
  }

  captureImage(cb) {
    this.writeStream = null
    const folderPath = this.getMediaTypePath()
    fh.createDirIfNotExists(folderPath)
    const fileName = this.getFilename(folderPath)
    this.writeStream = this.getChildProcess(fileName)
    this.writeStream.once('exit', () => {
      if (cb) {
        cb()
      }
    })
  }

  killStream() {
    this.writeStream.kill()
  }

  recordStream() {
    if (this.categoryType === 'image') {
      return
    }
    const self = this
    if (this.timer) {
      clearTimeout(this.timer)
    }

    fh.createDirIfNotExists(this.getDirectoryPath())
    fh.createDirIfNotExists(this.getTodayPath())

    if (this.writeStream && this.writeStream.binded) {
      return false
    }

    if (this.writeStream && this.writeStream.connected) {
      this.writeStream.binded = true
      this.writeStream.once('exit', () => {
        // 记录之前先检查是否文件夹大小溢出

        self.deleteMp4TillSizeLimit(() => {
          self.recordStream()
        });
        // self.recordStream();
      })
      this.killStream();
      return false
    }

    this.writeStream = null
    const folderPath = this.getMediaTypePath()
    fh.createDirIfNotExists(folderPath)
    const fileName = this.getFilename(folderPath)
    this.writeStream = this.getChildProcess(fileName)

    this.writeStream.once('exit', () => {
      if (self.disableStreaming) {
        return true
      }

      self.deleteMp4TillSizeLimit(() => {
        self.recordStream()
      });
      // self.recordStream();

    })
    this.timer = setTimeout(self.killStream.bind(this), this.timeLimit * 1000)

    console.log('Start record ' + fileName)
  }

  deleteMp4TillSizeLimit(callback) {
    let self = this;
    fh.getDirectorySize(self.folder, (err, value) => {
      console.log("文件夹大小:" + value + " 文件大小配置:" + self.getFolderSizeLimit());
      if (value >= self.getFolderSizeLimit()) {
        fh.deleteOldestMp4(self.folder, (err) => {
          if (err) throw err;
          self.deleteMp4TillSizeLimit(callback);
        });
      } else {
        callback();
      }
    });

  }
}

module.exports = RTSPRecorder
// vim:ts=2:sw=2:sts=2
