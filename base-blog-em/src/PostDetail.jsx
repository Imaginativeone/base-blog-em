import { useQuery } from "@tanstack/react-query"
import { fetchComments } from "./api";

import "./PostDetail.css";

export function PostDetail({ post, deleteMutation }) {

  // replace with useQuery
  // const data = [];

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => fetchComments(post.id)
  })

  if (isLoading) {
    return (
      <>
        <h3>Loading!</h3>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <h3>Error</h3>
        <p>{ error.toString()}</p>
      </>
    )
  }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <div>
        <button onClick={() => deleteMutation.mutation(post.id)}>Delete</button>
        { deleteMutation.isPending && (
            <p className="loading">Deleting the Post</p>
        )}
      </div>
      <div>
        <button>Update title</button>
      </div>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
