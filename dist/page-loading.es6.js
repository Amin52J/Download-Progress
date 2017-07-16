/**
 * @desc pageLoading initiator
 * @param files {Array}
 * @event beforeLoading
 * @event afterLoading
 * @event progress
 * @return {pageLoadingObject}
 **/
export default class PageLoading {

  /**
   * @desc pageLoading constructor
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
  _pageLoadingUpdateProgress(url, oEvent) {
    if (oEvent.lengthComputable) {
      let percentComplete = oEvent.loaded / oEvent.total;
      let totalPercentage = 0;
      let key;
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
  _pageLoadingInclude(index) {
    let req = new XMLHttpRequest();
    let url = this.files[index];
    req.addEventListener("progress", this._pageLoadingUpdateProgress.bind(this, url));
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
   * @return {pageLoadingObject}
   **/
  on(event, callback) {
    document.addEventListener(event, callback, false);
    return this;
  };

  /**
   * @desc initializes the loading
   * @return {pageLoadingObject}
   **/
  init() {
    document.dispatchEvent(this.events.beforeLoading);
    let i = 0;
    for (; i < this.filesLength; i++) {
      this.percentages[this.files[i]] = 0;
      this._pageLoadingInclude(i);
    }
    return this;
  };
}