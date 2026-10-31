import apiClient from '../../../services/apiClient';

export const postsService = {
  async getPosts({ limit = 10, skip = 0, search = '', signal } = {}) {
    const endpoint = search ? '/posts/search' : '/posts';
    const { data } = await apiClient.get(endpoint, {
      params: { ...(search ? { q: search } : {}), limit, skip },
      signal,
    });
    return data;
  },

  async getPostById(postId, signal) {
    const { data } = await apiClient.get(`/posts/${postId}`, { signal });
    return data;
  },

  async addPost({ body, title = 'A new thought', userId = 1 }) {
    const { data } = await apiClient.post('/posts/add', { title, body, userId, tags: ['community'] });
    return { ...data, reactions: { likes: 0, dislikes: 0 }, views: 0, tags: data.tags || ['community'], createdAt: new Date().toISOString(), isLocal: true };
  },

  async getPostsByUser(userId, signal) {
    const { data } = await apiClient.get(`/users/${userId}/posts`, { signal });
    return data;
  },
};
