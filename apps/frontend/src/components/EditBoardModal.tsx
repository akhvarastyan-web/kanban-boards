import { useState } from 'react';
import type { Board} from 'shared-types';

type EditBoardModalProps = {
  board: Board
  onClose: () => void
  onSave: (updatedBoard: Board) => void
}

export function EditBoardModal({ board, onClose, onSave }: EditBoardModalProps) {
  const [name, setName] = useState(board.name)
  const [id, setId] = useState(board.id)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSave({ ...board, name, id })
    onClose()
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-[1rem]"
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="bg-white rounded-[0.75rem] p-[1.5rem] w-full max-w-[28rem] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[1.25rem] font-bold text-gray-800 mb-[1rem]">Edit Board</h2>
        <form onSubmit={handleSubmit} className="space-y-[1rem]">
          <div>
            <label className="block text-[0.875rem] font-medium text-gray-700 mb-[0.25rem]">Board Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-[0.5rem] px-[0.75rem] py-[0.5rem] text-[0.875rem] outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-[0.875rem] font-medium text-gray-700 mb-[0.25rem]">Board ID</label>
            <input
              type="text"
              required
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full border border-gray-300 rounded-[0.5rem] px-[0.75rem] py-[0.5rem] text-[0.875rem] outline-none focus:ring-2 focus:ring-black font-mono text-xs"
            />
          </div>
          <div className="flex justify-end gap-[0.75rem] pt-[0.5rem]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="px-[1rem] py-[0.5rem] border border-gray-300 rounded-[0.5rem] text-[0.875rem] font-medium text-gray-700 hover:bg-gray-50"
            >
              Reject
            </button>
            <button
              type="submit"
              onClick={(e) => e.stopPropagation()}
              className="px-[1rem] py-[0.5rem] bg-black text-white rounded-[0.5rem] text-[0.875rem] font-medium hover:bg-gray-800"
            >
              Edit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}