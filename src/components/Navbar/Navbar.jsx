// src/components/Navbar/Navbar.jsx
import {
  Avatar, Button, Dropdown, DropdownItem,
  DropdownMenu, DropdownTrigger, useDisclosure,
  Badge,
} from "@heroui/react";
import { useContext, useEffect, useState } from "react";
import { FaCompass, FaPlus, FaRegBell, FaSearch } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import { Link, NavLink, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import logo from "../../assets/images/network-hub.png";
import { authContext } from "../context/AuthContext";
import { UserLoggedInfoContext } from "../context/UserLoggedContext";
import ThemeToggle from "../lib/ThemeToggle";
import LanguageSwitcher from "../lib/LanguageSwitcher";
import { getUnreadCount } from "../services/Notificationsservices";

// Lazy-load CreatePostModal to keep initial bundle small
import CreatePostModal from "../Cards/CreatePostCard/CreatePostCardModal";
import { ImProfile } from "react-icons/im";

export default function Navbar() {
  const { setToken } = useContext(authContext);
  const { userData } = useContext(UserLoggedInfoContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // ── Unread notifications count ─────────────────────────
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    getUnreadCount()
      .then(setUnreadCount)
      .catch(() => {}); // fail silently — badge just stays 0

    // Poll every 60 seconds
    const interval = setInterval(() => {
      getUnreadCount().then(setUnreadCount).catch(() => {});
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  // ── Logout ─────────────────────────────────────────────
  function logUserOut() {
    localStorage.removeItem("userToken");
    setToken(null);
    navigate("/login", { replace: true });
  }

  // ── Shared NavLink class helper ────────────────────────
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 transition-colors duration-300 hover:text-purple-500 ${
      isActive ? "text-purple-500" : "text-gray-400"
    }`;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-theme-card border-b border-theme px-2 py-3 shadow-sm transition-colors duration-300">
        <div className="mx-auto py-1 flex justify-between items-center max-w-6xl">

          {/* ── LEFT: Logo + Nav links ── */}
          <div className="left flex items-center space-x-5">
            <Link to="/">
              <div className="flex items-center space-x-1.5 cursor-pointer">
                <img className="w-10" src={logo} alt="SocialHub logo" />
                <h1 className="font-bold text-xl text-theme-primary">SocialHub</h1>
              </div>
            </Link>

            <ul className="hidden md:flex items-center space-x-4">
              <li><NavLink className={navLinkClass} to="/"><IoHome className="text-lg" />{t("nav.home")}</NavLink></li>
              <li><NavLink className={navLinkClass} to="/explore"><FaCompass className="text-lg" />{t("nav.explore")}</NavLink></li>
              <li><NavLink className={navLinkClass} to="/communication"><FaUsers className="text-lg" />{t("nav.communication")}</NavLink></li>
            </ul>
          </div>

          {/* ── RIGHT: desktop ── */}
          <div className="hidden md:flex items-center space-x-2.5">
            {/* Search */}
            <div className="lg:flex items-center relative hidden">
              <FaSearch className="text-gray-400 absolute start-2 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                className="focus:outline-0 focus:shadow focus:shadow-purple-200/80 focus:border-purple-300 bg-theme-secondary text-theme-primary min-w-72 ps-8 py-1.5 border border-theme rounded-full transition-colors duration-300"
                placeholder={t("common.search")}
              />
            </div>

            {/* Notification bell with badge */}
            <Link to="/notifications" className="relative text-2xl text-gray-400 hover:text-purple-500 transition-colors">
              <Badge
                content={unreadCount > 0 ? (unreadCount > 99 ? "99+" : unreadCount) : null}
                color="danger"
                size="sm"
                isInvisible={unreadCount === 0}
              >
                <FaRegBell />
              </Badge>
            </Link>

            {/* Theme + Language */}
            <LanguageSwitcher />
            <ThemeToggle />

            {/* Create Post */}
            <Button onPress={onOpen} radius="full" color="secondary" size="sm" className="px-3 py-1.5">
              <FaPlus />{t("post.create")}
            </Button>

            {/* Avatar dropdown */}
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform cursor-pointer"
                  src={userData?.photo}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="info" className="h-14 gap-2" isReadOnly>
                  <p className="font-semibold text-theme-secondary text-xs">{t("nav.signedInAs")}</p>
                  <Link className="font-semibold text-theme-primary text-sm" to="/profile">{userData?.email}</Link>
                </DropdownItem>
                <DropdownItem key="profile">
                  <Link to="/profile">{t("profile.edit_profile")}</Link>
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={logUserOut}>
                  {t("nav.logout")}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* ── RIGHT: mobile dropdown ── */}
          <div className="block md:hidden cursor-pointer">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform cursor-pointer"
                  src={userData?.photo}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Mobile Navigation" variant="flat">
                <DropdownItem key="info" className="h-14 gap-2" isReadOnly>
                  <p className="font-semibold text-xs">{t("nav.signedInAs")}</p>
                  <p className="font-semibold text-sm">{userData?.email}</p>
                </DropdownItem>
                <DropdownItem key="profile">
                  <NavLink className={navLinkClass} to="/profile"><ImProfile />{t("profile.edit_profile")}</NavLink>
                </DropdownItem>
                <DropdownItem key="home">
                  <NavLink className={navLinkClass} to="/"><IoHome />{t("nav.home")}</NavLink>
                </DropdownItem>
                <DropdownItem key="explore">
                  <NavLink className={navLinkClass} to="/explore"><FaCompass />{t("nav.explore")}</NavLink>
                </DropdownItem>
                <DropdownItem key="communication">
                  <NavLink className={navLinkClass} to="/communication"><FaUsers />{t("nav.communication")}</NavLink>
                </DropdownItem>
                <DropdownItem key="notifications">
                  <NavLink className={navLinkClass} to="/notifications">
                    <FaRegBell />
                    {t("nav.notifications")}
                    {unreadCount > 0 && (
                      <span className="ms-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </NavLink>
                </DropdownItem>
                <DropdownItem key="theme-lang" isReadOnly>
                  <div className="flex items-center gap-2 py-1">
                    <LanguageSwitcher />
                    <ThemeToggle />
                  </div>
                </DropdownItem>
                <DropdownItem key="create" isReadOnly>
                  <Button onPress={onOpen} radius="full" color="secondary" size="sm" className="w-full">
                    <FaPlus />{t("post.create")}
                  </Button>
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={logUserOut}>
                  {t("nav.logout")}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

        </div>

        <CreatePostModal isOpen={isOpen} onOpenChange={onOpenChange} />
      </nav>
    </>
  );
}