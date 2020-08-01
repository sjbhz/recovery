<template>
	<view>
		<view class="inputSearch">
			<uni-search-bar @confirm="confirmSearch" @input="inputWord" />
		</view>
		<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="text" active-color="#4cd964">
		</uni-segmented-control>
		<view class="content">
			<view v-show="current === 0">
				<view class="uni-flex residual">
					<view class="flex-item">
						<image src="../../../static/residual.jpg" style="width: 245upx;height: 220upx;padding-top:10upx;"></image>
					</view>
					<view class="display">
						<text class="title">干垃圾</text>
						<text class="content">干垃圾即其他垃圾，指除可回收物、有害垃圾、湿垃圾以外的其他生活废弃物</text>
					</view>
				</view>
				<view class="group" v-for="(item) in residual">
					<view class="gap"></view>
					<view class="uni-flex demoresidual">
						<view class="demoImg">
							<image src="../../../static/residual.jpg" style="width: 50upx;height: 50upx;"></image>
						</view>
						<view class="demoEach">{{item}}</view>
					</view>
				</view>
			</view>
			<view v-show="current === 1">
				<view class="uni-flex household">
					<view class="flex-item">
						<image src="../../../static/household.jpg" style="width: 245upx;height: 220upx;padding-top:10upx;"></image>
					</view>
					<view class="display">
						<text class="title">湿垃圾</text>
						<text class="content">湿垃圾即厨余垃圾、有机垃圾，即易腐垃圾，指食材废料等易腐的物质生活废弃物</text>
					</view>
				</view>
				<view class="group" v-for="(item,index) in household">
					<view class="gap"></view>
					<view class="uni-flex demohousehold">
						<view class="demoImg">
							<image src="../../../static/household.jpg" style="width: 50upx;height: 50upx;"></image>
						</view>
						<view class="demoEach">{{item}}</view>
					</view>
				</view>
			</view>
			<view v-show="current === 2">
				<view class="uni-flex hazardous">
					<view class="flex-item">
						<image src="../../../static/hazardous.jpg" style="width: 245upx;height: 220upx;padding-top:10upx;"></image>
					</view>
					<view class="display">
						<text class="title">有害垃圾</text>
						<text class="content">常见包括废电池、废荧光灯管、废灯泡、废水银温度计、废油漆桶、过期药品等</text>
					</view>
				</view>
				<view class="group" v-for="(item,index) in hazardous">
					<view class="gap"></view>
					<view class="uni-flex demohazardous">
						<view class="demoImg">
							<image src="../../../static/hazardous.jpg" style="width: 50upx;height: 50upx;"></image>
						</view>
						<view class="demoEach">{{item}}</view>
					</view>
				</view>
			</view>
			<view v-show="current === 3">
				<view class="uni-flex recyclable">
					<view class="flex-item">
						<image src="../../../static/recyclable.jpg" style="width: 245upx;height: 220upx;padding-top:10upx;"></image>
					</view>
					<view class="display">
						<text class="title">可回收垃圾</text>
						<text class="content">可回收物即再生循环的垃圾，本身或材质可再利用的纸类、玻璃、塑料、金属等</text>
					</view>
				</view>
				<view class="group" v-for="(item,index) in recyclable">
					<view class="gap"></view>
					<view class="uni-flex demorecyclable">
						<view class="demoImg">
							<image src="../../../static/recyclable.jpg" style="width: 50upx;height: 50upx;"></image>
						</view>
						<view class="demoEach">{{item}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nameList: [],
				sortdata: [],
				items: ['干垃圾', '湿垃圾', '有害垃圾', '可回收'],
				current: 0,
				residual: [],
				household: [],
				hazardous: [],
				recyclable: [],
			}
		},
		onLoad() {
			this.getGarbageData("1");
			this.getGarbageData("2");
			this.getGarbageData("3");
			this.getGarbageData("4");
		},
		methods: {
			getGarbageData(sortId) {
				uni.showLoading({
					title: '处理中...'
				})
				uniCloud.callFunction({
					name: 'getSortIddata',
					data: {
						_sortId: sortId
					}
				}).then((res) => {
					uni.hideLoading()
					this.sortdata = res.result.data
					if (this.sortdata.length > 0) {
						if (sortId == "1") {
							this.sortdata.forEach((item, index) => {
								this.residual.push(item.name)
							})
						}
						if (sortId == "2") {
							this.sortdata.forEach((item, index) => {
								this.household.push(item.name)
							})
						}
						if (sortId == "3") {
							this.sortdata.forEach((item, index) => {
								this.hazardous.push(item.name)
							})
						}
						if (sortId == "4") {
							this.sortdata.forEach((item, index) => {
								this.recyclable.push(item.name)
							})
						}

					} else {
						console.log("数据库无此数据", sortId)
					}
				}).catch((err) => {
					uni.hideLoading()
					uni.showModal({
						content: `查询失败，错误信息为：${err.message}`,
						showCancel: false
					})
					console.error(err)
				})
			},
			confirmSearch(e) { //回车确认的值
				console.log(e.value)
				if (e.value) {
					this.residual.forEach((item0, index) => {
						if (item0 == e.value) {
							this.current = 0
						}
					})
					this.household.forEach((item1, index) => {
						if (item1 == e.value) {
							this.current = 1
						}
					})
					this.hazardous.forEach((item2, index) => {
						if (item2 == e.value) {
							this.current = 2
						}
					})
					this.recyclable.forEach((item3, index) => {
						if (item3 == e.value) {
							this.current = 3
						}
					})
				}
			},
			inputWord(e) { //输入框每次输入的值
				console.log(e)
			},
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
				}
			}

		}
	}
</script>

<style>
	.residual {
		height: 240upx;
		margin: 20upx;
		background-color: #2c2b30;
		border: 1px solid #2c2b30;
		border-radius: 10upx;
	}

	.household {
		height: 240upx;
		margin: 20upx;
		background-color: #694336;
		border: 1px solid #694336;
		border-radius: 10upx;
	}

	.hazardous {
		height: 240upx;
		margin: 20upx;
		background-color: #e73825;
		border: 1px solid #e73825;
		border-radius: 10upx;
	}

	.recyclable {
		height: 240upx;
		margin: 20upx;
		background-color: #024884;
		border: 1px solid #024884;
		border-radius: 10upx;
	}

	.uni-flex {
		display: flex;
		flex-direction: row;
	}

	.flex-item {
		width: 40%;
		line-height: 2em;
	}

	text {
		color: white;
		font-size: large;
	}

	.display {
		display: flex;
		flex-direction: column;
	}

	.title {
		line-height: 2em;
		font-size: larger;
	}

	.content {
		font-size: 32upx;
	}

	.gap {
		background-color: #f4f5f6;
		margin: 0 20upx;
		height: 25upx;
	}

	.demoresidual {
		margin: 0 20upx;
		background-color: #2c2b30;
	}

	.demohousehold {
		margin: 0 20upx;
		background-color: #694336;
	}

	.demohazardous {
		margin: 0 20upx;
		background-color: #e73825;
	}

	.demorecyclable {
		margin: 0 20upx;
		background-color: #024884;
	}

	.demoImg {
		margin: 0 20upx;
	}

	.demoEach {
		font-size: 32upx;
		color: white;
	}
</style>
