const mongoose = require('mongoose');

export function convertToObjectId(str) {
	try {
		const objectId = mongoose.Types.ObjectId(str);
		return objectId;
	} catch (error) {
		return error;
	}
}

function isObjectId(str) {
	if (typeof str !== 'string') {
		return false;
	}

	return mongoose.Types.ObjectId.isValid(str);
}
