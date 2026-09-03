import { useState } from 'react';
import type { Board } from 'shared-types';
import { Pencil, Trash2, Copy, Check } from 'lucide-react'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
  boards: Board[]
  onOpenModal: () => void
  onSelectBoard: (board: Board) => void
  onDeleteClick: (id: string) => void
  onEditClick: (board: Board) => void
}

export function Sidebar({ isOpen, onClose, boards, onOpenModal, onSelectBoard, onDeleteClick, onEditClick }: SidebarProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

const handleCopyId = async (e: React.MouseEvent, id: string) => {
  e.stopPropagation()
  e.preventDefault()
  try {
    await navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  } catch (error) {
    console.error('Failed to copy ID:', error)
  }
}
  
   return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-[16rem] h-screen bg-white border-r border-gray-200 shrink-0
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 flex flex-col
        `}
      >
        <div className="h-[4rem] flex items-center justify-between px-[1.5rem] border-b border-gray-200 lg:hidden shrink-0">
          <span className="font-semibold">Menu</span>
          <button
            onClick={onClose}
            className="p-[0.5rem] text-gray-600 hover:bg-gray-100 rounded-[0.5rem]"
          >
            ✕
          </button>
        </div>

        <nav className="p-[1rem] flex flex-col gap-[0.25rem] overflow-y-auto flex-1">
          <button
            onClick={onOpenModal}
            className="w-full text-left px-[1rem] py-[0.5rem] rounded-[0.5rem] hover:bg-gray-100 text-gray-700 font-bold shrink-0"
          >
            + Create new board
          </button>
          
          {boards && boards.length > 0 ? (
            boards.map((board) => (
              <a
                key={board.id}
                href={`/boards/${board.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  onSelectBoard(board)
                  onClose()
                }}
                className="group relative px-[1rem] py-[0.5rem] rounded-[0.5rem] block h-[3.5rem] shrink-0"
              >
                <div className="absolute inset-x-[1rem] top-[0.5rem] flex flex-col justify-center">
                  <div className="font-medium text-gray-700 truncate">{board.name}</div>
                  <div className="text-xs text-gray-400 truncate">{board.id}</div>
                </div>

                <div className="absolute -left-2 right-[-2rem] -inset-y-4 z-20 flex items-center justify-between px-[1.25rem] bg-sky-100 border-2 border-sky-300 text-sky-900 rounded-[0.75rem] opacity-0 scale-90 origin-left pointer-events-none group-hover:opacity-100 group-hover:scale-105 transition-all duration-200 ease-out shadow-2xl">
                  <div className="flex flex-col justify-center overflow-hidden pr-2">
                    <div className="font-bold text-base leading-snug whitespace-normal break-words">{board.name}</div>
                    <div className="text-xs text-sky-700 font-mono leading-tight whitespace-normal break-all">ID: {board.id}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 pointer-events-auto">
                    <button
                      onClick={(e) => handleCopyId(e, board.id)}
                      className="p-1.5 text-sky-700 hover:text-sky-900 hover:bg-sky-200 rounded transition-colors"
                      title="Copy ID"
                    >
                      {copiedId === board.id ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onEditClick(board);
                      }}
                      className="p-1.5 text-sky-700 hover:text-sky-900 hover:bg-sky-200 rounded transition-colors"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onDeleteClick(board.id);
                      }}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </a>
            ))
          ) : (
            <span className="px-[1rem] py-[0.5rem] text-gray-400 text-sm">No boards yet</span>
          )}
        </nav>
      </aside>
    </>
  )
}