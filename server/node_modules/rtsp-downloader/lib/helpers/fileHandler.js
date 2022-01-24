const fs = require('fs')
const rimraf = require('rimraf')
const du = require('du')
const find = require('find');
const path = require("path");

const FileHandler = class {
  createDirIfNotExists(folderPath) {
    let self = this;
    try {
      if (!fs.lstatSync(folderPath).isDirectory()) {
        self.mkdirsSync(folderPath);
      }
    } catch (e) {
      self.mkdirsSync(folderPath);
    }
  }

  mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (this.mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
  }

  removeDirectory(folderPath, callback) {
    rimraf(folderPath, callback)
  }

  getDirectorySize(folderPath, callback) {
    du(folderPath, (err, size) => {
      callback(err, size)
    })
  }

  findOldestMp4(folderPath, callback) {
    find.file(/\.mp4/, folderPath, function(files) {
      let allFileArr = [];
      let cursorFile = false;
      let cursorBirthtime = Date.now();

      files.forEach((file,v) => {
        if(fs.statSync(file).birthtimeMs < cursorBirthtime) {
          cursorFile = file;
          cursorBirthtime = fs.statSync(file).birthtimeMs;
        }
      });
      callback(cursorFile);
    })
  }

  deleteOldestMp4(folderPath, callback) {
    this.findOldestMp4(folderPath, function(file){
      file ? (function(){
        fs.unlink(file, callback);
      })() : callback(new Error("文件为空"));
    });
  }

}

module.exports = FileHandler
// vim:ts=2:sw=2:sts=2
