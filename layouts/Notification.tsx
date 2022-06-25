import { Button, Snackbar, SnackbarOrigin, SnackbarProps } from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import undoableEventEmitter from '@specfocus/view-focus.data/providers/undoableEventEmitter';
import { useTranslate } from '@specfocus/view-focus.i18n/i18n/useTranslate';
import { useNotificationContext } from '@specfocus/view-focus.notification/providers/useNotificationContext';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';

const defaultAnchorOrigin: SnackbarOrigin = {
  vertical: 'bottom',
  horizontal: 'center',
};

/**
 * Provides a way to show a notification.
 * @see useNotify
 *
 * @example <caption>Basic usage</caption>
 * <Notification />
 *
 * @param props The component props
 * @param {string} props.type The notification type. Defaults to 'info'.
 * @param {number} props.autoHideDuration Duration in milliseconds to wait until hiding a given notification. Defaults to 4000.
 * @param {boolean} props.multiLine Set it to `true` if the notification message should be shown in more than one line.
 */
export const Notification = (props: NotificationProps) => {
  const {
    className,
    type = 'info',
    autoHideDuration = 4000,
    multiLine = false,
    anchorOrigin = defaultAnchorOrigin,
    ...rest
  } = props;
  const { notifications, takeNotification } = useNotificationContext();
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = React.useState(undefined);
  const translate = useTranslate();

  useEffect(() => {
    if (notifications.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo(takeNotification());
      setOpen(true);
    } else if (notifications.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [notifications, messageInfo, open, takeNotification]);

  const handleRequestClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleExited = useCallback(() => {
    if (messageInfo && messageInfo.notificationOptions.undoable) {
      undoableEventEmitter.emit('end', { isUndo: false });
    }
    setMessageInfo(undefined);
  }, [messageInfo]);

  const handleUndo = useCallback(() => {
    undoableEventEmitter.emit('end', { isUndo: true });
    setOpen(false);
  }, []);

  if (!messageInfo) return null;

  return (
    <StyledSnackbar
      className={className}
      open={open}
      message={
        messageInfo.message &&
        translate(
          messageInfo.message,
          messageInfo.notificationOptions.messageArgs
        )
      }
      autoHideDuration={
        messageInfo.notificationOptions.autoHideDuration ||
        autoHideDuration
      }
      disableWindowBlurListener={messageInfo.notificationOptions.undoable}
      TransitionProps={{ onExited: handleExited }}
      onClose={handleRequestClose}
      ContentProps={{
        className: clsx(NotificationClasses[messageInfo.type || type], {
          [NotificationClasses.multiLine]:
            messageInfo.multiLine || multiLine,
        }),
      }}
      action={
        messageInfo.notificationOptions.undoable ? (
          <Button
            color="primary"
            className={NotificationClasses.undo}
            size="small"
            onClick={handleUndo}
          >
            <>{translate('action.undo')}</>
          </Button>
        ) : null
      }
      anchorOrigin={anchorOrigin}
      {...rest}
    />
  );
};

Notification.propTypes = {
  type: PropTypes.string,
  autoHideDuration: PropTypes.number,
  multiLine: PropTypes.bool,
};

const PREFIX = 'RaNotification';

export const NotificationClasses = {
  success: `${PREFIX}-success`,
  error: `${PREFIX}-error`,
  warning: `${PREFIX}-warning`,
  undo: `${PREFIX}-undo`,
  multiLine: `${PREFIX}-multiLine`,
};

const StyledSnackbar = styled(Snackbar, {
  name: PREFIX,
  overridesResolver: (props, styles) => styles.root,
})(({ theme, type }: NotificationProps & { theme?: Theme; }) => ({
  [`& .${NotificationClasses.success}`]: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },

  [`& .${NotificationClasses.error}`]: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.error.contrastText,
  },

  [`& .${NotificationClasses.warning}`]: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
  },

  [`& .${NotificationClasses.undo}`]: {
    color:
      type === 'success'
        ? theme.palette.success.contrastText
        : theme.palette.primary.light,
  },
  [`& .${NotificationClasses.multiLine}`]: {
    whiteSpace: 'pre-wrap',
  },
}));

export interface NotificationProps extends Omit<SnackbarProps, 'open'> {
  type?: string;
  autoHideDuration?: number;
  multiLine?: boolean;
}