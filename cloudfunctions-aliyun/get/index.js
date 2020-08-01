'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {

	try {
		const collection = db.collection('lessproduct')
		// const res = await collection.get()
		const res = await collection.where({
			name: event._keyword
		}).get()
		
		return res
	} catch (e) {
		console.error(e)
	}

};
