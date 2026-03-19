// src/components/pages/Notifications/NotificationsPage.jsx
import { Avatar, Button, Chip, Divider, Skeleton } from "@heroui/react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { FaBell, FaCheckDouble } from "react-icons/fa";
import { useNavigate } from "react-router";
import {
  getNotifications,
  getUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/Notificationsservices";
import { toast } from "react-toastify";
import React from "react";

// ── Notification type → icon + color + message ─────────────
const TYPE_CONFIG = {
  like_post:     { emoji: "❤️",  color: "danger",  key: "liked your post"    },
  comment_post:  { emoji: "💬",  color: "success", key: "commented on your post" },
  follow:        { emoji: "👥",  color: "primary", key: "started following you"  },
  share_post:    { emoji: "🔁",  color: "warning", key: "shared your post"    },
  like_comment:  { emoji: "👍",  color: "danger",  key: "liked your comment"  },
  reply_comment: { emoji: "↩️",  color: "success", key: "replied to your comment" },
};

function getTypeConfig(type) {
  return TYPE_CONFIG[type] ?? { emoji: "🔔", color: "default", key: "interacted with you" };
}

// ── Single notification row ────────────────────────────────
function NotificationItem({ notification, onMarkRead }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { emoji, color, key } = getTypeConfig(notification.type);

  function handleClick() {
    if (!notification.isRead) onMarkRead(notification._id);
    // Navigate to related entity if available
    if (notification.entityType === "post" && !notification.entity?.unavailable) {
      navigate(`/post/${notification.entityId}`);
    } else if (notification.entityType === "user") {
      navigate(`/profile/${notification.entityId}`);
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors duration-200
        hover:bg-theme-secondary
        ${!notification.isRead ? "bg-brand-50 dark:bg-brand-900/20 border-s-4 border-brand-500" : ""}
      `}
    >
      {/* Actor avatar with emoji badge */}
      <div className="relative flex-shrink-0">
        <Avatar
          src={notification.actor?.photo}
          name={notification.actor?.name}
          size="md"
        />
        <span className="absolute -bottom-1 -end-1 text-sm">{emoji}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-theme-primary">
          <span className="font-semibold">{notification.actor?.name}</span>
          {" "}{t(`notifications.types.${notification.type}`, key)}
        </p>
        <p className="text-xs text-theme-secondary mt-0.5">
          {new Date(notification.createdAt).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
        {/* Unavailable entity warning */}
        {notification.entity?.unavailable && (
          <p className="text-xs text-red-400 mt-0.5">
            {t("notifications.unavailable", "This content is no longer available")}
          </p>
        )}
      </div>

      {/* Unread dot */}
      {!notification.isRead && (
        <span className="w-2.5 h-2.5 rounded-full bg-brand-500 flex-shrink-0 mt-1" />
      )}
    </div>
  );
}

// ── Skeleton loader ────────────────────────────────────────
function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-3/4 rounded-lg" />
        <Skeleton className="h-3 w-1/3 rounded-lg" />
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────
export default function NotificationsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // ── Filter: all | unread ──────────────────────────────
  // Using simple state-based pagination (not infinite scroll for simplicity)
  const [showUnreadOnly, setShowUnreadOnly] = React.useState(false);
  const [page, setPage] = React.useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["notifications", { unread: showUnreadOnly, page }],
    queryFn: () => getNotifications({ unread: showUnreadOnly, page, limit: 15 }),
    staleTime: 30_000,
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notificationsUnreadCount"],
    queryFn: getUnreadCount,
    staleTime: 30_000,
  });

  // ── Mark one as read ─────────────────────────────────
  const { mutate: markRead } = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notificationsUnreadCount"] });
    },
  });

  // ── Mark all as read ──────────────────────────────────
  const { mutate: markAllRead, isPending: isMarkingAll } = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notificationsUnreadCount"] });
      toast.success(t("notifications.markedAll", `${count} notifications marked as read`));
    },
    onError: () => toast.error(t("common.error")),
  });

  const notifications = data?.notifications ?? [];
  const pagination    = data?.pagination    ?? {};

  return (
    <div className="max-w-2xl mx-auto py-6 px-3">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FaBell className="text-brand-500 text-xl" />
          <h1 className="text-xl font-bold text-theme-primary">
            {t("nav.notifications", "Notifications")}
          </h1>
          {unreadCount > 0 && (
            <Chip color="danger" size="sm" variant="solid">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Chip>
          )}
        </div>

        {/* Mark all as read */}
        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="light"
            color="secondary"
            isLoading={isMarkingAll}
            onPress={() => markAllRead()}
            startContent={<FaCheckDouble />}
          >
            {t("notifications.markAllRead", "Mark all as read")}
          </Button>
        )}
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex gap-2 mb-4 mt-10">
        <button
          onClick={() => { setShowUnreadOnly(false); setPage(1); }}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !showUnreadOnly
              ? "bg-brand-500 text-white"
              : "bg-theme-secondary text-theme-secondary hover:bg-brand-100 dark:hover:bg-brand-900/30"
          }`}
        >
          {t("notifications.all", "All")}
        </button>
        <button
          onClick={() => { setShowUnreadOnly(true); setPage(1); }}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            showUnreadOnly
              ? "bg-brand-500 text-white"
              : "bg-theme-secondary text-theme-secondary hover:bg-brand-100 dark:hover:bg-brand-900/30"
          }`}
        >
          {t("notifications.unread", "Unread")}
          {unreadCount > 0 && (
            <span className="ms-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Notifications list ── */}
      <div className="bg-theme-card rounded-xl border border-theme overflow-hidden shadow-sm">
        {isLoading ? (
          <>
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <NotificationSkeleton />
                {i < 5 && <Divider />}
              </div>
            ))}
          </>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-5xl">🔔</span>
            <p className="text-theme-secondary font-medium">
              {showUnreadOnly
                ? t("notifications.noUnread", "No unread notifications")
                : t("notifications.empty", "No notifications yet")}
            </p>
          </div>
        ) : (
          notifications.map((notif, index) => (
            <div key={notif._id}>
              <NotificationItem
                notification={notif}
                onMarkRead={markRead}
              />
              {index < notifications.length - 1 && <Divider />}
            </div>
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {!isLoading && pagination.numberOfPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            size="sm"
            variant="bordered"
            color="secondary"
            isDisabled={page === 1}
            onPress={() => setPage((p) => p - 1)}
          >
            {t("common.prev", "Previous")}
          </Button>
          <span className="flex items-center text-sm text-theme-secondary px-2">
            {page} / {pagination.numberOfPages}
          </span>
          <Button
            size="sm"
            variant="bordered"
            color="secondary"
            isDisabled={page >= pagination.numberOfPages}
            onPress={() => setPage((p) => p + 1)}
          >
            {t("common.next", "Next")}
          </Button>
        </div>
      )}
    </div>
  );
}