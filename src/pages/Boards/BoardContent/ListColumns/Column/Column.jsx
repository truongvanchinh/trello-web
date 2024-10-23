import { useState } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Fade from '@mui/material/Fade'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import SaveIcon from '@mui/icons-material/Save'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import { toast } from 'react-toastify'
import ListCards from './ListCards/ListCards'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useConfirm } from 'material-ui-confirm'

import { cloneDeep } from 'lodash'

import { createNewCardAPI, deleteColumnDetailsAPI } from '~/apis'

import {
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useSelector, useDispatch } from 'react-redux'


function Column({ column }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const orderedCards = column.cards
  const [anchorEl, setAnchorEl] = useState(null)
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')
  const deleteConfirm = useConfirm()

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })
  const dndKitColumnStyles = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const toggleNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error('Please enter card title!', {
        position: 'bottom-right',
        theme: 'colored',
        autoClose: 2000
      })
      return
    }

    // Tạo data cho card để gọi api
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }


    // Begin: Gọi API tạo mới Card và làm lại dữ liệu State Board ------------ lesson 2: refactor
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    // console.log('createdCard: ', createdCard)

    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)

    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        // chưa có thì gán luôn -> loại bỏ card placeholder mặc định
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        // Đã có data thì push thêm vào mảng
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))
    // End: Gọi API tạo mới Card và làm lại dữ liệu State Board ------------ lesson 2: refactor


    //Đóng add Card, reset giá trị ban đầu
    toggleNewCardForm()
    setNewCardTitle('')
  }

  const handleDeleteColumn = () => {
    deleteConfirm({
      title: 'Xóa cột này?',
      description: 'Hành động này xẽ xóa vĩnh viễn cột này và toàn bộ thẻ bên trong',
      confirmationText: 'confirm',
      cancellationText: 'cancel',
      confirmationButtonProps: { color: 'error' }
    })
      .then(() => {
        // Begin: Gọi API xóa Column và cập nhật dữ liệu State Board ------------ lesson 2: refactor
        // update chuẩn dữ liệu state Board
        const newBoard = { ...board }
        newBoard.columns = newBoard.columns.filter(column => column._id !== column._id)
        newBoard.columnOrderIds = newBoard.columnOrderIds.map(_id => _id !== column._id)
        // setBoard(newBoard)
        dispatch(updateCurrentActiveBoard(newBoard))

        //Gọi API xử lý xóa column and cards
        deleteColumnDetailsAPI(column._id).then(res => {
          toast.success(res.deleteResult, { position: 'bottom-right' })
        })
        // End: Gọi API xóa Column và cập nhật dữ liệu State Board ------------ lesson 2: refactor
      })
      .catch(() => {})
  }

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes} >
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark'? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}
      >
        {/* Box Column Header */}
        <Box sx={{
          height: (theme) => theme.trello.columnHeaderHeight,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant='h6' sx={{
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            flex: 1
          }}>{column?.title}</Typography>
          <Box>
            <Tooltip title="List actions">
              <MoreHorizIcon
                sx={{ color: 'text.primary', cursor: 'pointer' }}
                id='basic-column-dropdown'
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id='basic-menu-column-dropdown'
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              TransitionComponent={Fade}
            >
              <Typography sx={{ textAlign: 'center' }}>List actions</Typography>
              <MenuItem
                onClick={toggleNewCardForm}
                sx={{
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}>
                <ListItemText>Add card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemText>Copy list</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemText>Move list</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemText>Sort by...</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemText>Watch</ListItemText>
              </MenuItem>

              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  '&:hover': {
                    color: 'red',
                    '& .delete-column-icon': { color: 'red[500]' }
                  }
                }}>
                <ListItemIcon className='delete-column-icon'> <DeleteForeverIcon fontSize='small' /> </ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon> <SaveIcon fontSize='small' /> </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        {/* List Cards */}
        <ListCards cards={orderedCards}/>
        {/* Box Column Footer */}
        <Box sx={{
          height: (theme) => theme.trello.columnFooterHeight,
          p: 2
        }}>
          {!openNewCardForm
            ? <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '100%'
            }}>
              <Button
                onClick={toggleNewCardForm}
                startIcon={<AddIcon/>}
                sx={{ flex: 1, justifyContent: 'flex-start' }}
              >
              Add a card
              </Button>
              <Tooltip title='Drag to move'>
                <DragHandleIcon sx={{ cursor: 'pointer' }}/>
              </Tooltip>
            </Box>
            : <Box
              sx={{
                minWidth: '250px',
                height: '100%',
                display: 'flex',
                gap: 1,
                alignItems: 'center'
              }}
            >
              <TextField
                id="outlined-search"
                label="Enter card title..."
                type="text"
                size='small'
                variant='outlined'
                autoFocus
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                data-no-dnd="true"
                sx={{
                  // width: '100%',
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: theme => theme.palette.primary.main,
                    bgcolor: theme => theme.palette.mode === 'dark'? '#333643': 'white'
                  },
                  '& label.Mui-focused': { color: theme => theme.palette.primary.main },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: theme => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: theme => theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: theme => theme.palette.primary.main }
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: 1
                  }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  data-no-dnd="true"
                  onClick={addNewCard}
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
                  data-no-dnd="true"
                  fontSize='small'
                  sx={{
                    color: theme => theme.palette.warning.light,
                    cursor: 'pointer'
                  }}
                  onClick={toggleNewCardForm}
                />
              </Box>
            </Box>
          }
        </Box>
      </Box>
    </div>
  )
}

export default Column