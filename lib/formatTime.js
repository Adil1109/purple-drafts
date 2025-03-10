export function formatReadableDateTime(providedDateTime) {
	let date = new Date(providedDateTime);
	date.setHours(date.getHours() - 6);

	const options = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	};

	return date.toLocaleString('en-US', options);
}

export function resizeGoogleProfileImage(url) {
	return url.replace('s96-c', 's800-c');
}
