# 项目介绍

## 主架构 uniapp

###	介绍 
-	组件使用easycom模式 cl-*(可在pages里面修改)

###	plugins  
-	路由 ->  [uni-simple-router](https://hhyang.cn/v2/)
-	ui框架 ->  [uview](http://uviewui.com/)
-	api请求 ->  [uview自带api请求](http://uviewui.com/js/http.html)
-	图标 ->  [Iconfont](https://www.iconfont.cn/)

###	项目结构

```
├─common
│  ├─config 			// 环境配置 (设置baseurl等)
│  ├─http.api 			// 请求接口
│  ├─extend 			// 扩展原型方法
│  ├─filters 			// 全局过滤器
│  ├─tools 				// 全局公共方法
│  ├─router 			// 路由文件
│  └─http.interceptor 	// 拦截器
├─components
│  ├─cl-test			// easycom测试组件 (示例使用可删除)
│  └─cl-icon			// iconfont图标库
├─store			
│  ├─$u.mixin			// 混入方法
│  └─index				// vuex
└─uview-ui				// uview
```

### 自定义环境配置

 [官方文档示例](https://uniapp.dcloud.io/collocation/package)，目前已配置了H5与微信小程序，其他自行配置即可。

![avatar](https://z3.ax1x.com/2021/06/09/2671JJ.png)

![avatar](https://z3.ax1x.com/2021/06/09/267Rw8.png)

###	Iconfont 注意事项

1. 在阿里矢量图标库创建项目
2. 添加你所需要使用的图标文件
3. 下载文件到本地后替换components/cl-icon里面的文件


### Iconfont示例

iconfont库中修改示例:

![avatar](https://z3.ax1x.com/2021/07/19/WJa9w6.png)

代码示例:

```
	<cl-icon type="test" size="30" color="#000000"></cl-icon>
```


### 依赖安装

安装之前请移除下载后自带的package.json 使用下面代码安装依赖即可运行

```
npm init -y
npm i uni-simple-router uni-read-pages
```

### 仓库
[gitee](https://gitee.com/ChenMuShan/uniapp-template) 

### 贡献者
[风筝](https://gitee.com/zslgodex)
[陈木杉](https://gitee.com/ChenMuShan)
