<template>
	<view class="content" :key="isRouterAlive">
		<u-row align="top">
			<u-col span="5.3">
				<view class="memberlist" :style="contentStyleObj">
					<uni-list v-for="(item,i) in eslId">
						<view @click="memberCheck(item,i)"><uni-list-item :class="member[i]" :title="item"></uni-list-item></view>
					</uni-list>
				</view>
			</u-col>
			
			<u-col span="6.7">
				<form @submit="formSubmit" @reset="formReset" style="width: 100%;">
					<view class="uni-list">
						<view class="uni-list-cell">
							<view class="uni-form-item">
								<view class="uni-title uni-common-pl">公司<font style="color: #ff0000;margin-left: 3px;">*</font>
								</view>
								<input class="uni-input text-edited" name="company" placeholder="请输入" :value="company_in"/>
							</view>
						</view>
						<view class="uni-list-cell">
							<view class="uni-form-item">
								<view class="uni-title uni-common-pl">职称<font style="color: #ff0000;margin-left: 3px;">*</font>
								</view>
								<input class="uni-input text-edited" name="title" placeholder="请输入" :value="title_in"/>
							</view>
						</view>
					
						<view class="uni-list-cell">
							<view class="uni-form-item">
								<view class="uni-title uni-common-pl">姓名<font style="color: #ff0000;margin-left: 3px;">*</font>
								</view>
								<view class="uni-list-cell-db text-edited">
									<input class="uni-input text-edited" name="name" placeholder="请输入" :value="name_in"/>
								</view>
							</view>
						</view>
					</view>

					<view class="uni-padding-wrap uni-common-mt">
						<button type="primary" form-type="submit">保存</button>
					</view>
				</form>
			</u-col>
		</u-row>
	</view>
</template>

<script>
	import urlConfig from "../../../common/config.js";
	export default {
		data() {
			return {
				url_pre: urlConfig.baseUrl,
				title: 'picker',
				array1: ['1', '2', '3', '4'],
				index1: 0,
				eslId: [],
				eslId_sel: "",
				applicationId: "",
				roomId: "",
				massage: "",
				postJson: {},
				contentStyleObj:{
					height:''
		　　　　 },
				member: [],
				isRouterAlive: true,
				company_in: "",
				title_in: "",
				name_in: ""
			}
		},
		onLoad(option) {
			this.applicationId=option.applicationId;
			this.roomId=option.roomId;
			uni.request({
					url: this.url_pre+'/room/info/'+this.roomId, //接口地址
					// data: {user: "aaa"},
					method: 'GET',
					header: {
						'content-type': 'application/json' //自定义请求头信息
					},
					success: (res) => {
						var datalist = res.data.room.eslIds;
						for(var i=0;i<datalist.length;i++){
							if(datalist[i].type=="namePlate"){
								this.eslId.push(datalist[i].eslId);
								this.member.push("member");
							}
						}
						console.log(res.data);
						console.log('request success');
					},
					fail: (res) => {
						console.log(res.data);
						console.log('request failure');
					}
			});
		},
		methods: {
			formSubmit: function(e) {
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value));
				var formdata = e.detail.value;
				this.postJson=formdata;
				this.postJson.applicationId=this.applicationId;
				this.postJson.roomId=this.roomId;
				this.postJson.eslId=this.eslId_sel;
				console.log(this.postJson);
				var form_title = "";
				var form_flag = 0;
				var first_Ftitle = "";
				for(var ele in formdata){
					if(formdata[ele].length==0){
						if(form_flag==1 && form_title.length!=0){
							first_Ftitle = form_title;
						}
						switch(ele) {
							case 'company': form_title="填写公司";break;
							case 'title': form_title="填写职称";break;
							case 'name': form_title="填写姓名";break;
							default:continue;
						}
						if(form_flag>=1 && first_Ftitle.length!=0){
							form_title=first_Ftitle;
						}
						form_flag++;
					}
				}
				if(form_flag==3){
					form_title="补充所有内容";
				}
				if(form_title!=""){
					uni.showModal({
						content: "请"+form_title,
						showCancel: false
					});
					return;
				}
				uni.showModal({
					content: '表单数据内容：' + JSON.stringify(formdata),
					showCancel: false
				});
				uni.request({
				    url: this.url_pre+'/esl/setContent', //接口地址。
				    data: e.detail.value,
				    method: 'POST',
				    header: {
				    	'content-type': 'application/json' //自定义请求头信息
				    },
				    success: (res) => {
				        console.log(res.data);
						this.massage=res.data.msg;
						uni.showModal({
							content: this.massage,
							showCancel: false
						});
				        console.log('request success');
				    },
					fail: (res) => {
						console.log(res.data);
						this.massage=res.data.msg;
						uni.showModal({
							content: this.massage,
							showCancel: false
						});
						console.log('request failure');
					}
				});
			},
			memberCheck(eslId,index){
				this.eslId_sel=eslId;
				this.company_in="";
				this.title_in="";
				this.name_in="";
				for(var i=0;i<this.member.length;i++){
					if(i==index){
						this.member[i]="memberHover";
					}
					else{
						this.member[i]="member";
					}
				}
				console.log(this.eslId_sel);
				uni.request({
						url: this.url_pre+'/esl/getContent', //接口地址。
						data: {eslId: eslId, applicationId: this.applicationId},
						method: 'GET',
						header: {
							'custom-header': 'application/json' //自定义请求头信息
						},
						success: (res) => {
							console.log(res.data);
							var datalist = res.data.page.list;
							for(var i=0;i<datalist.length;i++){
								if(datalist[i].roomId==this.roomId){
									this.company_in=datalist[i].company;
									this.title_in=datalist[i].title;
									this.name_in=datalist[i].name;
									break;
								}
							}
							console.log('request success');
						},
						fail: (res) => {
							console.log(res.data);
							console.log('request failure');
						}
				});
				
				uni.request({
						url: this.url_pre+'/participant/list', //接口地址。
						data: {applicationId: this.applicationId},
						header: {
							'custom-header': 'application/json' //自定义请求头信息
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
				
				this.isRouterAlive = false;
				this.$nextTick(() => {
					this.isRouterAlive = true;
				});
				console.log(this.isRouterAlive);
			},
			getHeight(){
			      this.contentStyleObj.height=window.innerHeight-44+'px';
				  console.log(this.contentStyleObj.height);
			}
		},
		
		created(){
		      window.addEventListener('resize', this.getHeight);
		      this.getHeight()
		},
		destroyed(){
		      window.removeEventListener('resize', this.getHeight)
		}
		
	}
</script>

<style>
	.content {
		background-color: #fff;
	}
	
	.uni-list {
		background: none;
	}
	.u-col{
		padding: 0!important;
	}
	
	.content .memberlist{
		float: left;
		box-shadow: #999 1rpx 1rpx 30rpx 1rpx;
		background: #fff;
		width: 99.8%;
	}
	
	.content .memberlist .member{
		background: #f5f5f5;
		transition: all .3s linear;
	}
	.content .memberlist .member:hover{
		background: #fff;
		border-left: 6rpx solid #007AFF;
		transition: all .3s linear;
	}
	.content .memberlist .memberHover{
		background: #fff;
		border-left: 6rpx solid #007AFF;
	}
	
	.uni-list-cell{
		width: 96%;
	}
	
	.divide-line{
		height: 10px;
		background-color: #efeff4;
	}
	
	.time-text{
		height: 40px;
		line-height: 40px;
		margin: 0 6px;
	}
	
	.text-edited{
		text-align: right;
	}
	
	.keyword-box{
		border: #bbb solid 1px;
		border-radius: 6px;
		padding: 0 6px;
		color: #bbb;
	}
</style>
