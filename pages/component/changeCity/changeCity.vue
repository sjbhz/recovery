<template>
	<view class="changeCity">
		<view class="head">
			<view class="city">
				切换城市
			</view>
		</view>
		<view class="uni-flex current">
			<view class="flex-current selected">当前已选： {{selectedCity}}</view>
			<view class="flex-item location">
				<button size="mini" style="color: #007AFF;" @click="getLocation" :data-locationCity="locationCity"> 定位
					<uni-icons type="location-filled" color="#007AFF"></uni-icons>
				</button>
			</view>
		</view>
		<view class="hotCity">
			<view>热门城市</view>
			<view style="padding-top: 10upx;">
				<button size="mini" style="margin: 10upx;" @click="hotcityChoose(item)" v-for="(item, index) in cityArray">{{item}}</button>
			</view>
		</view>
		<view class="uni-flex others">
			<view class="flex-current">选择其他</view>
			<view class="changeingCity">
				<picker @change="bindPickerChange" :value="index" :range="array" range-key="name">
					<!-- <view class="uni-input">{{array[index].name}}></view> -->
					<view class="uni-input">{{selectedCity}}></view>
				</picker>
			</view>
		</view>
	</view>
</template>

<script>
	import cityChoose from '@/common/cityChoose.js'
	export default {
		data() {
			return {
				locationCity: '',
				selectedCity: '',
				array: cityChoose.list,
				index: 0,
				cityArray: ['北京', '上海', '广州', '深圳', '长沙']
			}
		},
		onLoad(e) { //接受来自index 的 newsid
			console.log(e)
			this.selectedCity = e.currentcity;
		},
		methods: {
			getLocation(e) {
				var that = this
				console.log(e)
				uni.getLocation({
					success(res) {
						console.log(res)
					}
				})
				uni.chooseLocation({
					success(res) {
						console.log(res)
						console.log('位置名称：' + res.name);
						console.log('详细地址：' + res.address);
						var addressTemp = res.address
						var matchStr = addressTemp.substring(0, 2)
						if (matchStr == '黑龙') {
							that.selectedCity = '黑龙江'
						} else {
							that.selectedCity = matchStr;
							that.globalEvent(matchStr)
						}

					}
				})
			},
			hotcityChoose: function(item) {
				this.selectedCity = item			
				this.globalEvent(item)
			
			},
			bindPickerChange: function(e) {
				let that = this
				console.log('picker发送选择改变，携带值为：' + e.detail.value)
				this.index = e.detail.value
				this.selectedCity = this.array[this.index].name
				this.globalEvent(that.selectedCity)
				
			},
			globalEvent(value){
				let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息
				let prevPage = pages[pages.length - 2];
				uni.$emit("globleEvent", {
					data: value,
				})
				//关闭当前窗口
				uni.navigateBack({});
			},

		}
	}
</script>

<style>
	.changeCity {
		/* padding: 5upx 25upx; */
	}

	.head {
		padding: 15upx;
		border-bottom: 1upx solid #CCCCCC;
	}

	.city {
		text-align: left;
		line-height: 2em;
		font-weight: 700;
		font-size: 42upx;
	}

	.current {
		padding: 20upx 20upx 10upx 20upx;
		font-size: 32upx;
		border-bottom: 1upx solid #CCCCCC;
	}

	.uni-flex {
		display: flex;
		flex-direction: row;
	}

	.flex-current {
		width: 70%;
		line-height: 2em;
	}

	.flex-item {
		width: 30%;
		line-height: 2em;
	}

	.location {
		text-align: right;
	}

	.hotCity {
		padding: 20upx;
		font-size: 32upx;
		border-bottom: 1upx solid #CCCCCC;
	}

	.others {
		padding: 20upx;
		line-height: 2em;
		font-size: 32upx;
	}

	.changeingCity {
		padding-left: 90upx;
	}
</style>
