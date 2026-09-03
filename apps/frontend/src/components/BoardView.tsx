import { CardItem } from './CardItem'
import type { Board, Card } from 'shared-types';

type BoardViewProps = {
  board: Board
  onOpenCardModal: () => void
  onEditCard: (cardId: string, title: string, description: string) => void
  onDeleteCard: (id: string) => void
  onDragStartCard: (e: React.DragEvent, card: Card) => void
  onDropCard: (e: React.DragEvent, column: Card['column']) => void
}

export function BoardView({ board, onOpenCardModal, onEditCard, onDeleteCard, onDragStartCard, onDropCard }: BoardViewProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden p-4 md:p-6">
      <div className="mb-4 md:mb-6 shrink-0">
        <h2 className="text-lg md:text-xl font-bold mb-1">{board.name}</h2>
        <span className="text-xs md:text-sm text-gray-400">ID: {board.id}</span>
      </div>

     <div className="flex flex-col md:grid md:grid-cols-3 gap-4 flex-1 overflow-y-auto md:overflow-hidden">
        
        <div 
        onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDropCard(e, 'todo')}
          className="bg-gray-50 p-4 rounded-[0.5rem] flex flex-col border border-gray-200 min-h-[200px] md:overflow-y-auto">
  <div className="flex flex-col mb-3 shrink-0">
    <h3 className="font-semibold text-gray-700">ToDo</h3>
    <button
      onClick={onOpenCardModal}
      className="px-2.5 py-1 bg-black text-white rounded-[0.375rem] text-xs font-medium hover:bg-gray-800 transition-colors"
    >
      + Add Card
    </button>
  </div>
  <div className="flex flex-col gap-2">
    {board.columns.todo.map((card) => (
              <CardItem 
                key={card.id} 
                card={card} 
                onEdit={onEditCard} 
                onDelete={onDeleteCard}
                onDragStart={onDragStartCard} 
              />
            ))}
  </div>
</div>

        <div 
        onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDropCard(e, 'inProgress')}
          className="bg-gray-50 p-4 rounded-[0.5rem] flex flex-col border border-gray-200 min-h-[200px] md:overflow-y-auto">
          <h3 className="font-semibold text-gray-700 mb-3 shrink-0">In Progress</h3>
          <div className="flex flex-col gap-2">
            {board.columns.inProgress.map((card) => (
              <CardItem 
                key={card.id} 
                card={card} 
                onEdit={onEditCard} 
                onDelete={onDeleteCard} 
                onDragStart={onDragStartCard}
              />
            ))}
          </div>
        </div>

        <div 
        onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDropCard(e, 'done')}
          className="bg-gray-50 p-4 rounded-[0.5rem] flex flex-col border border-gray-200 min-h-[200px] md:overflow-y-auto">
          <h3 className="font-semibold text-gray-700 mb-3 shrink-0">Done</h3>
          <div className="flex flex-col gap-2">
            {board.columns.done.map((card) => (
              <CardItem 
                key={card.id} 
                card={card} 
                onEdit={onEditCard} 
                onDelete={onDeleteCard} 
                onDragStart={onDragStartCard}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}