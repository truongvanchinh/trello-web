import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'drag_column',
  CARD: 'drag_card'
}

function BoardContent({ board }) {
  const [orderedColumns, setOrderedColumns] = useState([])
  const [activeItemId, setActiveItemId] = useState(null)
  const [activeItemType, setActiveItemType] = useState(null)
  const [activeItemData, setActiveItemData] = useState(null)
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10
    }
  })
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 50
    }
  })
  const keyboardSensor = useSensor(KeyboardSensor)

  const sensors = useSensors( mouseSensor, touchSensor, keyboardSensor )

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragStart = (event) => {
    const { active } = event
    setActiveItemId(active?.id)
    setActiveItemType(active?.data?.current?.columnId ?
      ACTIVE_DRAG_ITEM_TYPE.CARD :
      ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveItemData(active?.data?.current)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    // chua toi uu
    if (!over) {
      return
    }

    if (active.id !== over.id) {

      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      // console.log(dndOrderedColumnsIds)
      setOrderedColumns(dndOrderedColumns)
    }
    setActiveItemId(null)
    setActiveItemType(null)
    setActiveItemData(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}

    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark'? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '8px 0'
      }}>
        <ListColumns columns={orderedColumns}/>
        <DragOverlay dropAnimation={dropAnimation}>
          {/* {!activeItemType && null} */}
          {(activeItemId && activeItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) &&
            <Column column={activeItemData}/>
          }
          {(activeItemId && activeItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) &&
            <Card card={activeItemData}/>
          }
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
