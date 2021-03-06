import {
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel
} from '@mui/material';
import { Entity } from '@specfocus/spec-focus/entities/Entity';
import {
  composeSyncValidators,
  useFormContext,
  useGetValidationErrorMessage
} from '@specfocus/view-focus.forms/forms';
import { useApplyInputDefaultValues } from '@specfocus/view-focus/forms';
import isRequired from '@specfocus/view-focus.forms/forms/isRequired';
import { useFieldArray } from '@specfocus/view-focus.forms/fields/useFieldArray';
import { useWatch } from '@specfocus/view-focus.forms/forms/useWatch';
import { FieldTitle } from '@specfocus/view-focus/utils/FieldTitle';
import clsx from 'clsx';
import isEqual from 'lodash/isEqual';
import { Children, cloneElement, ReactElement, useEffect, useRef } from 'react';
import { Labeled } from '../../apps/Labeled';
import { LinearProgress } from '../../layouts';
import { CommonInputProps } from '../CommonInputProps';
import { InputHelperText } from '../InputHelperText';
import { sanitizeInputRestProps } from '../sanitizeInputRestProps';
import { ArrayInputContext } from './ArrayInputContext';

/**
 * To edit arrays of data embedded inside a record, <ArrayInput> creates a list of sub-forms.
 *
 *  @example
 *
 *      import { ArrayInput, SimpleFormIterator, DateInput, TextInput } from '@specfocus/view-focus.mui-demo';
 *
 *      <ArrayInput source="backlinks">
 *          <SimpleFormIterator>
 *              <DateInput source="date" />
 *              <TextInput source="url" />
 *          </SimpleFormIterator>
 *      </ArrayInput>
 *
 * <ArrayInput> allows the edition of embedded arrays, like the backlinks field
 * in the following post record:
 *
 * {
 *   id: 123
 *   backlinks: [
 *         {
 *             date: '2012-08-10T00:00:00.000Z',
 *             url: 'http://example.com/foo/bar.html',
 *         },
 *         {
 *             date: '2012-08-14T00:00:00.000Z',
 *             url: 'https://blog.johndoe.com/2012/08/12/foobar.html',
 *         }
 *    ]
 * }
 *
 * <ArrayInput> expects a single child, which must be a *form iterator* component.
 * A form iterator is a component accepting a fields object as passed by
 * @specfocus/view-focus.forms-arrays's useFieldArray() hook, and defining a layout for
 * an array of fields. For instance, the <SimpleFormIterator> component
 * displays an array of fields in an unordered list (<ul>), one sub-form by
 * list item (<li>). It also provides controls for adding and removing
 * a sub-record (a backlink in this example).
 *
 * @see {@link https://@specfocus/view-focus.forms.com/api/usefieldarray}
 */
export const ArrayInput = (props: ArrayInputProps) => {
  const {
    className,
    defaultValue,
    label,
    isFetching,
    isLoading,
    children,
    helperText,
    record,
    resource: resourceFromProps,
    source,
    validate,
    variant,
    disabled,
    margin = 'dense',
    ...rest
  } = props;
  const sanitizedValidate = Array.isArray(validate)
    ? composeSyncValidators(validate)
    : validate;
  const getValidationErrorMessage = useGetValidationErrorMessage();

  const fieldProps = useFieldArray({
    name: source,
  });

  const {
    getFieldState,
    clearErrors,
    formState,
    getValues,
    register,
    setError,
    unregister,
  } = useFormContext();

  const { isSubmitted } = formState;

  // We need to register the array itself as a field to enable validation at its level
  useEffect(() => {
    register(source);

    return () => {
      unregister(source, { keepValue: true });
    };
  }, [register, unregister, source]);

  useApplyInputDefaultValues(props);

  const value = useWatch({ name: source });
  const { isDirty, invalid, error } = getFieldState(source, formState);

  // As @specfocus/view-focus.forms does not handle validation on the array itself,
  // we need to do it manually
  const errorRef = useRef(null);
  useEffect(() => {
    const applyValidation = async () => {
      const newError = await sanitizedValidate(value, getValues(), props);
      if (newError && !isEqual(errorRef.current, newError)) {
        errorRef.current = newError;
        setError(source, {
          type: 'manual',
          message: getValidationErrorMessage(newError),
        });
      }

      if (!newError && error) {
        errorRef.current = null;
        clearErrors(source);
      }
    };

    if (sanitizedValidate) {
      applyValidation();
    }
  }, [
    clearErrors,
    error,
    sanitizedValidate,
    value,
    getValues,
    props,
    setError,
    source,
    getValidationErrorMessage,
  ]);

  if (isLoading) {
    return (
      <Labeled label={label} className={className}>
        <LinearProgress />
      </Labeled>
    );
  }

  return (
    <FormControl
      fullWidth
      margin="normal"
      className={clsx('input', `ra-input-${source}`, className)}
      error={(isDirty || isSubmitted) && invalid}
      {...sanitizeInputRestProps(rest)}
    >
      <InputLabel
        htmlFor={source}
        shrink
        error={(isDirty || isSubmitted) && invalid}
      >
        <FieldTitle
          label={label}
          source={source}
          resource={resourceFromProps}
          isRequired={isRequired(validate)}
        />
      </InputLabel>
      <ArrayInputContext.Provider value={fieldProps}>
        {cloneElement(Children.only(children), {
          ...fieldProps,
          record,
          resource: resourceFromProps,
          source,
          variant,
          margin,
          disabled,
        })}
      </ArrayInputContext.Provider>
      {!!((isDirty || isSubmitted) && invalid) || helperText ? (
        <FormHelperText error={(isDirty || isSubmitted) && invalid}>
          <InputHelperText
            touched={isDirty || isSubmitted}
            error={error?.message}
            helperText={helperText}
          />
        </FormHelperText>
      ) : null}
    </FormControl>
  );
};

ArrayInput.defaultProps = {
  options: {},
  fullWidth: true,
};

export const getArrayInputError = error => {
  if (Array.isArray(error)) {
    return undefined;
  }
  return error;
};

export interface ArrayInputProps
  extends CommonInputProps,
  Omit<FormControlProps, 'children' | 'defaultValue' | 'onBlur' | 'onChange'> {
  className?: string;
  children: ReactElement;
  disabled?: boolean;
  isFetching?: boolean;
  isLoading?: boolean;
  record?: Partial<Entity>;
}