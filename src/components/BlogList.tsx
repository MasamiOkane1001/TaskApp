'use client'

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface BlogListProps {
  posts: Post[];
}

export default function BlogList({ posts }: BlogListProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">タスク一覧</h2>
      {posts.map((post) => (
        <div key={post.id} className="mb-4 p-4 border rounded">
          <h3 className="font-bold">{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  )
}