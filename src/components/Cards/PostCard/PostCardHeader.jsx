import {
  Avatar, Button, Dropdown, DropdownItem,
  DropdownMenu, DropdownTrigger, useDisclosure,
} from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Link } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
 
import { UserLoggedInfoContext } from "../../context/UserLoggedContext";
import { deletePost } from "../../services/postServices";
import { getUserProfile, toggleFollowUser } from "../../services/userServices";
import CreatePostModal from "../CreatePostCard/CreatePostCardModal";
 
export default function PostCardHeader({ post, refreshPost }) {
  const { userData } = useContext(UserLoggedInfoContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
 
  const isOwner = userData?._id === post?.user?._id;
 
  // ── Fetch user profile to know if already following ──
  const { data: profileData } = useQuery({
    queryKey: ["userProfile", post?.user?._id],
    queryFn: () => getUserProfile(post.user._id),
    enabled: !isOwner && !!post?.user?._id,
    staleTime: 60_000,
  });
 
  const isFollowing = profileData?.isFollowing ?? false;
 
  // ── Follow / Unfollow ────────────────────────────────
  const { mutate: handleFollow, isPending: isFollowPending } = useMutation({
    mutationFn: () => toggleFollowUser(post.user._id),
    onSuccess: () => {
      // Invalidate to refresh isFollowing state
      queryClient.invalidateQueries({ queryKey: ["userProfile", post.user._id] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || t("common.error"));
    },
  });
 
  // ── Delete post ──────────────────────────────────────
  async function deleteUserPost() {
    const result = await Swal.fire({
      title: t("post.delete_confirm", "Are you sure?"),
      text: t("post.delete_warning", "You won't be able to get it back"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#9333ea",
      confirmButtonText: t("post.delete_btn", "Yes, Delete!"),
      cancelButtonText: t("common.cancel", "Cancel"),
    });
 
    if (!result.isConfirmed) return;
 
    try {
      await deletePost(post._id);
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success(t("post.deleteSuccess", "Post deleted ✅"));
    } catch (error) {
      toast.error(error?.response?.data?.message || t("common.error"));
    }
  }
 
  return (
    <>
      <header className="flex items-center justify-between p-4">
        {/* Left: avatar + name + date */}
        <div className="flex items-center gap-3">
          {/* Avatar → links to user profile */}
          <Link to={`/profile/${post?.user?._id}`}>
            <Avatar
              src={post?.user?.photo}
              name={post?.user?.name}
              className="cursor-pointer ring-2 ring-transparent hover:ring-brand-400 transition-all"
            />
          </Link>
 
          <div>
            {/* Name → links to user profile */}
            <Link
              to={`/profile/${post?.user?._id}`}
              className="font-bold text-theme-primary hover:text-brand-500 transition-colors"
            >
              {post?.user?.name}
            </Link>
            {post?.user?.username && (
              <p className="text-xs text-theme-secondary">@{post.user.username}</p>
            )}
            <p className="text-xs text-theme-muted">
              {new Date(post?.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
            </p>
          </div>
        </div>
 
        {/* Right: follow button + 3-dot menu */}
        <div className="flex items-center gap-2">
          {/* Follow / Unfollow — only show for other users */}
          {!isOwner && (
            <Button
              size="sm"
              color={isFollowing ? "default" : "secondary"}
              variant={isFollowing ? "bordered" : "solid"}
              isLoading={isFollowPending}
              onPress={() => handleFollow()}
              className={`text-xs font-medium ${isFollowing ? "text-theme-primary" : "text-white"}`}
            >
              {isFollowing
                ? t("community.following", "Following")
                : t("community.follow", "Follow")
              }
            </Button>
          )}
 
          {/* 3-dot menu — only for post owner */}
          {isOwner && (
            <Dropdown>
              <DropdownTrigger>
                <HiOutlineDotsVertical className="text-xl cursor-pointer text-theme-secondary hover:text-brand-500 transition-colors" />
              </DropdownTrigger>
              <DropdownMenu aria-label="Post actions">
                <DropdownItem key="edit" onClick={onOpen}>
                  {t("post.edit", "Edit Post")}
                </DropdownItem>
                <DropdownItem key="delete" color="danger" onClick={deleteUserPost}>
                  {t("post.delete", "Delete Post")}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </header>
 
      <CreatePostModal post={post} isOpen={isOpen} onOpenChange={onOpenChange} onSuccess={refreshPost} />
    </>
  );
}
 