
type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmModal({ isOpen, title, message, onClose, onConfirm }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-[1rem]"
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="bg-white rounded-[0.75rem] p-[1.5rem] w-full max-w-[28rem] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[1.25rem] font-bold text-gray-800 mb-[1rem]">{title}</h2>
        <p className="text-[0.875rem] text-gray-600 mb-[1.5rem]">
          {message}
        </p>
        <div className="flex justify-end gap-[0.75rem] pt-[0.5rem]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="px-[1rem] py-[0.5rem] border border-gray-300 rounded-[0.5rem] text-[0.875rem] font-medium text-gray-700 hover:bg-gray-50"
          >
            No
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
              onClose();
            }}
            className="px-[1rem] py-[0.5rem] bg-black text-white rounded-[0.5rem] text-[0.875rem] font-medium hover:bg-gray-800"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}