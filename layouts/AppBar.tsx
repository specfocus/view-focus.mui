import {
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  Theme,
  Toolbar,
  Typography,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ComponentPropType from '@specfocus/view-focus/utils/ComponentPropType';
import PropTypes from 'prop-types';
import React, { Children, FunctionComponent, memo } from 'react';
import { HideOnScroll } from './HideOnScroll';
import { LoadingIndicator } from './LoadingIndicator';
import { SidebarToggleButton } from './SidebarToggleButton';
import { UserMenu } from './UserMenu';

/**
 * The AppBar component renders a custom MuiAppBar.
 *
 * @param {Object} props
 * @param {ReactNode} props.children React node/s to be rendered as children of the AppBar
 * @param {string} props.className CSS class applied to the MuiAppBar component
 * @param {string} props.color The color of the AppBar
 * @param {boolean} props.open State of the <BaseRoot/> Sidebar
 * @param {Element | boolean} props.userMenu A custom user menu component for the AppBar. <UserMenu/> component by default. Pass false to disable.
 *
 * @example
 *
 * const MyAppBar = props => {

 *   return (
 *       <AppBar {...props}>
 *           <Typography
 *               variant="h6"
 *               color="inherit"
 *               className={classes.title}
 *               id="@specfocus/view-focus.mui-demo-title"
 *           />
 *       </AppBar>
 *   );
 *};
 *
 * @example Without a user menu
 *
 * const MyAppBar = props => {

 *   return (
 *       <AppBar {...props} userMenu={false} />
 *   );
 *};
 */
export const AppBar: FunctionComponent<AppBarProps> = memo(props => {
  const {
    children,
    className,
    color = 'secondary',
    open,
    title,
    userMenu = DefaultUserMenu,
    container: Container = HideOnScroll,
    ...rest
  } = props;

  const isXSmall = useMediaQuery<Theme>(theme =>
    theme.breakpoints.down('sm')
  );

  return (
    <Container className={className}>
      <StyledAppBar
        className={AppBarClasses.appBar}
        color={color}
        {...rest}
      >
        <Toolbar
          disableGutters
          variant={isXSmall ? 'regular' : 'dense'}
          className={AppBarClasses.toolbar}
        >
          <SidebarToggleButton className={AppBarClasses.menuButton} />
          {Children.count(children) === 0 ? (
            <Typography
              variant="h6"
              color="inherit"
              className={AppBarClasses.title}
              id="@specfocus/view-focus.mui-demo-title"
            />
          ) : (
            children
          )}
          <LoadingIndicator />
          {typeof userMenu === 'boolean' ? (
            userMenu === true ? (
              <UserMenu />
            ) : null
          ) : (
            userMenu
          )}
        </Toolbar>
      </StyledAppBar>
    </Container>
  );
});

AppBar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.oneOf([
    'default',
    'inherit',
    'primary',
    'secondary',
    'transparent',
  ]),
  container: ComponentPropType,
  // @deprecated
  open: PropTypes.bool,
  userMenu: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
};

const DefaultUserMenu = <UserMenu />;

export interface AppBarProps extends Omit<MuiAppBarProps, 'title'> {
  container?: React.ElementType<any>;
  // @deprecated
  open?: boolean;
  title?: string | JSX.Element;
  userMenu?: JSX.Element | boolean;
}

const PREFIX = 'AppBar';

export const AppBarClasses = {
  appBar: `${PREFIX}-appBar`,
  toolbar: `${PREFIX}-toolbar`,
  menuButton: `${PREFIX}-menuButton`,
  menuButtonIconClosed: `${PREFIX}-menuButtonIconClosed`,
  menuButtonIconOpen: `${PREFIX}-menuButtonIconOpen`,
  title: `${PREFIX}-title`,
};

const StyledAppBar = styled(MuiAppBar, {
  name: PREFIX,
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  [`& .${AppBarClasses.toolbar}`]: {
    paddingRight: 24,
  },

  [`& .${AppBarClasses.menuButton}`]: {
    marginLeft: '0.2em',
    marginRight: '0.2em',
  },

  [`& .${AppBarClasses.title}`]: {
    flex: 1,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
}));
