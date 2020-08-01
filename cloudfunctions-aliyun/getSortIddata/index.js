'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {

	try {
		const collection = db.collection('lessproduct')
		// const res = await collection.get()
		const res = await collection.where({
			sortId: event._sortId
		}).get()
		
		return res
	} catch (e) {
		console.error(e)
	}

};
