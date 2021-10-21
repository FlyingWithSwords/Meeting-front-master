<template>
	<view class="content">
		<view class="number_btn">
			<view class="prompt-box" v-if="isHidden" @click.stop="!show">
				<view class="prompt-content contentFontColor">
					<view class="prompt-title">请输入设备数量</view>
					<view class="prompt-text">{{text}}</view>
					<input class="prompt-input" type="number" @input="_input" :value="cost" />
					<view class="prompt-btn-group">
						<button class="btn-item prompt-cancel-btn contentFontColor" @tap="_cancel">{{btn_cancel}}</button>
						<button class="btn-item prompt-certain-btn" @tap="_confirm">{{btn_certain}}</button>
					</view>
				</view>
			</view>
		</view>
		
		<form @submit="formSubmit" ref="form" @reset="formReset">
			
			<view class="divide-line"></view>
			<view class="uni-list">
				<view class="uni-form-item">
					<view class="uni-title uni-common-pl">会议室名<font style="color: #ff0000;margin-left: 3px;">*</font>
					</view>
					<input class="uni-input text-edited" name="name" placeholder="请输入" :value="item.name" />
				</view>
			</view>

			<view class="divide-line"></view>

			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-form-item">
						<view class="uni-title uni-common-pl">城市<font style="color: #ff0000;margin-left: 3px;">*</font>
						</view>
						<view class="uni-list-cell-db text-edited">
							<picker style="height: 0;line-height: 0;" @change="bindPickerCity" @columnchange="columnchange" :range="array_c" range-key="name" :value="value_c" mode="multiSelector">
							<view v-if="indexLs_c[0]==-1 || indexLs_c[1]==-1" class="uni-input" style="color: #888;">{{this.city_v}}</view>
							<view v-else class="uni-input">{{array_c[0][value_c[0]].name+" "+array_c[1][value_c[1]].name}}</view>
							<view hidden="true"><input type="hidden" name="province" :value="indexLs_c[0]==-1?item.province:code_res[value_c[0]].code" /></view>
							<view hidden="true"><input type="hidden" name="city" :value="indexLs_c[1]==-1?item.city:code_res[value_c[0]].cities[value_c[1]].code" /></view>
							</picker>
						</view>
					</view>
				</view>

				<view class="uni-list-cell">
					<view class="uni-form-item">
						<view class="uni-title uni-common-pl">办公楼<font style="color: #ff0000;margin-left: 3px;">*</font>
						</view>
						<view class="uni-list-cell-db text-edited">
							<picker @change="bindPickerChange_floor" :value="array_f[index_f]" :range="array_f">
								<view v-if="index_f==-1" class="uni-input" style="color: #888;">{{item.floor+"楼"}}</view>
								<view v-else class="uni-input">{{array_f[index_f]}}</view>
								<view hidden="true"><input type="hidden" name="floor" :value="index_f==-1?item.floor:value_f[index_f]" /></view>
							</picker>
						</view>
					</view>
				</view>
				
				<view class="uni-list-cell">
					<view class="uni-form-item">
						<view class="uni-title uni-common-pl">会议室类型<font style="color: #ff0000;margin-left: 3px;">*</font>
						</view>
						<view class="uni-list-cell-db text-edited">
							<picker @change="bindPickerChange_type" :value="array_t[index_t]" :range="array_t">
								<view v-if="index_t==-1" class="uni-input" style="color: #888;">{{item.type=='small'?'小型':item.type=='medium'?'中型':item.type=='big'?'大型':'未知'}}</view>
								<view v-else class="uni-input">{{array_t[index_t]}}</view>
								<view hidden="true"><input type="hidden" name="type" :value="index_t==-1?item.type:value_t[index_t]" /></view>
							</picker>
						</view>
					</view>
				</view>
			</view>

			<view class="divide-line"></view>

			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-form-item">
						<view class="uni-title uni-common-pl">可选时段</view>
						<view class="uni-list-cell-last" style="margin-left: 50px;">
							<picker mode="time" :value="time1" @change="bindTimeChange1">
								<view class="time-text">{{time1}}</view>
							</picker>
						</view>
						<view class="uni-list-cell-last">
							<view class="time-text">~</view>
						</view>
						<view class="uni-list-cell-last">
							<picker mode="time" :value="time2" @change="bindTimeChange2">
								<view class="time-text">{{time2}}</view>
							</picker>
						</view>
						<view hidden="true"><input type="hidden" name="validBeginHour" :value="time1" /></view>
						<view hidden="true"><input type="hidden" name="validEndHour" :value="time2" /></view>
					</view>
				</view>

				<view class="uni-list-cell">
					<view class="uni-form-item">
						<view class="uni-title uni-common-pl">容纳人数</view>
						<input class="uni-input text-edited" type="number" name="capcity" placeholder="请输入" :value="item.capcity" />
					</view>
				</view>

				<view class="uni-list-cell">
					<view class="uni-form-item" style="padding-bottom:160rpx;">
						<view class="uni-title uni-common-pl">设备工具</view>
						<view class="uni-list-cell-db text-edited">
							<view class="uni-input" style="height:238rpx;word-break:break-all;overflow: auto;">
								<button v-for="(item,i) in array_kw" size="mini" class="keyword-box" @click="show(item)">{{item+" x "+(rec_kw[i]?rec_kw[i]:0)}}</button>
							</view>
							<view hidden="true"><input type="hidden" name="device" :value="deviced.toString()" /></view>
						</view>
					</view>
				</view>

				<view class="uni-list-cell">
					<view class="uni-form-item">
						<view class="uni-title uni-common-pl">基站</view>
						<view class="uni-list-cell-db text-edited">
							<picker @change="bindPickerChange_apMac" :value="array_ap[index_ap]" :range="array_ap">
								<view v-if="index_ap==-1" class="uni-input" style="color: #888;">{{item.apMac}}</view>
								<view v-else class="uni-input">{{array_ap[index_ap]}}</view>
								<view hidden="true"><input type="hidden" name="apMac" :value="index_ap==-1?item.apMac:value_ap[index_ap]" /></view>
							</picker>
						</view>
					</view>
				</view>

				<view class="uni-list-cell">
					<view class="uni-form-item">
						<view class="uni-title uni-common-pl">电子会议门牌</view>
						<view class="uni-list-cell-db text-edited">
							<picker @change="bindPickerChange_eslId" :value="array_es[index_es]" :range="array_es">
								<view v-if="index_es==-1" class="uni-input" style="color: #888;">{{doorEslId}}</view>
								<view v-else class="uni-input">{{array_es[index_es]}}</view>
								<view hidden="true"><input type="hidden" name="doorEslId" :value="index_es==-1?this.doorEslId:value_es[index_es]" /></view>
							</picker>
						</view>
					</view>
				</view>
				
				<view class="uni-list-cell">
					<view class="uni-form-item">
						<view class="uni-title uni-common-pl">桌面铭牌</view>
						<view class="uni-list-cell-db text-edited">
							<view class="uni-input" style="height:40px;word-break:break-all;overflow: auto;" @tap="sel_show = true">{{sel_value}}</view>
							<multiple-select v-model="sel_show" :data="array_mules" :default-selected="defaultSelected" @confirm="mulsel_confirm"></multiple-select>
						</view>
					</view>
				</view>

				<view class="uni-list-cell">
					<view class="uni-form-item">
						<view class="uni-title uni-common-pl" style="margin-right: 45px;">实景照片</view>
						<u-upload name="picture" ref="upload" :action="pic_url" @on-uploaded="onUploaded"></u-upload>
					</view>
				</view>
			</view>

			<view class="uni-padding-wrap uni-common-mt">
				<button type="primary" form-type="submit">更新</button>
			</view>
		</form>
		
		<u-tabbar v-model="currentTarbar" :list="tarbarList"></u-tabbar>
	</view>
</template>

<script type="text/javascript" src="../../uview-ui/libs/function/test.js"></script>
<script type="text/javascript">
	
	
</script>
<script>
	import urlConfig from "../../../common/config.js";
	import multipleSelect from "@/components/momo-multipleSelect/momo-multipleSelect.vue";
	let selectVal = ['','',''];
	const arrayKw = [];
	const recKw = new Array(arrayKw.length);
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			const currentTime = this.getTime(0);
			return {
				url_pre: urlConfig.baseUrl,
				pic_url: urlConfig.baseUrl+'/sys/oss/upload',
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
				currentTarbar: 0,
				title: 'picker',
				item: [],
				array_f: [],
				value_f: [],
				zh_f: ['一','二','三','四','五','六','七','八','九','十'],
				array_t: ['小型', '中型', '大型'],
				value_t: ['small', 'medium', 'big'],
				array_kw: [],
				value_kw: [],
				array_ap: [],
				value_ap: [],
				array_es: [],
				value_es: [],
				allAddress: [],
				city_v: "",
				code_res: [],
				array_c: [],
				value_c: [0, 0],
				indexLs_c: [-1, -1],
				index_c: -1,
				index_f: -1,
				index_t: -1,
				index_ap: -1,
				index_es: -1,
				deviced: "",
				rec_kw: recKw,
                btn_cancel: '取消',
                btn_certain: '确定',
                text: '',
                multipleSlots: true, // 在组件定义时的选项中启用多slot支持
                isHidden: false,
                cost: '',
				showValue: "",
				date: currentDate,
				time1: currentTime,
				time2: this.getTime(3),
				massage: "",
				doorEslId: "",
				array_mules: [],
				sel_show: false,
				sel_value: "",
				defaultSelected: [],
				selected: []
			}
		},
		created() {
		    this.initSelected();
		},
		components: {
			multipleSelect
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			formSubmit: function(e) {
				e.detail.value.device=this.deviced;
				e.detail.value.namePlateEslIds=this.defaultSelected;
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value));
				var formdata = e.detail.value;
				if(JSON.stringify(formdata).indexOf("\"\"")!=-1){
					uni.showModal({
						content: "不能提交空信息",
						showCancel: false
					});
					return;
				}
				uni.showModal({
					content: '表单数据内容：' + JSON.stringify(formdata),
					showCancel: false
				});
				this.$refs.upload.upload();
				uni.request({
				    url: this.url_pre+'/room/update', //接口地址。
					method: 'POST',
				    data: e.detail.value,
				    header: {
				        'content-type': 'application/json' //请求头信息
				    },
				    success: (res) => {
				        console.log(res.data);
						this.massage=res.data.msg;
				        console.log('request success');
						uni.showModal({
							content: this.massage,
							showCancel: false
						});
				    },
					fail: (res) => {
						console.log(res.data);
						this.massage=res.data.msg;
						console.log('request failure');
						uni.showModal({
							content: this.massage,
							showCancel: false
						});
					}
				});
			},
			formReset: function(e) {
				console.log('清空数据');
			},
			onUploaded(lists){
				console.log(lists);
			},
			bindPickerChange_floor: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index_f = e.target.value;
			},
			bindPickerChange_type: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index_t = e.target.value
			},
			bindPickerChange_apMac: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index_ap = e.target.value
			},
			bindPickerChange_eslId: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value);
				console.log(this.defaultSelected);
				if(e.target.value>=0){
					for(var ele in this.array_mules){
						this.array_mules[ele].disabled=false;
					}
					this.array_mules[e.target.value].disabled=true;
					if(this.sel_value.length!=0){
						this.sel_value = "";
						var sel_temp = [];
						for(var i=0;i<this.defaultSelected.length;i++){
							if(this.defaultSelected[i]==this.array_mules[e.target.value].label){
								this.sel_value += "";
							}
							else{
								sel_temp.push(this.defaultSelected[i]);
								this.sel_value += this.defaultSelected[i];
								if(i!=this.defaultSelected.length-1) {
									this.sel_value += ", ";
								}
								if(this.sel_value.split(", ").length==1){
									this.sel_value = this.defaultSelected[i];
								}
							}
						}
						this.defaultSelected = sel_temp;
					}
				}
				else{
					for(var ele in this.array_mules){
						this.array_mules[ele].disabled=true;
					}
					this.sel_value = "";
					this.defaultSelected = [];
				}
				this.index_es = e.target.value;
			},
			bindDateChange: function(e) {
				this.date = e.target.value
			},
			bindTimeChange1: function(e) {
				this.time1 = e.target.value
			},
			bindTimeChange2: function(e) {
				this.time2 = e.target.value
			},
			devrec: function(value) {
				var rec=this.array_kw.indexOf(value);
				if(recKw[rec]!=null){
					recKw[rec]++;}
				else{
					recKw[rec]=1;
				}
				var objstr="{";
				for(var i=0;i<this.array_kw.length;i++){
					if(!recKw[i]){
						continue;
					}
					else{
						objstr+="'"+this.array_kw[i]+"'"+": '"+recKw[i]+"'";
						if(i!=this.array_kw.length-1 && recKw[i+1]){
							objstr+=", ";
						}
					}
				}
				objstr+="}";
				this.deviced=eval("("+objstr+")");
				console.log(this.deviced);
				console.log("KEY："+value+" 点击次数："+this.rec_kw[rec]);
			},
			getTime(after) {
				const date = after == 0 ? new Date() : new Date(new Date().getTime() + after * 60 * 60 * 1000);
				let hour = date.getHours();
				let min = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
				return hour + ':' + min;
			}, 
			getDate(type) {
				const date = new Date();
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
			    })
			    return this
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
				    url: this.url_pre+'/room/info/'+this.id, //接口地址。
				    // data: this.id,
				    method: 'GET',
				    header: {
				    	'content-type': 'application/json' //自定义请求头信息
				    },
				    success: (res) => {
						this.item=res.data.room.roomEntity;
						this.item_kw=res.data.room.roomEntity.device;
						this.item_kw=this.item_kw.substr(1,this.item_kw.length-2);
						this.selected=res.data.room.eslIds;
						var eslIdstr="";
						for(var i=0;i<this.selected.length;i++){
							if(this.selected[i].type=="namePlate"){
								eslIdstr+=this.selected[i].eslId;
								this.defaultSelected.push(this.selected[i].eslId);
								if(this.selected[i+1].type!="door" && i!=this.selected.length-1){
									eslIdstr+=", "
								}
							}
							if(this.selected[i].type=="door"){
								this.doorEslId=this.selected[i].eslId;
							}
						}
						this.sel_value=eslIdstr;
						var devLs=this.item_kw.split(',');
						for(var i=0;i<devLs.length;i++){
							var split=devLs[i].split(":");
							var array_kwstr="";
							for(var j=0;j<split[0].length;j++){
								if(split[0][j]!=("\'") && split[0][j]!=(" ")){
									array_kwstr+=split[0][j];
								}
							}
							this.array_kw.push(array_kwstr);
							arrayKw.push(array_kwstr);
							var rec_kwstr="";
							for(var k=0;k<split[1].length;k++){
								if(split[1][k]!=("\'") && split[1][k]!=(" ")){
									rec_kwstr+=split[1][k];
								}
							}
							this.rec_kw.push(rec_kwstr);
						}
						
						uni.request({
								url: this.url_pre+'/sys/dict/info/device', //接口地址。
								method: 'GET',
								header: {
									'content-type': 'application/json' //自定义请求头信息
								},
								success: (res) => {
									var datalist = res.data.dict.list;
									for(var i=0;i<datalist.length;i++){
										if(this.array_kw.indexOf(datalist[i].value)==-1){
											this.array_kw.push(datalist[i].value);
											arrayKw.push(datalist[i].value);
											this.rec_kw.push(0);
											this.value_kw.push(datalist[i].code);
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
						
						var objstr="{";
						for(var i=0;i<this.array_kw.length;i++){
							if(!recKw[i]){
								continue;
							}
							else{
								objstr+="'"+this.array_kw[i]+"'"+": '"+recKw[i]+"'";
								if(i!=this.array_kw.length-1 && recKw[i+1]){
									objstr+=", ";
								}
							}
						}
						objstr+="}";
						this.deviced=objstr;
						
						uni.request({
							url: this.url_pre+'/sys/dict/info/'+this.item.province+'/'+this.item.city, //接口地址。
							header: {
								'custom-header': 'hello' //自定义请求头信息
							},
							success: (res) => {
								this.city_v=res.data.page.value;
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
				
				uni.request({
						url: this.url_pre+'/sys/dict/info/provCity', //接口地址。
						method: 'GET',
						header: {
							'content-type': 'application/json' //自定义请求头信息
						},
						success: function(res) {
							var objstr = "[";
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
				uni.request({
						url: this.url_pre+'/ap/list', //接口地址。
						method: 'GET',
						header: {
							'content-type': 'application/json' //自定义请求头信息
						},
						success: (res) => {
							var datalist = res.data.page.list;
							for(var i=0;i<datalist.length;i++){
								this.array_ap.push(datalist[i].user+" - "+datalist[i].ip);
								this.value_ap.push(datalist[i].apId);
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
						url: this.url_pre+'/esl/list', //接口地址
						// data: {user: "aaa"},
						method: 'GET',
						header: {
							'content-type': 'application/json' //自定义请求头信息
						},
						success: (res) => {
							var datalist = res.data.page.list;
							for(var i=0;i<datalist.length;i++){
								this.array_es.push(datalist[i].eslId);
								this.value_es.push(datalist[i].eslId);
								this.array_mules.push(eval("({"+"label: '"+datalist[i].eslId+"', value: '"+datalist[i].eslId+"', disabled: true})"));
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
			hide: function() {
				this.isHidden = true;
			},
			
			show: function(value) {
				this.isHidden = !this.isHidden;
				this.showValue = value;
			},
			/*
			 * 内部私有方法建议以下划线开头
			 * triggerEvent 用于触发事件
			 */
			_cancel() {
				//触发cancel事件，即在外部，在组件上绑定cancel事件即可，bind:cancel，像绑定tap一样
				this.cost = '';
				this.showValue = '';
				this.isHidden = !this.isHidden;
			
			},
			_confirm() {
				let _cost = this.cost;
				if (_cost == '') {
					uni.showModal({
						content: '你还未输入',
						showCancel: false,
						confirmText: "确定"
					})
					return;
				} else {
					// this.$refs.prompt.hide();
					/* uni.showModal({
						title: '提示',
						content: '你输入的是:' + _cost,
						showCancel: false,
						confirmText: "确定"
					}) */
					var rec=this.array_kw.indexOf(this.showValue);
					recKw[rec]=_cost;
					var objstr="{";
					for(var i=0;i<this.array_kw.length;i++){
						if(!recKw[i]){
							continue;
						}
						else{
							objstr+="'"+this.array_kw[i]+"'"+": '"+recKw[i]+"'";
							if(i!=this.array_kw.length-1 && recKw[i+1]){
								objstr+=", ";
							}
						}
					}
					objstr+="}";
					this.deviced=objstr;
					console.log(this.deviced);
					console.log("KEY："+this.showValue+" 点击次数："+this.rec_kw[rec]);
					this._cancel();
				}
			},
			_input(e) {
				//将参数传出去，这样在getInput函数中可以通过e去获得必要的参数
				//this.triggerEvent("getInput",e.detail);
				this.cost = e.detail.value;
			}
			
		},
		
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

	.time-text {
		height: 40px;
		line-height: 40px;
		margin: 0 1px;
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
	
	.number-btn{
	    width: 86%;
	    height: 90rpx;
	    border-radius: 45rpx;
	    line-height: 90rpx;
	    font-size: 40rpx;
	    color: #a4c572;
	    background-color: #FFFFFF;
	    text-align: center;
	    margin: auto;
	}
	
	/* components/vas-prompt/vas-prompt.wxss */
	.prompt-box {
	  position: fixed;
	  left: 0;
	  top: 0;
	  width: 100%;
	  height: 100%;
	  z-index: 11;
	  background: rgba(209, 209, 209, 0.5);
	}
	
	.prompt-content {
	  position: absolute;
	  left: 50%;
	  top: 45%;
	  width: 80%;
	  max-width: 600rpx;
	  border: 2rpx solid #ccc;
	  border-radius: 10rpx;
	  box-sizing: bordre-box;
	  transform: translate(-50%, -50%); 
	  overflow: hidden;
	  background: #fff;
	}
	
	.prompt-title {
	  width: 100%;
	  padding: 20rpx 0;
	  text-align: center;
	  font-size: 35rpx;
	  border-bottom: 1rpx solid #eee;
	}
	.prompt-input{
	  margin: 8%;
	  padding: 5rpx 15rpx;
	  width: 80%;
	  height:60rpx;
	  border: 1px solid #ccc;
	  border-radius: 10rpx;
	}
	.prompt-btn-group{
	  display: flex;
	}
	
	.btn-item {
	  width: 35%;
	  font-size: 30rpx;
	  margin-bottom: 20rpx;
	  height: 76rpx;
	  line-height: 76rpx;
	  background-color: white;
	  justify-content: space-around;
	}
	.prompt-certain-btn{
	  color: white;
	  background-color: #378bf8;
	}
	.prompt-cancel-btn{
	  border: 1rpx solid #378bf8;
	}
	.contentFontColor {
	  color: #868686;
	}
	.prompt-cancel-btn:hover{
	  border: 1rpx solid #7cb0e9;
	}
	.contentFontColor:hover {
	  color: #868686;
	}
	.prompt-text{
	    margin-top:15rpx;
	    font-size:38rpx;
	}
</style>
