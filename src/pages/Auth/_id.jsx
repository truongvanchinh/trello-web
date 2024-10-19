import SignIn from './SignIn/SignIn'
import SignUp from './SignUp/SignUp'
import Container from '@mui/material/Container'
import { Routers, Router } from 'react-router-dom'
function Auth() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <SignUp />
    </Container>
  )
}

export default Auth