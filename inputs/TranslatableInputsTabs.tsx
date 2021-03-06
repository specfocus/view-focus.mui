import { AppBar, Tabs, TabsProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslatableContext } from '@specfocus/view-focus.i18n/translations/useTranslatableContext';
import { ReactElement } from 'react';
import { AppBarProps } from '../layouts';
import { TranslatableInputsTab } from './TranslatableInputsTab';

/**
 * Default locale selector for the TranslatableInputs component. Generates a tab for each specified locale.
 * @see TranslatableInputs
 */
export const TranslatableInputsTabs = (
  props: TranslatableInputsTabsProps & AppBarProps
): ReactElement => {
  const { groupKey, TabsProps: tabsProps } = props;
  const { locales, selectLocale, selectedLocale } = useTranslatableContext();

  const handleChange = (event, newLocale): void => {
    selectLocale(newLocale);
  };

  return (
    <StyledAppBar
      color="default"
      position="static"
      className={TranslatableInputsTabsClasses.root}
    >
      <Tabs
        value={selectedLocale}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        className={TranslatableInputsTabsClasses.tabs}
        {...tabsProps}
      >
        {locales.map(locale => (
          <TranslatableInputsTab
            key={locale}
            value={locale}
            locale={locale}
            groupKey={groupKey}
          />
        ))}
      </Tabs>
    </StyledAppBar>
  );
};

export interface TranslatableInputsTabsProps {
  groupKey?: string;
  TabsProps?: TabsProps;
}

const PREFIX = 'TranslatableInputsTabs';

export const TranslatableInputsTabsClasses = {
  root: `${PREFIX}-root`,
  tabs: `${PREFIX}-tabs`,
};

const StyledAppBar = styled(AppBar, { name: PREFIX })(({ theme }) => ({
  [`&.${TranslatableInputsTabsClasses.root}`]: {
    boxShadow: 'none',
    borderRadius: 0,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },

  [`& .${TranslatableInputsTabsClasses.tabs}`]: {
    minHeight: theme.spacing(3),
  },
}));
