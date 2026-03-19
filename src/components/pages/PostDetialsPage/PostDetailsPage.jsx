import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
 
import CardSkeleton from "../../Cards/CardSkeleton/CardSkeleton";
import PostCardBody from "../../Cards/PostCard/PostCardBody";
import PostCardFooter from "../../Cards/PostCard/PostCardFooter";
import PostCardHeader from "../../Cards/PostCard/PostCardHeader";
import { getSinglePost } from "../../services/postServices";       
import { getPostComments } from "../../services/commentAndRepliesServices"; 
 
export default function PostDetailsPage() {
  const { id } = useParams();
  const { t }  = useTranslation();
 
  const [post,      setPost]      = useState(null);
  const [comments,  setComments]  = useState([]);
  const [isLoading, setIsLoading] = useState(true);
 
  async function fetchPostDetails() {
    setIsLoading(true);
    try {
      // الـ API الجديدة — post وcomments منفصلين
      const [post, { comments }] = await Promise.all([
        getSinglePost(id),
        getPostComments(id, { limit: 20 }),
      ]);
      setPost(post);
      setComments(comments);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
 
  useEffect(() => {
    fetchPostDetails();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);
 
  return (
    <>
      <title>Post | SocialHup</title>
      <main className="mt-18 bg-theme-page min-h-screen py-6 px-3 transition-colors duration-300">
        <div className="max-w-2xl mx-auto bg-theme-card border border-theme rounded-xl overflow-hidden shadow-sm">
          {isLoading ? (
            <CardSkeleton />
          ) : post ? (
            <>
              <PostCardHeader post={post} refreshPost={fetchPostDetails} />
              <PostCardBody post={post} postDetails />
              <PostCardFooter
                post={post}
                postComments={comments}        // ← prop name محدّث
                setPostComments={setComments}  // ← prop name محدّث
                postDetails
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <span className="text-5xl">😕</span>
              <p className="text-theme-secondary font-medium">
                {t("post.notFound", "Post not found or has been deleted")}
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}