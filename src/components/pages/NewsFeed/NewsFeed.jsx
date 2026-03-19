// src/components/pages/NewsFeed/NewsFeed.jsx
import {
  Button, Drawer, DrawerBody, DrawerContent,
  DrawerFooter, DrawerHeader, Pagination, Skeleton, useDisclosure,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaFire } from "react-icons/fa6";
import { RiUserSettingsFill } from "react-icons/ri";

import CardSkeleton from "../../Cards/CardSkeleton/CardSkeleton";
import CreatePost from "../../Cards/CreatePostCard/CreatePostCard";
import PostCard from "../../Cards/PostCard/PostCard";
import LeftSideBar from "../../SideBars/LeftSideBar";
import RightSideBar from "../../SideBars/RightSideBar";
import { getAllPosts } from "../../services/postServices";

export default function NewsFeed() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const leftDrawer = useDisclosure();
  const rightDrawer = useDisclosure();

  // ── Fetch posts ────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ["posts", page],          // ← "posts" not "getPosts"
    queryFn: () => getAllPosts(page),    // returns { posts, pagination }
    refetchInterval: 60_000,            // poll every 60s (not 3s — too aggressive)
    staleTime: 30_000,
  });

  useEffect(() => {
    if (data?.pagination?.numberOfPages) {
      (async () => setTotalPages(data.pagination.numberOfPages));
    }
  }, [data]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const posts = data?.posts ?? [];
  const pagination = data?.pagination ?? {};

  return (
    <>
      <title>Home | SocialHub</title>

      {/* Mobile sidebar triggers */}
      <div className="lg:hidden fixed top-20 inset-s-4 z-50">
        <Button size="sm" color="secondary" onPress={leftDrawer.onOpen}>
          <RiUserSettingsFill className="text-xl" />
        </Button>
      </div>
      <div className="lg:hidden fixed top-20 inset-e-4 z-50">
        <Button size="sm" color="secondary" onPress={rightDrawer.onOpen}>
          <FaFire className="text-xl" />
        </Button>
      </div>

      {/* Main grid */}
      <main className="grid grid-cols-12 gap-3 bg-theme-page min-h-screen pt-25 lg:pt-18 px-3 lg:px-0 transition-colors duration-300">

        {/* Left sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="fixed top-16 inset-s-0 w-[25%] h-[calc(100vh-4rem)] overflow-hidden">
            <LeftSideBar />
          </div>
        </div>

        {/* Feed */}
        <div className="col-span-12 lg:col-span-6 py-4 px-3">
          <CreatePost />

          {isLoading
            ? [...Array(4)].map((_, i) => <CardSkeleton key={i} />)
            : posts.map((post) => <PostCard post={post} key={post._id} />)
          }

          {/* Pagination */}
          {!isLoading && pagination.numberOfPages > 1 && (
            <Pagination
              key={pagination.numberOfPages}
              onChange={setPage}
              showControls
              showShadow
              initialPage={1}
              page={page}
              total={pagination.numberOfPages || totalPages}
              className="my-4 flex justify-center"
              color="secondary"
            />
          )}
        </div>

        {/* Right sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="fixed top-16 inset-e-0 w-[25%] h-[calc(100vh-4rem)] overflow-hidden">
            <RightSideBar />
          </div>
        </div>
      </main>

      {/* Left Drawer (mobile) */}
      <Drawer isOpen={leftDrawer.isOpen} onOpenChange={leftDrawer.onOpenChange} placement="left">
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="text-theme-primary">{t("nav.menu", "Menu")}</DrawerHeader>
              <DrawerBody className="p-0 bg-theme-card"><LeftSideBar /></DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>{t("common.close", "Close")}</Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>

      {/* Right Drawer (mobile) */}
      <Drawer isOpen={rightDrawer.isOpen} onOpenChange={rightDrawer.onOpenChange} placement="right">
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="text-theme-primary">{t("nav.more", "More")}</DrawerHeader>
              <DrawerBody className="p-0 bg-theme-card"><RightSideBar /></DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>{t("common.close", "Close")}</Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
