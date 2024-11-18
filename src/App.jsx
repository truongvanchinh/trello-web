import Board from '~/pages/Boards/_id'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from '~/pages/Settings/Settings'
import Boards from './pages/Boards'

/**
* Giải pháp Clean Code trong việc xác định các route nào cần đăng nhập tài khoản xong thì mới cho truy cập * Sử dụng <Outlet /> của react-router-dom đề hiển thị các Child Route (xem cách sử dụng trong App() bên dưới)
* https://reactrouter.com/en/main/components/outlet
* Một bài hướng dẫn khá đầy đủ: https://www.robinwieruch.de/react-router-private-routes/
 */

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

function App() {

  const currentUser = useSelector(selectCurrentUser)

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
      {/*-Protected Routes (Hiều đơn giản trong dự án của chúng ta là những route chỉ cho truy cập sau khi đã login) */}
      <Route element={<ProtectedRoute user={currentUser}/>}>
        {/*<Outlet /> của react-router-dom sẽ chạy vào các child route trong này */}
        {/* Board Detail */}
        <Route path='/boards/:boardId' element={<Board />} />
        <Route path='/boards' element={<Boards />} />

        {/* User Setting */}
        <Route path='/settings/account' element={<Settings />} />
        <Route path='/settings/security' element={<Settings />} />

      </Route>
      {/* Authentication Route */}
      <Route path='/login' element={<Auth/>} />
      <Route path='/register' element={<Auth/>} />
      <Route path='/account/verification' element={<AccountVerification />} />

      {/* 404 Route Not Found */}
      <Route path='*' element={<NotFound/>} />


    </Routes>
  )
}

export default App
