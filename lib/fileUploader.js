import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_KEY
);

export default async function fileUploader(file, fileType) {
	try {
		const { data, error } = await supabase.storage
			.from('files')
			.upload(`${fileType}/${new Date().getTime()}`, file);

		if (error) {
			throw new Error();
		}
		return (
			process.env.SUPABASE_URL + '/storage/v1/object/public/' + data.fullPath
		);
	} catch (error) {
		throw new Error(error);
	}
}
