'use client'

import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface TaskFormProps {
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

export default function TaskForm({ setPosts }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('posts')
      .insert({ title, content })
      .select()

    if (error) {
      console.error('Error inserting task:', error)
    } else {
      setTitle('')
      setContent('')
      setPosts(prevPosts => [...(data as Post[]), ...prevPosts])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タスクのタイトル"
        className="w-full p-2 mb-2 border rounded text-black"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="タスクの内容"
        className="w-full p-2 mb-2 border rounded text-black"
        rows={4}
        required
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded flex items-center justify-center hover:bg-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
        タスクを追加
      </button>
    </form>
  )
}