'use server';
import { connectMongoDB } from '@/lib/mongodb';
import Comment from '@/models/commentsModel';

export const deleteCommentAction = async (_id) => {
	try {
		await connectMongoDB();
		const result = await Comment.findByIdAndDelete(_id);
		if (result) {
			return { success: true };
		}
	} catch (error) {
		return { error: error.message };
	}
};
