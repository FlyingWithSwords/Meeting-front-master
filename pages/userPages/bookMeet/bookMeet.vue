<template>
	<view class="content">
		<form @submit="formSubmit" @reset="formReset">
			<view class="uni-form-item">
				<input class="uni-title uni-common-pl" name="subject" placeholder="日程、会议、活动主题" />
			</view>
			
			<view class="uni-list-cell">
				<view class="uni-form-item">
					<view class="uni-title uni-common-pl">开始</view>
					<view class="uni-list-cell-db text-edited">
						<picker mode="date" :value="date_v" @change="bindDateChange">
							<view class="time-text">{{date}}</view>
						</picker>
					</view>
					<view class="uni-list-cell-last text-edited">
						<picker mode="time" :value="time" @change="bindTimeChange">
							<view class="time-text" style="margin-right: 12px;">{{time}}</view>
							<view hidden="true"><input type="hidden" name="startTime" :value="date_v+' '+time+':00'" /></view>
						</picker>
					</view>
				</view>
			</view>

			<view class="uni-list-cell">
				<view class="uni-form-item">
				<view class="uni-title uni-common-pl">时长</view>
					<view class="uni-list-cell-db text-edited">
						<picker @change="bindPickerChange1" :value="index_t" :range="array_t">
							<view class="uni-input">{{array_t[index_t]}}</view>
							<view hidden="true"><input type="hidden" name="duration" :value="parseInt(array_t[index_t])" /></view>
						</picker>
					</view>
				</view>
			</view>
			
			<view class="uni-list-cell">
				<view class="uni-form-item">
					<view class="uni-title uni-common-pl">会议室</view>
					<view class="uni-list-cell-db text-edited">
						<picker @change="bindPickerChange2" :value="index_r" :range="roomList">
							<view v-if="index_r==-1" class="uni-input" style="color: #888;">请选择></view>
							<view v-else class="uni-input">{{roomList[index_r]}}</view>
							<view hidden="true"><input type="hidden" name="roomId" :value="roomId[index_r]" /></view>
						</picker>
					</view>
				</view>
			</view>
			
			<view class="uni-list-cell">
				<view class="uni-form-item">
					<view class="uni-title uni-common-pl">参与人</view>
					<view class="uni-list-cell-db text-edited">
							<view class="uni-input" style="height:40px;word-break:break-all;overflow: auto;" @tap="sel_show = true">{{sel_value || "请选择"}}</view>
							<multiple-select v-model="sel_show" :data="array2" :default-selected="defaultSelected" @confirm="mulsel_confirm"></multiple-select>
							<view hidden="true"><input type="hidden" name="member" :value="defaultSelected.toString()" /></view>
						</picker>
					</view>
				</view>
			</view>

			<view class="uni-padding-wrap uni-common-mt">
				<button type="primary" form-type="submit">保存</button>
			</view>
		</form>
	</view>
</template>

<script>
	import urlConfig from "../../../common/config.js";
	import multipleSelect from "@/components/momo-multipleSelect/momo-multipleSelect.vue";
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			},"",true);
			const currentDate_v = this.getDate({
				format: true
			},"",false)
			const currentTime = this.getTime();
			return {
				url_pre: urlConfig.baseUrl,
				id: "",
				title: 'picker',
				roomList: [],
				roomId: [],
				array2: [{'label':'1', 'value':'1'}, {'label':'2', 'value':'2'}, {'label':'3','value':'3'}, {'label':'4','value':'4'}, {'label':'5','value':'5'}],
				array_t: ['1小时', '2小时', '3小时', '4小时', '5小时', '6小时', '7小时',
				 '8小时', '9小时', '10小时', '11小时', '12小时'],
				index_t: 0,
				index_r: -1,
				index3: -1,
				date: currentDate,
				date_v: currentDate_v,
				time: currentTime,
				sel_show: false,
				sel_value: "",
				defaultSelected: [],
			}
		},
		components: {
			multipleSelect
		},
		computed: {
			startDate() {
				return this.getDate('start',0);
			},
			endDate() {
				return this.getDate('end',0);
			}
		},
		methods: {
			formSubmit: function(e) {
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
				var formdata = e.detail.value;
				var form_title = "";
				var form_flag = 0;
				var first_Ftitle = "";
				for(var ele in formdata){
					if(formdata[ele].length==0){
						if(form_flag==1 && form_title.length!=0){
							first_Ftitle = form_title;
						}
						switch(ele) {
							case 'content': form_title="填写日程/会议/活动主题";break;
							case 'startTime': form_title="选择开始时间";break;
							case 'duration': form_title="选择时长";break;
							case 'roomId': form_title="选择会议室";break;
							case 'member': form_title="选择参与人";break;
							default:continue;
						}
						if(form_flag>=1 && first_Ftitle.length!=0){
							form_title=first_Ftitle;
						}
						form_flag++;
					}
				}
				if(form_flag==5){
					form_title="补充所有内容";
				}
				if(form_title!=""){
					uni.showModal({
						content: "请"+form_title,
						showCancel: false
					});
					return;
				}
				/* uni.showModal({
					content: '表单数据内容：' + JSON.stringify(formdata),
					showCancel: false
				}); */
				uni.request({
					url: this.url_pre+'/application/save', //接口地址。
					data: e.detail.value,
					method: 'POST',
					header: {
						'content-type': 'application/json' //自定义请求头信息
					},
					success: (res) => {
						console.log(res.data);
						console.log('request success');
						this.massage=res.data.msg;
						uni.showModal({
							content: this.massage,
							showCancel: false,
							success: () => {
								if(res.data.msg=="success"){
									uni.navigateTo({
										url: "/meetList"
									});
								}
							}
						});
					},
					fail: (res) => {
						console.log(res.data);
						console.log('request failure');
						this.massage=res.data.msg;
						uni.showModal({
							content: this.massage,
							showCancel: false
						});
					}
				});
			},
			bindPickerChange1: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index_t = e.target.value
			},
			bindPickerChange2: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index_r = e.target.value
			},
			bindPickerChange3: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index3 = e.target.value
			},
			bindDateChange: function(e) {
				this.date = this.getDate("",e.target.value,true);
				this.date_v = this.getDate("",e.target.value,false);
			},
			bindTimeChange: function(e) {
				this.time = e.target.value;
			},
			getTime(){
				const date = new Date();
				let hour = date.getHours();
				let min = (date.getMinutes()<10?"0":"")+date.getMinutes();
				return hour+':'+min;
			}
			,
			getDate(type,value,flag) {
				const date = (value=="")?new Date():new Date(value);
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				
				let toDate = new Date();
				let toYear = toDate.getFullYear();
				let toMonth = toDate.getMonth()+1;
				let toDay = toDate.getDate();
				let word = '';

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				year = (year==toYear)?(flag==true?"":year):(flag==true?year+"年":year);
				if(year==''){
					if(month==toMonth && day==toDay){word='今天 · ';}
					else if(month==toMonth && day==toDay+1){word='明天 · ';}
					else if(month==toMonth && day==toDay+2){word='后天 · ';}
					else if(day==toDay+7){word='一周后 · ';}
					else if(month==toMonth+1){word='下月 · ';}
					else{word='';}
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				if(flag==true){
					return `${word}${year}${month}月${day}日`;}
				else{
					return `${year}-${month}-${day}`;
				}
			},
			mulsel_confirm(data) {
				console.log(data);
				this.sel_value = data.map((el) => el.label).join(", ");
				this.defaultSelected = this.sel_value.split(", ");
				console.log(this.defaultSelected);
			},
			onLoad(options){
				this.id=options.id;
				uni.request({
						url: this.url_pre+'/room/list', //接口地址。
						// data: {city: '广州', floor: '1', bookDate: '2021-09-22 14:15:13'},
						method: 'GET',
						header: {
							'content-type': 'application/json' //自定义请求头信息
						},
						success: (res) => {
							var datalist = res.data.page.list;
							for(var i=0;i<datalist.length;i++){
								this.roomId.push(datalist[i].roomEntity.id);
								this.roomList.push(datalist[i].roomEntity.name);
								if(this.id==datalist[i].roomEntity.id){
									this.index_r=i;
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
				uni.request({
						url: this.url_pre+'/participant/list', //接口地址。
						// data: {applicationId: ""},
						method: 'GET',
						header: {
							'content-type': 'application/json' //自定义请求头信息
						},
						success: (res) => {
							var datalist = res.data.page.list;
							// for(var i=0;i<datalist.length;i++){
							// 	this.roomId.push(datalist[i].roomEntity.id);
							// 	this.roomList.push(datalist[i].roomEntity.name);
							// }
							console.log(res.data);
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
		background-color: #fff;
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
	
	.upimg{
		width: 70px;
		height: 70px;
		padding: 10px;
		margin: 12px 36px;
		border: #ccc dashed 1px;
	}
	.upimg image{
		width: 50px;
		height: 50px;
	}
</style>
