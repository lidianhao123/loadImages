/**
 * @version 1.0.0
 * @DATE: 2016-02-03
 * @author Lidian, dainli@outlook.com
 *
 * @description loadImages can preload images and after each image load completed can callback process
 * @param  {object} options - past setting parameters
 * @param  {string[]} options.data - images url array
 * @callback options.step - each step callback function
 *          @param {number} - process number
 * @callback options.complete - all images are loaded
 * @param {boolean} needOneStep - increase by 1 each time
 * @param {string} path - images data string common path
 * @return {boolean}
 * @example
 * loadImages({
 *      data:["1.png", "2.png", "3.png"],
 *      step:function(num){},
 *      compelte: function(){},
 *      needOneStep: true,
 *      path:"/images"
 * });
 * //images path will be "/images/1.png" and so on
 */
(function(w){
    function loadImages(options){
        var len = 0,             //资源总数
            index = 0,           //循环资源数组用
            curIndex = 0,        //记录当前加载完成资源个数
            stepTimer = null,    //记录当前setTimeout对象句柄 
            stepTimeValue = 5,  //步进时间间隔
            percentageValue = 0, //当前百分比
            targetPercent = 0,   //目标百分比
            data = options.data || [],
            step = options.step || function(){},
            complete = options.complete || function(){},
            needOneStep = options.needOneStep || false,
            path = options.path || false;

        if(typeof data !== "object" || data.length === 0){
            step(100);
            return false;
        }

        len = data.length;
        if(path){
            for(var i = len-1; i>-1; i--){
                data[i] = path + data[i];
                console.info(data[i])
            }
        }

        var processStep = function (){
            percentageValue++;
            // console.info("processStep = ",percentageValue)
            step(percentageValue);
            if(percentageValue < targetPercent){
                stepTimer = setTimeout(function (){
                    processStep();
                }, stepTimeValue);
            } else if(targetPercent === 100 && percentageValue === targetPercent){
                if(complete && typeof complete === "function"){
                    complete();
                }
            }
        }

        function onload(){
            curIndex++;
            targetPercent = Math.floor(curIndex/len*100);
            if(needOneStep){
                if(stepTimer){
                    clearTimeout(stepTimer);
                }
                processStep();
            } else{
                step(targetPercent);
                if(targetPercent === 100){
                    complete();
                }
            }
        }

        for(index; index < len; index++){
            var strUrl = data[index];
            (new loadImageItem(strUrl, onload)).start();
        }
    }
    /**
     * @name loadImageItem
     * @param  {string} url - images full url
     * @callback cb - called when load image completed
     */
    function loadImageItem(url, cb){
        var self = this;
        
        this.img = new Image();

        //readyState为complete和loaded则表明图片已经加载完毕。测试IE6-IE10支持该事件，其它浏览器不支持。
        var onReadyStateChange = function(){
            removeEventHandlers();
            console.info("onReadyStateChange");
            cb(this, "onReadyStateChange");
        };

        var onError = function(){
            console.info("onError");
            removeEventHandlers();
            cb(this, "onError");
        };

        var onLoad = function(){
            removeEventHandlers();
            cb(this, "onload");
        };

        var removeEventHandlers = function() {
            self.unbind('load', onLoad);
            self.unbind('readystatechange', onReadyStateChange);
            self.unbind('error', onError);
        };

        this.start = function(){
            this.bind('load', onLoad);
            this.bind('readystatechange', onReadyStateChange);
            this.bind('error', onError);

            this.img.src = url;
            if(self.img.complete){
                removeEventHandlers();
                cb(this, "onload");
            }
        }
    }

    /**
     * @name bind
     * @description cross-browser event binding
     * @param  {string} eventName
     * @param  {function} eventHandler
     */
    loadImageItem.prototype.bind = function(eventName, eventHandler) {
        if (this.img.addEventListener) {
            this.img.addEventListener(eventName, eventHandler, false);
        } else if (this.img.attachEvent) {
            this.img.attachEvent('on' + eventName, eventHandler);
        }
    };

    /**
     * @name unbind
     * @description cross-browser event un-binding
     * @param  {string} eventName
     * @param  {function} eventHandler
     */
    loadImageItem.prototype.unbind = function(eventName, eventHandler) {
        if (this.img.removeEventListener) {
            this.img.removeEventListener(eventName, eventHandler, false);
        } else if (this.img.detachEvent) {
            this.img.detachEvent('on' + eventName, eventHandler);
        }
    };

    // AMD module support
    if (typeof define === 'function' && define.amd) {
        define('loadImages', [], function() {
            return loadImages;
        });
    }
    w.loadImages = loadImages;
})(window);
