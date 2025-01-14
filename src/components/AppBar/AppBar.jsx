import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as trelloIcon } from '~/assets/trello.svg'
import Typography from '@mui/material/Typography'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Started from './Menus/Started'
import Templates from './Menus/Templates'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { Link } from 'react-router-dom'
import Notifications from './Notifications/Notifications'
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard'

function AppBar() {
  return (
    <Box px={2} sx={{
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark'? '#2c3e50' : '#1565c0'),
      '&::-webkit-scrollbar-track' : { m: 2 }
    }}>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link to='/boards'>
          <Tooltip title="Boards">
            <AppsIcon fontSize="medium" sx={{ color: 'white', verticalAlign: 'middle' }} />
          </Tooltip>
        </Link>

        <Link to={'/'}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SvgIcon component={trelloIcon} fontSize='small' inheritViewBox sx={{ color: 'white' }} />
            <Typography variant='span' sx={{ fontSize:'1.2rem', fontWeight: 'bold', color: 'white' }}>
              Trello
            </Typography>
          </Box>
        </Link>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>

          <Workspaces />
          <Recent/>
          <Started/>
          <Templates/>

          <Button variant="outlined" startIcon={<LibraryAddIcon/>} sx={{ color: 'white' }}>Create</Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap:2 }}>

        {/* Tìm kiếm nhanh Board */}
        <AutoCompleteSearchBoard />

        {/* Dark Light System Mode */}
        <ModeSelect />

        {/* Xử lý hiển thị các thông báo - notification ở đây */}
        <Notifications />

        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ color: 'white', cursor: 'pointer' }}/>
        </Tooltip>

        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar
