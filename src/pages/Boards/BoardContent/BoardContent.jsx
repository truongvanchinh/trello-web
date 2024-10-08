import { useCallback, useEffect, useState, useRef } from 'react'
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { generatePlaceholderCard } from '~/utils/formatters'
import {
  DndContext,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  // closestCenter,
  pointerWithin,
  // rectIntersection,
  getFirstCollision
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensor'
import { arrayMove } from '@dnd-kit/sortable'
import { cloneDeep, isEmpty } from 'lodash'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'drag_column',
  CARD: 'drag_card'
}

function BoardContent({
  board,
  createNewColumn,
  createNewCard,
  moveColumn,
  moveCardInTheSameColumn,
  moveCardToDifferentColumn
}) {
  const [orderedColumns, setOrderedColumns] = useState([])
  const [activeItemId, setActiveItemId] = useState(null)
  const [activeItemType, setActiveItemType] = useState(null)
  const [activeItemData, setActiveItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)
  const lastOverId = useRef(null)
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

  const sensors = useSensors( mouseSensor, touchSensor )

  useEffect(() => {
    setOrderedColumns(board.columns)
  }, [board])

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    setOrderedColumns(prevColumns => {
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top >
          over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      if (nextActiveColumn) {
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
        if (isEmpty(nextActiveColumn.cards)) {
          // console.log('Card cuoi dc keo di')
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }
      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)

        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }
      if (triggerFrom === 'handleDragEnd') {
        moveCardToDifferentColumn(
          activeDraggingCardId,
          oldColumnWhenDraggingCard._id,
          nextOverColumn._id,
          nextColumns
        )
      }
      return nextColumns
    })
  }

  const handleDragStart = (event) => {
    const { active } = event
    setActiveItemId(active?.id)
    setActiveItemType(active?.data?.current?.columnId ?
      ACTIVE_DRAG_ITEM_TYPE.CARD :
      ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveItemData(active?.data?.current)
    if (active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(active?.id))
    }
  }

  const handleDragOver = (event) => {
    if (activeItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    const { active, over } = event
    if (!active || !over) { return } // chua toi uu

    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) { return }

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver'
      )
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!active || !over) { return } // chua toi uu

    if (activeItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      const { id: overCardId } = over

      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn) { return }

      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        //khac column
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        )
      } else {
        // cung column
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(card => card._id === activeItemId)
        const newCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardsIds = dndOrderedCards.map(card => card._id)
        setOrderedColumns(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCardsIds
          return nextColumns
        })

        moveCardInTheSameColumn(dndOrderedCards, dndOrderedCardsIds, oldColumnWhenDraggingCard._id)
      }

    }

    if (activeItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && active.id !== over.id) {
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)

      moveColumn(dndOrderedColumns)
      setOrderedColumns(dndOrderedColumns)
    }
    setActiveItemId(null)
    setActiveItemType(null)
    setActiveItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  const collisionDetectionStrategy = useCallback((args) => {
    if (activeItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    const pointerIntersections = pointerWithin(args)
    if (!pointerIntersections?.length) return
    // const intersections = !!pointerIntersections?.length > 0
    //   ? pointerIntersections
    //   : rectIntersection(args)
    let overId = getFirstCollision(pointerIntersections, 'id')
    if (overId) {
      const checkColumn = orderedColumns?.find(column => column._id === overId)
      // console.log('checkColumn: ', checkColumn)
      // console.log('overId: ', overId)
      if (checkColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            container.id !== overId &&
            checkColumn?.cardOrderIds?.includes(container.id)
          })
        })[0]?.id
      }
      lastOverId.current = overId
      return [{ id: overId }]
    }
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeItemType, orderedColumns])
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark'? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '8px 0'
      }}>
        <ListColumns columns={orderedColumns} createNewColumn={createNewColumn} createNewCard={createNewCard}/>
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
