'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BlogForm from '../../components/BlogForm'
import BlogList from '../../components/BlogList'
import { supabase } from '../../lib/supabase'

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export default function BlogPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/')
    } else {
      fetchPosts()
    }
  }, [router])

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
    } else {
      setPosts(data || [])
    }
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">ブログ投稿</h1>
      <BlogForm setPosts={setPosts} />
      <BlogList posts={posts} />
    </main>
  )
}