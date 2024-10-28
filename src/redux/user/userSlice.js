import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'


// Khởi tạo giá trị State của một Slice trong redux
const initialState = {
  currentUser: null
}

export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    return response.data
  }
)

// Khởi tạo một Slice trong kho lưu trữ
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAPI.fulfilled, (state, action) => {
        const user = action.payload

        //* Xử lý dữ liệu nều cần thiết...Tùy vào đặc thù dự án -------------------------

        //* -------------------------------------------------------

        // Update lại dữ liệu
        state.currentUser = user
      })
  }
})


//* Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch()
//* tới nó đề cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// export const {} = userSlice.actions
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer