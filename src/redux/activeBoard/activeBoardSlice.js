import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
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
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
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

      // Xử lý dữ liệu nều cần thiết
      // ...

      // Update lại dữ liệu của cái currentActiveBoard
      state.currentActiveBoard = board

      //? ngắn gọn -> state.currentActiveBoard = action.payload
    }
  },
  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducer: (builder) => {
    builder
      .addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
        //action.payload ở đây chính là cái response.data trả về ở trên
        let board = action.payload

        // Xử lý dữ liệu nều cần thiết...
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

        // Update lại dữ liệu của cải currentActiveBoard
        state.currentActiveBoard = board
      })
  }
})


//* Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch()
//* tới nó đề cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)

//* Để ý ở trên thì không thấy properties actions đầu cả, bởi vì
//* những cái actions này đơn giản là được thằng redux tạo tự động theo tên của reducer nhé.
export const { updateCurrentActiveBoard } = activeBoardlice.actions

//* Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector()
//* để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

//* Cái file này tên là activeBoardSlice NHƯNG chúng ta sẽ export một thử tên là Reducer, mọi người lưu ý
//* export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardlice.reducer