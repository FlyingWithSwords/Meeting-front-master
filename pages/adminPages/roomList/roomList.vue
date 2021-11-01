<template>
	<view class="content">
		<form ref="form" @reset="formReset" style="z-index: 966;">
			<view class="uni-list-cell-db" style="background: #fff;height: 40px;margin: 0;border-bottom: 1rpx solid #eee;">
				<picker @change="bindPickerCity" @columnchange="columnchange" :range="array_c" range-key="name" :value="value_c" mode="multiSelector" style="margin-left:5px;float: left;border: #ccc solid 1px;background: #fff;border-radius: 1em;height: 30px;width: 120px;">
					<view v-if="indexLs_c[0]==-1 || indexLs_c[1]==-1" class="uni-input" style="color: #888;background: #0000;line-height: 15px;">请选择></view>
					<view v-else class="uni-input" style="background: #0000;line-height: 15px;">{{array_c[0][value_c[0]].name+" "+array_c[1][value_c[1]].name}}</view>
					<view hidden="true"><input type="hidden" name="province" :value="indexLs_c[0]==-1?"":code_res[value_c[0]].code" /></view>
					<view hidden="true"><input type="hidden" name="city" :value="indexLs_c[1]==-1?"":code_res[value_c[0]].cities[value_c[1]].code" /></view>
				</picker>
				<picker @change="bindPickerFloor" :value="index_f" :range="array_f" style="margin-left:5px;float: left;border: #ccc solid 1px;background: #fff; border-radius: 1em;height: 30px;width: 120px;">
					<view v-if="index_f==-1" class="uni-input" style="color: #888;background: #0000;line-height: 15px;">请选择></view>
					<view v-else class="uni-input" style="background: #0000;line-height: 15px;">{{array_f[index_f]}}</view>
					<view hidden="true"><input type="hidden" name="floor" :value="value_f[index_f]" /></view>
				</picker>
				<picker mode="date" :value="date" @change="bindDateChange" style="margin-left:5px;float: left;padding:0 12px; border: #ccc solid 1px;background: #fff;border-radius: 1em;">
					<view class="time-text">{{date}}</view>
				</picker>
				<!-- <u-checkbox name="AllDay" v-model="checked" @change="getCheck()" style="line-height: 30px; margin-left: 12px;" size="22px">全天</u-checkbox> -->
			</view>
		</form>
		<view>
			<!-- <u-tabs :list="tabList" :is-scroll="false" :current="currentTab" @change="changeTab"></u-tabs> -->
			<u-index-list :scrollTop="scrollTop" style="clear: both;" :sticky="false" :index-list="[]">
				<view v-for="(item, index) in roomList" :key="index" :data-index="index"  @mousemove="getClient" @longpress="onLongPress" @contextmenu.prevent="oncontextmenu" :class="{'active':pickerUserIndex==index}" @tap="listTap(item.id)">
					<view class="list-cell roomList">{{item.roomName}}</view>
				</view>
			</u-index-list>
		</view>
		
		<view class="shade" v-show="showShade" @tap="hidePop">
			<view class="pop" :style="popStyle" :class="{'show':showPop}">
				<view v-for="(item,index) in popButton" :key="index" @tap="pickerMenu" :data-index="index">{{item}}</view>
			</view>
		</view>
		
		<u-tabbar v-model="currentTarbar" :list="tarbarList"></u-tabbar>
	</view>
</template>

<script>
	import urlConfig from "../../../common/config.js";
	let selectVal = ['','',''];
	const arrayKw = [];
	const recKw = new Array(arrayKw.length);
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			},"");
			const currentTime = this.getTime();
			return {
				url_pre: urlConfig.baseUrl,
				tarbarList: [{
						iconPath: "file-text",
						selectedIconPath: "file-text-fill",
						text: '会议室列表',
						count: 0,
						isDot: true,
						customIcon: false,
						pagePath: '/pages/adminPages/roomList/roomList'
					},
					{
						iconPath: "chat",
						selectedIconPath: "chat-fill",
						text: '会议列表',
						count: 0,
						isDot: true,
						customIcon: false,
						pagePath: '/pages/adminPages/meetList/meetList'
					},
					{
						iconPath: "plus-circle",
						selectedIconPath: "plus-circle-fill",
						text: '新增会议室',
						count: 0,
						isDot: false,
						customIcon: false,
						pagePath: '/pages/adminPages/addRoom/addRoom'
					},
				],
				checked: false,
				array_f: ["全部"],
				value_f: ["all"],
				array_c: [],
				code_c: [],
				value_c: [0, 0],
				indexLs_c: [0, 0],
				index_c: -1,
				index_f: 0,
				date: currentDate,
				currentTarbar: 0,
				currentTab: 0,
				scrollTop: 0,
				roomList: [],
				selectJson: {},
				// allRoomList: [],
				
				ls_clientX: 0,
				ls_clientY: 0,
				
				winSize: {},
				/* 显示遮罩 */
				showShade: false,
				/* 显示操作弹窗 */
				showPop: false,
				/* 弹窗按钮列表 */
				popButton: ["临时关闭", "编辑", "删除"],
				/* 弹窗定位样式 */
				popStyle: "",
				/* 选择的用户下标 */
				pickerUserIndex: -1,
				
				onPageScroll(e) {
					this.scrollTop = e.scrollTop;
				}
			}
			},
			created() {
			    this.initSelected();
			},
		// created() {
		// 	this.roomList = this.allRoomList
		// },
		onLoad() {
			uni.request({
					url: this.url_pre+'/room/list', //接口地址。
					// data: {city: '广州', floor: '1', bookDate: '2021-09-22 14:15:13'},
					method: 'GET',
					header: {
						'content-type': 'application/json' //自定义请求头信息
					},
					success: (res) => {
						var objstr = '[';
						var datalist = res.data.page.list;
						for(var i=0;i<datalist.length;i++){
							objstr+="{\"id\""+": '"+datalist[i].roomEntity.id+"',\"roomName\":\""+datalist[i].roomEntity.name+"\"}";
							if(i!=datalist.length-1){
								objstr+=", ";
							}
						}
						objstr+="]";
						this.roomList=eval("("+objstr+")");
						console.log(res.data);
						console.log('request success');
					},
					fail: (res) => {
						console.log(res.data);
						console.log('request failure');
					}
			});
			uni.request({
					url: this.url_pre+'/sys/dict/info/provCity', //接口地址。
					method: 'GET',
					header: {
						'content-type': 'application/json' //自定义请求头信息
					},
					success: function(res) {
						var objstr = '[{name: \'全部\', \"city\":[{name:\"\"}]},';
						var datalist = res.data.page.list;
						this.code_res = datalist;
						console.log(this.code_res);
						for(var i=0;i<datalist.length;i++){
							objstr+="{name"+": '"+datalist[i].value+"',city:[{";
							for(var j=0;j<datalist[i].cities.length;j++){
								objstr+="name: '"+datalist[i].cities[j].value+"'";
								if(j!=datalist[i].cities.length-1){
									objstr+="},{";
								}
								else{
									objstr+="}]}";
								}
							}
							if(i!=datalist.length-1){
								objstr+=", ";
							}
						}
						objstr+="]";
						this.allAddress=eval("("+objstr+")");
						this.initSelected();
						console.log(this.allAddress);
						console.log('request success');
					}.bind(this),
					fail: (res) => {
						console.log(res.data);
						console.log('request failure');
					}
				});
			uni.request({
					url: this.url_pre+'/sys/dict/info/floor', //接口地址。
					method: 'GET',
					header: {
						'content-type': 'application/json' //自定义请求头信息
					},
					success: (res) => {
						var datalist = res.data.dict.list;
						for(var i=0;i<datalist.length;i++){
							this.array_f.push(datalist[i].value);
							this.value_f.push(datalist[i].code);
						}
						console.log(res.data);
						console.log('request success');
					},
					fail: (res) => {
						console.log(res.data);
						console.log('request failure');
					}
			});
			
			this.getListData();
			this.getWindowSize();
		
			// #ifdef H5
			document.onLong = function(e) {
				var e = e || window.event;
				e.preventDefault();
			};
			// #endif
		},
		methods: {
			// 初始化地址选项
			initSelected() {
			    this.updateSourceDate() // 更新源数据
			    .updateAddressDate() // 更新结果数据
			    .$forceUpdate()  // 触发双向绑定
			},
			// 地址控件改变控件
			columnchange(d) {
			    this.updateSelectIndex(d.detail.column, d.detail.value) // 更新选择索引
			    .updateSourceDate() // 更新源数据
			    .updateAddressDate() // 更新结果数据
			    .$forceUpdate()  // 触发双向绑定
			},
			
			/**
			 * 更新源数据
			 * */
			updateSourceDate() {
			    this.array_c = []
			    this.array_c[0] = this.allAddress.map(obj => {
			        return {
			            name: obj.name
			        }
			    })
			    this.array_c[1] = this.allAddress[this.value_c[0]].city.map(obj => {
			        return {
			            name: obj.name
			        }
			    })
			    // this.array[2] = AllAddress[this.value[0]].city[this.value[1]].area.map(obj => { 
			    //     return {
			    //         name: obj
			    //     }
			    // })
			    return this
			},
			
			/**
			 * 更新索引
			 * */
			updateSelectIndex(column, value){
			    let arr = JSON.parse(JSON.stringify(this.value_c)) 
			    arr[column] = value
			    if(column === 0 ) {
			        arr[1] = 0
			    }
			    this.value_c = arr
			    return this
			},
			
			/**
			 * 更新结果数据 
			 * */
			updateAddressDate() {
			    selectVal[0] = this.array_c[0][this.value_c[0]].name
			    selectVal[1] = this.array_c[1][this.value_c[1]].name
			    // selectVal[2] = this.array[2][this.value[2]].name 
			    return this
			},
			
			/**
			 * 点击确定
			 * */
			bindPickerCity(e) {
				this.indexLs_c=this.value_c;
			    this.$emit('change', {
			        index_c: this.value_c,
			        data: selectVal
			    });
				this.selectJson.city = this.value_c[0]==0?"":this.code_res[this.value_c[0]-1].cities[this.value_c[1]].code;
				if(this.value_c[0]==0){delete this.selectJson.city;}
				uni.request({
				    url: this.url_pre+'room/list',
				    data: this.selectJson,   // 这里传入你的参数(json格式)
				    method: 'GET',
				    header: {
				        'Content-Type': 'application/x-www-form-urlencoded'
				    },
				    dataType: 'json',
				    success: (response) => {
						var objstr = '[';
						var datalist = response.data.page.list;
						for(var i=0;i<datalist.length;i++){
							objstr+="{\"id\""+": '"+datalist[i].roomEntity.id+"',\"roomName\":\""+datalist[i].roomEntity.name+"\"}";
							if(i!=datalist.length-1){
								objstr+=", ";
							}
						}
						objstr+="]";
						this.roomList=eval("("+objstr+")");
				        console.log('请求登录后返回的数据：', response);
				    },
				    fail: (err) => {
				        console.log('登录失败：', err);
				    },
				    complete: (com) => {
				        console.log('请求登录结束：', com);
				    }
				});
			    return this
			},
			bindPickerFloor: function(e) {
				this.index_f = e.target.value;
				this.selectJson.floor = this.value_f[this.index_f];
				if(this.index_f==0){delete this.selectJson.floor;}
				uni.request({
				    url: this.url_pre+'room/list',
				    data: this.selectJson,   // 这里传入你的参数(json格式)
				    method: 'GET',
				    header: {
				        'Content-Type': 'application/x-www-form-urlencoded'
				    },
				    dataType: 'json',
				    success: (response) => {
						var objstr = '[';
						var datalist = response.data.page.list;
						for(var i=0;i<datalist.length;i++){
							objstr+="{\"id\""+": '"+datalist[i].roomEntity.id+"',\"roomName\":\""+datalist[i].roomEntity.name+"\"}";
							if(i!=datalist.length-1){
								objstr+=", ";
							}
						}
						objstr+="]";
						this.roomList=eval("("+objstr+")");
				        console.log('请求登录后返回的数据：', response);
				    },
				    fail: (err) => {
				        console.log('登录失败：', err);
				    },
				    complete: (com) => {
				        console.log('请求登录结束：', com);
				    }
				});
				console.log('picker发送选择改变，携带值为', e.target.value)
			},
			getCheck() {
				console.log(this.checked);
			},
			// changeTab(index) {
			// 	this.currentTab = index;
			// 	if (this.currentTab == 0) {
			// 		this.roomList = this.myRoomList
			// 	} else {
			// 		this.roomList = this.allRoomList
			// 	}
			// },
			bindDateChange: function(e) {
				this.date = this.getDate("",e.target.value);
				this.selectJson.bookDate = this.date+" 00:00:00";
				uni.request({
					url: this.url_pre+'room/list',
					data: this.selectJson,   // 这里传入你的参数(json格式)
					method: 'GET',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					dataType: 'json',
					success: (response) => {
						console.log(this.selectJson);
						var objstr = '[';
						var datalist = response.data.page.list;
						for(var i=0;i<datalist.length;i++){
							objstr+="{\"id\""+": '"+datalist[i].roomEntity.id+"',\"roomName\":\""+datalist[i].roomEntity.name+"\"}";
							if(i!=datalist.length-1){
								objstr+=", ";
							}
						}
						objstr+="]";
						this.roomList=eval("("+objstr+")");
						console.log('请求登录后返回的数据：', response);
					},
					fail: (err) => {
						console.log('登录失败：', err);
					},
					complete: (com) => {
						if(com.data.msg!="success"){
							uni.showToast({
								title: com.data.msg,
								icon: 'none',
								duration: 3000
							});
						}
						console.log('请求登录结束：', com);
					}
				});
				console.log(this.date);
			},
			bindTimeChange: function(e) {
				this.time = e.target.value;
			},
			getTime(){
				const date = new Date();
				let hour = date.getHours();
				let min = (date.getMinutes()<10?"0":"")+date.getMinutes();
				return hour+':'+min;
			},
			getDate(type,value) {
				const date = (value=="")?new Date():new Date(value);
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
			
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			/* 列表触摸事件 */
			listTap(id) {
				/* 因弹出遮罩问题，所以需要在遮罩弹出的情况下阻止列表事件的触发 */
				if (this.showShade) {
					return;
				}
				uni.navigateTo({
					url: "/roomDetail?id="+id
				})
			
				console.log("列表触摸事件触发")
			},
			/* 获取列表数据 */
			getListData() {
				let list = [];
				this.roomList = list;
			},
			/* 获取窗口尺寸 */
			getWindowSize() {
				uni.getSystemInfo({
					success: (res) => {
						this.winSize = {
							"res": res,
							"witdh": res.windowWidth,
							"height": res.windowHeight
						}
					}
				})
			},
			getClient(e) {
				this.ls_clientX=e.clientX;
				this.ls_clientY=e.clientY;
			},
			oncontextmenu(e) {
				var style="";
				
				if (this.ls_clientY > (this.winSize.height / 2)) {
					style = `bottom:${this.winSize.height-this.ls_clientY}px;`;
				} else {
					style = `top:${this.ls_clientY+44}px;`;
				}
				if (this.ls_clientX > (this.winSize.witdh / 2)) {
					style += `right:${this.winSize.witdh-this.ls_clientX}px`;
				} else {
					style += `left:${this.ls_clientX}px`;
				}
				
				this.popStyle = style;
				this.pickerUserIndex = Number(e.currentTarget.dataset.index);
				this.showShade = true;
				this.$nextTick(() => {
					setTimeout(() => {
						this.showPop = true;
					}, 10);
				});
			},
			/* 长按监听 */
			onLongPress(e) {
				let [touches, style, index] = [e.touches[0], "", e.currentTarget.dataset.index];
			
				/* 因 非H5端不兼容 style 属性绑定 Object ，所以拼接字符 */
				if (touches.clientY > (this.winSize.height / 2)) {
					style = `bottom:${this.winSize.height-touches.clientY}px;`;
				} else {
					style = `top:${touches.clientY+44}px;`;
				}
				if (touches.clientX > (this.winSize.witdh / 2)) {
					style += `right:${this.winSize.witdh-touches.clientX}px`;
				} else {
					style += `left:${touches.clientX}px`;
				}
			
				this.popStyle = style;
				this.pickerUserIndex = Number(index);
				this.showShade = true;
				this.$nextTick(() => {
					setTimeout(() => {
						this.showPop = true;
					}, 10);
				});
			},
			/* 隐藏弹窗 */
			hidePop() {
				this.showPop = false;
				this.pickerUserIndex = -1;
				setTimeout(() => {
					this.showShade = false;
				}, 250);
			},
			/* 选择菜单 */
			pickerMenu(e) {
				let index = Number(e.currentTarget.dataset.index);
				console.log(`第${this.pickerUserIndex+1}个会议室,第${index+1}个按钮`);
				// 在这里开启你的代码秀
				
				if(index==0){
					uni.request({
					    url: this.url_pre+'/room/update', //接口地址。
					    data: {id: this.roomList[this.pickerUserIndex].id, state: "unusable"},
					    method: 'POST',
					    header: {
					    	'content-type': 'application/json' //自定义请求头信息
					    },
					    success: (res) => {
					        console.log(res.data);
					        console.log('request success');
					    },
						fail: (res) => {
							console.log(res.data);
							console.log('request failure');
						}
					});
				}
				if(index==1){
					uni.navigateTo({
						url: "/updRoom?id="+this.roomList[this.pickerUserIndex].id
					})
				}
				var ids = new Array();
				ids.push(JSON.stringify(parseInt(this.roomList[this.pickerUserIndex].id)));
				if(index==2){
					uni.request({
					    url: this.url_pre+'/room/delete', //接口地址。
					    data: ids,
					    method: 'POST',
					    header: {
					    	'content-type': 'application/json' //自定义请求头信息
					    },
					    success: (res) => {
					        console.log(res.data);
					        console.log('request success');
					    },
						fail: (res) => {
							console.log(res.data);
							console.log('request failure');
						}
					});
				}
			
				uni.showToast({
					title: `第${this.pickerUserIndex+1}个会议室,第${index+1}个按钮`,
					icon: "none",
					mask: true,
					duration: 600
				});
			
				/* 
				 因为隐藏弹窗方法中会将当前选择的用户下标还原为-1,
				 如果行的菜单方法存在异步情况，请在隐藏之前将该值保存，或通过参数传入异步函数中
				 */
				this.hidePop();
			}
		},
	}
</script>

<style lang="scss" scoped>
	.content {
		background: #f5f5f5;
	}
	.list-cell {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		padding: 10px 24rpx;
		overflow: hidden;
		color: #323233;
		font-size: 14px;
		line-height: 24px;
		background-color: #fff;
	}
	.list-cell:hover{
		background: #eee;
	}

	.my-meeting {
		width: 400rpx;
	}
	
	.time-text {
		height: 30px;
		line-height: 30px;
		margin: 0 1px;
	}
	
	.roomList{
		width: 100%;
		padding: 30rpx;
		border-bottom: 3rpx solid #f0f0f0;
	}
	
	/* 列式弹性盒子 */
	.flex_col {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: center;
		align-content: center;
	}
	
	/* 弹性盒子弹性容器 */
	.flex_col .flex_grow {
		width: 0;
		-webkit-box-flex: 1;
		-ms-flex-positive: 1;
		flex-grow: 1;
	}
	
	.flex_row .flex_grow {
		-webkit-box-flex: 1;
		-ms-flex-positive: 1;
		flex-grow: 1;
	}
	
	/* 弹性盒子允许换行 */
	.flex_col.flex_wrap {
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
	}
	
	/* 列表 */
	.list {
		background-color: #fff;
		font-size: 28upx;
		color: #333;
		user-select: none;
		touch-callout: none;
	
		&>view {
			padding: 24upx 30upx;
			position: relative;
	
			&:active,
			&.active {
				background-color: #f3f3f3;
			}
	
			image {
				height: 80upx;
				width: 80upx;
				border-radius: 4px;
				margin-right: 20upx;
			}
	
			&>view {
				line-height: 40upx;
	
				.time,
				.info {
					color: #999;
					font-size: 24upx;
				}
	
				.time {
					width: 150upx;
					text-align: right;
				}
	
				.info {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	
		&>view:not(:first-child) {
			margin-top: 1px;
	
			&::after {
				content: '';
				display: block;
				height: 0;
				border-top: #CCC solid 1px;
				width: 620upx;
				position: absolute;
				top: -1px;
				right: 0;
				transform:scaleY(0.5);	/* 1px像素 */
			}
		}
	}
	
	/* 遮罩 */
	.shade {
		position: fixed;
		z-index: 100;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		-webkit-touch-callout: none;
	
		.pop {
			position: fixed;
			z-index: 101;
			width: 200upx;
			box-sizing: border-box;
			font-size: 28upx;
			text-align: left;
			color: #333;
			background-color: #fff;
			box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
			line-height: 80upx;
			transition: transform 0.15s ease-in-out 0s;
			user-select: none;
			-webkit-touch-callout: none;
			transform: scale(0, 0);
	
			&.show {
				transform: scale(1, 1);
			}
	
			&>view {
				padding: 0 20upx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				user-select: none;
				-webkit-touch-callout: none;
	
				&:active {
					background-color: #f3f3f3;
				}
			}
		}
	}
</style>
