import { Divider, Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
 
import CardSkeleton from "../Cards/CardSkeleton/CardSkeleton";
import PostCardBody from "../Cards/PostCard/PostCardBody";
import PostCardFooter from "../Cards/PostCard/PostCardFooter";
import PostCardHeader from "../Cards/PostCard/PostCardHeader";
import { getSinglePost } from "../services/postServices";
import { getPostComments } from "../services/commentAndRepliesServices";
 
export default function PostDetailsModal({
  isOpen,
  onOpenChange,
  postId,
  postComments,     
  setPostComments,  
}) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [post,      setPost]      = useState(null);
 
  async function fetchDetails() {
    setIsLoading(true);
    try {
      const [post, { comments }] = await Promise.all([
        getSinglePost(postId),
        getPostComments(postId, { limit: 20 }),
      ]);
      setPost(post);
      setPostComments(comments);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
 
  useEffect(() => {
    if (isOpen && postId) fetchDetails();
  }, [isOpen, postId]);
 
  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="inside"
      onOpenChange={onOpenChange}
      classNames={{
        base: "bg-theme-card",
        header: "border-b border-theme text-theme-primary",
      }}
    >
      <ModalContent className="max-w-2xl">
        {() => (
          <>
            <ModalHeader>{t("post.postDetails", "Post Details")}</ModalHeader>
            <Divider />
 
            {isLoading ? (
              <div className="p-4">
                <CardSkeleton />
              </div>
            ) : post ? (
              <ModalBody className="p-0">
                <PostCardHeader post={post} />
                <PostCardBody post={post} postDetails />
                <PostCardFooter
                  post={post}
                  postComments={postComments}
                  setPostComments={setPostComments}
                  postDetails
                />
              </ModalBody>
            ) : (
              <div className="flex flex-col items-center py-12 gap-3">
                <span className="text-4xl">😕</span>
                <p className="text-theme-secondary">
                  {t("post.notFound", "Post not found")}
                </p>
              </div>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
