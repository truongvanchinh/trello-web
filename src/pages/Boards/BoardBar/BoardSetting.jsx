import React from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { useConfirm } from 'material-ui-confirm'
import { useNavigate } from 'react-router-dom'
import { deleteBoardDetailsAPI } from '~/apis'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { toast } from 'react-toastify'
import { selectCurrentUser } from '~/redux/user/userSlice'

function BoardSetting() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const deleteConfirm = useConfirm()
  const navigate = useNavigate()
  const currentBoard = useSelector(selectCurrentActiveBoard)
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  // const confirmLogout = useConfirm()
  const handleDeleteBoard = () => {
    if (!currentBoard.ownerIds.includes(currentUser._id)) {
      toast.error('You not board\'s owner')
      return
    }
    deleteConfirm({
      title: 'Delete this board?',
      description: 'Hành động này xẽ xóa vĩnh viễn tất cả thông tin trong board!!!',
      confirmationText: 'confirm',
      cancellationText: 'cancel',
      confirmationButtonProps: { color: 'error' }
    })
      .then(() => {
        deleteBoardDetailsAPI(currentBoard._id).then(res => {
          dispatch(deleteCurrentActiveBoard())
          toast.success(res.deleteResult, { position: 'bottom-right' })
          navigate('/boards')
        })
      })
      .catch(() => {})
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Board settings">
          <MoreHorizIcon
            onClick={handleClick}
            size="small"
            aria-controls={open ? 'basic-menu-profiles' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            sx={{ color: 'white' }}
          >
          </MoreHorizIcon>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="basic-menu-profiles"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 28,
                height: 28,
                ml: -0.5,
                mr: 2
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0
              }
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleDeleteBoard}>
          <ListItemIcon>
            <DeleteForeverIcon fontSize="small" />
          </ListItemIcon>
          Delete board
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default BoardSetting