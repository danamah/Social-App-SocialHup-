// src/components/services/userServices.js
import axiosInstance from "../lib/axiosInstance";

// ── GET MY PROFILE ─────────────────────────────────────────
// GET /users/profile-data
// Returns: { user: { _id, name, username, email, photo, cover,
//            followers, following, bookmarks, ...counts } }
export async function getMyProfile() {
  const { data } = await axiosInstance.get("/users/profile-data");
  return data.data.user;
}

// ── GET ANY USER PROFILE ───────────────────────────────────
// GET /users/:userId/profile
// Returns: { isFollowing: bool, user: { ...userData } }
export async function getUserProfile(userId) {
  const { data } = await axiosInstance.get(`/users/${userId}/profile`);
  return data.data; // { isFollowing, user }
}

// ── GET USER POSTS ─────────────────────────────────────────
// GET /users/:userId/posts
// Returns: { posts: [...] } + meta.pagination
export async function getUserPosts(userId, page = 1) {
  const { data } = await axiosInstance.get(`/users/${userId}/posts`, {
    params: { page },
  });
  return {
    posts: data.data.posts,
    pagination: data.meta.pagination,
  };
}

// ── GET FOLLOW SUGGESTIONS ─────────────────────────────────
// GET /users/suggestions?limit=10
// Returns: { suggestions: [...] } + meta.pagination
export async function getFollowSuggestions(limit = 10) {
  const { data } = await axiosInstance.get("/users/suggestions", {
    params: { limit },
  });
  return {
    suggestions: data.data.suggestions,
    pagination: data.meta.pagination,
  };
}

// ── FOLLOW / UNFOLLOW USER ─────────────────────────────────
// PUT /users/:userId/follow
// Toggle — same endpoint follows if not following, unfollows if following
export async function toggleFollowUser(userId) {
  const { data } = await axiosInstance.put(`/users/${userId}/follow`);
  return data; // { success, message }
}

// ── GET BOOKMARKS ──────────────────────────────────────────
// GET /users/bookmarks
// Returns: { bookmarks: [...] } + meta.pagination
export async function getBookmarks(page = 1) {
  const { data } = await axiosInstance.get("/users/bookmarks", {
    params: { page },
  });
  return {
    bookmarks: data.data.bookmarks,
    pagination: data.meta.pagination,
  };
}

// ── UPLOAD PROFILE PHOTO ───────────────────────────────────
// PUT /users/upload-photo
// Body: FormData with key "photo" (File)
export async function uploadProfilePhoto(file) {
  const formData = new FormData();
  formData.append("photo", file);
  const { data } = await axiosInstance.put("/users/upload-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

// ── CHANGE PASSWORD ────────────────────────────────────────
// PATCH /users/change-password
// Body: { password: "old", newPassword: "new" }
export async function changePassword({ password, newPassword }) {
  const { data } = await axiosInstance.patch("/users/change-password", {
    password,
    newPassword,
  });
  return data;
}
