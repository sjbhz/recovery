chooseImage: async function(type) {
				uni.chooseImage({
					sourceType:  [type],
					sizeType: ['compressed', 'original'],
					count: this.countIndex,
					success: (res) => {
						this.aimgurl = res.tempFilePaths[0];
						
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