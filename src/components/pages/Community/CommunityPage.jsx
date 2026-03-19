import { Avatar, Button, Skeleton } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaUsers } from "react-icons/fa";
import { Link } from "react-router";
import { toast } from "react-toastify";
 
import { getFollowSuggestions, toggleFollowUser } from "../../services/userServices";
 
function SuggestionCard({ user }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [followed, setFollowed] = useState(false);
 
  const { mutate: handleFollow, isPending } = useMutation({
    mutationFn: () => toggleFollowUser(user._id),
    onSuccess: () => {
      setFollowed((prev) => !prev);
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || t("common.error"));
    },
  });
 
  return (
    <div className="flex items-center justify-between p-4 bg-theme-card border border-theme rounded-xl transition-colors duration-300 hover:border-brand-300">
      <Link to={`/profile/${user._id}`} className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar src={user.photo} name={user.name} size="md" />
        <div className="min-w-0">
          <h3 className="font-semibold text-theme-primary truncate">{user.name}</h3>
          {user.username && (
            <p className="text-xs text-theme-secondary truncate">@{user.username}</p>
          )}
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-theme-muted">
              {user.followersCount?.toLocaleString()} {t("profile.followers", "followers")}
            </span>
            {user.mutualFollowersCount > 0 && (
              <span className="text-xs text-brand-500">
                · {user.mutualFollowersCount} {t("community.mutual", "mutual")}
              </span>
            )}
          </div>
        </div>
      </Link>
 
      <Button
        size="sm"
        color={followed ? "default" : "secondary"}
        variant={followed ? "bordered" : "solid"}
        isLoading={isPending}
        onPress={() => handleFollow()}
        className={`ms-3 flex-shrink-0 ${followed ? "text-theme-primary" : "text-white"}`}
      >
        {followed
          ? t("community.following", "Following")
          : t("community.follow", "Follow")
        }
      </Button>
    </div>
  );
}
 
function SuggestionSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 bg-theme-card border border-theme rounded-xl">
      <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-1/3 rounded-lg" />
        <Skeleton className="h-3 w-1/4 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-20 rounded-full flex-shrink-0" />
    </div>
  );
}
 
export default function CommunityPage() {
  const { t } = useTranslation();
  const [limit, setLimit] = useState(10);
 
  const { data, isLoading } = useQuery({
    queryKey: ["suggestions", limit],
    queryFn: () => getFollowSuggestions(limit),
    staleTime: 60_000,
  });
 
  const suggestions = data?.suggestions ?? [];
  const total       = data?.pagination?.total ?? 0;
 
  return (
    <>
      <title>Community | SocialHup</title>
      <main className="bg-theme-page min-h-screen pt-20 pb-8 px-3 transition-colors duration-300">
        <div className="max-w-2xl mx-auto">
 
          {/* Header */}
          <div className="flex items-center gap-2 mb-5">
            <FaUsers className="text-brand-500 text-xl" />
            <h1 className="text-xl font-bold text-theme-primary">
              {t("community.title", "People You May Know")}
            </h1>
            {total > 0 && (
              <span className="text-sm text-theme-secondary ms-1">
                ({total.toLocaleString()})
              </span>
            )}
          </div>
 
          {/* Suggestion cards */}
          <div className="space-y-3">
            {isLoading
              ? [...Array(6)].map((_, i) => <SuggestionSkeleton key={i} />)
              : suggestions.length === 0
                ? (
                  <div className="flex flex-col items-center py-20 gap-3">
                    <span className="text-6xl">👥</span>
                    <p className="text-theme-secondary font-medium">
                      {t("community.empty", "No suggestions available")}
                    </p>
                  </div>
                )
                : suggestions.map((user) => (
                  <SuggestionCard key={user._id} user={user} />
                ))
            }
          </div>
 
          {/* Load more */}
          {!isLoading && suggestions.length < total && (
            <div className="flex justify-center mt-6">
              <Button
                color="secondary"
                variant="bordered"
                onPress={() => setLimit((prev) => prev + 10)}
              >
                {t("community.loadMore", "Load More")}
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
 