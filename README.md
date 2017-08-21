# app-h5
## how to use
* npm install git@github.com:liyuanqing/app-h5.git
* 本项目采用scss,可使用koala将scss转化为css
## app-h5>app
* 采用rem单位进行适配
* 对不同的屏幕大小设置相应的基础fontsize,具体设置见[_media.scss](./app/scss/_media.scss)
* 展示了一些常用的移动端组件（头，底，弹出框，错误提示等）
### good point
* 对多屏幕进行适配，可自由设置相应屏幕下的适配规则（采用媒体查询，设置不同屏幕下的基础fontsize）

## app-h5>activity
* 以一个活动页为例展示了如何用js进行移动端的适配
### good point
* 操作简单，在头部添加几行js代码即可
* 可自动检测屏幕宽度，对页面进行适配
* 可完美100%还原设计稿
### bad point
* 在大屏幕时，由于设置的基础fontsize很大，导致页面放大很多
* 不能通过meta标签进行禁止缩放
