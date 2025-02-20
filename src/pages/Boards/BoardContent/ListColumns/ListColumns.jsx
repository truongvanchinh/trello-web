import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Column from './Column/Column'
import AddIcon from '@mui/icons-material/Add'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { cloneDeep } from 'lodash'

import { createNewColumnAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'

import {
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useSelector, useDispatch } from 'react-redux'


function ListColumns({ columns }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
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

    // Begin: Gọi API tạo mới Column và làm lại dữ liệu State Board ------------
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn._id)]

    //TODO - lesson 2
    //* Đoạn này sẽ dính lỗi object is not extensible bởi dù đã copy/clone ra giá trị newBoard
    //* nhưng bản chất của spread operator là Shallow Copy/Clone,
    //* nên dính phải rules Immutability trong Redux Toolkit không dùng được hàm PUSH (sửa giá trị mảng trực tiếp),
    //? cách đơn giản nhanh gọn nhất ở trường hợp này của chúng ta là dùng tới Deep Copy/Clone toàn bộ cái Board
    //* cho dễ hiều và code ngắn gọn.
    //* https://redux-toolkit.js.org/usage/immer-reducers
    //* Tài Liệu thêm về Shallow và Deep Copy Object trong JS:
    //* https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/

    //? c1: dùng cloneDeep
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)

    //? c2: dùng concat -> vì nó sẽ tạo ra mảng mới
    // const newBoard = { ...board }
    // newBoard.columns = newBoard.columns.concat([createdColumn])
    // newBoard.columnOrderIds = newBoard.columnOrderIds.concat([createdColumn])
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))
    // End: Gọi API tạo mới Column và làm lại dữ liệu State Board ------------

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
        {columns?.map(column => <Column key={column._id} column={column} />)}
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addNewColumn()
                }
              }}
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
                className='interceptor-loading'
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