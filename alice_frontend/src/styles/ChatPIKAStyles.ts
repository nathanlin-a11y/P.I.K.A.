import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  chatPIKAContainer: {
    display: 'flex',
    height: '100%',
    maxWidth: '100%',
    // overflow: 'hidden',
  },
  chatPIKAMain: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    overflow: 'auto',
  },
  chatPIKAMessages: {
    flexGrow: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    margin: '0 10px'
  },
  chatPIKAInput: {
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1),
  },
  actionButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default useStyles;