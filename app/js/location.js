/*****************************/
var map = new AMap.Map("container", {
    resizeEnable: true,
    zoom: 18
}),lnglatXY; //已知点坐标

var geolocation;
//加载地图，调用浏览器定位服务

map.plugin('AMap.Geolocation', function() {
    geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        buttonPosition:'RB'
    });
    map.addControl(geolocation);
    geolocation.getCurrentPosition();
    AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
});
//解析定位结果
function onComplete(data) {
    lnglatXY = [data.position.getLng(),data.position.getLat()];
    regeocoder();
}

function regeocoder() {  //逆地理编码
    var geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: "all"
    });
    geocoder.getAddress(lnglatXY, function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
            geocoder_CallBack(result);
        }
    });
    var marker = new AMap.Marker({  //加点
        map: map,
        position: lnglatXY
    });
    map.setFitView();
}
function geocoder_CallBack(data) {
    var address = data.regeocode.formattedAddress; //返回地址描述
    alert(address);
}