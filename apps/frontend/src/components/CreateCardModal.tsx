import { useState } from 'react';

export type CreateCardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (cardData: { 
    title: string; 
    description: string; 
    columnId?: string; 
    status?: 'todo' | 'inProgress' | 'done';
  }) => Promise<void> | void;
};

export function CreateCardModal({ isOpen, onClose, onCreate }: CreateCardModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      await onCreate({ title, description });
      setTitle('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Failed to create card:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-[1rem]"
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="bg-white rounded-[0.75rem] p-[1.5rem] w-full max-w-[28rem] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[1.25rem] font-bold text-gray-800 mb-[1rem]">Create New Card</h2>
        <form onSubmit={handleSubmit} className="space-y-[1rem]">
          <div>
            <label className="block text-[0.875rem] font-medium text-gray-700 mb-[0.25rem]">Card Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-[0.5rem] px-[0.75rem] py-[0.5rem] text-[0.875rem] outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g. Design Landing Page"
            />
          </div>
          <div>
            <label className="block text-[0.875rem] font-medium text-gray-700 mb-[0.25rem]">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-[0.5rem] px-[0.75rem] py-[0.5rem] text-[0.875rem] outline-none focus:ring-2 focus:ring-black resize-none"
              placeholder="Enter card description..."
            />
          </div>
          <div className="flex justify-end gap-[0.75rem] pt-[0.5rem]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              disabled={isLoading}
              className="px-[1rem] py-[0.5rem] border border-gray-300 rounded-[0.5rem] text-[0.875rem] font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={(e) => e.stopPropagation()}
              disabled={isLoading}
              className="px-[1rem] py-[0.5rem] bg-black text-white rounded-[0.5rem] text-[0.875rem] font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}