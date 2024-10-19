import PropTypes from 'prop-types'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { getSignUpTheme } from '~/theme'

function TemplateFrame({
  mode,
  children
}) {
  const signUpTheme = createTheme(getSignUpTheme(mode))

  return (
    <ThemeProvider theme={signUpTheme}>
      <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: '1 1', overflow: 'auto' }}>{children}</Box>
      </Box>
    </ThemeProvider>
  )
}

TemplateFrame.propTypes = {
  children: PropTypes.node,
  showCustomTheme: PropTypes.bool.isRequired,
  toggleCustomTheme: PropTypes.func.isRequired
}

export default TemplateFrame