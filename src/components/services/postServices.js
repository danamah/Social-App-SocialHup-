// src/components/services/postServices.js
import axiosInstance from "../lib/axiosInstance";

// ── GET ALL POSTS ──────────────────────────────────────────
// GET /posts?page=1
// Returns: { posts: [...] } + meta.pagination
export async function getAllPosts(page = 1) {
  const { data } = await axiosInstance.get("/posts", {
    params: { page },
  });
  return {
    posts: data.data.posts,
    pagination: data.meta.pagination,
  };
}

// ── GET HOME FEED ──────────────────────────────────────────
// GET /posts/feed?only=following&limit=10&page=1
// only: "following" | "all"
// Returns: { posts: [...] } + meta.pagination + meta.feedMode
export async function getHomeFeed({
  only = "following",
  limit = 10,
  page = 1,
} = {}) {
  const { data } = await axiosInstance.get("/posts/feed", {
    params: { only, limit, page },
  });
  return {
    posts: data.data.posts,
    pagination: data.meta.pagination,
    feedMode: data.meta.feedMode,
  };
}

// ── CREATE POST ────────────────────────────────────────────
// POST /posts  — multipart/form-data
// body: { body?: string, image?: File }
// Returns: { post: { _id, body, image, user, ... } }
export async function createPost({ body, image }) {
  const formData = new FormData();
  if (body) formData.append("body", body);
  if (image) formData.append("image", image);

  const { data } = await axiosInstance.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data.post;
}

// ── GET SINGLE POST ────────────────────────────────────────
// GET /posts/:postId
// Returns: { post: { _id, body, image, user, likes, commentsCount, ... } }
export async function getSinglePost(postId) {
  const { data } = await axiosInstance.get(`/posts/${postId}`);
  return data.data.post;
}

// ── UPDATE POST ────────────────────────────────────────────
// PUT /posts/:postId  — multipart/form-data
// body: { body?: string, image?: File }
// Returns: { post: { ...updatedPost } }
export async function updatePost(postId, { body, image }) {
  const formData = new FormData();
  if (body) formData.append("body", body);
  if (image) formData.append("image", image);

  const { data } = await axiosInstance.put(`/posts/${postId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data.post;
}

// ── DELETE POST ────────────────────────────────────────────
// DELETE /posts/:postId
// Returns: { post: { ...deletedPost } }
export async function deletePost(postId) {
  const { data } = await axiosInstance.delete(`/posts/${postId}`);
  return data.data.post;
}

// ── LIKE / UNLIKE POST ─────────────────────────────────────
// PUT /posts/:postId/like  — toggle
// Returns: { liked: bool, likesCount: number, post: {...} }
export async function toggleLikePost(postId) {
  const { data } = await axiosInstance.put(`/posts/${postId}/like`);
  return data.data; // { liked, likesCount, post }
}

// ── BOOKMARK / UNBOOKMARK POST ─────────────────────────────
// PUT /posts/:postId/bookmark  — toggle
// Returns: { bookmarked: bool, bookmarksCount: number }
export async function toggleBookmarkPost(postId) {
  const { data } = await axiosInstance.put(`/posts/${postId}/bookmark`);
  return data.data; // { bookmarked, bookmarksCount }
}

// ── SHARE POST ─────────────────────────────────────────────
// POST /posts/:postId/share
// body: { body?: string }  — optional caption
// Returns: { post: { ...sharedPost } }
export async function sharePost(postId, body = "") {
  const { data } = await axiosInstance.post(`/posts/${postId}/share`, { body });
  return data.data.post;
}

// ── GET POST LIKES ─────────────────────────────────────────
// GET /posts/:postId/likes?page=1&limit=20
// Returns: { likes: [...users] } + meta.pagination
export async function getPostLikes(postId, { page = 1, limit = 20 } = {}) {
  const { data } = await axiosInstance.get(`/posts/${postId}/likes`, {
    params: { page, limit },
  });
  return {
    likes: data.data.likes,
    pagination: data.meta.pagination,
  };
}
