import {
  Avatar, Button, Divider, Modal, ModalBody,
  ModalContent, ModalHeader, Textarea,
} from "@heroui/react";
import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FiShare2 } from "react-icons/fi";
 
import { UserLoggedInfoContext } from "../../context/UserLoggedContext";
import { sharePost } from "../../services/postServices";
 
export default function SharePostModal({ isOpen, onOpenChange, post }) {
  const { userData } = useContext(UserLoggedInfoContext);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const bodyRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
 
  async function handleShare() {
    const body = bodyRef.current?.value?.trim() ?? "";
    setIsLoading(true);
    try {
      await sharePost(post._id, body);
      toast.success(t("post.shareSuccess", "Post shared!"));
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onOpenChange(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || t("common.error"));
    } finally {
      setIsLoading(false);
    }
  }
 
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{ base: "bg-theme-card", header: "border-b border-theme" }}
    >
      <ModalContent className="max-w-lg">
        {() => (
          <>
            <ModalHeader className="flex items-center gap-2 text-theme-primary">
              <FiShare2 className="text-brand-500" />
              {t("post.shareTitle", "Share Post")}
            </ModalHeader>
 
            <ModalBody className="pb-5 space-y-4">
              {/* User info */}
              <div className="flex items-center gap-3">
                <Avatar src={userData?.photo} name={userData?.name} size="sm" />
                <span className="font-semibold text-sm text-theme-primary">{userData?.name}</span>
              </div>
 
              {/* Caption input */}
              <Textarea
                ref={bodyRef}
                minRows={3}
                placeholder={t("post.shareCaption", "Add a caption... (optional)")}
                classNames={{
                  input: "text-theme-primary",
                  inputWrapper: "bg-theme-secondary border border-theme",
                }}
              />
 
              <Divider />
 
              {/* Original post preview */}
              <div className="rounded-xl border border-theme overflow-hidden bg-theme-secondary">
                <div className="flex items-center gap-2 p-3">
                  <Avatar src={post?.user?.photo} name={post?.user?.name} size="sm" />
                  <span className="font-semibold text-sm text-theme-primary">{post?.user?.name}</span>
                </div>
                {post?.body && (
                  <p className="px-3 pb-2 text-sm text-theme-secondary">{post.body}</p>
                )}
                {post?.image && (
                  <img
                    src={post.image}
                    alt="original post"
                    className="w-full max-h-48 object-cover"
                  />
                )}
              </div>
 
              {/* Share button */}
              <Button
                onPress={handleShare}
                isLoading={isLoading}
                color="secondary"
                className="text-white font-bold w-full"
                startContent={!isLoading && <FiShare2 />}
              >
                {t("post.share", "Share")}
              </Button>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}