'use client';
import DeleteConfirmer from '@/components/DeleteConfirmer';
import { useParams } from 'next/navigation';
import { deleteCommentAction } from '@/actions/commentActions';

export default function DeleteComment() {
	const params = useParams();
	return (
		<DeleteConfirmer
			ModelType={'Comment'}
			deleteAction={() => deleteCommentAction(params.byId)}
		/>
	);
}
