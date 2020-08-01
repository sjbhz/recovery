<template>
	<view>
		<view class="top">
			<view class="userinfo">
				<!-- 取userinfo变量中的avatarUrl 字段，也就是微信头像的连接 -->
				<image class="userimage" v-if="!isShow" src="../../../static/user-unlogin.png"></image>
				<image class="userimage" v-if="isShow" :src="userInfo.avatarUrl"></image>
			</view>
			<view class="Username">
				<!-- 取userinfo变量中的nickName字段，也就是微信昵称 -->
				<!-- #ifdef APP-PLUS || MP-ALIPAY || MP-TOUTIAO -->
				<label v-if="nameShow" @click="getUserInfo">登录</label>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ -->
				<!-- <label class="logining" v-if="nameShow" open-type="getUserInfo" @getuserinfo="mpGetUserInfo">登录</label> -->
				<label class="logining" v-if="nameShow" @click="mpGetUserInfo">登录</label>
				<!-- #endif -->
				<label v-if="!nameShow">{{userInfo.nickName}}</label>
			</view>
		</view>
		<div class="gap"></div>
		<div class="container">
			<div class="row">
				<label class="left">
					<!-- <image class="img" src=""></image> -->
				</label>
				<label class="name">
					<uni-icons type="compose" size="18"></uni-icons>
					<text>意见反馈</text>
				</label>
				<label class="right" @click="advice">
					>
				</label>
			</div>
		</div>

	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {
				// 用户信息
				isShow: false,
				nameShow:true,
				hasUserInfo: false,
				userInfo: {}
			}
		},
		computed: {
			// ...mapState({
			// 	loginProvider: state => state.loginProvider
			// })
		},
		// onShow() {
		// 	const userinfo = uni.getStorageSync('userinfo')
		// 	if (userinfo.openId) {
		// 		this.userinfo = userinfo
		// 		this.isShow = true
		// 	}
		// },
		methods: {
			// 获取用户信息 API 在小程序可直接使用，在 5+App 里面需要先登录才能调用
			getUserInfo() {
				uni.getUserInfo({
					// provider: this.loginProvider,
					success: (result) => {
						console.log('getUserInfo success', result);
						this.hasUserInfo = true;
						this.userInfo = result.userInfo;
						this.nameShow = true;
					},
					fail: (error) => {
						console.log('getUserInfo fail', error);
						let content = error.errMsg;
						if (~content.indexOf('uni.login')) {
							content = '请在登录页面完成登录操作';
						}
			            // #ifndef APP-PLUS
						uni.getSetting({
							success: (res) => {
								let authStatus = res.authSetting['scope.userInfo'];
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: 'Hello uni-app需要获取您的用户信息，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								} else {
									uni.showModal({
										title: '获取用户信息失败',
										content: '错误原因' + content,
										showCancel: false
									});
								}
							}
						})
			            // #endif
			            // #ifdef APP-PLUS
			            uni.showModal({
			            	title: '获取用户信息失败',
			            	content: '错误原因' + content,
			            	showCancel: false
			            });
			            // #endif
					}
				});
			},
			mpGetUserInfo(result) {
				console.log('mpGetUserInfo', result);
				if (result.detail.errMsg !== 'getUserInfo:ok') {
					uni.showModal({
						title: '获取用户信息失败',
						content: '错误原因' + result.detail.errMsg,
						showCancel: false
					});
					return;
				}
				this.hasUserInfo = true;
				this.userInfo = result.detail.userInfo;
			},
			advice() {
				uni.showModal({
					content: `thank you`,
					showCancel: false
				})
			},
		}
	}
</script>

<style>
	.container {
		margin-top: 10px;
		background: #FFFFFF;
		font-size: 15px;
	}

	.row {
		padding: 0px 18px;
		border-bottom: 1px #E8E8E8 solid;
		height: 55px;
		line-height: 55px;
	}

	.img {
		float: left;
		width: 20px;
		height: 20px;
		padding-top: 16px;
	}

	.name {
		float: left;
	}
	.Username{
		float: left;
		width: 120rpx;
		height: 120rpx;
		padding: 30upx;
		text-align: center;
	}

	text {
		padding-left: 10upx;
	}

	.right {
		float: right;
		color: #C8C8C8;
		line-height: 55px;
	}

	.left {
		width: 80%;
	}

	.top {
		height: 200upx;
		width: 100%;
		/* 		background: #EA5149; */
		padding-top: 30px;
		display: block;
	}

	.userinfo {
		padding-bottom: 5px;
		float: left;
	}

	.userimage {
		width: 120rpx;
		height: 120rpx;
		margin: 15rpx;
		border-radius: 10upx;
		border: 1px #D0D0D0 solid;
		text-align:center;
	}
	.gap {
		background-color: #f4f5f6;
		height: 25upx;
	}
</style>
