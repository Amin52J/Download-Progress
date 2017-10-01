/**
 * @desc downloadProgress initiator
 * @param files {Array}
 * @event beforeLoading
 * @event afterLoading
 * @event progress
 * @return {downloadProgressObject}
 **/
var DownloadProgress = (function (files) {

  /**
   * @desc downloadProgress constructor
   * @param files {Array}
   **/
  var constructor = (function (files) {
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
  });

  /**
   * @desc the callback that gets called on update progress
   * @param url {String}
   * @param oEvent {Object}
   **/
  function _downloadProgressUpdateProgress(url, oEvent) {
    if (oEvent.lengthComputable) {
      var percentComplete = oEvent.loaded / oEvent.total;
      var totalPercentage = 0;
      var key;
      this.percentages[url] = percentComplete;
      for (key in this.percentages) {
        totalPercentage += this.percentages[key];
      }
      this.percentage = (totalPercentage / this.filesLength) * 100;
      document.dispatchEvent(this.events.progress(this.percentage));
    }
  }

  /**
   * @desc gets the target file and sends the responseText back
   * @param index {Number}
   **/
  function _downloadProgressInclude(index) {
    var req = new XMLHttpRequest();
    var url = this.files[index];
    req.addEventListener("progress", _downloadProgressUpdateProgress.bind(this, url));
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
  constructor.prototype.on = function (event, callback) {
    document.addEventListener(event, callback, false);
    return this;
  };

  /**
   * @desc initializes the loading
   * @return {downloadProgressObject}
   **/
  constructor.prototype.init = function () {
    document.dispatchEvent(this.events.beforeLoading);
    var i = 0;
    for (; i < this.filesLength; i++) {
      this.percentages[this.files[i]] = 0;
      (function (index) {
        _downloadProgressInclude.call(this, index);
      }).call(this, i);
    }
    return this;
  };

  return new constructor(files);
});