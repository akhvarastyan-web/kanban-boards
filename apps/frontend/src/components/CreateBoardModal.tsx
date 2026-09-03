import { useState } from 'react';
import { boardsApi } from './../services/boardsApi';
import type { Board} from 'shared-types';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (board: { id: string; name: string; }) => void;
}

export const CreateBoardModal: React.FC<CreateBoardModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsLoading(true);
      const createdBoard: Board = await boardsApi.createBoard(name.trim());
      
      onCreate(createdBoard);
      
      setName('');
      onClose();
    } catch (error) {
      console.error('Failed to create board:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-[1rem]">
      <div className="bg-white rounded-[0.75rem] p-[1.5rem] w-full max-w-[28rem] shadow-xl">
        <h2 className="text-[1.25rem] font-bold text-gray-800 mb-[1rem]">Create New Board</h2>
        <form onSubmit={handleSubmit} className="space-y-[1rem]">
          <div>
            <label className="block text-[0.875rem] font-medium text-gray-700 mb-[0.25rem]">Board Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-[0.5rem] px-[0.75rem] py-[0.5rem] text-[0.875rem] outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g. IT Projects"
            />
          </div>
          <div className="flex justify-end gap-[0.75rem] pt-[0.5rem]">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-[1rem] py-[0.5rem] border border-gray-300 rounded-[0.5rem] text-[0.875rem] font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-[1rem] py-[0.5rem] bg-black text-white rounded-[0.5rem] text-[0.875rem] font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Board'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
