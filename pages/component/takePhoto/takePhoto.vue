<template>
	<view>
		<view class="photoDisplay">
			<view class="aimgurl">
				<image class="aimgurl_img" :src="aimgurl" :data-src="aimgurl"></image>
			</view>
			<view class="loadingAI" v-if="isShow === false">
				<view>图片识别中...</view>
			</view>
			<view class="classifyAI" v-if="isShow === true">
				<view class="eachAI" v-for="(item,index) in results" @click="selectedKeyword" :data-keyword="item.keyword">{{item.keyword}}</view>
			</view>
			<!-- <view class="showPlace" v-if="isShow === true">
				<view></view>
			</view> -->
			<!-- <view class="photoAgain" @click="againChoose">重新选择图片</view> -->

		</view>
	</view>

</template>

<script>
	
	const fileSystemManager = uni.getFileSystemManager()
	export default {
		data() {
			return {
				aimgurl: "",
				baiduToken: "",
				accessToken: "",
				expiresIn: "",
				isShow: false,
				results: [],
				dataAI: [],
				sortIdAI: 0,
				sortIdMessage: '',
				keyword: ""
			}
		},
		// onReady() {
		// },
		onLoad: function(e) {
			//获取BaiduTaken
			if (!this.accessToken) {
				this.getBaiduToken();
			}
			var time = uni.getStorageSync("time")
			var curTime = new Date().getTime()
			var timeNum = curTime - time
			console.log("=======" + timeNum)
			var accessToken = uni.getStorageSync("access_token")
			console.log("====accessToken===" + accessToken + "a")
			if (timeNum < 0 || (accessToken == "" ||
					accessToken == null || accessToken == undefined)) {
				this.getBaiduToken()
			} else {
				this.accessToken = uni.getStorageSync("access_token")
			}

			try { //查看Storage中的keys
				const res = uni.getStorageInfoSync();
				console.log(res.keys);
			} catch (e) {
				// error
			}

			console.log(e)
			this.aimgurl = e.aimgurl;
			this.handlePhoto(this.aimgurl);
		},
		methods: {
			selectedKeyword(e) {
				console.log(e)
				this.keyword = e.currentTarget.dataset.keyword; //点击的keyword
				this.get(this.keyword);

			},
			get(keyword) {
				uni.showLoading({
					title: '处理中...'
				})
				uniCloud.callFunction({
					name: 'get',
					data: {
						_keyword: keyword
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
							content: `${this.keyword}为：${this.sortIdMessage}`,
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
			handlePhoto(aimgurl) {
				fileSystemManager.readFile({
					filePath: aimgurl,
					encoding: "base64",
					success: res => {
						console.log(res)
						this.getBaiduToken()
						var buffer = res.data
						this.req(this.accessToken, buffer)
						console.log(444)
						console.log(this)
					},
					fail: res => {
						uni.hideLoading()
						uni.showToast({
							title: '拍照失败,未获取相机权限或其他原因',
							icon: "none"
						})
					}
				})
				uni.getImageInfo({
					src: aimgurl,
					success: function(res) {
						// this.cutImg(res)
					}
				})
			},
			req: function(token, image) {
				let that = this;
				uni.request({
					url: 'https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=' + token,
					method: 'POST',
					data: {
						image: image
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: function(res) {
						console.log("req提示pass", res);
						uni.hideLoading()
						console.log(JSON.stringify(res))
						var code = res.data.err_code
						if (code == 111 || code == 100 || code == 110) {
							uni.clearStorageSync("access_token")
							uni.clearStorageSync("time")
							this.getBaiduToken()
							return
						}
						var results = res.data.result
						if (results != undefined && results != null) {
							console.log(results) //识别的结果显示
							that.results = results
							that.isShow = true
						} else {
							uni.clearStorageSync("access_token")
							uni.showToast({
								icon: 'none',
								title: 'AI识别失败,请重新尝试',
							})
						}
					},
					fail: function(res) {
						console.log("req提示fail", res);
					}
				})
			},
			//获取baiduToken(图片)
			getBaiduToken: function() {
				let that = this
				const apiKey = 'UkcYT474c2DIPRb3WDFmKq8c';
				const secKey = 'QcRpqOKy15NjWksnnj8KG3L9QdPifaas';
				const tokenUrl = 'https://aip.baidubce.com/oauth/2.0/token' +
					'?grant_type=client_credentials' +
					'&client_id=UkcYT474c2DIPRb3WDFmKq8c&client_secret=QcRpqOKy15NjWksnnj8KG3L9QdPifaas';
				uni.request({
					url: tokenUrl,
					method: 'POST',
					dataType: "json",
					header: {
						'content-type': 'application/json; charset=UTF-8'
					},
					success: function(res) {
						console.log("getBaiduTaken提示pass", res);
						// const {access_token, expires_in} = res.data;  
						console.log(22)
						console.log(that)
						that.accessToken = res.data.access_token //access_token： 要获取的Access Token； 
						that.expiresIn = res.data.expires_in //expires_in： Access Token的有效期(秒为单位，一般为1个月)；
						console.log(that.accessToken)
						uni.setStorageSync("access_token", res.data.access_token)
						uni.setStorageSync("time", new Date(res.header.Date).getTime())
					},
					fail: function(res) {
						console.log("getBaiduTaken提示fail", res);
					}
				})
			},
			againChoose: function() {
				console.log(123)
				this.chooseImage('album');
				this.isShow = false;
				this.handlePhoto(this.aimgurl);
				
			},
			chooseImage: async function(type) {
				uni.chooseImage({
					sourceType: [type],
					sizeType: ['compressed', 'original'],
					count: 1,
					success: (res) => {
						this.aimgurl = res.tempFilePaths[0];

						// uni.navigateTo({
						// 	url: '../component/takePhoto/takePhoto?aimgurl=' + this.aimgurl,
						// });

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
		}
	}
</script>

<style>
	.loadingAI {
		height: 450upx;
		line-height: 450upx;
		background-color: #f4f5f6;
		border: 1px solid #f4f5f6;
		text-align: center;
	}

	.classifyAI {
		height: 450upx;
		line-height: 2rem;
		background-color: #f4f5f6;
		border: 1px solid #f4f5f6;
	}

	.eachAI {
		float: left;
		display: block;
		margin: 15upx;
		padding: 12upx;
		border: 1px solid green;
		border-radius: 20upx;
	}

	.showPlace {
		height: 200upx;
		background-color: #dcdbdb;
	}

	.photoAgain {
		margin: 40upx 250upx;
		border: 1px solid #dcdbdb;
		line-height: 2.5rem;
		text-align: center;
	}
</style>
