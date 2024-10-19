// import SignUp from './SignUp/SignUp'
import SignIn from './SignIn/SignIn'
import Container from '@mui/material/Container'
function Auth() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <SignIn />
    </Container>
  )
}

export default Auth