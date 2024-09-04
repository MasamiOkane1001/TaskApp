'use client'

import React, { useState } from 'react'

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface TaskListProps {
  posts: Post[];
}

export default function TaskList({ posts }: TaskListProps) {
  const today = new Date().toDateString()
  const thisWeek = new Date()
  thisWeek.setDate(thisWeek.getDate() + 7)

  const todayPosts = posts.filter(post => new Date(post.created_at).toDateString() === today)
  const thisWeekPosts = posts.filter(post => {
    const postDate = new Date(post.created_at)
    return postDate > new Date(today) && postDate <= thisWeek
  })
  const laterPosts = posts.filter(post => new Date(post.created_at) > thisWeek)

  const TaskGroup = ({ title, posts }: { title: string; posts: Post[] }) => {
    const [isOpen, setIsOpen] = useState(true)

    return (
      <div className="mb-4">
        <h2 
          className="text-lg font-semibold mb-2 flex items-center text-white cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 mr-2 text-white transition-transform ${isOpen ? 'transform rotate-0' : 'transform rotate-180'}`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          {title}
        </h2>
        {isOpen && posts.map((post) => (
          <div key={post.id} className="bg-gray-100 p-4 rounded mb-2">
            <h3 className="font-bold text-black">{post.title}</h3>
            <p className="text-black">{post.content}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <TaskGroup title="今日" posts={todayPosts} />
      <TaskGroup title="今週" posts={thisWeekPosts} />
      <TaskGroup title="後で" posts={laterPosts} />
    </div>
  )
}