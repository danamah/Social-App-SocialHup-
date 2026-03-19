// src/components/Cards/PostCard/CommentInput.jsx
import { Avatar, Button, Input } from "@heroui/react";
import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaImages } from "react-icons/fa6";
import { GiCrossMark } from "react-icons/gi";
import { IoSend } from "react-icons/io5";
import { toast } from "react-toastify";

import { UserLoggedInfoContext } from "../../context/UserLoggedContext";
import { createComment } from "../../services/Commentandrepliesservices";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

export default function CommentInput({ postId, onCommentAdded }) {
  const { userData } = useContext(UserLoggedInfoContext);
  const { t } = useTranslation();

  const [content,     setContent]     = useState("");
  const [imageFile,   setImageFile]   = useState(null);
  const [previewUrl,  setPreviewUrl]  = useState("");
  const [fileError,   setFileError]   = useState("");
  const [isLoading,   setIsLoading]   = useState(false);

  const fileInputRef = useRef(null);

  // ── File handling ───────────────────────────────────────
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError(t("post.imageTypeError", "Only jpg, jpeg, png, webp are supported"));
      return;
    }
    setFileError("");
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function clearImage() {
    setImageFile(null);
    setPreviewUrl("");
    setFileError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ── Submit ──────────────────────────────────────────────
  async function handleSubmit() {
    if (!content.trim()) {
      toast.error(t("post.commentEmpty", "Please write a comment"));
      return;
    }
    if (!imageFile) {
      toast.error(t("post.commentImageRequired", "Please add an image to your comment"));
      return;
    }

    setIsLoading(true);
    try {
      const comment = await createComment(postId, { content: content.trim(), image: imageFile });
      onCommentAdded?.(comment);
      setContent("");
      clearImage();
    } catch (error) {
      toast.error(error?.response?.data?.message || t("common.error"));
    } finally {
      setIsLoading(false);
    }
  }

  const canSubmit = content.trim() && imageFile;

  return (
    <div className="flex items-start gap-2 py-3 px-3">
      <Avatar src={userData?.photo} name={userData?.name} size="sm" className="mt-1 flex-shrink-0" />

      <div className="flex-1 space-y-2">
        {/* Text input */}
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
          radius="full"
          placeholder={t("post.add_comment", "Add a comment...")}
          classNames={{ inputWrapper: "bg-theme-secondary border border-theme" }}
          endContent={
            <div className="flex items-center gap-2">
              {/* Image picker icon */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-theme-secondary hover:text-brand-500 transition-colors"
                title={t("post.addImage", "Add image")}
              >
                <FaImages className={`text-lg ${imageFile ? "text-brand-500" : ""}`} />
              </button>

              {/* Send button */}
              <Button
                isDisabled={!canSubmit}
                isLoading={isLoading}
                onPress={handleSubmit}
                className="bg-transparent min-w-0 p-0"
              >
                {!isLoading && (
                  <IoSend className={`text-xl transition-colors ${canSubmit ? "text-brand-500 hover:text-brand-600" : "text-gray-300"}`} />
                )}
              </Button>
            </div>
          }
        />

        {/* Image preview */}
        {previewUrl && (
          <div className="relative w-fit">
            <img
              src={previewUrl}
              alt="comment attachment"
              className="max-h-24 rounded-lg border border-theme object-cover"
            />
            <button
              onClick={clearImage}
              className="absolute -top-1.5 -end-1.5 bg-red-100 dark:bg-red-900/50 rounded-full p-0.5 border border-theme"
            >
              <GiCrossMark className="text-sm text-red-500" />
            </button>
          </div>
        )}

        {/* Helper text — tells user image is required */}
        {!imageFile && (
          <p className="text-xs text-theme-muted ps-2">
            <span className="text-red-400">*</span>{" "}
            {t("post.commentImageHint", "An image is required to post a comment")}
          </p>
        )}

        {/* File type error */}
        {fileError && (
          <p className="text-xs text-red-500 ps-2">{fileError}</p>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}