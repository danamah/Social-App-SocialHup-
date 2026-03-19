import {
  Avatar, Button, Divider, Modal, ModalBody,
  ModalContent, ModalHeader, Skeleton,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { AiFillLike } from "react-icons/ai";
import { Link } from "react-router";
 
import { getPostLikes } from "../../services/postServices";
 
export default function PostLikesModal({ isOpen, onOpenChange, postId, likesCount }) {
  const { t } = useTranslation();
 
  const { data, isLoading } = useQuery({
    queryKey: ["postLikes", postId],
    queryFn: () => getPostLikes(postId, { limit: 50 }),
    enabled: isOpen && !!postId,
    staleTime: 30_000,
  });
 
  const likes = data?.likes ?? [];
 
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{ base: "bg-theme-card", header: "border-b border-theme" }}
    >
      <ModalContent className="max-w-sm">
        {() => (
          <>
            <ModalHeader className="flex items-center gap-2 text-theme-primary">
              <AiFillLike className="text-brand-500 text-xl" />
              {t("post.likesTitle", "Likes")}
              <span className="text-theme-secondary text-sm font-normal ms-1">
                ({likesCount})
              </span>
            </ModalHeader>
            <Divider />
            <ModalBody className="py-4 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="w-9 h-9 rounded-full" />
                      <Skeleton className="h-3 w-32 rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : likes.length === 0 ? (
                <div className="flex flex-col items-center py-8 gap-2">
                  <span className="text-4xl">❤️</span>
                  <p className="text-theme-secondary text-sm">
                    {t("post.noLikes", "No likes yet")}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {likes.map((user) => (
                    <Link
                      key={user._id}
                      to={`/profile/${user._id}`}
                      onClick={() => onOpenChange(false)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-theme-secondary transition-colors"
                    >
                      <Avatar src={user.photo} name={user.name} size="sm" />
                      <div>
                        <p className="font-semibold text-sm text-theme-primary">{user.name}</p>
                        {user.username && (
                          <p className="text-xs text-theme-secondary">@{user.username}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}