import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  chatPIKAContainer: {
    display: 'flex',
    height: '100%',
  },
  chatPIKAMain: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  chatPIKAMessages: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: theme.spacing(2),
  },
  chatPIKAInput: {
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2),
  },
  right_circle: {
    marginLeft: 'auto !important',
  },
  actionButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default useStyles;