import { Pagination, Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaBookmark } from "react-icons/fa";
 
import CardSkeleton from "../../Cards/CardSkeleton/CardSkeleton";
import PostCard from "../../Cards/PostCard/PostCard";
import { getBookmarks } from "../../services/userServices";
 
export default function ExplorePage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
 
  const { data, isLoading } = useQuery({
    queryKey: ["bookmarks", page],
    queryFn: () => getBookmarks(page),
    staleTime: 30_000,
  });
 
  const bookmarks  = data?.bookmarks  ?? [];
  const pagination = data?.pagination ?? {};
 
  return (
    <>
      <title>Saved | SocialHup</title>
      <main className="bg-theme-page min-h-screen pt-20 pb-8 px-3 transition-colors duration-300">
        <div className="max-w-2xl mx-auto">
 
          {/* Header */}
          <div className="flex items-center gap-2 mb-5">
            <FaBookmark className="text-brand-500 text-xl" />
            <h1 className="text-xl font-bold text-theme-primary">
              {t("explore.title", "Saved Posts")}
            </h1>
            {pagination.total > 0 && (
              <span className="text-sm text-theme-secondary ms-1">
                ({pagination.total})
              </span>
            )}
          </div>
 
          {/* Posts */}
          {isLoading ? (
            [...Array(3)].map((_, i) => <CardSkeleton key={i} />)
          ) : bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <span className="text-6xl">🔖</span>
              <p className="text-theme-secondary font-medium text-lg">
                {t("explore.empty", "No saved posts yet")}
              </p>
              <p className="text-theme-muted text-sm text-center max-w-xs">
                {t("explore.emptyHint", "When you save a post, it will appear here")}
              </p>
            </div>
          ) : (
            bookmarks.map((post) => <PostCard key={post._id} post={post} />)
          )}
 
          {/* Pagination */}
          {!isLoading && pagination.numberOfPages > 1 && (
            <Pagination
              onChange={setPage}
              showControls
              showShadow
              page={page}
              total={pagination.numberOfPages}
              className="mt-5 flex justify-center"
              color="secondary"
            />
          )}
        </div>
      </main>
    </>
  );
}
 