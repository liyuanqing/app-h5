/**
 * 创建图片上传控件
 * @param wrap string  上传控件div的 id
 * @param fileNumLimit int 文件数量限制
 * @param fileSizeLimit int 文件大小限制
 * @param fileSingleSizeLimit int 单文件大小限制
 * @param showPDF bool 是否显示pdf 默认false
 */
function createUploader(wrap, fileNumLimit, fileSizeLimit, fileSingleSizeLimit,showPDF) {
    //showPDF = showPDF?showPDF:false;
    showPDF = showPDF || false;


    var $ = jQuery,    // just in case. Make sure it's not an other libaray.

        $wrap = $(wrap),

    // 图片容器
        $queue = $('<ul class="filelist"></ul>')
            .appendTo($wrap.find('.queueList')),

    // 状态栏，包括进度和控制按钮
        $statusBar = $wrap.find('.statusBar'),

    // 文件总体选择信息。
        $info = $statusBar.find('.info'),

    // 上传按钮
        $upload = $wrap.find('.uploadBtn'),

    // 没选择文件之前的内容。
        $placeHolder = $wrap.find('.placeholder'),

    // 总体进度条
        $progress = $statusBar.find('.progress').hide(),

    // 添加的文件数量
        fileCount = 0,

    // 添加的文件总大小
        fileSize = 0,

    // 优化retina, 在retina下这个值是2
        ratio = window.devicePixelRatio || 1,

    // 缩略图大小
        thumbnailWidth = 104 * ratio,
        thumbnailHeight = 132 * ratio,

    // 可能有pedding, ready, uploading, confirm, done.
        state = 'pedding',

    // 所有文件的进度信息，key为file id
        percentages = {},

        supportTransition = (function () {
            var s = document.createElement('p').style,
                r = 'transition' in s ||
                    'WebkitTransition' in s ||
                    'MozTransition' in s ||
                    'msTransition' in s ||
                    'OTransition' in s;
            s = null;
            return r;
        })(),

    // WebUploader实例
        uploader;

    if (!WebUploader.Uploader.support()) {
        alert('Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
        throw new Error('WebUploader does not support the browser you are using.');
    }

    var fileType = 'jpg,jpeg,png';
    var accept = {};
    if(showPDF){
        accept = {
            title: 'Images',
            extensions: fileType + ',pdf',
            mimeTypes: 'image/*,.pdf'
        };
    }else{
        accept = {
            title: 'Images',
            extensions: fileType,
            mimeTypes: 'image/*,'
        };
    }
    // 实例化
    uploader = WebUploader.create({
        pick: {
            id: wrap+' .filePicker',
            label: '点击选择图片'
        },
        dnd: wrap+' .queueList',
        paste: document.body,

        accept: accept,

        // swf文件路径 TODO swf
        // swf: BASE_URL + '/js/Uploader.swf',

        disableGlobalDnd: true,

        chunked: true,
        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false,
        // server: 'http://webuploader.duapp.com/server/fileupload.php',
        server: 'http://2betop.net/fileupload.php', // 图片上传地址
        fileNumLimit: fileNumLimit,  //文件数量
        fileSizeLimit: fileSizeLimit * 1024 * 1024,    // 200 M
        fileSingleSizeLimit: fileSingleSizeLimit * 1024 * 1024    // 50 M
    });

    // 添加“添加文件”的按钮，
    uploader.addButton({
        id: wrap+' .filePicker2',
        label: '添加图片'
    });

    // 当有文件添加进来时执行，负责view的创建
    function addFile(file) {
        var $li = $('<li id="' + file.id + '">' +

                '<p class="imgWrap"></p>' +
                '<p class="progress"><span></span></p>' +
                '<p class="title">' + file.name + '</p>' +
                '</li>'),

            $btns = $('<div class="file-panel">' +
                '<span class="cancel">删除</span>' +
                '<span class="rotateRight">向右旋转</span>' +
                '<span class="rotateLeft">向左旋转</span></div>').appendTo($li),
            $prgress = $li.find('p.progress span'),
            $wrap = $li.find('p.imgWrap'),
            $info = $('<p class="error"></p>'),

            showError = function (code) {
                switch (code) {
                    case 'exceed_size':
                        text = '文件大小超出';
                        break;

                    case 'interrupt':
                        text = '上传暂停';
                        break;

                    default:
                        text = '上传失败，请重试';
                        break;
                }

                $info.text(text).appendTo($li);
            };

        if (file.getStatus() === 'invalid') {
            showError(file.statusText);
        } else {
            // @todo lazyload
            $wrap.text('预览中');
            uploader.makeThumb(file, function (error, src) {
                if (error) {
                    $wrap.text('不能预览');
                    return;
                }

                var img = $('<img src="' + src + '">');
                $wrap.empty().append(img);
            }, thumbnailWidth, thumbnailHeight);

            percentages[file.id] = [file.size, 0];
            file.rotation = 0;
        }

        file.on('statuschange', function (cur, prev) {
            if (prev === 'progress') {
                $prgress.hide().width(0);
            } else if (prev === 'queued') {
                // TODO 上传失败
                //$li.off('mouseenter mouseleave');
                //$btns.remove();
            }

            // 成功
            if (cur === 'error' || cur === 'invalid') {
                console.log(file.statusText);
                showError(file.statusText);
                percentages[file.id][1] = 1;
            } else if (cur === 'interrupt') {
                showError('interrupt');
            } else if (cur === 'queued') {
                percentages[file.id][1] = 0;
            } else if (cur === 'progress') {
                $info.remove();
                $prgress.css('display', 'block');
            } else if (cur === 'complete') {
                $li.append('<span class="success"></span>');
            }

            $li.removeClass('state-' + prev).addClass('state-' + cur);
        });

        $li.on('mouseenter', function () {
            $btns.stop().animate({height: 30});
        });

        $li.on('mouseleave', function () {
            $btns.stop().animate({height: 0});
        });

        $btns.on('click', 'span', function () {
            var index = $(this).index(),
                deg;

            switch (index) {
                case 0:
                    uploader.removeFile(file);
                    return;

                case 1:
                    file.rotation += 90;
                    break;

                case 2:
                    file.rotation -= 90;
                    break;
            }

            if (supportTransition) {
                deg = 'rotate(' + file.rotation + 'deg)';
                $wrap.css({
                    '-webkit-transform': deg,
                    '-mos-transform': deg,
                    '-o-transform': deg,
                    'transform': deg
                });
            } else {
                $wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');
                // use jquery animate to rotation
                // $({
                //     rotation: rotation
                // }).animate({
                //     rotation: file.rotation
                // }, {
                //     easing: 'linear',
                //     step: function( now ) {
                //         now = now * Math.PI / 180;

                //         var cos = Math.cos( now ),
                //             sin = Math.sin( now );

                //         $wrap.css( 'filter', "progid:DXImageTransform.Microsoft.Matrix(M11=" + cos + ",M12=" + (-sin) + ",M21=" + sin + ",M22=" + cos + ",SizingMethod='auto expand')");
                //     }
                // });
            }


        });

        $li.appendTo($queue);
    }

    // 负责view的销毁
    function removeFile(file) {
        var $li = $('#' + file.id);

        delete percentages[file.id];
        updateTotalProgress();
        $li.off().find('.file-panel').off().end().remove();
    }

    function updateTotalProgress() {
        var loaded = 0,
            total = 0,
            spans = $progress.children(),
            percent;

        $.each(percentages, function (k, v) {
            total += v[0];
            loaded += v[0] * v[1];
        });

        percent = total ? loaded / total : 0;

        spans.eq(0).text(Math.round(percent * 100) + '%');
        spans.eq(1).css('width', Math.round(percent * 100) + '%');
        updateStatus();
    }

    function updateStatus() {
        var text = '', stats;

        if (state === 'ready') {
            text = '选中' + fileCount + '张图片，共' +
                WebUploader.formatSize(fileSize) + '。';
        } else if (state === 'confirm') {
            stats = uploader.getStats();
            if (stats.uploadFailNum) {
                text = '已成功上传' + stats.successNum + '张图片，' +
                    stats.uploadFailNum + '张图片上传失败</a>'
            }

        } else {
            stats = uploader.getStats();
            text = '共' + fileCount + '张（' +
                WebUploader.formatSize(fileSize) +
                '），已上传' + stats.successNum + '张';

            if (stats.uploadFailNum) {
                text += '，失败' + stats.uploadFailNum + '张';
            }
        }

        $info.html(text);
    }

    function setState(val) {
        var file, stats;

        if (val === state) {
            return;
        }

        $upload.removeClass('state-' + state);
        $upload.addClass('state-' + val);
        state = val;

        switch (state) {
            case 'pedding':
                //$placeHolder.removeClass('element-invisible');
                $queue.parent().removeClass('filled');
                // $queue.hide();
                //$statusBar.addClass('element-invisible');
                uploader.refresh();
                break;

            case 'ready':
                //$placeHolder.addClass('element-invisible');
                //$('#filePicker2').removeClass('element-invisible');
                $queue.parent().addClass('filled');
                // $queue.show();
                //$statusBar.removeClass('element-invisible');
                uploader.refresh();
                break;

            case 'uploading':
                //$('#filePicker2').addClass('element-invisible');
                $progress.show();
                $upload.text('暂停上传');
                break;

            case 'paused':
                $progress.show();
                $upload.text('继续上传');
                break;

            case 'confirm':
                $progress.hide();
                $upload.text('开始上传');
                //$upload.text('开始上传').addClass('disabled');//不禁用

                stats = uploader.getStats();
                if (stats.successNum && !stats.uploadFailNum) {
                    setState('finish');
                    return;
                }
                break;
            case 'finish':
                stats = uploader.getStats();
                if (stats.successNum) {
                    alert('上传成功');
                } else {
                    // 没有成功的图片，重设
                    state = 'done';
                    location.reload();
                }
                break;
        }

        updateStatus();
    }

    uploader.onUploadProgress = function (file, percentage) {
        var $li = $('#' + file.id),
            $percent = $li.find('.progress span');

        $percent.css('width', percentage * 100 + '%');
        percentages[file.id][1] = percentage;
        updateTotalProgress();
    };

    uploader.onFileQueued = function (file) {
        fileCount++;
        fileSize += file.size;

        if (fileCount === 1) {
            $placeHolder.addClass('element-invisible');
            $statusBar.show();
        }

        addFile(file);
        setState('ready');
        updateTotalProgress();
    };

    uploader.onFileDequeued = function (file) {
        fileCount--;
        fileSize -= file.size;

        if (!fileCount) {
            setState('pedding');
        }

        removeFile(file);
        updateTotalProgress();

    };

    uploader.on('all', function (type) {
        var stats;
        switch (type) {
            case 'uploadFinished':
                setState('confirm');
                break;

            case 'startUpload':
                setState('uploading');
                break;

            case 'stopUpload':
                setState('paused');
                break;

        }
    });

    uploader.onError = function (code) {
        var msg = '';
        switch (code) {
            case 'F_DUPLICATE':
                msg = '文件重复选择';
                break;
            case 'F_EXCEED_SIZE':
                msg = '单文件大小不能超过'+fileSingleSizeLimit+'M';
                break;
            case 'Q_EXCEED_SIZE_LIMIT':
                msg = '文件总大小不能超过'+fileSizeLimit+'M';
                break;
            case 'Q_EXCEED_NUM_LIMIT':
                msg = '文件数量不能超过'+fileNumLimit+'个';
                break;
            case 'Q_TYPE_DENIED':
                msg = '请上传'+fileType+'格式图片';
                break;
            default :
                msg = code;
                break;
        }
        alert(msg);
    };

    $upload.on('click', function () {
        if ($(this).hasClass('disabled')) {
            return false;
        }

        if (state === 'ready') {
            uploader.upload();
        } else if (state === 'paused') {
            uploader.upload();
        } else if (state === 'uploading') {
            uploader.stop();
        }
    });

    $info.on('click', '.retry', function () {
        uploader.retry();
    });

    $info.on('click', '.ignore', function () {
        alert('todo');
    });

    $upload.addClass('state-' + state);
    updateTotalProgress();
}
