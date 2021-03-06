import CircularProgress from '@mui/material/CircularProgress';
import { styled, useTheme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { useLoading } from '@specfocus/view-focus.data/providers/useLoading';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { RefreshIconButton } from '../buttons';

export const LoadingIndicator = (props: LoadingIndicatorProps) => {
  const { className, sx, ...rest } = props;
  const loading = useLoading();

  const theme = useTheme();
  return (
    <Root className={className} sx={sx}>
      {loading ? (
        <CircularProgress
          className={clsx(
            'app-loader',
            LoadingIndicatorClasses.loader
          )}
          color="inherit"
          size={theme.spacing(2)}
          thickness={6}
          {...rest}
        />
      ) : (
        <RefreshIconButton
          className={LoadingIndicatorClasses.loadedIcon}
        />
      )}
    </Root>
  );
};

LoadingIndicator.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.string,
  width: PropTypes.string,
};

interface LoadingIndicatorProps {
  className?: string;
  sx?: SxProps;
}

const PREFIX = 'LoadingIndicator';

export const LoadingIndicatorClasses = {
  loader: `${PREFIX}-loader`,
  loadedIcon: `${PREFIX}-loadedIcon`,
};

const Root = styled('div', {
  name: PREFIX,
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  [`& .${LoadingIndicatorClasses.loader}`]: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },

  [`& .${LoadingIndicatorClasses.loadedIcon}`]: {},
}));
