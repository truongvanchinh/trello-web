import Button from '@mui/material/Button'
import AccessibilityIcon from '@mui/icons-material/Accessibility'
import AddHomeIcon from '@mui/icons-material/AddHome'
import Typography from '@mui/material/Typography'

function App() {
  return (
    <>
      <div>Truong van chinh</div>
      <Button variant="text">Text</Button>
      <Button variant="contained" color="success">Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <AccessibilityIcon />
      <AddHomeIcon />
      <Typography variant='body2' color='text.secondary'>Test Typography</Typography>
    </>
  )
}

export default App
