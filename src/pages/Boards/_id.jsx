import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect } from 'react'
import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'
import { cloneDeep } from 'lodash'

import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard' //lesson 14
import { socketIoInstance } from '~/socket'

function Board() {
  const dispatch = useDispatch()
  // Không dùng state của component nữa mà chuyển sang dùng state của Redux
  // const [board, setBoard] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)

  // boardId là khi bên App.jsx sau dấu : của prop path
  const { boardId } = useParams()

  useEffect(() => { // use react-router-dom
    //call API ...... 670247dbaceb5f086b41a889
    //* fetchBoardDetailsAPI(boardId) là Middleware của board trong redux toolkit
    dispatch(fetchBoardDetailsAPI(boardId))
    const onReceiveMemberUpdate = () => {
      dispatch(fetchBoardDetailsAPI(boardId))
    }

    const onReceiveUpdatedBoard = (updatedBoard) => {
      dispatch(updateCurrentActiveBoard(updatedBoard))
    }

    socketIoInstance.on('BE_board_update', onReceiveUpdatedBoard)
    socketIoInstance.on('BOARD_MEMBER_UPDATED', onReceiveMemberUpdate)
    return () => {
      socketIoInstance.off('BOARD_MEMBER_UPDATED', onReceiveMemberUpdate)
      socketIoInstance.off('BE_board_update', onReceiveUpdatedBoard)
    }
  }, [dispatch, boardId])


  //gọi api khi kéo thả column xong
  const moveColumn = async (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

    /* Trường hợp dùng Spread Operator này thì lại không sao bởi vì ở đây
    chúng ta không dùng push như ở trên Làm thay đổi trực tiếp kiều mở rộng màng,
    mà chỉ đang gán lại toàn bộ giá trị columns và columnOrderIds bằng 2 mảng mày.
    Tương tự như cách làm concat ở trường hợp createNewColumn thôi - lesson 2
    */
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    //gọi api update board
    await updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOrderedColumnsIds
    })
  }

  //gọi api khi kéo thả column xong
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardsIds, columnId) => {
    /*Cannot assign to read only property cards' of object
    * Trường hợp Immutability ở đây đã đụng tới giá trị cards đang được coi là chỉ đọc read only
    (nested object - can thiệp sâu dữ Liệu)
    */
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards= dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardsIds
    }
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    //gọi api update board
    updateColumnDetailsAPI(columnId, {
      cardOrderIds: dndOrderedCardsIds
    })
  }

  //gọi api khi kéo thả column xong
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {

    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    //gọi API cập nhật data (BE)
    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  if (!board) {
    return <PageLoadingSpinner caption="Loading Board..."/>
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      {/* Modal Active Card, check đóng/mở dựa theo cái State isShowModalActiveCard lưu trong Redux*/}
      <ActiveCard />

      {/* các thành phần còn lại của Board Details */}
      <AppBar />
      <BoardBar board={board}/>
      <BoardContent
        board={board}

        // 3 cái trường hợp move dưới đây thì giữ nguyên đề code xử lý kéo thả ở
        //phần BoardContent không bị quả dài mất kiểm soát khi đọc code, maintain.
        moveColumn={moveColumn}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
