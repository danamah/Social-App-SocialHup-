import {
  Avatar, Button, Divider, Dropdown, DropdownItem,
  DropdownMenu, DropdownTrigger, Input, Spinner, useDisclosure,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaAngleDown, FaBookmark, FaRegBookmark, FaRegCommentDots } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { toast } from "react-toastify";
import { UserLoggedInfoContext } from "../../context/UserLoggedContext";
import PostDetailsModal from "../../PostDetailsModal/PostDetailsModal";
import {
  createComment, deleteComment,
  getPostComments,
  updateComment,
} from "../../services/Commentandrepliesservices";
import { sharePost, toggleBookmarkPost, toggleLikePost } from "../../services/postServices";
import CommentInput from "./CommentInput";
import SharePostModal from "./SharePostModal";
import PostLikesModal from "./PostLikesModal";
export default function PostCardFooter({ post, postComments, setPostComments, postDetails }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { userData } = useContext(UserLoggedInfoContext);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const shareModal = useDisclosure();
  const [commentMsg, setCommentMsg] = useState("");
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const likesModal = useDisclosure();
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [liked, setLiked] = useState(post.likes?.includes(userData?._id));
  const [likesCount, setLikesCount] = useState(post.likesCount ?? 0);
  const [bookmarked, setBookmarked] = useState(post.bookmarked ?? false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  // ── Like toggle ──────────────────────────────────────
  async function handleLike() {
    if (isLikeLoading) return;
    setIsLikeLoading(true);
    // optimistic update
    setLiked((prev) => !prev);
    setLikesCount((prev) => liked ? prev - 1 : prev + 1);
    try {
      const res = await toggleLikePost(post._id);
      setLiked(res.liked);
      setLikesCount(res.likesCount);
    } catch {
      // revert on error
      setLiked((prev) => !prev);
      setLikesCount((prev) => liked ? prev + 1 : prev - 1);
      toast.error(t("common.error"));
    } finally {
      setIsLikeLoading(false);
    }
  }

  // ── Bookmark toggle ──────────────────────────────────
  async function handleBookmark() {
    if (isBookmarkLoading) return;
    setIsBookmarkLoading(true);
    setBookmarked((prev) => !prev);
    try {
      const res = await toggleBookmarkPost(post._id);
      setBookmarked(res.bookmarked);
    } catch {
      setBookmarked((prev) => !prev);
      toast.error(t("common.error"));
    } finally {
      setIsBookmarkLoading(false);
    }
  }

  // ── Share ────────────────────────────────────────────
  async function handleShare() {
    try {
      await sharePost(post._id, "");
      toast.success(t("post.shareSuccess", "Post shared!"));
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error) {
      toast.error(error?.response?.data?.message || t("common.error"));
    }
  }

  // ── Add comment ──────────────────────────────────────
  async function addComment() {
    if (!commentMsg.trim()) return;
    setIsCommentLoading(true);
    try {
      const comment = await createComment(post._id, { content: commentMsg });
      setPostComments((prev) => [comment, ...prev]);
      setCommentMsg("");
    } catch (error) {
      toast.error(error?.response?.data?.message || t("common.error"));
    } finally {
      setIsCommentLoading(false);
    }
  }

  // ── Refresh comments ─────────────────────────────────
  async function refreshComments() {
    try {
      const { comments } = await getPostComments(post._id);
      setPostComments(comments);
    } catch { /* silent */ }
  }

  // ── Delete comment ───────────────────────────────────
  async function handleDeleteComment(commentId) {
    setDeletingCommentId(commentId);
    try {
      await deleteComment(post._id, commentId);
      setPostComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {
      toast.error(t("common.error"));
    } finally {
      setDeletingCommentId(null);
    }
  }

  // ── Edit comment ─────────────────────────────────────
  async function handleUpdateComment(commentId) {
    if (!editContent.trim()) { setEditCommentId(null); return; }
    try {
      await updateComment(post._id, commentId, { content: editContent.trim() });
      setPostComments((prev) =>
        prev.map((c) => c._id === commentId ? { ...c, content: editContent.trim() } : c)
      );
      setEditCommentId(null);
      setEditContent("");
    } catch {
      toast.error(t("common.error"));
    }
  }

  // ── Comment item renderer ─────────────────────────────
  function CommentItem({ comment }) {
    const isOwner = userData?._id === comment?.commentCreator?._id;
    return (
      <div className="flex gap-2 py-2 px-3">
        <Avatar src={comment?.commentCreator?.photo} name={comment?.commentCreator?.name} size="sm" />
        <div className="flex justify-between bg-theme-secondary px-3 py-2 w-full rounded-xl border border-theme">
          {editCommentId === comment._id ? (
            <div className="w-full">
              <Input
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                autoFocus size="sm" className="mb-2"
              />
              <div className="flex gap-2">
                <Button size="sm" color="secondary" className="text-white" onPress={() => handleUpdateComment(comment._id)}>
                  {t("common.save", "Save")}
                </Button>
                <Button size="sm" variant="light" onPress={() => setEditCommentId(null)}>
                  {t("common.cancel", "Cancel")}
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-sm text-theme-primary">{comment?.commentCreator?.name}</h3>
              <p className="text-xs text-theme-secondary mb-1">
                {new Date(comment?.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
              </p>
              <p className="text-theme-primary">{comment?.content}</p>
            </div>
          )}
          {isOwner && (
            <Dropdown>
              <DropdownTrigger>
                {deletingCommentId === comment._id
                  ? <Spinner size="sm" color="secondary" />
                  : <HiOutlineDotsVertical className="cursor-pointer text-theme-secondary hover:text-brand-500 transition-colors" />
                }
              </DropdownTrigger>
              <DropdownMenu aria-label="Comment actions">
                <DropdownItem key="edit" onClick={() => { setEditCommentId(comment._id); setEditContent(comment.content); }}>
                  {t("post.edit", "Edit")}
                </DropdownItem>
                <DropdownItem key="delete" color="danger" onClick={() => handleDeleteComment(comment._id)}>
                  {t("post.delete", "Delete")}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
    );
  }

  return (
    <main className="bg-theme-card transition-colors duration-300">
      {/* Counts row */}
      <div className="flex items-center justify-between px-3 py-2">
        {likesCount > 0 ? (
          <button
            onClick={likesModal.onOpen}
            className="flex items-center gap-1.5 text-sm text-theme-secondary hover:text-brand-500 transition-colors cursor-pointer"
          >
            <AiFillLike className="text-brand-500" />
            <span className="font-medium">{likesCount}</span>
            <span>{t("post.like", "likes")}</span>
          </button>
        ) : (
          <span />
        )}
        <p className="text-sm text-theme-secondary">
          {postComments.length > 0 && `${postComments.length} ${t("post.comment", "comments")}`}
        </p>
      </div>

      <Divider />

      {/* Action buttons */}
      <div className="flex items-center justify-between py-2 px-3">
        {/* Like */}
        <button
          onClick={handleLike}
          disabled={isLikeLoading}
          className={`flex items-center gap-1.5 group cursor-pointer transition-colors duration-250 ${liked ? "text-brand-500" : "text-theme-secondary hover:text-brand-500"}`}
        >
          {liked ? <AiFillLike className="text-lg" /> : <AiOutlineLike className="text-lg" />}
          <span className="text-sm">{t("post.like", "Like")}</span>
        </button>

        {/* Comment */}
        <button
          onClick={onOpen}
          className="flex items-center gap-1.5 text-theme-secondary hover:text-green-500 transition-colors duration-250 cursor-pointer"
        >
          <FaRegCommentDots className="text-lg" />
          <span className="text-sm">{t("post.comment", "Comment")}</span>
        </button>

        {/* Share */}
        <button
          onClick={shareModal.onOpen}   // ← بدل handleShare المباشرة
          className="flex items-center gap-1.5 text-theme-secondary hover:text-yellow-500 transition-colors duration-250 cursor-pointer"
        >
          <FiShare2 className="text-lg" />
          <span className="text-sm">{t("post.share", "Share")}</span>
        </button>

        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          disabled={isBookmarkLoading}
          className={`flex items-center gap-1.5 transition-colors duration-250 cursor-pointer ${bookmarked ? "text-brand-500" : "text-theme-secondary hover:text-brand-500"}`}
        >
          {bookmarked ? <FaBookmark className="text-lg" /> : <FaRegBookmark className="text-lg" />}
          <span className="text-sm">{t("post.bookmark", "Save")}</span>
        </button>
      </div>

      <Divider />

      {/* Top comment preview (card view) */}
      {!postDetails && postComments.length > 0 && (
        <>
          <CommentItem comment={postComments[0]} />
          {postComments.length > 1 && (
            <button
              onClick={onOpen}
              className="flex justify-center items-center gap-1 w-full py-2 text-sm text-theme-secondary hover:text-brand-500 transition-colors cursor-pointer"
            >
              <span className="font-semibold">{t("post.showMoreComments", "Show more comments")}</span>
              <FaAngleDown />
            </button>
          )}
        </>
      )}

      {/* All comments (details view) */}
      {postDetails && postComments.map((comment) => (
        <CommentItem key={comment._id} comment={comment} />
      ))}

      <Divider />

      {/* Comment input */}
      <CommentInput
        postId={post._id}
        onCommentAdded={(comment) => setPostComments((prev) => [comment, ...prev])}
      />

      {/* Post Details Modal */}
      <PostDetailsModal
        postComments={postComments}
        setPostComments={setPostComments}
        postId={post._id}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onRefresh={refreshComments}
      />
      <SharePostModal
        isOpen={shareModal.isOpen}
        onOpenChange={shareModal.onOpenChange}
        post={post}
      />
      <PostLikesModal
        isOpen={likesModal.isOpen}
        onOpenChange={likesModal.onOpenChange}
        postId={post._id}
        likesCount={likesCount}
      />
    </main>

  );
}