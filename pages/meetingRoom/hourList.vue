<template>
	<view>
		<!-- 会议室信息 -->
		<el-row>
		  <!-- <el-col :span="8" v-for="(o, index) in 1" :key="o" :offset="index > 0 ? 2 : 0"> -->
		  <el-col>
		    <el-card :body-style="{ padding: '0px' }">
		      <img src="../../static/img/room1.jpeg" class="image">
		      <div style="padding: 14px;">
		        <span class="roomName">{{roomName}}</span><span class="roomInfo">{{roomInfo}}</span>
		      </div>
		    </el-card>
		  </el-col>
		</el-row>
		<!-- <u-card class="roomName" :title="title" :sub-title="subTitle" :thumb="thumb">
			<view class="" slot="body">
				<view class="u-body-item u-flex u-border-bottom u-col-between u-p-t-0">
					<view class="u-body-item-title u-line-2"></view>
					<image src="../../static/img/room1.jpeg" style="height: 200rpx;" mode="aspectFill"></image>
				</view>
			</view>
		</u-card> -->
		<!-- 可用时段 -->
		<!-- <view class="uni-padding-wrap uni-common-mt" style="margin-bottom: 2rem;">
			<view class="uni-flex uni-column" style="display: flex; flex-direction: row;">
				<u-checkbox-group class="hourList" @change="checkboxGroupChange">
					<u-checkbox @change="checkboxChange" v-model="item.checked" :disabled="item.disabled"
						label-size="item.size" v-for="(item, index) in hourList1" :key="index" :name="item.name">
						{{item.name}}</u-checkbox>
				</u-checkbox-group>
				<u-checkbox-group class="hourList" @change="checkboxGroupChange">
					<u-checkbox @change="checkboxChange" v-model="item.checked" :disabled="item.disabled"
						label-size="item.size" v-for="(item, index) in hourList2" :key="index" :name="item.name">
						{{item.name}}</u-checkbox>
				</u-checkbox-group>
				<u-checkbox-group class="hourList" @change="checkboxGroupChange">
					<u-checkbox @change="checkboxChange" v-model="item.checked" :disabled="item.disabled"
						label-size="item.size" v-for="(item, index) in hourList3" :key="index" :name="item.name">
						{{item.name}}</u-checkbox>
				</u-checkbox-group>
			</view>
		</view> -->
		<time-selector @selectTime="selectTimeEvent" startTime="08:30" endTime="22:00" selectedTabColor="#0092D5"
			selectedItemColor="#0094D7" timeSlot=1 disableText="已约"></time-selector>

		<u-button type="primary" shape="square" size="default">预定</u-button>

	</view>
</template>

<script>
	import timeSelector from '@/components/xiujun-time-selector/index.vue';

	export default {
		components: {
			timeSelector
		},

		data() {

			return {
				query: {},
				roomName: '亚洲01',
				roomInfo: '人数×18 八爪鱼×1 投影×1'
				/* dateList: [{
					name: '今天8-17'
				}, {
					name: '明天8-18'
				}, {
					name: '后天8-19',
				}, {
					name: '周五8-20',
				}, {
					name: '更多',
				}],
				currentDate: 0,
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				showPicker: false,
				range1: [{
					"value": 0,
					"text": "0830"
				}, {
					"value": 1,
					"text": "0900"
				}, {
					"value": 2,
					"text": "0930"
				}, {
					"value": 3,
					"text": "1000"
				}, {
					"value": 4,
					"text": "1030"
				}, {
					"value": 5,
					"text": "1100"
				}, {
					"value": 6,
					"text": "1130"
				}, {
					"value": 7,
					"text": "1200"
				}, {
					"value": 8,
					"text": "1230"
				}],
				range2: [{
					"value": 0,
					"text": "1230"
				}, {
					"value": 1,
					"text": "1300"
				}, {
					"value": 2,
					"text": "1330"
				}, {
					"value": 3,
					"text": "1400"
				}, {
					"value": 4,
					"text": "1430"
				}, {
					"value": 5,
					"text": "1500"
				}, {
					"value": 6,
					"text": "1530"
				}, {
					"value": 7,
					"text": "1600"
				}, {
					"value": 8,
					"text": "1700"
				}],
				range3: [{
					"value": 0,
					"text": "1630"
				}, {
					"value": 1,
					"text": "1700"
				}, {
					"value": 2,
					"text": "1730"
				}, {
					"value": 3,
					"text": "1800"
				}, {
					"value": 4,
					"text": "1830"
				}, {
					"value": 5,
					"text": "1900"
				}, {
					"value": 6,
					"text": "1930"
				}, {
					"value": 7,
					"text": "2000"
				}, {
					"value": 8,
					"text": "2130"
				}],
				hourList1: [{
						name: '0830',
						checked: false,
						disabled: true
					},
					{
						name: '0930',
						checked: false,
						disabled: false
					},
					{
						name: '1000',
						checked: false,
						disabled: false
					}, {
						name: '1030',
						checked: false,
						disabled: false
					},
					{
						name: '1100',
						checked: false,
						disabled: false
					},
					{
						name: '1130',
						checked: false,
						disabled: false
					},
					{
						name: '1200',
						checked: false,
						disabled: false
					}, {
						name: '1230',
						checked: false,
						disabled: true
					},
					{
						name: '1300',
						checked: false,
						disabled: false
					}
				],
				hourList2: [{
						name: '0900',
						checked: false,
						disabled: true
					},
					{
						name: '0930',
						checked: false,
						disabled: false
					},
					{
						name: '1000',
						checked: false,
						disabled: false
					}, {
						name: '1030',
						checked: false,
						disabled: false
					},
					{
						name: '1100',
						checked: false,
						disabled: false
					},
					{
						name: '1130',
						checked: false,
						disabled: false
					},
					{
						name: '1200',
						checked: false,
						disabled: false
					}, {
						name: '1230',
						checked: false,
						disabled: true
					},
					{
						name: '1300',
						checked: false,
						disabled: false
					}
				],
				hourList3: [{
						name: '0900',
						checked: false,
						disabled: true
					},
					{
						name: '0930',
						checked: false,
						disabled: false
					},
					{
						name: '1000',
						checked: false,
						disabled: false
					}, {
						name: '1030',
						checked: false,
						disabled: false
					},
					{
						name: '1100',
						checked: false,
						disabled: false
					},
					{
						name: '1130',
						checked: false,
						disabled: false
					},
					{
						name: '1200',
						checked: false,
						disabled: false
					}, {
						name: '1230',
						checked: false,
						disabled: true
					},
					{
						name: '2130',
						checked: false,
						disabled: false
					}
				] */

			}
		},
		created() {

		},
		onLoad() {
			this.query = this.$Route.query;
			console.log('query:', this.query);
		},
		methods: {

			/* changeTab(index) {
				this.currentTab = index;

			},
			changeDate(index) {
				console.log(index)
				this.currentDate = index;

				//更多
				if (index == 4) {
					this.showPicker = true
				}
			},
			// 选中某个复选框时，由checkbox时触发
			checkboxChange(e) {
				//console.log(e);
			},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
				// console.log(e);
			},
			// 全选
			checkedAll() {
				this.list.map(val => {
					val.checked = true;
				})
			} */

		},
	}
</script>

<style lang="scss" scoped>
	
	  .image {
	    width: 100%;
		height: 8rem;
	    display: block;
	  }
	
	  .roomName {
		  font-size: 1.5rem;
		  color: #007AFF;
		  margin-right: 2rem;
	  }
</style>
