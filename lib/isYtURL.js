export default function isYouTubeWatchURL(url) {
	// Regular expression to match YouTube watch URLs
	const youtubeWatchRegex =
		/^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+$/;
	return youtubeWatchRegex.test(url);
}
