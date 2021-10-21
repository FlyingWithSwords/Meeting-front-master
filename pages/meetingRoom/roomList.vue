<template>
	<view>
		<u-subsection :list="tabList" :current="currentTab" @change="changeTab"></u-subsection>
		<!-- <u-tabs :list="tabList" :is-scroll="false" :current="currentTab" @change="changeTab"></u-tabs> -->
		<u-index-list :scrollTop="scrollTop">
			<view v-for="(item, index) in roomList" :key="index">
				<u-index-anchor :index="item.name" />
				<view class="list-cell" v-for="(i,num) in item.list" :key="num" @click="goTo(i.id)">
					{{i.roomName}}
				</view>
			</view>
		</u-index-list>
		<u-tabbar v-model="currentTarbar" :list="tarbarList"></u-tabbar>

	</view>
</template>

<script>
	export default {
		data() {

			return {
				currentTarbar: 0,
				tarbarList: [{
						iconPath: "home",
						selectedIconPath: "home-fill",
						text: '我的会议',
						count: 2,
						isDot: true,
						customIcon: false,
					},
					{
						iconPath: "account",
						selectedIconPath: "account-fill",
						text: '我的',
						count: 0,
						isDot: false,
						customIcon: false,
					},
				],
				tabList: [{
					name: '我关注的'
				}, {
					name: '全部'
				}],
				currentTab: 0,
				scrollTop: 0,
				roomList: [],
				myRoomList: [{
						name: 'A',
						list: [{
							"id": 0,
							"roomName": "亚洲01"
						}]
					},
					{
						name: 'B',
						list: [{
							"id": 2,
							"roomName": "本国01"
						}, {
							"id": 3,
							"roomName": "本国02"
						}]
					},
					{
						name: 'C',
						list: []
					},
					{
						name: 'D',
						list: []
					},
					{
						name: 'E',
						list: []
					},
					{
						name: 'F',
						list: []
					},
					{
						name: 'G',
						list: []
					},
					{
						name: 'H',
						list: []
					},
					{
						name: 'I',
						list: []
					},
					{
						name: 'J',
						list: []
					},
					{
						name: 'K',
						list: []
					},
					{
						name: 'L',
						list: []
					},
					{
						name: 'M',
						list: []
					},
					{
						name: 'N',
						list: []
					},
					{
						name: 'O',
						list: []
					},
					{
						name: 'P',
						list: []
					},
					{
						name: 'Q',
						list: []
					},
					{
						name: 'R',
						list: []
					},
					{
						name: 'S',
						list: []
					},
					{
						name: 'T',
						list: []
					},
					{
						name: 'U',
						list: []
					},
					{
						name: 'V',
						list: []
					},
					{
						name: 'W',
						list: []
					},
					{
						name: 'X',
						list: []
					},
					{
						name: 'Y',
						list: []
					},
					{
						name: 'Z',
						list: []
					}
				],
				allRoomList: [{
						name: 'A',
						list: [{
							"id": 0,
							"roomName": "亚洲01"
						}, {
							"id": 1,
							"roomName": "亚洲02"
						}]
					},
					{
						name: 'B',
						list: [{
							"id": 2,
							"roomName": "本国01"
						}, {
							"id": 3,
							"roomName": "本国02"
						}]
					},
					{
						name: 'C',
						list: []
					},
					{
						name: 'D',
						list: []
					},
					{
						name: 'E',
						list: []
					},
					{
						name: 'F',
						list: []
					},
					{
						name: 'G',
						list: []
					},
					{
						name: 'H',
						list: []
					},
					{
						name: 'I',
						list: []
					},
					{
						name: 'J',
						list: []
					},
					{
						name: 'K',
						list: []
					},
					{
						name: 'L',
						list: []
					},
					{
						name: 'M',
						list: []
					},
					{
						name: 'N',
						list: []
					},
					{
						name: 'O',
						list: []
					},
					{
						name: 'P',
						list: []
					},
					{
						name: 'Q',
						list: []
					},
					{
						name: 'R',
						list: []
					},
					{
						name: 'S',
						list: []
					},
					{
						name: 'T',
						list: []
					},
					{
						name: 'U',
						list: []
					},
					{
						name: 'V',
						list: []
					},
					{
						name: 'W',
						list: []
					},
					{
						name: 'X',
						list: []
					},
					{
						name: 'Y',
						list: []
					},
					{
						name: 'Z',
						list: []
					},
				],
				onPageScroll(e) {
					this.scrollTop = e.scrollTop;
				},
			}
		},
		created() {
			console.log('111')
			this.roomList = this.myRoomList
		},
		methods: {

			changeTab(index) {
				this.currentTab = index;
				if (this.currentTab == 0) {
					this.roomList = this.myRoomList
				} else {
					this.roomList = this.allRoomList
				}
			},
			goTo(id) {
				this.$Router.push({
					name: 'newpage',
					params: {
						id: 1
					}
				});
			},
		},
	}
</script>

<style lang="scss" scoped>
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

	.my-meeting {
		width: 400rpx;
	}
</style>
