import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'

function Card({ tempocaryHideMedia }) {
  if (tempocaryHideMedia) {
    return (
      <MuiCard sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        borderRadius: '12px',
        overflow: 'unset'
      }}>
        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          <Typography>
            Lizard
          </Typography>
        </CardContent>
      </MuiCard>
    )
  }
  return (
    <MuiCard sx={{
      cursor: 'pointer',
      boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
      borderRadius: '12px',
      overflow: 'unset'
    }}>
      <CardMedia
        sx={{ height: 140 }}
        image="https://mui.com/static/images/cards/paella.jpg"
        title="green iguana"
      />
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>
          Lizard
        </Typography>
      </CardContent>
      <CardActions sx={{ p: '0 4px 8px 4px' }}>
        <Button size="small" startIcon={<PeopleAltIcon/>}>12</Button>
        <Button size="small" startIcon={<CommentIcon/>}>2</Button>
        <Button size="small" startIcon={<AttachmentIcon/>}>2</Button>
      </CardActions>
    </MuiCard>
  )
}

export default Card