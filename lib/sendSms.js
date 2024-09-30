import axios from 'axios';
const API_URL = 'http://sms.apars.shop/api/smsapi';
const API_KEY = 'OV9b0zDRYmWOdcQxA0Cb';
const SENDER_ID = '8809617618482';
export async function sendSmsPost(number, message) {
	const url = `${API_URL}`;
	const params = new URLSearchParams({
		api_key: API_KEY,
		type: 'text',
		number: number,
		senderid: SENDER_ID,
		message: message,
	});

	try {
		const response = await axios.post(url, params);
		return response.data;
	} catch (error) {
		throw error;
	}
}
