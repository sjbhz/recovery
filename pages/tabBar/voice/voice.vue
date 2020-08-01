<template>
	<view class="total">
		<!-- <view class="content">
			11
		</view> -->
		<view class="uni-padding-wrap">
			<view v-if="!recording && !playing && !hasRecord">
				<view class="page-body-time">
					<text class="time-big">{{formatedRecordTime}}</text>
				</view>
				<view class="page-body-buttons">
					<view class="page-body-button"></view>
					<view class="page-body-button" @click="startRecord">
						<image src="../../../static/record.png"></image>
					</view>
					<view class="page-body-button"></view>
				</view>
			</view>
			<block v-if="recording === true">
				<view class="page-body-time">
					<text class="time-big">{{formatedRecordTime}}</text>
				</view>
				<view class="page-body-buttons">
					<view class="page-body-button"></view>
					<view class="page-body-button" @click="stopRecord">
						<view class="button-stop-record"></view>
					</view>
					<view class="page-body-button"></view>
				</view>
			</block>
			<block v-if="hasRecord === true && playing === false">
				<view class="page-body-time">
					<text class="time-big">{{formatedPlayTime}}</text>
					<text class="time-small">{{formatedRecordTime}}</text>
				</view>
				<view class="page-body-buttons">
					<view class="page-body-button" @click="clear">
						<image src="../../../static/trash.png"></image>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	var util = require('../../../common/util.js')
	var recordTimeInterval = null;
	// const recorderManager1 = uni.getRecorderManager()
	// const fileSystemManager = uni.getFileSystemManager()
	const fileSystemManager = wx.getFileSystemManager()
	const recorderManager = wx.getRecorderManager()
	// const innerAudioContext = uni.createInnerAudioContext()
	export default {
		data() {
			return {
				recording: false, //录音中
				playing: false, //播放中
				hasRecord: false, //是否有了一个
				recordTime: 0,
				formatedRecordTime: '00:00:00', //录音的总时间
				tempFilePath: "",
				accessTokenVoice: "",
				expiresInVoice: "",
				dataAI: [],
			}
		},
		onUnload: function() {
			this.end();
		},
		onLoad: function() {
			// this.getBaiduVoiceToken()
			if (!this.accessTokenVoice) {
				this.getBaiduVoiceToken();
			}
			var time = uni.getStorageSync("time")
			var curTime = new Date().getTime()
			var timeNum = curTime - time
			console.log("=======" + timeNum)
			var accessTokenVoice = uni.getStorageSync("access_token")
			console.log("====accessTokenVoice===" + accessTokenVoice)
			if (timeNum < 28 || (accessTokenVoice == "" ||
					accessTokenVoice == null || accessTokenVoice == undefined)) {
				this.getBaiduVoiceToken()
			} else {
				// var timeNum = new Date(parseInt(new Date().getTime() - time) * 1000).getDay();
				this.accessTokenVoice = uni.getStorageSync("access_token")
			}

			try { //查看Storage中的keys
				const res = uni.getStorageInfoSync();
				console.log(res.keys);
			} catch (e) {
				// error
			}

			recorderManager.onError(() => {
				console.log('recorder onError');
			});
		},
		methods: {
			startRecord() {
				console.log(11)
				// const options = {
				// 	sampleRate: 8000,
				// 	numberOfChannels: 1,
				// 	encodeBitRate: 48000,
				// 	format: 'PCM', //音频格式
				// }
				const options = {
					sampleRate: 16000,
					numberOfChannels: 1,
					encodeBitRate: 32000,
					format: 'PCM', //音频格式
				}
				recorderManager.start(options); //开始录音

				this.recording = true;

				recorderManager.onStart((res) => {
					console.log('recorder start');
					recordTimeInterval = setInterval(() => {
						this.recordTime += 1;
						this.formatedRecordTime = util.formatTime(this.recordTime);
					}, 1000)
				});
			},
			stopRecord() {
				//停止录音
				var that= this
				recorderManager.stop();
				clearInterval(recordTimeInterval);
				var accessTokenVoice = this.accessTokenVoice

				recorderManager.onStop((res) => {

					this.hasRecord = true;
					this.recording = false;
					this.tempFilePath = res.tempFilePath; //音频文件路径

					console.log('停止录音', res.tempFilePath)
					console.log('token', accessTokenVoice)

					fileSystemManager.readFile({ //读取文件并转为ArrayBuffer
						filePath: this.tempFilePath,
						success(res) {
							// console.log(res)
							var base64 = uni.arrayBufferToBase64(res.data);
							var fileSize = res.data.byteLength;
							uni.request({
								url: 'https://vop.baidu.com/server_api',
								data: {
									format: 'pcm',
									rate: 8000,
									dev_pid: 1537,
									channel: 1,
									cuid: 'yuyin_workshop',
									token: accessTokenVoice,
									speech: base64,
									len: fileSize
								},
								method: 'POST',
								header: {
									'content-type': 'application/json' // 默认值
								},
								success(res) {
									uni.hideLoading()
									console.log(res)
									console.log(res.data)
									var result = res.data.result;
									console.log(result)
									if (result.length == 0) {
										uni.showToast({
											title: "未识别到语音信息！",
											icon: 'none',
											duration: 3000
										})
										return;
									}

									var keyword = result[0];
									keyword = keyword.replace("。", "");
									console.log(444)
									console.log(that)
									that.get(keyword);

								},
								fail(err) {
									console.log(err)
								}
							})
						}
					})

				})
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
			end() {
				recorderManager.stop();
				clearInterval(recordTimeInterval)
				this.recording = false, this.playing = false, this.hasRecord = false;
				this.recordTime = 0;
				this.formatedRecordTime = "00:00:00";
			},
			clear() {
				this.end();
			},
			//获取baiduToken(语音)
			getBaiduVoiceToken: function() {
				let that = this
				const apiKey = 'Gp48ZgMpUK6aDvvHYF0ZwqyA';
				const secKey = 'HGPgU1CQ2hBIs53k9EkF7VS7QNUcn4IR';
				const tokenUrl = 'https://aip.baidubce.com/oauth/2.0/token' +
					'?grant_type=client_credentials' +
					'&client_id=Gp48ZgMpUK6aDvvHYF0ZwqyA&client_secret=HGPgU1CQ2hBIs53k9EkF7VS7QNUcn4IR';
				uni.request({
					url: tokenUrl,
					method: 'POST',
					dataType: "json",
					header: {
						'content-type': 'application/json; charset=UTF-8'
					},
					success: function(res) {
						console.log("getBaiduVoiceToken提示pass", res);
						// const {access_token, expires_in} = res.data;  
						console.log(22)
						that.accessTokenVoice = res.data.access_token //access_token： 要获取的Access Token； 
						that.expiresInVoice = res.data.expires_in //expires_in： Access Token的有效期(秒为单位，一般为1个月)；
						console.log(that.accessTokenVoice)
						uni.setStorageSync("access_token", res.data.access_token)
						uni.setStorageSync("time", new Date(res.header.Date).getTime())
					},
					fail: function(res) {
						console.log("getBaiduVoiceToken提示fail", res);
					}
				})
			},
		}
	}
</script>

<style>
	.total {
		/* background-color: lavender; */
	}

	.content {
		margin-left: 50rpx;
		width: 650rpx;
		height: 500rpx;
		background-color: #d3d3d3;
	}

	.time-big {
		font-size: 60rpx;
		margin: 20rpx;
	}

	.page-body-buttons {
		margin-top: 230rpx;
		display: flex;
		justify-content: space-around;
	}

	.page-body-button {
		/* background-color: lavender; */
		text-align: center;
	}

	image {
		width: 150rpx;
		height: 150rpx;
	}

	.button-stop-record {
		width: 110rpx;
		height: 110rpx;
		border: 20rpx solid #fff;
		background-color: #f55c23;
		border-radius: 130rpx;
		margin: 0 auto;
	}
</style>
