import { useState } from "react";
import PostCardBody from "./PostCardBody";
import PostCardFooter from "./PostCardFooter";
import PostCardHeader from "./PostCardHeader";
 
export default function PostCard({ post }) {
  // comments start from topComment provided by the API (may be null)
  const [postComments, setPostComments] = useState(
    post.topComment ? [post.topComment] : []
  );
 
  return (
    <main className="bg-theme-card border border-theme shadow-sm rounded-xl overflow-hidden m-1 mb-3 transition-colors duration-300">
      <PostCardHeader post={post} />
      <PostCardBody post={post} />
      <PostCardFooter
        post={post}
        postComments={postComments}
        setPostComments={setPostComments}
      />
    </main>
  );
}
