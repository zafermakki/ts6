
import apiClient from '../../../services/apiClient';

export const commentsService = {
  async getCommentsByPost(postId, signal) {
    const { data } = await apiClient.get(
      `/comments/post/${postId}`,
      {
        params: { limit: 0 },
        signal,
      }
    );

    return data.comments || [];
  },

  async addComment({ body, postId, userId = 1 }) {
    const { data } = await apiClient.post('/comments/add', {
      body,
      postId,
      userId,
    });

    return {
      ...data,
      postId,
      likes: 0,
      user: data.user || {
        id: userId,
        username: 'emilyj',
        fullName: 'Emily Johnson',
      },
      isLocal: true,
    };
  },
};
