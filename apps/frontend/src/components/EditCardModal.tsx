import { useState } from 'react';

type EditCardModalProps = {
  isOpen: boolean;
  initialTitle: string;
  initialDescription: string;
  onClose: () => void;
  onConfirm: (title: string, description: string) => void;
};

export function EditCardModal({ 
  isOpen, 
  initialTitle, 
  initialDescription, 
  onClose, 
  onConfirm 
}: EditCardModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [prevInitialTitle, setPrevInitialTitle] = useState(initialTitle);
  const [prevInitialDescription, setPrevInitialDescription] = useState(initialDescription);

  if (initialTitle !== prevInitialTitle || initialDescription !== prevInitialDescription) {
    setPrevInitialTitle(initialTitle);
    setPrevInitialDescription(initialDescription);
    setTitle(initialTitle);
    setDescription(initialDescription);
  }

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(title, description);
    onClose();
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
        <h2 className="text-[1.25rem] font-bold text-gray-800 mb-[1rem]">Edit Card</h2>
        <form onSubmit={handleSubmit} className="space-y-[1rem]">
          <div>
            <label className="block text-[0.875rem] font-medium text-gray-700 mb-[0.25rem]">Card Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-[0.5rem] px-[0.75rem] py-[0.5rem] text-[0.875rem] outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-[0.875rem] font-medium text-gray-700 mb-[0.25rem]">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-[0.5rem] px-[0.75rem] py-[0.5rem] text-[0.875rem] outline-none focus:ring-2 focus:ring-black resize-none"
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
  );
}