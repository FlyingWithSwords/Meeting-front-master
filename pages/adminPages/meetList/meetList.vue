<template>
	<view class="content" :key="isRouterAlive">
		<view class="uni-input title">全部会议</view>
		<view style="margin: 8px;">
			<picker @change="bindPickerChange" :value="index" :range="array" class="picker-s">
				<view class="uni-input" style="background: #0000;line-height: 15px;">{{array[index]}}</view>
			</picker>
			<u-search border-color="#ccc" v-model="keyword" @custom="search()" :action-style="{background: '#59e',color: '#fff',borderRadius: '0.5em',padding: '2px'}"></u-search>
		</view>
		<view style="text-align: center;">
			<button size="mini" style="margin: 10px;" @click="refrash" v-bind:disabled="cliMeet">刷新铭牌</button>
			<button size="mini" style="margin: 10px;" @tap="gotoNps" v-bind:disabled="cliMeet">设置铭牌</button>
		</view>
		<view class="h-table" style="font-size: 10px;text-align: center;">
			<view class="h-tr h-tr-3 h-thead">
				<view class="h-td">会议主题</view>
				<view class="h-td">发起人</view>
				<!-- <view class="h-td">会议人数</view> -->
				<view class="h-td">会议室</view>
				<view class="h-td">会议状态</view>
				<view class="h-td">开始时间</view>
			</view>
			<view v-for="(item,i) in meetList">
				<view :class="htr[i]" @click="clickMeet(item,i)">
					<view class="h-td">{{item.subject}}</view>
					<view class="h-td">{{item.employeeId}}</view>
					<!-- <view class="h-td">{{item.roomId}}</view> -->
					<view class="h-td">{{item.roomName}}</view>
					<view class="h-td">{{item.state=='applied'?'已申请':item.state=='signed'?'已签到':item.state=='started'?'已开始':item.state=='over'?'已结束':item.state=='canceled'?'已取消':'未知'}}</view>
					<view class="h-td">{{item.startTime}}</view>
				</view>
			</view>
		</view>
		
		<u-tabbar v-model="currentTarbar" :list="tarbarList"></u-tabbar>
	</view>
</template>

<script>
	import urlConfig from "../../../common/config.js";
	export default {
		data() {
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
				array: ['会议主题','发起人'],
				currentTarbar: 0,
				index: 0,
				keyword: "",
				typed: "会议主题",
				seadata: "",
				meetList: [],
				cliMeet: true,
				cliFlag: 0,
				applicationId: "",
				roomId: "",
				htr: [],
				isRouterAlive: true
			}
		},
		methods: {
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index = e.target.value?e.target.value:0;
				this.typed = this.array[this.index];
			},
			refrash: function(){
				uni.request({
						url: this.url_pre+'esl/refreshEsl', //接口地址。
						data: {applicationId: this.applicationId}, //暂缺接口参数
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
			},
			gotoNps: function(e){
				uni.navigateTo({
					url: "/nameplateSet?applicationId="+this.applicationId+"&roomId="+this.roomId
				})
			},
			search: function(e){
				this.seadata = {};
				var objstr="{";
				if(this.typed=="会议主题"){
					// objstr+="subject"+": '"+this.keyword+"'";
					this.seadata.subject = this.keyword;
				}
				if(this.typed=="发起人"){
					// objstr+="booker"+": '"+this.keyword+"'";
					this.seadata.booker = this.keyword;
				}
				objstr+="}";
				// this.seadata=eval("("+objstr+")");
				console.log(this.$data.keyword);
				console.log(this.$data.typed);
				uni.request({
						url: this.url_pre+'/application/list', //接口地址。
						data: this.seadata,
						method: 'GET',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						dataType: 'json',
						success: (res) => {
							console.log(res.data);
							this.meetList = res.data.page.list;
							this.cliMeet=true;
							this.htr = [];
							for(var i=0;i<this.meetList.length;i++){
								this.htr.push("h-tr h-tr-3");
							}
							console.log('request success');
						},
						fail: (res) => {
							console.log(res.data);
							console.log('request failure');
						}
				});
			},
			// disBtn: function(e){
			// 	if(this.cliMeet==false){
			// 		this.cliFlag++;
			// 	}
			// 	if(this.cliFlag>1){
			// 		this.cliMeet=true;
			// 		this.cliFlag=0;
			// 	}
			// 	console.log(this.cliFlag);
			// },
			clickMeet: function(e,index){
				this.cliMeet=false;
				this.applicationId=e.id;
				this.roomId=e.roomId;
				
				for(var i=0;i<this.htr.length;i++){
					if(i==index){
						this.htr[i]="h-tr h-trHover h-tr-3";
					}
					else{
						this.htr[i]="h-tr h-tr-3";
					}
				}
				
				this.isRouterAlive = false;
				this.$nextTick(() => {
					this.isRouterAlive = true;
				});
				console.log(e);
			},
			formSubmit: function(e) {
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
				var formdata = e.detail.value
				uni.showModal({
					content: '表单数据内容：' + JSON.stringify(formdata),
					showCancel: false
				});
			},
			formReset: function(e) {
				console.log('清空数据')
			},
			onLoad(options){
				uni.request({
						url: this.url_pre+'/application/list', //接口地址。
						method: 'GET',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						dataType: 'json',
						success: (res) => {
							console.log(res.data);
							this.meetList = res.data.page.list;
							for(var i=0;i<this.meetList.length;i++){
								this.htr.push("h-tr h-tr-3");
							}
							console.log('request success');
						},
						fail: (res) => {
							console.log(res.data);
							console.log('request failure');
						}
				});
			}
		}
		
	}
</script>

<style>
	.content {
		background-color: #f5f5f5;
	}
	.title {
		height: 40px;
		background: #0000;
		font-weight: bold;
		font-size: 18px;
	}
	.picker-s {
		float: left;
		border: #ccc solid 1px;
		background: #fff;
		border-radius: 1em;
		height: 30px;
		width: 90px;
		margin-right: 5px;
	}
	
	.h-tr:hover {
		-moz-transition: 0.8s; /* Firefox 4 */
		-webkit-transition: 0.8s; /* Safari 和 Chrome */
		-o-transition: 0.8s; /* Opera */
	}
	.h-trHover{
		background: #DEDEE3;
		transition: 0.8s;
		-moz-transition: 0.8s; /* Firefox 4 */
		-webkit-transition: 0.8s; /* Safari 和 Chrome */
		-o-transition: 0.8s; /* Opera */
	}
	.h-tr:active {
		background: #C9C9CF;
		transition: 0.8s;
		-moz-transition: 0.8s; /* Firefox 4 */
		-webkit-transition: 0.8s; /* Safari 和 Chrome */
		-o-transition: 0.8s; /* Opera */
	}
</style>
