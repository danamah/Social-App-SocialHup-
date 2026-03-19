// src/components/services/commentAndRepliesServices.js
import axiosInstance from "../lib/axiosInstance";

// ── GET POST COMMENTS ──────────────────────────────────────
// GET /posts/:postId/comments?page=1&limit=10
// Returns: { comments: [...] } + meta.pagination
export async function getPostComments(postId, { page = 1, limit = 10 } = {}) {
  const { data } = await axiosInstance.get(`/posts/${postId}/comments`, {
    params: { page, limit },
  });
  return {
    comments: data.data.comments,
    pagination: data.meta.pagination,
  };
}

// ── CREATE COMMENT ─────────────────────────────────────────
// POST /posts/:postId/comments — multipart/form-data
// ⚠️ API requires image — content alone returns 400 error
// body: { content: string, image: File }
// Returns: { comment: { _id, content, image, commentCreator, post, likes, ... } }
export async function createComment(postId, { content, image }) {
  const formData = new FormData();
  formData.append("content", content);
  formData.append("image", image); // required by API

  const { data } = await axiosInstance.post(
    `/posts/${postId}/comments`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data.comment;
}

// ── UPDATE COMMENT ─────────────────────────────────────────
// PUT /posts/:postId/comments/:commentId — multipart/form-data
// body: { content?: string, image?: File }
// Returns: { comment: { ...updatedComment } }
export async function updateComment(postId, commentId, { content, image }) {
  const formData = new FormData();
  if (content) formData.append("content", content);
  if (image) formData.append("image", image);

  const { data } = await axiosInstance.put(
    `/posts/${postId}/comments/${commentId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data.comment;
}

// ── DELETE COMMENT ─────────────────────────────────────────
// DELETE /posts/:postId/comments/:commentId
// Returns: {} (empty data on success)
export async function deleteComment(postId, commentId) {
  const { data } = await axiosInstance.delete(
    `/posts/${postId}/comments/${commentId}`,
  );
  return data; // { success, message }
}

// ── LIKE / UNLIKE COMMENT ──────────────────────────────────
// PUT /posts/:postId/comments/:commentId/like — toggle
// Returns: { liked: bool, likesCount: number, comment: {...} }
export async function toggleLikeComment(postId, commentId) {
  const { data } = await axiosInstance.put(
    `/posts/${postId}/comments/${commentId}/like`,
  );
  return data.data; // { liked, likesCount, comment }
}

// ── GET COMMENT REPLIES ────────────────────────────────────
// GET /posts/:postId/comments/:commentId/replies?page=1&limit=10
// Returns: { replies: [...] } + meta.pagination
export async function getCommentReplies(
  postId,
  commentId,
  { page = 1, limit = 10 } = {},
) {
  const { data } = await axiosInstance.get(
    `/posts/${postId}/comments/${commentId}/replies`,
    { params: { page, limit } },
  );
  return {
    replies: data.data.replies,
    pagination: data.meta.pagination,
  };
}

// ── CREATE REPLY ───────────────────────────────────────────
// POST /posts/:postId/comments/:commentId/replies — multipart/form-data
// ⚠️ API requires image — content alone returns 400 error
// body: { content: string, image: File }
// Returns: { reply: { _id, content, image, commentCreator, parentComment, isReply: true, ... } }
export async function createReply(postId, commentId, { content, image }) {
  const formData = new FormData();
  formData.append("content", content);
  formData.append("image", image); // required by API

  const { data } = await axiosInstance.post(
    `/posts/${postId}/comments/${commentId}/replies`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data.reply;
}
