'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import AddTaskModal from './AddTaskModal'
import TaskDetail from './TaskDetail'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Task {
  id: number;
  title: string;
  content: string;
  created_at: string;
  due_date: string | null;
  parent_id: number | null;
  subtasks?: Task[];
}

interface NewTask {
  title: string;
  content: string;
  due_date: string | null;
  parent_id: number | null;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tasks:', error)
    } else {
      const tasksWithSubtasks = buildTaskHierarchy(data || [])
      setTasks(tasksWithSubtasks)
    }
  }

  const buildTaskHierarchy = (flatTasks: Task[]): Task[] => {
    const taskMap = new Map<number, Task>()
    const rootTasks: Task[] = []

    flatTasks.forEach(task => {
      taskMap.set(task.id, { ...task, subtasks: [] })
    })

    flatTasks.forEach(task => {
      if (task.parent_id) {
        const parentTask = taskMap.get(task.parent_id)
        if (parentTask) {
          parentTask.subtasks?.push(taskMap.get(task.id)!)
        }
      } else {
        rootTasks.push(taskMap.get(task.id)!)
      }
    })

    return rootTasks
  }

  const addTask = async (newTask: NewTask): Promise<Task> => {
    const { data, error } = await supabase
      .from('posts')
      .insert([{ ...newTask, created_at: new Date().toISOString() }])
      .select()

    if (error) {
      console.error('Error adding task:', error)
      throw error
    } else {
      await fetchTasks()
      return data[0]
    }
  }

  const updateTask = async (updatedTask: Partial<Task>) => {
    const { error } = await supabase
      .from('posts')
      .update(updatedTask)
      .eq('id', updatedTask.id)

    if (error) {
      console.error('Error updating task:', error)
    } else {
      await fetchTasks()
      if (selectedTask && selectedTask.id === updatedTask.id) {
        setSelectedTask(prev => prev ? { ...prev, ...updatedTask } : null)
      }
    }
  }

  const deleteTask = async (taskId: number) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', taskId)

    if (error) {
      console.error('Error deleting task:', error)
    } else {
      await fetchTasks()
      setSelectedTask(null)
    }
  }

  const moveTask = async (taskId: number, newParentId: number) => {
    const { error } = await supabase
      .from('posts')
      .update({ parent_id: newParentId })
      .eq('id', taskId)

    if (error) {
      console.error('Error moving task:', error)
    } else {
      await fetchTasks()
    }
  }

  const renderTask = (task: Task, level: number = 0) => (
    <div key={task.id} className={`ml-${level * 4}`}>
      <div
        className="bg-gray-800 p-4 rounded-lg flex items-center cursor-pointer mb-2"
        onClick={() => setSelectedTask(task)}
      >
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-white">{task.title}</h3>
        </div>
        <div className="text-sm text-gray-400">
          {task.due_date && `Due: ${new Date(task.due_date).toLocaleDateString()}`}
        </div>
      </div>
      {task.subtasks && task.subtasks.map(subtask => renderTask(subtask, level + 1))}
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-900">
      <div className="flex-1 bg-gray-900 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">All issues</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Task
          </button>
        </div>
        <div className="space-y-2">
          {tasks.map(task => renderTask(task))}
        </div>
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={addTask}
        parentTasks={tasks}
      />
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          allTasks={tasks}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onAddSubtask={addTask}
          onMoveTask={moveTask}
        />
      )}
    </div>
  )
}