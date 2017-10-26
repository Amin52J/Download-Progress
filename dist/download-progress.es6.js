/**
 * @desc downloadProgress initiator
 * @param files {Array}
 * @event beforeLoading
 * @event afterLoading
 * @event progress
 * @return {downloadProgressObject}
 **/
class downloadProgress {

  /**
   * @desc downloadProgress constructor
   * @param files {Array}
   **/
  constructor(files) {
    this.files = files;
    this.filesLength = files.length;
    this.percentages = {};
    this.percentage = 0;
    this.events = {
      beforeLoading: new Event('beforeLoading'),
      afterLoading: function (response, url) {
        return new CustomEvent('afterLoading', {detail: {response: response, url: url}})
      },
      progress: function (percentage) {
        return new CustomEvent('progress', {detail: percentage})
      }
    };
  }

  /**
   * @desc the callback that gets called on update progress
   * @param url {String}
   * @param oEvent {Object}
   **/
  _downloadProgressUpdateProgress(url, oEvent) {
    let percentComplete = oEvent.lengthComputable ? oEvent.loaded / oEvent.total : oEvent.loaded / oEvent.target.getResponseHeader('x-decompressed-content-length');
    let totalPercentage = 0;
    let key;
    this.percentages[url] = percentComplete;
    for (key in this.percentages) {
      totalPercentage += this.percentages[key];
    }
    this.percentage = (totalPercentage / this.filesLength) * 100;
    document.dispatchEvent(this.events.progress(this.percentage));
  }

  /**
   * @desc gets the target file and sends the responseText back
   * @param index {Number}
   **/
  _downloadProgressInclude(index) {
    let req = new XMLHttpRequest();
    let url = this.files[index];
    req.addEventListener("progress", this._downloadProgressUpdateProgress.bind(this, url));
    req.open("GET", url);
    req.onreadystatechange = (function (index) {
      if ((req.status === 200) && (req.readyState === 4)) {
        document.dispatchEvent(this.events.afterLoading(req.responseText, this.files[index]));
      }
    }).bind(this, index);
    req.send();
  }

  /**
   * @desc attaches the callback to the given even
   * @param event {Object}
   * @param callback {Function}
   * @return {downloadProgressObject}
   **/
  on(event, callback) {
    document.addEventListener(event, callback, false);
    return this;
  };

  /**
   * @desc initializes the loading
   * @return {downloadProgressObject}
   **/
  init() {
    document.dispatchEvent(this.events.beforeLoading);
    let i = 0;
    for (; i < this.filesLength; i++) {
      this.percentages[this.files[i]] = 0;
      this._downloadProgressInclude(i);
    }
    return this;
  };
}

export default DownloadProgress = files => new downloadProgress(files);