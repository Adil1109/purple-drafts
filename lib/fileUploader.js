import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';

const s3Client = new S3Client({
	endpoint: 'https://s3.us-east-005.backblazeb2.com',
	region: 'us-east-005',
	credentials: {
		accessKeyId: process.env.BACKBLAZE_KEY_ID,
		secretAccessKey: process.env.BACKBLAZE_APP_KEY,
	},
});

export default async function backblazeUploader(file, fileType) {
	try {
		const ext = path.extname(file.name);
		const timestamp = new Date().getTime();
		const sanitizedFileName = file.name.replace(/[^\w.-]/g, '-');
		const key = `${fileType}/${sanitizedFileName}-${timestamp}${ext}`;

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const bucketName = process.env.BACKBLAZE_BUCKET_NAME;

		const params = {
			Bucket: bucketName,
			Key: key,
			Body: buffer,
		};

		await s3Client.send(new PutObjectCommand(params));

		return `https://${bucketName}.s3.us-east-005.backblazeb2.com/${params.Key}`;
	} catch (err) {
		throw new Error('Error uploading to Backblaze: ' + err.message);
	}
}
