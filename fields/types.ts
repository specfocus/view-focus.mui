import { ReactElement } from 'react';
import { Entity } from '@specfocus/spec-focus/entities/Entity';
import PropTypes from 'prop-types';
import { TableCellProps } from '@mui/material/TableCell';

type TextAlign = TableCellProps['align'];
type SortOrder = 'ASC' | 'DESC';

export interface FieldProps<RecordType extends Entity = any>
  extends PublicFieldProps,
  InjectedFieldProps<RecordType> { }

export interface PublicFieldProps {
  sortBy?: string;
  sortByOrder?: SortOrder;
  source?: string;
  label?: string | ReactElement | boolean;
  sortable?: boolean;
  className?: string;
  cellClassName?: string;
  headerClassName?: string;
  formClassName?: string;
  textAlign?: TextAlign;
  emptyText?: string;
  fullWidth?: boolean;
}

export interface InjectedFieldProps<RecordType = any> {
  record?: RecordType;
  resource?: string;
}

export const fieldPropTypes = {
  sortBy: PropTypes.string,
  sortByOrder: PropTypes.oneOf<SortOrder>(['ASC', 'DESC']),
  source: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.bool,
  ]),
  sortable: PropTypes.bool,
  className: PropTypes.string,
  cellClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  textAlign: PropTypes.oneOf<TextAlign>([
    'inherit',
    'left',
    'center',
    'right',
    'justify',
  ]),
  emptyText: PropTypes.string,
};
