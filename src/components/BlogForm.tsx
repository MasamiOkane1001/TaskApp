'use client'

import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface BlogFormProps {
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

export default function BlogForm({ setPosts }: BlogFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('posts')
      .insert({ title, content })
      .select()

    if (error) {
      console.error('Error inserting post:', error)
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
        placeholder="タイトル"
        className="w-full p-2 mb-2 border rounded text-black"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="内容"
        className="w-full p-2 mb-2 border rounded text-black"
        rows={4}
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        投稿する
      </button>
    </form>
  )
}