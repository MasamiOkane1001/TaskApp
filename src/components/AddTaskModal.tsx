import React, { useState } from 'react'

interface Task {
  id: number;
  title: string;
}

interface NewTask {
  title: string;
  content: string;
  due_date: string | null;
  parent_id: number | null;
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: NewTask) => void;
  parentTasks: Task[];
}

export default function AddTaskModal({ isOpen, onClose, onAddTask, parentTasks }: AddTaskModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [parentId, setParentId] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddTask({ 
      title, 
      content, 
      due_date: dueDate || null,
      parent_id: parentId
    })
    setTitle('')
    setContent('')
    setDueDate('')
    setParentId(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-white">New issue</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Issue title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-700 rounded text-white"
          />
          <textarea
            placeholder="Add description..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-700 rounded h-32 text-white"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-700 rounded text-white"
          />
          <select
            value={parentId || ''}
            onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : null)}
            className="w-full p-2 mb-4 bg-gray-700 rounded text-white"
          >
            <option value="">Select parent task (optional)</option>
            {parentTasks.map(task => (
              <option key={task.id} value={task.id}>{task.title}</option>
            ))}
          </select>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
            >
              Create issue
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}