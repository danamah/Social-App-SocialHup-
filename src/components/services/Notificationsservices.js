// src/components/services/notificationsServices.js
import axiosInstance from "../lib/axiosInstance";

// ── GET NOTIFICATIONS ──────────────────────────────────────
// GET /notifications?unread=false&page=1&limit=10
// unread: false = all, true = unread only
// Returns: { notifications: [...] } + meta.pagination
export async function getNotifications({
  unread = false,
  page = 1,
  limit = 10,
} = {}) {
  const { data } = await axiosInstance.get("/notifications", {
    params: { unread, page, limit },
  });
  return {
    notifications: data.data.notifications,
    pagination: data.meta.pagination,
  };
}

// ── GET UNREAD COUNT ───────────────────────────────────────
// GET /notifications/unread-count
// Returns: { unreadCount: number }
export async function getUnreadCount() {
  const { data } = await axiosInstance.get("/notifications/unread-count");
  return data.data.unreadCount; // number
}

// ── MARK ONE NOTIFICATION AS READ ─────────────────────────
// PATCH /notifications/:notificationId/read
// Returns: { notification: { ...updatedNotification, isRead: true, readAt: Date } }
export async function markNotificationAsRead(notificationId) {
  const { data } = await axiosInstance.patch(
    `/notifications/${notificationId}/read`,
  );
  return data.data.notification;
}

// ── MARK ALL NOTIFICATIONS AS READ ────────────────────────
// PATCH /notifications/read-all
// Returns: { modifiedCount: number }
export async function markAllNotificationsAsRead() {
  const { data } = await axiosInstance.patch("/notifications/read-all");
  return data.data.modifiedCount; // number of updated notifications
}
