<template>
	<view>
		
	</view>
</template>
<template>
	<view>
		<view>
			<button style="width: 100px;height: 40px;background: #438BEF;color: #fff;" @tap='browse'>图片</button>
			<button style="width: 100px;height: 40px;background: #438BEF;color: #fff;" @tap='btnClick3'>拍摄照片</button>
		</view>
		<!-- <button type="primary" @click="add">新增一条数据</button> -->
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				aimgurl: "", //临时图片的路径
				countIndex: 1, //可选图片的剩余数量
				imageData: [], //所选上传的图片数据
				src: "",
			}
		},
		onLoad() {
			this.ctx = wx.createCameraContext()
		},
		methods: {
			add() {
				uni.showLoading({
					title: '处理中...'
				})
				uniCloud.callFunction({
					name: 'add',
					data: {
						name: '扁豆',
						sortId: '3',
					}
				}).then((res) => {
					uni.hideLoading()
					uni.showModal({
						content: `成功添加一条数据，文档id为：${res.result.id}`,
						showCancel: false
					})
					console.log(res)
				}).catch((err) => {
					uni.hideLoading()
					uni.showModal({
						content: `添加数据失败，错误信息为：${err.message}`,
						showCancel: false
					})
					console.error(err)
				})
			},
			//图片浏览及上传
			browse: function(e) {
				let that = this;
				wx.showActionSheet({
					itemList: ['从相册中选择', '拍照'],
					itemColor: '#438BEF',
					success: function(res) {
						if (!res.cancel) {
							if (res.tapIndex == 0) {
								that.chooseImage('album');
							} else if (res.tapIndex == 1) {
								that.chooseImage('camera');
							}
						}
					}
				})
			},
			
			btnClick3:function(){
				this.ctx.takePhoto({
					quality:'high',
					success:(res) =>{
						console.log(res)
						// this.setData({
						// 	src:res.tempImagePath
						// })
						this.src = res.tempImagePath
					}
				})
			},
			// chooseImage: function(type) { //打开相机，相册
			// 	let that = this;
			// 	console.log(that)
			// 	wx.chooseImage({
			// 		count: that.countIndex,
			// 		sizeType: ['original', 'compressed'],
			// 		sourceType: [type],
			// 		success: function(res) { //选择图片后的完成确认操作
			// 			console.log(res)
			// 			that.aimgurl = res.tempFilePaths[0]
			// 			console.log(that.aimgurl)
			// 			// that.upLoadImgFun(res.tempFilePaths);
			// 		}
			// 	})
			// },
			
			//打开相机，相册
			chooseImage: function(type) {
				let that = this;
				console.log(that)
				wx.chooseImage({
					count: that.countIndex,
					sizeType: ['original', 'compressed'],
					sourceType: [type],
					success: function(res) {
						console.log(res)
						that.aimgurl = res.tempFilePaths[0]
						console.log(that.aimgurl)
						
						// that.upLoadImgFun(res.tempFilePaths);
					}
				})
			},
			//上传图片到服务器 （小程序中一次只能一张）
			upLoadImgFun: function(tempFilePathsData) {
				let that = this;
				let orderCommentMaterial = []; //每次选择添加的图片并上传到服务器后的图片信息
				tempFilePathsData.forEach((item, index) => {
					wx.uploadFile({
						url: HTTP.uploadFileUrl(), //上传服务器的后台请求接口地址
						filePath: item, //要上传的图片数据对象
						name: 'file', //上传类型
						header: {
							'content-Type': 'multipart/form-data' //form表单格式上传
						},
						//要携带的参数
						formData: {
							"systemCode": "aaa",
							"belongCode": "cccccc",
							"belongID": "123456"
						},
						success(res) {
							console.log(res);
						},
						fail(err) {
							console.log(err);
						},
						complete(all) {
							console.log(all);
						}

					})
				})
			}

		}
	}
</script>

<style>

</style>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
