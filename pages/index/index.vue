<template>
	<view class="mainPage">
		<!-- <uni-nav-bar left-icon="back" left-text="返回" right-text="菜单" title="标题"></uni-nav-bar> -->
		<view class="head">
			<view class="uni-flex">
				<view class="flex-item title">垃圾识别</view>
				<view class="flex-item city" @tap="changeCity" :data-currentCity="currentCity">{{currentCity}}></view>
				<!-- <view class="flex-item city" @tap="changeCity" :data-chooseCity="chooseCity">{{chooseCity}}></view> -->
			</view>
		</view>
		<view class="body">
			<view class="pic">
				<image src="../../static/recovery.jpg"></image>
			</view>
		</view>
		<view class="searchPart">
			<view class="inputSearch">
				<uni-search-bar @confirm="confirmSearch" @input="inputWord" />
			</view>
			<view class="commonWords">
			</view>
			<view class="uni-flex discernMethods">
				<view class="flex-item photoMethod" @click="takePic">
					<uni-icons type="camera" size="30"></uni-icons>
					<text>拍照识别</text>
				</view>
				<view class="flex-item pictureMethod" @click="choosePhoto">
					<uni-icons type="image" size="30"></uni-icons>
					<text>图片识别</text>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				currentCity: '北京',
				aimgurl: '', //临时图片的路径
				countIndex: 1, //可选图片的剩余数量
				imageList: [], //所选上传的图片数据
				searchName: '',
				chooseCity: ''
			}
		},
		onUnload() {
			this.aimgurl = '';
			this.countIndex = 1;
		},
		onLoad() {
			// this.ctx = wx.createCameraContext()
		},
		methods: {
			confirmSearch(e) { //回车确认
				console.log(e.value)
				this.searchName = e.value

				uniCloud.callFunction({
					name: 'get',
					data: {
						_keyword: this.searchName
					}
				}).then((res) => {
					uni.hideLoading()
					console.log(res)
					// this.dataAI =JSON.stringify(res.result.data)
					this.dataAI = res.result.data
					if (this.dataAI.length == 1) {
						this.sortIdAI = this.dataAI[0].sortId
						this.sortIdMessage = this.handleSort(this.sortIdAI)
						uni.showModal({
							content: `${this.searchName}为：${this.sortIdMessage}`,
							showCancel: false
						})
					} else if (this.dataAI.length < 1) {
						this.sortIdAI = 0
						uni.showModal({
							content: `数据库无此数据，马不停蹄更新中...`,
							showCancel: false
						})
					} else {
						uni.showModal({
							content: `数据库数据重复`,
							showCancel: false
						})
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
			handleSort: function(index) {
				switch (index) {
					case "1":
						return "可回收物"
					case "2":
						return "有害垃圾"
					case "3":
						return "湿垃圾"
					case "4":
						return "干垃圾"
				}
			},

			changeCity(e) {				
				uni.$on("globleEvent", (options) => {
					console.log(options)
					this.currentCity = options.data
					uni.$off('globleEvent')
				})

				var currentCity = e.currentTarget.dataset.currentcity; //获取当前的id号
				uni.navigateTo({ //页面跳转
					url: '../component/changeCity/changeCity?currentcity=' + currentCity,
				});
			},
			takePic(e) {
				let that = this;
				that.chooseImage('camera');
			},
			choosePhoto() {
				let that = this;
				that.chooseImage('album');
			},
			chooseImage: async function(type) {
				uni.chooseImage({
					sourceType: [type],
					sizeType: ['compressed', 'original'],
					count: this.countIndex,
					success: (res) => {
						this.aimgurl = res.tempFilePaths[0];
						// this.aimgurl = res.tempFilePaths;

						uni.navigateTo({
							url: '../component/takePhoto/takePhoto?aimgurl=' + this.aimgurl,
							// url: '../component/takePhoto/takePhoto?res=' + res,
						});

					},
					fail: (err) => {
						// #ifdef MP
						uni.getSetting({
							success: (res) => {
								let authStatus = false;
								switch (type) {
									case 'camera':
										authStatus = res.authSetting['scope.camera'];
										break;
									case 'album':
										authStatus = res.authSetting['scope.album'];
										break;
									default:
										break;
								}
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: '小程序需要从您的相机或相册获取图片，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
						// #endif
					}
				})
			},
			//上传图片到服务器 （小程序中一次只能一张）
			// upLoadImgFun: function(tempFilePathsData) {
			// 	let that = this;
			// 	let orderCommentMaterial = []; //每次选择添加的图片并上传到服务器后的图片信息
			// 	tempFilePathsData.forEach((item, index) => {
			// 		wx.uploadFile({
			// 			url: HTTP.uploadFileUrl(), //上传服务器的后台请求接口地址
			// 			filePath: item, //要上传的图片数据对象
			// 			name: 'file', //上传类型
			// 			header: {
			// 				'content-Type': 'multipart/form-data' //form表单格式上传
			// 			},
			// 			//要携带的参数
			// 			formData: {
			// 				"systemCode": "aaa",
			// 				"belongCode": "cccccc",
			// 				"belongID": "123456"
			// 			},
			// 			success(res) {
			// 				console.log(res);
			// 			},
			// 			fail(err) {
			// 				console.log(err);
			// 			},
			// 			complete(all) {
			// 				console.log(all);
			// 			}

			// 		})
			// 	})
			// }


		}
	}
</script>

<style>
	.mainPage {
		padding: 5upx 25upx;
	}

	.head {
		padding-bottom: 20upx;
	}

	.uni-flex {
		display: flex;
		flex-direction: row;
	}

	.flex-item {
		width: 50%;
		line-height: 2em;
	}

	.title {
		text-align: left;
		line-height: 2em;
		font-weight: 700;
		font-size: 42upx;
	}

	.city {
		text-align: right;
		vertical-align: center;
		line-height: 2em;
		font-size: 32upx;
	}

	image {
		width: 100%;
		margin: 0 auto;
		border-radius: 25upx;
	}

	.discernMethods {
		height: 320upx;

	}

	.photoMethod {
		flex-direction: column;
		margin: 50upx;
		border: 1rpx solid #da3131;
		background-color: #da3131;
		border-radius: 50upx;
	}

	.pictureMethod {
		flex-direction: column;
		margin: 50upx;
		border: 1rpx solid #dfdf13;
		background-color: #dfdf13;
		border-radius: 50upx;
	}

	uni-icons {
		text-align: center;
		display: block;
		margin-top: 20upx;

	}

	text {
		display: block;
		text-align: center;
		margin-top: 20upx;
		/* line-height: 110upx; */
	}
</style>
