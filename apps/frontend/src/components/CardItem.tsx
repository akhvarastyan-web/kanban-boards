import { Trash2, Pencil } from 'lucide-react';
import type { Card } from 'shared-types';

type CardItemProps = {
  card: Card;
  onEdit?: (cardId: string, title: string, description: string) => void;
  onDelete?: (id: string) => void;
  onDragStart?: (e: React.DragEvent, card: Card) => void;
};

export function CardItem({ card, onEdit, onDelete, onDragStart }: CardItemProps) {
  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart?.(e, card)}
      className="p-3 bg-white rounded-[0.5rem] border border-gray-200 shadow-sm relative group cursor-grab active:cursor-grabbing"
    >
      <div className="font-semibold text-gray-800 text-sm pr-12">{card.title}</div>
      {card.description && (
        <div className="text-xs text-gray-500 mt-1 whitespace-pre-wrap text-left">
          {card.description}
        </div>
      )}
      <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(card.id, card.title, card.description);
          }}
          className="p-1 text-gray-400 hover:text-black rounded transition-colors"
          title="Edit"
        >
          <Pencil size={14} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(card.id);
          }}
          className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}