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
import DragHandleIcon from '@mui/icons-material/DragHandle'
import { mapOrder } from '~/utils/sorts'

import ListCards from './ListCards/ListCards'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Column({ column }) {

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: column._id
  })
  const dndKitColumnStyles = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition
  }

  const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <Box
      ref={setNodeRef}
      style={dndKitColumnStyles}
      {...attributes}
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
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Button startIcon={<AddIcon/>} sx={{ flex: 1, justifyContent: 'flex-start' }}>Add a card</Button>
        <Tooltip title='Drag to move'>
          <DragHandleIcon sx={{ cursor: 'pointer' }}/>
        </Tooltip>
      </Box>
    </Box>
  )
}

export default Column