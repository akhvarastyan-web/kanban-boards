
type BoardLoaderProps = {
  boardIdInput: string;
  onBoardIdChange: (value: string) => void;
  onLoadBoard: () => void;
};

export function BoardLoader({ boardIdInput, onBoardIdChange, onLoadBoard }: BoardLoaderProps) {
  return (
    <div className="flex gap-3 items-center">
      <input
        type="text"
        value={boardIdInput}
        onChange={(e) => onBoardIdChange(e.target.value)}
        placeholder="Enter unique hashed board ID..."
        className="px-4 py-2 border border-gray-300 rounded-[0.5rem] w-80 focus:outline-none focus:border-black"
      />
      <button
        onClick={onLoadBoard}
        className="px-4 py-2 bg-black text-white rounded-[0.5rem] hover:bg-gray-800 font-medium"
      >
        Load
      </button>
    </div>
  );
}