# Download Progress
A small, low-level library to create awesome file download progress bars. 

### How to start?

* Install using npm `npm install download-progress`
* If using ECMAScript 6 then `import DownloadProgress from 'download-progress'` then `DownloadProgress(filesToLoad)`
* If using ECMAScript 5 then include `<script src="[PATH-TO-FILE]/download-progress.js"></script>` in the head of your index.html then `DownloadProgress(filesToLoad)`

### How to use?

    //set up the library
    var files = ['myJS.js','myCSS.css','myText.txt'];
    var dp = DownloadProgress(files);
    
    //add event listeners
    dp.on('progress',function(e){
        console.log(e.detail + ' combined percentage loaded!');
    }).on('afterLoading',function(e){
        console.log(e.detail.url + ' is completely loaded!');
        console.log(e.detail.response); //this is the content of the loaded file
    });
    
    //initialize
    dp.init();
    
### Methods
* **on**: Attaches a callback to one of the events
* **init**: Initializes the loading process
    
### Events

* **beforeLoading**: Dispatches right before the download process starts
* **afterLoading**: Dispatches once after each url is completely loaded
* **progress**: Dispatches when the progress value (the percentage) changes

### NOTE

For seeing the progress of gzip files you need to set a header for the file in the backend api called `x-decompressed-content-length` so that Download Progress can get the uncompressed file size and calculate the progress.

#### Feel free to contribute, leave suggestion or issues. 

## License

This project is licensed under the [MIT License](https://raw.githubusercontent.com/Amin52J/Page-Loading/master/LICENSE).