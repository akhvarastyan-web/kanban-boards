import type { Board, Card } from 'shared-types';
import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { BoardView } from './components/BoardView';
import { CreateBoardModal } from './components/CreateBoardModal';
import { boardsApi} from './services/boardsApi';
import { cardsApi} from './services/cardsApi';
import { EditBoardModal } from './components/EditBoardModal'
import { CreateCardModal } from './components/CreateCardModal'
import { BoardLoader } from './components/BoardLoader'
import { ConfirmModal } from './components/ConfirmModal'
import {EditCardModal} from './components/EditCardModal'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteBoardId, setDeleteBoardId] = useState<string | null>(null)
  const [boards, setBoards] = useState<Board[]>([])
  const [boardIdInput, setBoardIdInput] = useState('')
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null)
  const [editingBoard, setEditingBoard] = useState<Board | null>(null)
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null)
  const [editingCard, setEditingCard] = useState<{ id: string; title: string; description: string } | null>(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await boardsApi.getAllBoards()
        setBoards(data)
      } catch (error) {
        console.error('Failed to fetch boards:', error)
      }
    }

    fetchBoards()
  }, [])

  const onAddBoard = (newBoard: { id: string; name: string; columns?: Board['columns'] }) => {
  const boardToAdd: Board = {
    ...newBoard,
    columns: newBoard.columns || { todo: [], inProgress: [], done: [] }
  }
  setBoards((prev) => [...prev, boardToAdd])
  setSelectedBoard(boardToAdd)
  setBoardIdInput(boardToAdd.id)
  setIsSidebarOpen(false)
}


  const loadBoardWithCards = async (board: Board): Promise<Board> => {
  const cards = await cardsApi.getCardsByBoard(board.id)

  const columns: Board['columns'] = {
    todo: [],
    inProgress: [],
    done: [],
  }

  cards.forEach((card) => {
    columns[card.column].push(card)
  })

  Object.keys(columns).forEach((key) => {
    columns[key as Card['column']].sort((a, b) => a.order - b.order)
  })

  return { ...board, columns }
}

  const handleSelectBoard = async (board: Board) => {
  try {
    const fullBoard = await loadBoardWithCards(board)
    setSelectedBoard(fullBoard)
    setBoardIdInput(board.id)
  } catch (error) {
    console.error('Failed to load board:', error)
  }
}

 const handleLoadBoardById = async () => {
  if (!boardIdInput.trim()) return
  try {
    const board = await boardsApi.getBoard(boardIdInput.trim())
    const fullBoard = await loadBoardWithCards(board)
    setSelectedBoard(fullBoard)
  } catch (error) {
    console.error('Failed to load board by ID:', error)
    alert('Board not found')
  }
}

  const handleDeleteBoard = async (id: string) => {
  try {
    await boardsApi.deleteBoard(id)
    setBoards((prev) => prev.filter((b) => b.id !== id))
    if (selectedBoard?.id === id) {
      setSelectedBoard(null)
      setBoardIdInput('')
    }
  } catch (error) {
    console.error('Failed to delete board:', error)
  }
}

const handleUpdateBoard = async (updatedBoard: Board) => {
  try {
    const savedBoard = await boardsApi.updateBoard(updatedBoard.id, updatedBoard.name)
    const fullBoard = await loadBoardWithCards(savedBoard)

    setBoards((prev) => prev.map((b) => (b.id === fullBoard.id ? fullBoard : b)))
    if (selectedBoard?.id === fullBoard.id) {
      setSelectedBoard(fullBoard)
      setBoardIdInput(fullBoard.id)
    }
  } catch (error) {
    console.error('Failed to update board:', error)
  }
}

const handleCreateCard = async ({ title, description }: { title: string; description: string }) => {
  if (!selectedBoard) return

  try {
    const firstColumnKey = 'todo' as Card['column']

    const newCard = await cardsApi.createCard(
      selectedBoard.id,
      title,
      description,
      firstColumnKey
    )

    const updatedColumns = {
      ...selectedBoard.columns,
      [firstColumnKey]: [
        ...(selectedBoard.columns[firstColumnKey] || []),
        newCard,
      ],
    }

    const updatedBoard = { ...selectedBoard, columns: updatedColumns }

    setSelectedBoard(updatedBoard)
    setBoards((prev) => prev.map((b) => (b.id === updatedBoard.id ? updatedBoard : b)))
  } catch (error) {
    console.error('Failed to create card:', error)
  }
}


const handleDragStartCard = (e: React.DragEvent, card: Card) => {
  e.dataTransfer.setData('text/plain', card.id)
}

const handleDropCard = async (e: React.DragEvent, targetColumn: Card['column']) => {
  e.preventDefault()
  if (!selectedBoard) return

  const cardId = e.dataTransfer.getData('text/plain')
  if (!cardId) return

  try {
    const targetColCards = selectedBoard.columns[targetColumn] || []
    const newOrder = targetColCards.length

    await cardsApi.moveCard(cardId, targetColumn, newOrder)

    let sourceColumn: Card['column'] | null = null
    let cardToMove: Card | null = null

    for (const col of ['todo', 'inProgress', 'done'] as const) {
      const found = selectedBoard.columns[col].find((c) => c.id === cardId)
      if (found) {
        sourceColumn = col
        cardToMove = found
        break
      }
    }

    if (!sourceColumn || !cardToMove) return
    if (sourceColumn === targetColumn) return

    const updatedSource = selectedBoard.columns[sourceColumn].filter((c) => c.id !== cardId)
    const updatedTarget = [...selectedBoard.columns[targetColumn], { ...cardToMove, column: targetColumn }]

    const updatedBoard = {
      ...selectedBoard,
      columns: {
        ...selectedBoard.columns,
        [sourceColumn]: updatedSource,
        [targetColumn]: updatedTarget,
      },
    }

    setSelectedBoard(updatedBoard)
    setBoards((prev) => prev.map((b) => (b.id === updatedBoard.id ? updatedBoard : b)))
  } catch (error) {
    console.error('Failed to move card:', error)
  }
}

const handleDeleteCardRequest = (cardId: string) => {
  setDeleteCardId(cardId)
}

const handleDeleteCard = async (cardId: string) => {
  if (!selectedBoard) return

  try {
    await cardsApi.deleteCard(cardId)

    const updatedColumns = {
      todo: selectedBoard.columns.todo.filter((c) => c.id !== cardId),
      inProgress: selectedBoard.columns.inProgress.filter((c) => c.id !== cardId),
      done: selectedBoard.columns.done.filter((c) => c.id !== cardId),
    }

    const updatedBoard = { ...selectedBoard, columns: updatedColumns }
    setSelectedBoard(updatedBoard)
    setBoards((prev) => prev.map((b) => (b.id === updatedBoard.id ? updatedBoard : b)))
  } catch (error) {
    console.error('Failed to delete card:', error)
  }
}

const handleEditCardRequest = (cardId: string, title: string, description: string) => {
  setEditingCard({ id: cardId, title, description });
};

const handleEditCardConfirm = async (title: string, description: string) => {
  if (!editingCard || !selectedBoard) return;

  try {
    const updatedCard = await cardsApi.updateCard(editingCard.id, { title, description });

    const updateCardInList = (cards: Card[]) =>
      cards.map((c) => (c.id === updatedCard.id ? updatedCard : c));

    const updatedColumns = {
      todo: updateCardInList(selectedBoard.columns.todo),
      inProgress: updateCardInList(selectedBoard.columns.inProgress),
      done: updateCardInList(selectedBoard.columns.done),
    };

    const updatedBoard = { ...selectedBoard, columns: updatedColumns };
    setSelectedBoard(updatedBoard);
    setBoards((prev) => prev.map((b) => (b.id === updatedBoard.id ? updatedBoard : b)));
    setEditingCard(null);
  } catch (error) {
    console.error('Failed to update card:', error);
  }
};

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden">
      <header className="h-[4rem] bg-[#000000] border-b border-gray-200 px-[1.5rem] flex flex-row justify-between shrink-0 z-30">
        <div className="flex flex-start gap-[1rem] items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-[0.5rem] text-gray-600 hover:bg-gray-100 rounded-[0.5rem]"
          >
            ☰
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          boards={boards}
          onOpenModal={() => setIsModalOpen(true)}
          onSelectBoard={handleSelectBoard}
          onDeleteClick={(id) => setDeleteBoardId(id)}
          onEditClick={(board) => setEditingBoard(board)}
        />

        <main className="flex-1 overflow-auto p-[1.5rem] flex flex-col gap-6">
          <BoardLoader
  boardIdInput={boardIdInput}
  onBoardIdChange={setBoardIdInput}
  onLoadBoard={handleLoadBoardById}
/>

          <div className="flex-1 p-6 bg-white flex flex-col">
            {selectedBoard ? (
              <BoardView 
                board={selectedBoard}
                onOpenCardModal={() => setIsCardModalOpen(true)}
                onEditCard={handleEditCardRequest}
                onDeleteCard={handleDeleteCardRequest}
                onDragStartCard={handleDragStartCard}
                onDropCard={handleDropCard}
              />
            ) : (
              <div className="text-gray-400 flex items-center justify-center h-full">
                No board selected. Choose one from the sidebar or enter an ID above.
              </div>
            )}
          </div>
        </main>
      </div>

      <CreateBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={onAddBoard}
      />

      <ConfirmModal
  isOpen={Boolean(deleteBoardId)}
  title="Delete Board"
  message="And do you really want to delete your board?"
  onClose={() => setDeleteBoardId(null)}
  onConfirm={() => deleteBoardId && handleDeleteBoard(deleteBoardId)}
/>

<ConfirmModal
  isOpen={Boolean(deleteCardId)}
  title="Delete Card"
  message="And do you really want to delete this card?"
  onClose={() => setDeleteCardId(null)}
  onConfirm={() => deleteCardId && handleDeleteCard(deleteCardId)}
/>

<EditCardModal
  isOpen={Boolean(editingCard)}
  initialTitle={editingCard?.title || ''}
  initialDescription={editingCard?.description || ''}
  onClose={() => setEditingCard(null)}
  onConfirm={handleEditCardConfirm}
/>

      {editingBoard && (
        <EditBoardModal
          board={editingBoard}
          onClose={() => setEditingBoard(null)}
          onSave={handleUpdateBoard}
        />
      )}

      {isCardModalOpen && (
  <CreateCardModal
    isOpen={isCardModalOpen}
    onClose={() => setIsCardModalOpen(false)}
    onCreate={handleCreateCard}
  />
)}
    </div>
  )
}

export default App