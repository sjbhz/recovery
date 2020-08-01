'use strict';
const openapi = require('mp-cloud-openapi')

exports.main = async (event, context) => { //event为客户端上传的参数
	console.log('event : ' + event)
	var type = event.type
	var buffer = event.buffer
	console.log("===type==" + type)
	console.log("===buffer==" + buffer)
	try {
		const result = await uniCloud.openapi.security.imgSecCheck({
			media: {
				header: {
					'Content-Type': 'application/octet-stream'
				},
				contentType: type,
				value: Buffer.from(buffer)
			}
		})
		return result //返回数据给客户端
	} catch (err) {
		return err
	}
};
