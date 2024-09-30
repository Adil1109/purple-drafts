export function formatPhoneNumber(phoneNumber) {
	let cleaned = phoneNumber.replace(/\D/g, '');

	if (cleaned.startsWith('880')) {
		return cleaned;
	} else if (cleaned.startsWith('0')) {
		return '88' + cleaned;
	} else if (cleaned.startsWith('8')) {
		return '8' + cleaned;
	} else if (cleaned.length === 10 && cleaned.startsWith('1')) {
		return '880' + cleaned;
	} else {
		return cleaned;
	}
}
