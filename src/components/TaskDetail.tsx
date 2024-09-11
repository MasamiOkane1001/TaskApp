import React, { useState, useEffect, useRef } from 'react'
import { MoreVertical, Trash, X, Calendar } from 'lucide-react'

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

interface TaskDetailProps {
  task: Task;
  allTasks: Task[];
  onClose: () => void;
  onUpdate: (task: Partial<Task>) => void;
  onDelete: (taskId: number) => void;
  onAddSubtask: (subtask: NewTask) => Promise<Task>;
  onMoveTask: (taskId: number, newParentId: number) => Promise<void>;
}

const CustomCalendar: React.FC<{ selected: Date | undefined; onSelect: (date: Date) => void }> = ({ selected, onSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="bg-gray-800 p-2 rounded-md w-64">
      <div className="flex justify-between items-center mb-2">
        <button onClick={handlePrevMonth}>&lt;</button>
        <span>{currentDate.getFullYear()}年 {monthNames[currentDate.getMonth()]}</span>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['日', '月', '火', '水', '木', '金', '土'].map(day => (
          <div key={day} className="text-center text-sm">{day}</div>
        ))}
        {Array(firstDayOfMonth).fill(null).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map(day => (
          <button
            key={day}
            onClick={() => onSelect(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
            className={`w-8 h-8 rounded-full ${
              selected && day === selected.getDate() && currentDate.getMonth() === selected.getMonth() && currentDate.getFullYear() === selected.getFullYear()
                ? 'bg-blue-600'
                : 'hover:bg-gray-700'
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function TaskDetail({ task, allTasks, onClose, onUpdate, onDelete, onAddSubtask, onMoveTask }: TaskDetailProps) {
  const [title, setTitle] = useState(task.title)
  const [content, setContent] = useState(task.content)
  const [dueDate, setDueDate] = useState<Date | undefined>(task.due_date ? new Date(task.due_date) : undefined)
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')
  const [selectedSubtask, setSelectedSubtask] = useState<string>('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [localSubtasks, setLocalSubtasks] = useState(task.subtasks || [])
  const detailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const debounce = setTimeout(() => {
      onUpdate({
        id: task.id,
        title,
        content,
        due_date: dueDate ? dueDate.toISOString() : null
      })
    }, 500)

    return () => clearTimeout(debounce)
  }, [title, content, dueDate, task.id, onUpdate])

  const handleAddSubtask = async () => {
    if (selectedSubtask === 'new' && newSubtaskTitle.trim()) {
      const newSubtask = await onAddSubtask({
        title: newSubtaskTitle,
        content: '',
        due_date: null,
        parent_id: task.id
      })
      setLocalSubtasks([...localSubtasks, newSubtask])
      setNewSubtaskTitle('')
      setSelectedSubtask('')
    } else if (selectedSubtask && selectedSubtask !== 'new') {
      const subtaskId = parseInt(selectedSubtask)
      await onMoveTask(subtaskId, task.id)
      const movedTask = allTasks.find(t => t.id === subtaskId)
      if (movedTask) {
        setLocalSubtasks([...localSubtasks, movedTask])
      }
      setSelectedSubtask('')
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen)
  }

  const handleDateSelect = (date: Date) => {
    setDueDate(date)
    setIsCalendarOpen(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={handleOverlayClick}>
      <div ref={detailRef} className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl text-white relative" onClick={(e) => e.stopPropagation()}>
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleMenu}
            className="text-gray-400 hover:text-white focus:outline-none p-1"
          >
            <MoreVertical size={24} />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10">
              <ul className="py-1">
                <li>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                  >
                    <Trash size={18} className="mr-2" />
                    <span>タスクを削除</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={onClose}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                  >
                    <X size={18} className="mr-2" />
                    <span>閉じる</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold mb-4">タスクの詳細</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 rounded text-white"
          placeholder="タスクのタイトル"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 rounded h-32 text-white"
          placeholder="タスクの内容"
        />
        <div className="mb-4 flex items-center">
          <Calendar size={18} className="mr-2" />
          <span className="mr-2">期限日：</span>
          {dueDate ? (
            <button
              onClick={toggleCalendar}
              className="text-blue-400 hover:text-blue-300"
            >
              {dueDate.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}
            </button>
          ) : (
            <button
              onClick={toggleCalendar}
              className="text-blue-400 hover:text-blue-300"
            >
              設定する
            </button>
          )}
        </div>
        {isCalendarOpen && (
          <div className="absolute left-0 mt-2 z-20">
            <CustomCalendar
              selected={dueDate}
              onSelect={handleDateSelect}
            />
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">サブタスク</h3>
          {localSubtasks.map(subtask => (
            <div key={subtask.id} className="bg-gray-700 p-2 rounded mb-2">
              {subtask.title}
            </div>
          ))}
          <div className="mt-4 flex flex-col">
            <select
              value={selectedSubtask}
              onChange={(e) => setSelectedSubtask(e.target.value)}
              className="p-2 mb-2 bg-gray-700 rounded text-white"
            >
              <option value="">サブタスクを追加</option>
              <option value="new">
                新規で追加
              </option>
              {allTasks.filter(t => t.id !== task.id && !localSubtasks.some(s => s.id === t.id)).map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
            {selectedSubtask === 'new' && (
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="新しいサブタスクのタイトル"
                className="p-2 mb-2 bg-gray-700 rounded text-white placeholder-gray-400"
              />
            )}
            <button
              onClick={handleAddSubtask}
              disabled={!selectedSubtask || (selectedSubtask === 'new' && !newSubtaskTitle.trim())}
              className={`px-4 py-2 rounded ${
                !selectedSubtask || (selectedSubtask === 'new' && !newSubtaskTitle.trim())
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              追加
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}