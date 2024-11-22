import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // added useQueryClient

import { fetchPosts, deletePost, updatePost, useMutation } from "./api";
import { PostDetail } from "./PostDetail";

const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1); // 1 instead of 0
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
  })

  // deleteMutation.mutate

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1
      queryClient.prefetchQuery({
        queryKey: ["posts", nextPage],
        queryFn: fetchPosts(nextPage)
      })
    }
  }, [currentPage, queryClient])

  const { data, isError, error, isLoading, isFetching } = useQuery({
    // previously const data = []
    queryKey: ["posts", currentPage],
    // queryFn: fetchPosts,
    queryFn: () => fetchPosts(currentPage),
    staleTime: 2000, // 2 seconds
  }); // The return value of query fn that we're passing to useQuery

  // if (!data) {
  //   return (
  //     <div />
  //   )
  // }

  if (isLoading) {
    return <div>LOADING</div>;
  }

  // if (isFetching) {
  //   return <div>FETCHING</div>;
  // }

  if (isError) {
    return (
      <>
        <h3>Oops, something went wrong.</h3>
        <p>{error.toString()}</p>
      </>
    );
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((previousValue) => previousValue - 1)
          }}
        >
          Previous page
        </button>
        {/* <span>Page {currentPage + 1}</span> */}
        <span>Page {currentPage + 0}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((previousValue) => previousValue + 1)
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} deleteMutation={deleteMutation} />}
    </>
  );
}
