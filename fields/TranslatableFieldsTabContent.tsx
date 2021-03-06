import { styled } from '@mui/material/styles';
import { useTranslatableContext } from '@specfocus/view-focus.i18n/translations/useTranslatableContext';
import { Entity } from '@specfocus/spec-focus/entities/Entity';
import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode
} from 'react';
import { Labeled } from '../apps/Labeled';

/**
 * Default container for a group of translatable fields inside a TranslatableFields components.
 * @see TranslatableFields
 */
export const TranslatableFieldsTabContent = (
  props: TranslatableFieldsTabContentProps
): ReactElement => {
  const {
    children,
    groupKey = '',
    locale,
    record,
    resource,
    className,
    ...other
  } = props;
  const { selectedLocale, getLabel, getSource } = useTranslatableContext();

  return (
    <Root
      role="tabpanel"
      hidden={selectedLocale !== locale}
      id={`translatable-content-${groupKey}${locale}`}
      aria-labelledby={`translatable-header-${groupKey}${locale}`}
      className={className}
      {...other}
    >
      {Children.map(children, field =>
        field && isValidElement<any>(field) ? (
          <div key={field.props.source}>
            {field.props.addLabel ? (
              <Labeled
                resource={resource}
                label={field.props.label}
                source={field.props.source}
              >
                {cloneElement(field, {
                  ...field.props,
                  label: getLabel(field.props.source),
                  record,
                  source: getSource(
                    field.props.source,
                    locale
                  ),
                })}
              </Labeled>
            ) : typeof field === 'string' ? (
              field
            ) : (
              cloneElement(field, {
                ...field.props,
                label: getLabel(field.props.source),
                record,
                source: getSource(field.props.source, locale),
              })
            )}
          </div>
        ) : null
      )}
    </Root>
  );
};

export type TranslatableFieldsTabContentProps = {
  children: ReactNode;
  className?: string;
  formGroupKeyPrefix?: string;
  groupKey: string;
  locale: string;
  record: Entity;
  resource: string;
};

const PREFIX = 'TranslatableFieldsTabContent';

const Root = styled('div', {
  name: PREFIX,
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  borderRadius: 0,
  borderBottomLeftRadius: theme.shape.borderRadius,
  borderBottomRightRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  borderTop: 0,
}));
