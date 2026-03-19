// components/SidBars/RightSideBar.jsx
import { Avatar, Button, Skeleton } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaFireAlt } from "react-icons/fa";
import { Link } from "react-router";
import { toast } from "react-toastify";
 
import { getFollowSuggestions, toggleFollowUser } from "../services/userServices";
 
// ── Static trending data ──────────────────────────────────
const TRENDING = [
  { head: "Technology · Trending", label: "#AiRevolution",      numb: "45.2k posts" },
  { head: "Design · Trending",     label: "#UIUXTrends",        numb: "32.8k posts" },
  { head: "Business · Trending",   label: "#StartupLife",       numb: "28.2k posts" },
  { head: "Photography · Trending",label: "#StreetPhotography", numb: "19.3k posts" },
  { head: "Lifestyle · Trending",  label: "#MorningRoutine",    numb: "15.4k posts" },
];
 
function SuggestionItem({ user }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [followed, setFollowed] = useState(false);
 
  const { mutate: handleFollow, isPending } = useMutation({
    mutationFn: () => toggleFollowUser(user._id),
    onSuccess: () => setFollowed((prev) => !prev),
    onError: (error) => toast.error(error?.response?.data?.message || t("common.error")),
  });
 
  return (
    <li className="flex items-center justify-between gap-2">
      <Link to={`/profile/${user._id}`} className="flex items-center gap-2 min-w-0">
        <Avatar src={user.photo} name={user.name} size="sm" className="flex-shrink-0" />
        <div className="min-w-0">
          <h3 className="font-semibold text-sm text-theme-primary truncate">{user.name}</h3>
          <p className="text-xs text-theme-muted truncate">
            {user.followersCount?.toLocaleString()} {t("profile.followers", "followers")}
          </p>
        </div>
      </Link>
      <Button
        size="sm"
        radius="full"
        color={followed ? "default" : "secondary"}
        variant={followed ? "bordered" : "solid"}
        isLoading={isPending}
        onPress={() => handleFollow()}
        className={`text-xs flex-shrink-0 ${followed ? "text-theme-primary" : "text-white"}`}
      >
        {followed ? t("community.following", "Following") : t("community.follow", "Follow")}
      </Button>
    </li>
  );
}
 
export default function RightSideBar() {
  const { t } = useTranslation();
 
  const { data, isLoading } = useQuery({
    queryKey: ["suggestions", 5],
    queryFn: () => getFollowSuggestions(5),
    staleTime: 60_000,
  });
 
  const suggestions = data?.suggestions ?? [];
 
  return (
    <aside className="bg-theme-card border-s border-theme p-4 h-full overflow-y-auto transition-colors duration-300 space-y-4">
 
      {/* Trending Now */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-sm text-theme-primary">
            {t("sidebar.trendingNow", "Trending Now")}
          </h2>
          <Link className="text-brand-500 text-xs hover:underline" to="/explore">
            {t("common.seeAll", "See all")}
          </Link>
        </div>
        <ul className="space-y-3">
          {TRENDING.map((trend) => (
            <li key={trend.label} className="flex justify-between items-start cursor-pointer group">
              <div>
                <p className="text-xs text-theme-muted">{trend.head}</p>
                <h3 className="font-bold text-sm text-theme-primary group-hover:text-brand-500 transition-colors">
                  {trend.label}
                </h3>
                <p className="text-xs text-theme-muted">{trend.numb}</p>
              </div>
              <FaFireAlt className="text-orange-500 flex-shrink-0 mt-1" />
            </li>
          ))}
        </ul>
      </section>
 
      <div className="border-t border-theme" />
 
      {/* Follow Suggestions */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-sm text-theme-primary">
            {t("sidebar.suggestions", "Suggestions")}
          </h2>
          <Link className="text-brand-500 text-xs hover:underline" to="/communication">
            {t("common.seeAll", "See all")}
          </Link>
        </div>
 
        <ul className="space-y-3">
          {isLoading
            ? [...Array(4)].map((_, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-2.5 w-24 rounded" />
                    <Skeleton className="h-2 w-16 rounded" />
                  </div>
                  <Skeleton className="h-7 w-16 rounded-full" />
                </li>
              ))
            : suggestions.map((user) => (
                <SuggestionItem key={user._id} user={user} />
              ))
          }
        </ul>
      </section>
 
    </aside>
  );
}