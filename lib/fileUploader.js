import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

cloudinary.config({
	cloud_name: 'dccbdekei',
	api_key: '516356231748473',
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function cloudinaryUploader(file, fileType) {
	const ext = path.extname(file.name);
	const timestamp = new Date().getTime();
	const sanitizedFileName = file.name.replace(/[^\w.-]/g, '-');

	const publicId = `${fileType}/${sanitizedFileName}-${timestamp}${ext}`;

	const bytes = await file.arrayBuffer();
	const buffer = Buffer.from(bytes);

	try {
		const result = await new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					public_id: publicId,
					folder: fileType,
					resource_type: 'auto',
				},
				(error, result) => {
					if (error) {
						return reject(
							new Error('Cloudinary Upload Error: ' + error.message)
						);
					}
					resolve(result);
				}
			);

			uploadStream.end(buffer);
		});

		return result.secure_url;
	} catch (error) {
		throw new Error('Error uploading to Cloudinary: ' + error.message);
	}
}
