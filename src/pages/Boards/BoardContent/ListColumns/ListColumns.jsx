import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Column from './Column/Column'
import AddIcon from '@mui/icons-material/Add'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'


function ListColumns({ columns, createNewColumn, createNewCard }) {

  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const toggleNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)
  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Please enter column title!', {
        position: 'bottom-left',
        theme: 'colored',
        autoClose: 2000
      })
      return
    }

    //Tạo dữ liệu Column để gọi api
    const newColumnData = {
      title: newColumnTitle
    }
    //Gọi API ở dưới
    await createNewColumn(newColumnData)

    //Đóng add column, reset giá trị ban đầu
    toggleNewColumnForm()
    setNewColumnTitle('')
  }

  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track' : { m: 2 }
      }}>
        {columns?.map(column => <Column key={column._id} column={column} createNewCard={createNewCard}/>)}
        {/* Box add new list */}
        {!openNewColumnForm
          ? <Box
            onClick={toggleNewColumnForm}
            sx={{
              maxWidth: '250px',
              minWidth: '250px',
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
          : <Box
            sx={{
              minWidth: '250px',
              maxHeight: '250px',
              mx: 2,
              p: 1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              display: 'flex',
              gap: 1
            }}
          >
            <TextField
              id="outlined-search"
              label="Enter cloumn title..."
              type="text"
              size='small'
              variant='outlined'
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                // width: '100%',
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }

              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={addNewColumn}
                variant='contained' color='success' size='small'
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                }}
              >
                Add
              </Button>
              <CloseIcon
                fontSize='small'
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': { color: theme => theme.palette.warning.light }
                }}
                onClick={toggleNewColumnForm}
              />
            </Box>
          </Box>
        }
      </Box>
    </SortableContext>
  )
}

export default ListColumns