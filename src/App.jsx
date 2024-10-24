import Board from '~/pages/Boards/_id'
import { Routes, Route, Navigate } from 'react-router-dom'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'

function App() {
  return (
    <Routes>
      {/* Redirect Route */}
      <Route path='/' element={
        // ở đây cần replace giá trị true đề nó thay thế route /,
        // có thể hiểu là route / sẽ không còn nằm trong history của Browser
        // Thực hành dễ hiều hơn bằng cách nhẫn Go Home từ trang 404
        // xong thứ quay lại bằng nút back của trình duyệt giữa 2 trường hợp có replace hoặc không có.
        //* Ví Dụ thực tế:
        //? đang ở /abd (404 Page Not Found) -> click Go home (/) -> /board/:boardId -> click go back ->
        //? trở về trang (/), mà / thì lại navigate lại /board/:boardId, mà 0 phải /abd (404 Page Not Found)
        //? dùng replace={true} để thay cái / thành /board/:boardId -> back là trở về trang /abd (404 Page Not Found)

        <Navigate to='/boards/670247dbaceb5f086b41a889' replace={true}/>
      }/>
      {/* Board Detail */}
      <Route path='/boards/:boardId' element={<Board />} />

      {/* Authentication Route */}
      <Route path='/login' element={<Auth/>} />
      <Route path='/register' element={<Auth/>} />

      {/* 404 Route Not Found */}
      <Route path='*' element={<NotFound/>} />
    </Routes>
  )
}

export default App
