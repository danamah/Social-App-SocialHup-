import { Link } from "react-router";
 
export default function PostCardBody({ post, postDetails }) {
  return (
    <main>
      {post.body && (
        <p className="my-2 font-medium text-base px-4 text-theme-primary">
          {post.body}
        </p>
      )}
      {post.image && (
        <Link to={`/post/${post._id}`}>
          <img
            src={post.image}
            alt={post.user?.name}
            className={`w-full object-cover cursor-pointer ${!postDetails ? "max-h-80" : ""}`}
          />
        </Link>
      )}
    </main>
  );
}
 