// src/components/Cards/CreatePostCard/CreatePostModal.jsx
import {
  Avatar, Button, Divider, Modal, ModalBody,
  ModalContent, ModalHeader, Textarea,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaImages } from "react-icons/fa6";
import { GiCrossMark } from "react-icons/gi";
import { toast } from "react-toastify";

import { UserLoggedInfoContext } from "../../context/UserLoggedContext";
import { createPost, updatePost } from "../../services/postServices";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

export default function CreatePostModal({ isOpen, onOpenChange, post, onSuccess }) {
  const { userData } = useContext(UserLoggedInfoContext);
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const fileInputRef = useRef(null);
  const textAreaRef  = useRef(null);

  const [selectedFile,  setSelectedFile]  = useState(null);
  const [previewImage,  setPreviewImage]  = useState(post?.image || "");
  const [formDataImage, setFormDataImage] = useState(null);
  const [fileError,     setFileError]     = useState("");
  const [isLoading,     setIsLoading]     = useState(false);

  // ── Reset state when modal closes ──────────────────────
  function handleClose() {
    setPreviewImage("");
    setSelectedFile(null);
    setFormDataImage(null);
    setFileError("");
  }

  // ── File picker ─────────────────────────────────────────
  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError(t("post.imageTypeError", "Only jpg, jpeg, png, webp are supported"));
      return;
    }

    setFileError("");
    setSelectedFile(file);
    setFormDataImage(file);
    setPreviewImage(URL.createObjectURL(file));
  }

  function clearImage() {
    setPreviewImage("");
    setSelectedFile(null);
    setFormDataImage(null);
    setFileError("");
    // reset file input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ── Submit ──────────────────────────────────────────────
  async function handleSubmit() {
    const body = textAreaRef.current?.value?.trim();

    if (!body && !formDataImage) {
      toast.error(t("post.emptyError", "Please add text or an image"));
      return;
    }

    setIsLoading(true);
    try {
      if (post) {
        // ── UPDATE existing post ──
        await updatePost(post._id, { body, image: formDataImage });
        toast.success(t("post.updateSuccess", "Post updated successfully!"));
        onSuccess?.();
      } else {
        // ── CREATE new post ──
        await createPost({ body, image: formDataImage });
        toast.success(t("post.createSuccess", "Post published!"));
        handleClose();
      }

      // Invalidate both queries so lists refresh
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || t("common.error", "Something went wrong")
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="inside"
      onOpenChange={onOpenChange}
      onClose={handleClose}
      classNames={{
        base: "bg-theme-card",
        header: "text-theme-primary border-b border-theme",
        body: "text-theme-primary",
      }}
    >
      <ModalContent className="max-w-2xl">
        {() => (
          <>
            <ModalHeader>
              {post ? t("post.updateTitle", "Update Post") : t("post.createTitle", "Create Post")}
            </ModalHeader>

            <Divider />

            <ModalBody className="pb-6 space-y-4">
              {/* User info */}
              <header className="flex items-center gap-3">
                <Avatar size="lg" src={userData?.photo} />
                <div>
                  <h3 className="text-base font-semibold text-theme-primary">{userData?.name}</h3>
                  <p className="text-xs text-theme-secondary">{t("post.active", "Active now")}</p>
                </div>
              </header>

              {/* Text area */}
              <Textarea
                ref={textAreaRef}
                defaultValue={post?.body || ""}
                minRows={previewImage ? 3 : 6}
                placeholder={t("post.what_on_mind", "What's on your mind?") + ` ${userData?.name ?? ""}...`}
                classNames={{
                  input: "text-theme-primary",
                  inputWrapper: "bg-theme-secondary border border-theme",
                }}
              />

              {/* Image preview */}
              {previewImage && (
                <div className="relative w-fit rounded-2xl overflow-hidden mx-auto border border-theme">
                  <button
                    onClick={clearImage}
                    className="absolute end-2 top-2 z-10 bg-red-100 dark:bg-red-900/40 border border-white/20 shadow rounded-xl p-1"
                    aria-label="Remove image"
                  >
                    <GiCrossMark className="text-xl text-red-500 cursor-pointer" />
                  </button>
                  <img
                    src={previewImage}
                    alt="Post preview"
                    className="max-h-72 object-cover"
                  />
                </div>
              )}

              <Divider />

              {/* Image picker row */}
              <div className="flex gap-2 items-center">
                <span className="text-sm font-medium text-theme-secondary">
                  {t("post.addImage", "Add image to your post")}
                </span>
                <FaImages
                  className="text-purple-500 cursor-pointer text-2xl hover:text-purple-600 transition-colors"
                  onClick={openFilePicker}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <span className="text-xs text-theme-secondary truncate max-w-40">
                    {selectedFile.name}
                  </span>
                )}
              </div>

              {fileError && (
                <p className="text-red-500 text-sm font-medium">{fileError}</p>
              )}

              <Divider />

              {/* Submit button */}
              <Button
                onPress={handleSubmit}
                isLoading={isLoading}
                color="secondary"
                className="text-white font-bold py-5 w-full"
              >
                {post ? t("post.update", "Update") : t("post.publish", "Publish")}
              </Button>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}