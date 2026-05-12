import { mockPosts, boardCategories, MockPost, BoardCategory, Comment } from '../lib/mockData';

const STORAGE_KEY = 'sharedata_posts';
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

function getPosts(): MockPost[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored) as MockPost[];
  return [...mockPosts];
}

function savePosts(posts: MockPost[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export const boardService = {
  async getCategories(): Promise<BoardCategory[]> {
    await delay(200);
    return [...boardCategories];
  },

  async getPostsByCategory(category: string): Promise<MockPost[]> {
    await delay(300);
    const posts = getPosts();
    return posts
      .filter((p) => p.category === category)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getAllPosts(): Promise<MockPost[]> {
    await delay(300);
    return getPosts().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getPostById(id: string): Promise<MockPost> {
    await delay(200);
    const posts = getPosts();
    const post = posts.find((p) => p.id === id);
    if (!post) throw new Error('게시물을 찾을 수 없습니다.');
    return { ...post, views: post.views + 1 };
  },

  async createPost(postData: Partial<MockPost>): Promise<MockPost> {
    await delay(400);
    const posts = getPosts();
    const newPost: MockPost = {
      id: `post-${Date.now()}`,
      category: '',
      title: '',
      type: 'markdown',
      content: '',
      authorId: '',
      authorName: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      ...postData,
    };
    posts.unshift(newPost);
    savePosts(posts);
    return newPost;
  },

  async updatePost(id: string, postData: Partial<MockPost>): Promise<MockPost> {
    await delay(300);
    const posts = getPosts();
    const idx = posts.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('게시물을 찾을 수 없습니다.');

    posts[idx] = {
      ...posts[idx],
      ...postData,
      updatedAt: new Date().toISOString(),
    };
    savePosts(posts);
    return posts[idx];
  },

  async deletePost(id: string): Promise<void> {
    await delay(300);
    const posts = getPosts().filter((p) => p.id !== id);
    savePosts(posts);
  },

  async toggleLike(postId: string, userId: string): Promise<MockPost> {
    await delay(200);
    const posts = getPosts();
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx === -1) throw new Error('게시물을 찾을 수 없습니다.');

    if (!posts[idx].likedUsers) posts[idx].likedUsers = [];

    const likedIndex = posts[idx].likedUsers!.indexOf(userId);
    if (likedIndex > -1) {
      posts[idx].likedUsers!.splice(likedIndex, 1);
      posts[idx].likes = Math.max(0, posts[idx].likes - 1);
    } else {
      posts[idx].likedUsers!.push(userId);
      posts[idx].likes += 1;
    }
    savePosts(posts);
    return posts[idx];
  },

  async addComment(postId: string, commentData: Omit<Comment, 'id' | 'createdAt'>): Promise<MockPost> {
    await delay(300);
    const posts = getPosts();
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx === -1) throw new Error('게시물을 찾을 수 없습니다.');

    if (!posts[idx].comments) posts[idx].comments = [];
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      ...commentData,
      createdAt: new Date().toISOString(),
    };
    posts[idx].comments!.push(newComment);
    savePosts(posts);
    return posts[idx];
  },

  async deleteComment(postId: string, commentId: string): Promise<MockPost> {
    await delay(300);
    const posts = getPosts();
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx === -1) throw new Error('게시물을 찾을 수 없습니다.');

    if (posts[idx].comments) {
      posts[idx].comments = posts[idx].comments!.filter((c) => c.id !== commentId);
      savePosts(posts);
    }
    return posts[idx];
  },

  async searchPosts(query: string, category?: string): Promise<MockPost[]> {
    await delay(300);
    let posts = getPosts();
    if (category) posts = posts.filter((p) => p.category === category);
    const q = query.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.authorName.toLowerCase().includes(q) ||
        (p.content && p.content.toLowerCase().includes(q))
    );
  },
};
