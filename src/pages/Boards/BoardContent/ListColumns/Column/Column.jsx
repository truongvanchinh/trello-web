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
import { mapOrder } from '~/utils/sorts'
import { toast } from 'react-toastify'
import ListCards from './ListCards/ListCards'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Column({ column, createNewCard }) {
  const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
  const [anchorEl, setAnchorEl] = useState(null)
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')

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
    //Gọi API ở dưới
    await createNewCard(newCardData)
    //Đóng add Card, reset giá trị ban đầu
    toggleNewCardForm()
    setNewCardTitle('')
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
              TransitionComponent={Fade}
            >
              <Typography sx={{ textAlign: 'center' }}>List actions</Typography>
              <MenuItem>
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
              <MenuItem>
                <ListItemIcon> <DeleteForeverIcon fontSize='small' /> </ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
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