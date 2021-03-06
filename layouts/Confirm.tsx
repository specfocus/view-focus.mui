import ActionCheck from '@mui/icons-material/CheckCircle';
import AlertError from '@mui/icons-material/ErrorOutline';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { alpha, styled } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { useTranslate } from '@specfocus/view-focus.i18n/translations/useTranslate';
import clsx from 'clsx';
import PropTypes, { ReactComponentLike } from 'prop-types';
import React, { MouseEventHandler, useCallback } from 'react';

/**
 * Confirmation dialog
 *
 * @example
 * <Confirm
 *     isOpen={true}
 *     title="Delete Item"
 *     content="Are you sure you want to delete this item?"
 *     confirm="Yes"
 *     confirmColor="primary"
 *     ConfirmIcon=ActionCheck
 *     CancelIcon=AlertError
 *     cancel="Cancel"
 *     onConfirm={() => { // do something }}
 *     onClose={() => { // do something }}
 * />
 */
export const Confirm = (props: ConfirmProps) => {
  const {
    className,
    isOpen = false,
    loading,
    title,
    content,
    cancel = 'action.cancel',
    confirm = 'action.confirm',
    confirmColor = 'primary',
    ConfirmIcon = ActionCheck,
    CancelIcon = AlertError,
    onClose,
    onConfirm,
    translateOptions = {},
    sx,
  } = props;

  const translate = useTranslate();

  const handleConfirm = useCallback(
    e => {
      e.stopPropagation();
      onConfirm(e);
    },
    [onConfirm]
  );

  const handleClick = useCallback(e => {
    e.stopPropagation();
  }, []);

  return (
    <StyledDialog
      className={className}
      open={isOpen}
      onClose={onClose}
      onClick={handleClick}
      aria-labelledby="alert-dialog-title"
      sx={sx}
    >
      <DialogTitle id="alert-dialog-title">
        {translate(title, { _: title, ...translateOptions })}
      </DialogTitle>
      <DialogContent>
        {typeof content === 'string' ? (
          <DialogContentText>
            {translate(content, {
              _: content,
              ...translateOptions,
            })}
          </DialogContentText>
        ) : (
          content
        )}
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={onClose}>
          <CancelIcon className={ConfirmClasses.iconPaddingStyle} />
          {translate(cancel, { _: cancel })}
        </Button>
        <Button
          disabled={loading}
          onClick={handleConfirm}
          className={clsx('confirm', {
            [ConfirmClasses.confirmWarning]:
              confirmColor === 'warning',
            [ConfirmClasses.confirmPrimary]:
              confirmColor === 'primary',
          })}
          autoFocus
        >
          <ConfirmIcon className={ConfirmClasses.iconPaddingStyle} />
          {translate(confirm, { _: confirm })}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export interface ConfirmProps {
  cancel?: string;
  className?: string;
  confirm?: string;
  confirmColor?: string;
  ConfirmIcon?: ReactComponentLike;
  CancelIcon?: ReactComponentLike;
  content: React.ReactNode;
  isOpen?: boolean;
  loading?: boolean;
  onClose: MouseEventHandler;
  onConfirm: MouseEventHandler;
  title: string;
  translateOptions?: object;
  sx?: SxProps;
}

Confirm.propTypes = {
  cancel: PropTypes.string,
  className: PropTypes.string,
  confirm: PropTypes.string,
  confirmColor: PropTypes.string,
  ConfirmIcon: PropTypes.elementType,
  CancelIcon: PropTypes.elementType,
  content: PropTypes.node.isRequired,
  isOpen: PropTypes.bool,
  loading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  sx: PropTypes.any,
};

const PREFIX = 'Confirm';

export const ConfirmClasses = {
  confirmPrimary: `${PREFIX}-confirmPrimary`,
  confirmWarning: `${PREFIX}-confirmWarning`,
  iconPaddingStyle: `${PREFIX}-iconPaddingStyle`,
};

const StyledDialog = styled(Dialog, {
  name: PREFIX,
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  [`& .${ConfirmClasses.confirmPrimary}`]: {
    color: theme.palette.primary.main,
  },

  [`& .${ConfirmClasses.confirmWarning}`]: {
    color: theme.palette.error.main,
    '&:hover': {
      backgroundColor: alpha(theme.palette.error.main, 0.12),
      // Reset on mouse devices
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
  },

  [`& .${ConfirmClasses.iconPaddingStyle}`]: {
    paddingRight: '0.5em',
  },
}));
