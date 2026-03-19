import { Button, Divider, Input, Skeleton } from '@heroui/react';
import { useContext, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BsFilePost } from "react-icons/bs";
import { CiLock } from "react-icons/ci";
import { FaCalendar, FaCamera, FaEye, FaRegEnvelope, FaUser } from "react-icons/fa";
import { GiHumanTarget } from "react-icons/gi";
import { ImProfile } from "react-icons/im";
import { IoMdEyeOff } from "react-icons/io";
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';

import CardSkeleton from '../../Cards/CardSkeleton/CardSkeleton';
import PostCard from '../../Cards/PostCard/PostCard';
import { authContext } from '../../context/AuthContext';
import { UserLoggedInfoContext } from '../../context/UserLoggedContext';
import {
  changePassword,
  getUserPosts,
  uploadProfilePhoto,
} from '../../services/userServices';

export default function MyProfilePage() {
  const { t } = useTranslation();
  const { userData, setUserData } = useContext(UserLoggedInfoContext);
  const { setToken } = useContext(authContext);

  const [isPhotoLoading,    setIsPhotoLoading]    = useState(false);
  const [showCurrentPass,   setShowCurrentPass]   = useState(false);
  const [showNewPass,       setShowNewPass]        = useState(false);
  const [changePassLoading, setChangePassLoading] = useState(false);

  const imageInput = useRef();

  // ── User posts via useQuery ──────────────────────────
  const { data: postsData, isLoading: isUserPostsLoading } = useQuery({
    queryKey: ["userPosts", userData?._id],
    queryFn: () => getUserPosts(userData._id),
    enabled: !!userData?._id,
    staleTime: 30_000,
  });
  const userPosts = postsData?.posts ?? [];

  // ── Profile info list ────────────────────────────────
  const userInfo = [
    {
      icon: <FaUser className="text-xl text-purple-800" />,
      label: t("profile.name",        "Full Name"),
      result: userData?.name,
    },
    {
      icon: <FaRegEnvelope className="text-xl text-purple-800" />,
      label: t("profile.email",       "Email Address"),
      result: userData?.email,
    },
    {
      icon: <FaCalendar className="text-xl text-purple-800" />,
      label: t("profile.dateOfBirth", "Date of Birth"),
      result: userData?.dateOfBirth
        ? new Date(userData.dateOfBirth).toLocaleDateString("en-US", { dateStyle: "medium" })
        : "—",
    },
    {
      icon: <GiHumanTarget className="text-xl text-purple-800" />,
      label: t("profile.gender", "Gender"),
      result: userData?.gender,
    },
  ];

  // ── Photo upload ─────────────────────────────────────
  function chooseFile() { imageInput.current?.click(); }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.type)) {
      toast.error(t("post.imageTypeError", "Only JPG, PNG, JPEG allowed"));
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image is too large — max 4 MB");
      return;
    }
    handleUpdatePhoto(file);
  }

  async function handleUpdatePhoto(file) {
    setIsPhotoLoading(true);
    try {
      const updated = await uploadProfilePhoto(file);        // returns data.data
      const newUrl  = updated?.photo ?? URL.createObjectURL(file);
      setUserData((prev) => ({ ...prev, photo: newUrl }));
    } catch (error) {
      toast.error(error?.response?.data?.message || t("common.error"));
    } finally {
      setIsPhotoLoading(false);
    }
  }

  // ── Change password ──────────────────────────────────
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    mode: "all",
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  async function handleChangePassword({ currentPassword, newPassword }) {
    setChangePassLoading(true);
    try {
      const result = await changePassword({ password: currentPassword, newPassword });
      if (result?.data?.token) {
        localStorage.setItem("userToken", result.data.token);
        setToken(result.data.token);
      }
      toast.success(t("profile.passwordChanged", "Password changed ✅"));
      reset();
    } catch (error) {
      toast.error(error?.response?.data?.message || t("common.error"));
    } finally {
      setChangePassLoading(false);
    }
  }

  if (!userData) return null;

  return (
    <>
      <title>Profile | SocialHub</title>
      <main className="w-[95%] lg:w-[70%] mx-auto grid grid-cols-12 gap-3 my-4 pt-20">

        {/* ── Cover + Avatar ── */}
        <div className="totalInfo relative col-span-12 shadow-lg rounded-2xl overflow-hidden bg-theme-card border border-theme">
          <img
            className="w-full h-15 md:h-30 lg:h-45 object-cover"
            src="https://t3.ftcdn.net/jpg/03/22/30/46/360_F_322304683_7ysRarFkmy2osfPKTOYQv7qTPofKelfb.jpg"
            alt="cover"
          />
          <div className="info flex gap-2 items-center justify-between py-2.5 px-3">
            <div className="flex gap-3 items-center">
              {/* Avatar with upload overlay */}
              <div
                onClick={chooseFile}
                className="group cursor-pointer relative size-16 rounded-full overflow-hidden border-3 border-purple-500"
              >
                <img src={userData.photo} alt={userData.name} className="w-full h-full object-cover" />
                {isPhotoLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Skeleton className="size-16 rounded-full" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <FaCamera className="text-white text-lg" />
                  </div>
                )}
                <input ref={imageInput} onChange={handleImageChange} type="file" className="hidden" accept="image/*" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-theme-primary">{userData.name}</h2>
                <p className="text-sm text-theme-secondary flex items-center gap-1">
                  <FaRegEnvelope className="text-brand-500" />
                  {userData.email}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-center">
                <p className="font-bold text-theme-primary">{userData.followersCount ?? 0}</p>
                <p className="text-xs text-theme-secondary">{t("profile.followers", "Followers")}</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-theme-primary">{userData.followingCount ?? 0}</p>
                <p className="text-xs text-theme-secondary">{t("profile.following", "Following")}</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-theme-primary">{userData.bookmarksCount ?? 0}</p>
                <p className="text-xs text-theme-secondary">{t("profile.saved", "Saved")}</p>
              </div>
            </div>

            {/* Gender badge */}
            <div className="flex items-center bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded-2xl p-1 px-2">
              <GiHumanTarget className="text-purple-600 me-1.5 text-lg" />
              <p className="text-purple-700 dark:text-purple-300 font-bold capitalize">{userData.gender}</p>
            </div>
          </div>
        </div>

        {/* ── Profile Info ── */}
        <div className="allInfo col-span-12 lg:col-span-6 shadow-lg rounded-2xl p-4 bg-theme-card border border-theme space-y-3">
          <header className="flex items-center gap-2 py-1">
            <ImProfile className="bg-purple-200 dark:bg-purple-900/40 text-purple-700 text-4xl rounded-xl p-1.5" />
            <div>
              <h2 className="text-lg font-bold text-theme-primary">{t("profile.info", "Profile Information")}</h2>
              <p className="text-sm text-theme-secondary">{t("profile.personalDetails", "Your personal details")}</p>
            </div>
          </header>
          <Divider />
          <ul className="space-y-3 mt-1">
            {userInfo.map((info) => (
              <li key={info.label} className="bg-brand-50 dark:bg-brand-900/20 border border-theme rounded-xl p-2 px-3 flex items-center gap-3">
                <div className="bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center size-8 flex-shrink-0">
                  {info.icon}
                </div>
                <div>
                  <p className="text-xs text-theme-secondary">{info.label}</p>
                  <h3 className="font-bold text-theme-primary capitalize">{info.result || "—"}</h3>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Change Password ── */}
        <div className="password col-span-12 lg:col-span-6 shadow-lg rounded-2xl p-4 bg-theme-card border border-theme space-y-3">
          <header className="flex items-center gap-2 py-1">
            <CiLock className="bg-red-200 dark:bg-red-900/30 text-red-600 text-4xl rounded-xl p-1.5" />
            <div>
              <h2 className="text-lg font-bold text-theme-primary">{t("profile.changePassword", "Change Password")}</h2>
              <p className="text-sm text-theme-secondary">{t("profile.updateSecurity", "Update your security credentials")}</p>
            </div>
          </header>
          <Divider />
          <form onSubmit={handleSubmit(handleChangePassword)} className="space-y-4 pt-2">
            <div className="border-2 border-theme rounded-2xl p-4 relative mt-3">
              <h3 className="font-semibold text-sm px-2 text-theme-primary bg-theme-card absolute -top-3.5">
                {t("profile.currentPassword", "Current Password")}
              </h3>
              <Input
                {...register("currentPassword", {
                  required: "Current password is required",
                  minLength: { value: 6, message: "At least 6 characters" },
                })}
                errorMessage={errors.currentPassword?.message}
                isInvalid={!!errors.currentPassword}
                label={t("profile.currentPassword", "Current Password")}
                type={showCurrentPass ? "text" : "password"}
                endContent={
                  showCurrentPass
                    ? <IoMdEyeOff onClick={() => setShowCurrentPass(false)} className="text-xl text-brand-500 cursor-pointer" />
                    : <FaEye onClick={() => setShowCurrentPass(true)} className="text-xl text-brand-500 cursor-pointer" />
                }
              />
            </div>

            <div className="border-2 border-theme rounded-2xl p-4 relative mt-3">
              <h3 className="font-semibold text-sm px-2 text-theme-primary bg-theme-card absolute -top-3.5">
                {t("profile.newPassword", "New Password")}
              </h3>
              <Input
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: { value: 6, message: "At least 6 characters" },
                })}
                errorMessage={errors.newPassword?.message}
                isInvalid={!!errors.newPassword}
                label={t("profile.newPassword", "New Password")}
                type={showNewPass ? "text" : "password"}
                endContent={
                  showNewPass
                    ? <IoMdEyeOff onClick={() => setShowNewPass(false)} className="text-xl text-brand-500 cursor-pointer" />
                    : <FaEye onClick={() => setShowNewPass(true)} className="text-xl text-brand-500 cursor-pointer" />
                }
              />
            </div>

            <Button
              type="submit"
              isLoading={changePassLoading}
              isDisabled={changePassLoading}
              color="secondary"
              className="w-full font-medium text-white"
            >
              {t("profile.updatePassword", "Update Password")}
            </Button>
          </form>
        </div>

        {/* ── User Posts ── */}
        <div className="userPosts col-span-12 shadow-lg rounded-2xl p-4 bg-theme-card border border-theme">
          <header className="flex items-center gap-2 py-1 mb-3">
            <BsFilePost className="bg-amber-200 dark:bg-amber-900/30 text-amber-700 text-4xl rounded-xl p-1.5" />
            <div>
              <h2 className="text-lg font-bold text-theme-primary">{t("profile.yourPosts", "Your Posts")}</h2>
              <p className="text-sm text-theme-secondary">
                {t("profile.postsCount", "{{count}} posts", { count: userPosts.length })}
              </p>
            </div>
          </header>
          <Divider />
          {isUserPostsLoading ? (
            [...Array(2)].map((_, i) => <CardSkeleton key={i} />)
          ) : userPosts.length > 0 ? (
            userPosts.map((post) => <PostCard post={post} key={post._id} />)
          ) : (
            <div className="flex flex-col items-center py-10 gap-2 text-theme-secondary">
              <span className="text-4xl">📝</span>
              <p>{t("profile.noPosts", "No posts yet")}</p>
            </div>
          )}
        </div>

      </main>
    </>
  );
}