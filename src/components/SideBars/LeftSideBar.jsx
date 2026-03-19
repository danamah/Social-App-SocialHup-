import { useTranslation } from "react-i18next";
import { FaBookmark, FaCamera, FaFireAlt, FaHome, FaUserFriends } from "react-icons/fa";
import { FaBrain, FaCode, FaRocket } from "react-icons/fa6";
import { IoIosColorPalette } from "react-icons/io";
import { NavLink } from "react-router";
 
export default function LeftSideBar() {
  const { t } = useTranslation();
 
  const navigation = [
    { icon: <FaHome className="text-lg" />,        label: t("nav.home", "Home Feed"),        path: "/" },
    { icon: <FaFireAlt className="text-lg" />,     label: t("nav.trending", "Trending"),     path: "/trending" },
    { icon: <FaBookmark className="text-lg" />,    label: t("explore.title", "Saved Posts"), path: "/explore" },
    { icon: <FaUserFriends className="text-lg" />, label: t("nav.communication", "Community"), path: "/communication" },
  ];
 
  const communities = [
    {
      icon: <FaCode className="text-white bg-gradient-to-r from-purple-500 via-fuchsia-400 to-pink-300 p-2 text-[36px] rounded-full" />,
      label: "Web Development", para: "24.5k members",
    },
    {
      icon: <IoIosColorPalette className="text-white bg-gradient-to-r from-green-600 via-cyan-600 to-blue-500 p-2 text-[36px] rounded-full" />,
      label: "UX/UI Design", para: "18.3k members",
    },
    {
      icon: <FaCamera className="text-white bg-gradient-to-r from-yellow-600 via-orange-500 to-orange-600 p-2 text-[36px] rounded-full" />,
      label: "Photography", para: "32.2k members",
    },
    {
      icon: <FaRocket className="text-white bg-gradient-to-r from-pink-700 via-fuchsia-400 to-fuchsia-600 p-2 text-[36px] rounded-full" />,
      label: "Startups", para: "24.5k members",
    },
    {
      icon: <FaBrain className="text-white bg-gradient-to-r from-purple-500 to-purple-700 p-2 text-[36px] rounded-full" />,
      label: "AI & Machine Learning", para: "28.9k members",
    },
  ];
 
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
      isActive
        ? "bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 font-semibold"
        : "text-theme-secondary hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-500"
    }`;
 
  return (
    <aside className="bg-theme-card border-e border-theme ps-4 pe-3 h-full pt-4 overflow-y-auto transition-colors duration-300">
 
      {/* Navigation */}
      <h2 className="text-xs uppercase tracking-widest font-bold text-theme-muted py-2 px-1">
        {t("sidebar.navigation", "Navigation")}
      </h2>
      <ul className="space-y-1 mb-4">
        {navigation.map((nav) => (
          <NavLink key={nav.label} to={nav.path} className={navLinkClass}>
            <span className="text-brand-500">{nav.icon}</span>
            <span className="text-sm font-medium">{nav.label}</span>
          </NavLink>
        ))}
      </ul>
 
      <div className="border-t border-theme my-3" />
 
      {/* Communities */}
      <h2 className="text-xs uppercase tracking-widest font-bold text-theme-muted py-2 px-1">
        {t("sidebar.communities", "My Communities")}
      </h2>
      <ul className="space-y-3 mb-4">
        {communities.map((com) => (
          <li key={com.label} className="flex items-center gap-2.5 px-1 cursor-pointer hover:opacity-80 transition-opacity">
            <span className="flex-shrink-0">{com.icon}</span>
            <div>
              <h3 className="font-semibold text-sm text-theme-primary">{com.label}</h3>
              <p className="text-xs text-theme-muted">{com.para}</p>
            </div>
          </li>
        ))}
      </ul>
 
      <div className="border-t border-theme my-3" />
 
      {/* Trending tags */}
      <h2 className="text-xs uppercase tracking-widest font-bold text-theme-muted py-2 px-1">
        {t("sidebar.trendingTags", "Trending Tags")}
      </h2>
      <div className="flex flex-wrap gap-2 pb-4">
        {["#webdev", "#design", "#ai", "#startup", "#coding", "#tech"].map((tag) => (
          <span
            key={tag}
            className="text-brand-600 dark:text-brand-300 bg-brand-100 dark:bg-brand-900/30 px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-brand-200 dark:hover:bg-brand-800/40 transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>
    </aside>
  );
}