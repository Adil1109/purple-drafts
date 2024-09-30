export default handleFileChange = (event) => {
	const file = event.target.files[0];

	if (file) {
		if (file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = function (e) {
				setSelectedFile(e.target.result);
			};

			reader.readAsDataURL(file);
		} else {
			alert('Please select a valid image file.');
		}
	} else {
		setSelectedFile(null);
	}
};
