<template>
	<view class="content">
		<view class="uni-list">
			<view class="uni-form-item">
				<view class="uni-title uni-common-pl">会议室名</view>
				<view class="uni-input text-edited">{{item.name}}</view>
			</view>
		</view>
		
		<view class="divide-line"></view>
		
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-form-item">
					<view class="uni-title uni-common-pl">城市</view>
					<view class="uni-input text-edited">{{this.city}}</view>
				</view>
			</view>
		
			<view class="uni-list-cell">
				<view class="uni-form-item">
					<view class="uni-title uni-common-pl">办公楼</view>
					<view class="uni-input text-edited">{{item.floor}}</view>
				</view>
			</view>
			
			<view class="uni-list-cell">
				<view class="uni-form-item">
					<view class="uni-title uni-common-pl">会议室类型</view>
					<view class="uni-input text-edited">{{item.type=='small'?'小型':item.type=='medium'?'中型':item.type=='big'?'大型':'未知'}}</view>
				</view>
			</view>
		</view>
		
		<view class="divide-line"></view>
		
		<view class="uni-list">
			<!-- <view class="uni-list-cell">
				<view class="uni-form-item">
					<view class="uni-title uni-common-pl">创建时间</view>
					<view class="uni-input text-edited">{{item.createTime}}</view>
				</view>
			</view>
			
			<view class="uni-list-cell">
				<view class="uni-form-item">
					<view class="uni-title uni-common-pl">更新时间</view>
					<view class="uni-input text-edited">{{item.updateTime}}</view>
				</view>
			</view> -->
			
			<view class="uni-list-cell">
				<view class="uni-form-item">
					<view class="uni-title uni-common-pl">状态</view>
					<view class="uni-input text-edited">{{item.state}}</view>
				</view>
			</view>
		
			<view class="uni-list-cell">
				<view class="uni-form-item">
					<view class="uni-title uni-common-pl">可选时段</view>
					<view class="uni-input text-edited">{{item.validBeginHour}}~{{item.validEndHour}}</view>
				</view>
			</view>
		
			<view class="uni-list-cell">
				<view class="uni-form-item">
					<view class="uni-title uni-common-pl">容纳人数</view>
					<view class="uni-input text-edited">{{item.capcity}}</view>
				</view>
			</view>
		
			<view class="uni-list-cell">
				<view class="uni-form-item" style="padding-bottom:160rpx;">
					<view class="uni-title uni-common-pl">设备工具</view>
					<view class="uni-list-cell-db text-edited">
						<view class="uni-input" style="height:238rpx;word-break:break-all;overflow: auto;">
							<button v-for="(ele,i) in array_kw" size="mini" class="keyword-box">{{i+" x "+ele}}</button>
						</view>
					</view>
				</view>
			</view>
		
			<!-- <view class="uni-list-cell">
				<view class="uni-form-item">
					<view class="uni-title uni-common-pl">基站</view>
					<view class="uni-input text-edited">{{item.apMac}}</view>
				</view>
			</view> -->
		
			<view class="uni-list-cell">
				<view class="uni-form-item">
					<view class="uni-title uni-common-pl">电子会议门牌</view>
					<view class="uni-input text-edited">{{doorEslId}}</view>
				</view>
			</view>
			
			<view class="uni-list-cell">
				<view class="uni-form-item">
					<view class="uni-title uni-common-pl">桌面铭牌</view>
					<view class="uni-input text-edited" style="height:40px;word-break:break-all;overflow: auto;">{{eslIds}}</view>
				</view>
			</view>
			
			<view class="uni-list-cell">
				<view class="uni-form-item">
					<view class="uni-title uni-common-pl" style="margin-right: 45px;">实景照片</view>
					<u-image :src="item.picUrl" width="200rpx" height="200rpx" border-radius="0.5em"></u-image>
				</view>
			</view>
			
			<view class="uni-padding-wrap uni-common-mt">
				<button type="primary" @tap="bookSubmit">预约</button>
			</view>
		</view>
	</view>
</template>

<script>
	import urlConfig from "../../../common/config.js";
	export default {
		data() {
			return {
				url_pre: urlConfig.baseUrl,
				item: [],
				eslIds: [],
				id: 1,
				array_kw: [],
				rec_kw: [],
				city: '',
				doorEslId: '',
				fileList: [{}]
			}
		},
		methods: {
			onLoad(options){
				this.id=options.id;
				uni.request({
				    url: this.url_pre+'/room/info/'+this.id, //接口地址。
				    // data: this.id,
				    method: 'GET',
				    header: {
				    	'content-type': 'application/json' //自定义请求头信息
				    },
				    success: (res) => {
						this.item=res.data.room.roomEntity;
						this.eslIds=res.data.room.eslIds;
						var eslIdstr="";
						for(var i=0;i<this.eslIds.length;i++){
							if(this.eslIds[i].type=="namePlate"){
								eslIdstr+=this.eslIds[i].eslId;
								if(this.eslIds[i+1].type!="door" && i!=this.eslIds.length-1){
									eslIdstr+=", "
								}
							}
							if(this.eslIds[i].type=="door"){
								this.doorEslId=this.eslIds[i].eslId;
							}
						}
						this.eslIds=eslIdstr;
						this.array_kw=eval("("+res.data.room.roomEntity.device+")");
						uni.request({
							url: this.url_pre+'/sys/dict/info/'+this.item.province+'/'+this.item.city, //接口地址。
							header: {
								'custom-header': 'hello' //自定义请求头信息
							},
							success: (res) => {
								this.city=res.data.page.value;
								console.log(res.data);
								console.log('request success');
							},
							fail: (res) => {
								console.log(res.data);
								console.log('request failure');
							}
						});
				        console.log(res.data);
				        console.log('request success');
				    },
					fail: (res) => {
						console.log(res.data);
						console.log('request failure');
					}
				});
			},
			bookSubmit: function(){
				uni.navigateTo({
					url: "/bookMeet?id="+this.id
				});
			}
		}
	}
</script>

<style>
	.content {
		background-color: #efeff4;
	}
	
	.uni-list-cell {
		width: 96%;
	}
	
	.divide-line {
		height: 10px;
		background-color: #efeff4;
	}
	
	.text-edited {
		margin-left: 115px;
		position: absolute;
	}
	
	.keyword-box {
		border: #bbb solid 1px;
		border-radius: 6px;
		height: 30px;
		line-height: 30px;
		padding: 0 6px;
		margin-right: 12px;
		color: #bbb;
	}
</style>
