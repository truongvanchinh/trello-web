let emitTimeout = null // Biến lưu timeout
let lastBoardStateString = '' // Lưu trạng thái cuối cùng dưới dạng chuỗi JSON

const socketMiddleware = (socket) => (store) => (next) => (action) => {
  const result = next(action)
  const newBoard = store.getState().activeBoard.currentActiveBoard

  const socketActions = ['activeBoard/updateCurrentActiveBoard', 'activeBoard/deleteCurrentActiveBoard']

  if (socketActions.includes(action.type)) {
    const newBoardString = JSON.stringify(newBoard)

    if (!newBoard) {
      socket.emit('FE_board_deleted')
      lastBoardStateString = ''
      return result
    }

    // Nếu dữ liệu không thay đổi, bỏ qua
    if (newBoardString === lastBoardStateString) {
      return result
    }

    // Cập nhật trạng thái mới ngay lập tức để tránh tình trạng lưu bản cũ
    lastBoardStateString = newBoardString

    // Xóa timeout cũ nếu có
    if (emitTimeout) clearTimeout(emitTimeout)

    // Chờ 500ms mới gửi emit, để tránh gửi liên tục khi có nhiều thay đổi nhanh
    emitTimeout = setTimeout(() => {
      socket.emit('FE_board_update', newBoard)
    }, 300)
  }

  return result
}

export default socketMiddleware
