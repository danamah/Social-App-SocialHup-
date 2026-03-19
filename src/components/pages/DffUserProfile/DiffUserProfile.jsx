import { Avatar, Button, Divider } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { FaCalendar, FaRegEnvelope, FaUserFriends } from "react-icons/fa";
import { GiHumanTarget } from "react-icons/gi";
import { BsFilePost } from "react-icons/bs";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { useContext } from "react";

import CardSkeleton from "../../Cards/CardSkeleton/CardSkeleton";
import PostCard from "../../Cards/PostCard/PostCard";
import { getUserProfile, getUserPosts, toggleFollowUser } from "../../services/userServices";
import { UserLoggedInfoContext } from "../../context/UserLoggedContext";
export default function DiffUserProfile() {
    const { id } = useParams();
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { userData: myData } = useContext(UserLoggedInfoContext);

    // ── Fetch profile data ───────────────────────────────
    const { data: profileData, isLoading: profileLoading } = useQuery({
        queryKey: ["userProfile", id],
        queryFn: () => getUserProfile(id),
        staleTime: 30_000,
    });

    // ── Fetch user posts ─────────────────────────────────
    const { data: postsData, isLoading: postsLoading } = useQuery({
        queryKey: ["userPosts", id],
        queryFn: () => getUserPosts(id),
        enabled: !!id,
        staleTime: 30_000,
    });

    const user = profileData?.user;
    const isFollowing = profileData?.isFollowing ?? false;
    const posts = postsData?.posts ?? [];
    const isMyProfile = myData?._id === id;

    // ── Follow / Unfollow ────────────────────────────────
    const { mutate: handleFollow, isPending: isFollowPending } = useMutation({
        mutationFn: () => toggleFollowUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userProfile", id] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || t("common.error"));
        },
    });

    if (profileLoading) {
        return (
            <main className="bg-theme-page min-h-screen pt-20 px-3">
                <div className="max-w-3xl mx-auto space-y-3">
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            </main>
        );
    }
    if (!id) return <Navigate to="/profile" replace />;
    if (!user) {
        return (
            <main className="bg-theme-page min-h-screen pt-20 flex items-center justify-center">
                <div className="text-center space-y-3">
                    <span className="text-6xl">😕</span>
                    <p className="text-theme-secondary font-medium">{t("profile.notFound", "User not found")}</p>
                </div>
            </main>
        );
    }

    return (
        <>
            <title>{user.name} | SocialHub</title>
            <main className="bg-theme-page min-h-screen pt-20 pb-8 px-3 transition-colors duration-300">
                <div className="max-w-3xl mx-auto space-y-4">

                    {/* ── Profile card ── */}
                    <div className="bg-theme-card border border-theme rounded-2xl overflow-hidden shadow-sm">
                        {/* Cover */}
                        <div className="h-32 md:h-48 bg-linear-to-r from-brand-400 to-brand-700" />

                        {/* Avatar + info */}
                        <div className="px-4 pb-4 -mt-10">
                            <div className="flex items-end justify-between">
                                <Avatar
                                    src={user.photo}
                                    name={user.name}
                                    className="w-20 h-20 border-4 border-theme-card"
                                />
                                {/* Follow button — hide for own profile */}
                                {!isMyProfile && (
                                    <Button
                                        color={isFollowing ? "default" : "secondary"}
                                        variant={isFollowing ? "bordered" : "solid"}
                                        isLoading={isFollowPending}
                                        onPress={() => handleFollow()}
                                        className={`mt-12 font-medium ${isFollowing ? "text-theme-primary" : "text-white"}`}
                                    >
                                        {isFollowing
                                            ? t("community.following", "Following")
                                            : t("community.follow", "Follow")
                                        }
                                    </Button>
                                )}
                            </div>

                            {/* Name + username */}
                            <div className="mt-3">
                                <h1 className="text-xl font-bold text-theme-primary">{user.name}</h1>
                                {user.username && (
                                    <p className="text-sm text-theme-secondary">@{user.username}</p>
                                )}
                            </div>

                            {/* Stats row */}
                            <div className="flex gap-6 mt-4">
                                <div className="text-center">
                                    <p className="font-bold text-lg text-theme-primary">{user.followersCount ?? 0}</p>
                                    <p className="text-xs text-theme-secondary">{t("profile.followers", "Followers")}</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-lg text-theme-primary">{user.followingCount ?? 0}</p>
                                    <p className="text-xs text-theme-secondary">{t("profile.following", "Following")}</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-lg text-theme-primary">{posts.length}</p>
                                    <p className="text-xs text-theme-secondary">{t("profile.posts", "Posts")}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Profile details ── */}
                    <div className="bg-theme-card border border-theme rounded-2xl p-4 shadow-sm space-y-3">
                        <h2 className="font-bold text-theme-primary flex items-center gap-2">
                            <FaUserFriends className="text-brand-500" />
                            {t("profile.about", "About")}
                        </h2>
                        <Divider />
                        <ul className="space-y-3">
                            {user.email && (
                                <li className="flex items-center gap-3 text-sm">
                                    <div className="bg-brand-100 dark:bg-brand-900/30 rounded-full p-1.5">
                                        <FaRegEnvelope className="text-brand-500" />
                                    </div>
                                    <span className="text-theme-secondary">{user.email}</span>
                                </li>
                            )}
                            {user.gender && (
                                <li className="flex items-center gap-3 text-sm">
                                    <div className="bg-brand-100 dark:bg-brand-900/30 rounded-full p-1.5">
                                        <GiHumanTarget className="text-brand-500" />
                                    </div>
                                    <span className="text-theme-secondary capitalize">{user.gender}</span>
                                </li>
                            )}
                            {user.dateOfBirth && (
                                <li className="flex items-center gap-3 text-sm">
                                    <div className="bg-brand-100 dark:bg-brand-900/30 rounded-full p-1.5">
                                        <FaCalendar className="text-brand-500" />
                                    </div>
                                    <span className="text-theme-secondary">
                                        {new Date(user.dateOfBirth).toLocaleDateString("en-US", { dateStyle: "medium" })}
                                    </span>
                                </li>
                            )}
                            <li className="flex items-center gap-3 text-sm">
                                <div className="bg-brand-100 dark:bg-brand-900/30 rounded-full p-1.5">
                                    <BsFilePost className="text-brand-500" />
                                </div>
                                <span className="text-theme-secondary">
                                    {t("profile.memberSince", "Joined")}{" "}
                                    {new Date(user.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* ── User posts ── */}
                    <div className="space-y-1">
                        <h2 className="font-bold text-theme-primary px-1 flex items-center gap-2">
                            <BsFilePost className="text-brand-500" />
                            {t("profile.posts", "Posts")}
                            <span className="text-sm font-normal text-theme-secondary">({posts.length})</span>
                        </h2>

                        {postsLoading ? (
                            [...Array(2)].map((_, i) => <CardSkeleton key={i} />)
                        ) : posts.length > 0 ? (
                            posts.map((post) => <PostCard post={post} key={post._id} />)
                        ) : (
                            <div className="bg-theme-card border border-theme rounded-2xl flex flex-col items-center py-12 gap-2 text-theme-secondary">
                                <span className="text-4xl">📝</span>
                                <p>{t("profile.noPosts", "No posts yet")}</p>
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </>
    );
}
