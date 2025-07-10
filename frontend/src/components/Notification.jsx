import { Snackbar, Alert, IconButton, Typography } from '@mui/joy';
import {
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Report as ReportIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const iconMapping = {
  success: <CheckCircleIcon />,
  danger: <ReportIcon />,
  warning: <WarningIcon />,
  info: <InfoIcon />,
};

const Notification = ({ message, type = 'info', duration = 5000, onClose }) => {
  return (
    <Snackbar
      autoHideDuration={duration}
      open={true}
      variant="outlined"
      color={type}
      onClose={onClose}
      sx={{
        '--Snackbar-animationDuration': '0.3s',
        animation: 'inAnimation 0.3s forwards',
        '@keyframes inAnimation': {
          '0%': {
            transform: 'translateX(100%)',
            opacity: 0,
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: 1,
          },
        },
        margin: 0,
        padding: 0
      }}
    >
      <Alert
        variant="soft"
        color={type}
        startDecorator={iconMapping[type]}
        sx={{ m: 0 }}
        endDecorator={
          <IconButton onClick={onClose} size="sm" variant="plain" color={type}>
            <CloseIcon />
          </IconButton>
        }
      >
        <Typography level="body-sm" color={type}>{message}</Typography>
      </Alert>
    </Snackbar>
  );
};

export default Notification;