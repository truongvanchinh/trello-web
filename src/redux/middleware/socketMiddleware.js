let emitTimeout = null // Biến lưu timeout
let lastBoardState = null // Lưu trạng thái cuối cùng đã emit

const socketMiddleware = (socket) => (store) => (next) => (action) => {
  const result = next(action)
  const newBoard = store.getState().activeBoard.currentActiveBoard

  const socketActions = ['activeBoard/updateCurrentActiveBoard']

  if (socketActions.includes(action.type)) {
    // Nếu dữ liệu không thay đổi hoặc giống lần cuối emit, bỏ qua
    if (
      lastBoardState &&
      JSON.stringify(lastBoardState) === JSON.stringify(newBoard)
    ) {
      return result
    }

    // Xóa timeout cũ nếu có
    clearTimeout(emitTimeout)

    // Chờ 500ms mới gửi emit, để tránh gửi liên tục khi có nhiều thay đổi nhanh
    emitTimeout = setTimeout(() => {
      socket.emit('FE_board_update', newBoard)
      lastBoardState = newBoard // Cập nhật trạng thái cuối cùng đã emit
    }, 300)
  }

  return result
}

export default socketMiddleware
