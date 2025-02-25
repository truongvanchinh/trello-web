import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'


// Khởi tạo giá trị State của một Slice trong redux
const initialState = {
  currentActiveBoard: null
}

// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk di
//kèm với extraReducers
// https://redux-toolkit.js.org/api/createAsyncThunk
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    return response.data
  }
)

// Khởi tạo một Slice trong kho lưu trữ
export const activeBoardlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducers: Nơi xử lý dữ Liệu đồng bộ
  reducers: {
    // Lưu ý Luôn là ở đây luôn luôn cần cập ngoặc nhọn cho function trong reducer cho dù
    // code bên trong chỉ có 1 dòng, đây là rule của Redux
    // https://redux-toolkit.js.org/usage/immer-reducers#mutating-and-returning-state
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gần nó ra một biến có nghĩa hơn
      const board = action.payload

      //* Xử lý dữ liệu nều cần thiết...Tùy vào đặc thù dự án -------------------------
      // ...
      //* -------------------------

      // Update lại dữ liệu của cái currentActiveBoard
      state.currentActiveBoard = board

      //? ngắn gọn -> state.currentActiveBoard = action.payload
    },
    updateCardInBoard: (state, action) => {
      //Update nested data
      // https://redux-toolkit.js.org/usage/immer-reducers#updating-nested-data
      const incomingCard = action.payload

      // Tìm dần từ board > column > card
      const column = state.currentActiveBoard.columns.find(i => i._id === incomingCard.columnId)
      if (column) {
        const card = column.cards.find(i => i._id === incomingCard._id)
        if (card) {
          // card.title = incomingCard.title

          /**
          * Giải thích đoạn dưới, các bạn mới lần đầu sẽ dễ bị lú :D
          * Đơn giản là dùng Object.keys để lấy toàn bộ các properties (keys) của incoming Card về một Array rồi forEach nó ra.
          * Sau đó tùy vào trường hợp cần thì kiểm tra thêm còn không thì cập nhật ngược lại giá trị vào card luôn như bên dưới.
          */
          Object.keys(incomingCard).forEach(key => {
            card[key] = incomingCard[key]
          })
        }
      }
    },
    deleteCurrentActiveBoard: (state) => {
      state.currentActiveBoard = null
    }
  },
  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
        //action.payload ở đây chính là cái response.data trả về ở trên
        let board = action.payload

        //* Xử lý dữ liệu nều cần thiết...Tùy vào đặc thù dự án -------------------------
        // Thành viên trong Board sẽ là gộp lại của 2 mảng owners và members
        board.FE_allUsers = board.owners.concat(board.members)

        // Sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuồng bên
        // dưới các component con (video 71 đã giải thích lý do ở phần Fix bug quan trọng)
        board.columns = mapOrder(board?.columns, board?.columnOrderIds, '_id')

        board.columns.forEach(column => {
          // Khi 15 trang web thì cần xử lý vấn đề kéo thả vào một column rỗng
          // (Nhớ lại video 37.2, code hiện tại là video 69)
          if (isEmpty(column.cards)) {
            column.cards = [generatePlaceholderCard(column)]
            column.cardOrderIds = [generatePlaceholderCard(column._id)]
          } else {
            // Sắp xếp thứ tự các cards luôn ở đây trước khi đưa dữ liệu xuống bên dưới
            // các component con (video 71 đã giải thích lý do ở phần Fix bug quan trọng)
            column.cards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
          }
        })
        //* -------------------------------------------------------

        // Update lại dữ liệu của cải currentActiveBoard
        state.currentActiveBoard = board
      })
  }
})


//* Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch()
//* tới nó đề cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)

//* Để ý ở trên thì không thấy properties actions đầu cả, bởi vì
//* những cái actions này đơn giản là được thằng redux tạo tự động theo tên của reducer nhé.
export const { updateCurrentActiveBoard, updateCardInBoard, deleteCurrentActiveBoard } = activeBoardlice.actions

//* Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector()
//* để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

//* Cái file này tên là activeBoardSlice NHƯNG chúng ta sẽ export một thử tên là Reducer, mọi người lưu ý
//* export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardlice.reducer