import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Column from './Column/Column'
import AddIcon from '@mui/icons-material/Add'

function ListColumns() {
  return (
    <Box sx={{
      bgcolor: 'inherit',
      width: '100%',
      height: '100%',
      display: 'flex',
      overflowX: 'auto',
      overflowY: 'hidden',
      '&::-webkit-scrollbar-track' : { m: 2 }
    }}>
      <Column/>
      <Column/>
      <Column/>
      <Column/>
      <Column/>
      <Column/>
      <Column/>
      <Column/>
      <Column/>
      <Column/>
      <Column/>
      {/* Box add new list */}
      <Box sx={{
        maxWidth: '200px',
        minWidth: '200px',
        bgcolor: 'rgba(236, 240, 241, 0.2)',
        height: 'fit-content',
        mx: 2,
        borderRadius: '12px'

      }}>
        <Button
          startIcon={<AddIcon/>}
          sx={{
            color: 'white',
            width: '100%',
            justifyContent: 'flex-start',
            pl: 2.5,
            py: 1
          }}
        >
          Add another list</Button>
      </Box>
    </Box>
  )
}

export default ListColumns