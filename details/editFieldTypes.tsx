import { InferredElement, InferredTypeMap } from '@specfocus/view-focus/resources';
import { InputProps } from '@specfocus/view-focus/forms/useInput';
import { ReactElement, ReactNode } from 'react';
import { SimpleForm } from '../forms';
import {
  ArrayInput,
  BooleanInput,
  DateInput,
  NumberInput,
  ReferenceArrayInput,
  ReferenceArrayInputProps,
  ReferenceInput,
  ReferenceInputProps,
  SelectInput,
  SimpleFormIterator,
  TextInput
} from '../inputs';

export const editFieldTypes: InferredTypeMap = {
  form: {
    component: SimpleForm,
    representation: (
      _,
      children: InferredElement[]
    ) => `        <SimpleForm>
${children.map(child => `            ${child.getRepresentation()}`).join('\n')}
        </SimpleForm>`,
  },
  array: {
    // eslint-disable-next-line react/display-name
    component: ({
      children,
      ...props
    }: { children: ReactNode; } & InputProps) => (
      <ArrayInput {...props}>
        <SimpleFormIterator>{children}</SimpleFormIterator>
      </ArrayInput>
    ),
    representation: (props: InputProps, children: InferredElement[]) =>
      `<ArrayInput source="${props.source
      }"><SimpleFormIterator>${children
        .map(child => child.getRepresentation())
        .join('\n')}</SimpleFormIterator></ArrayInput>`,
  },
  boolean: {
    component: BooleanInput,
    representation: (props: InputProps) =>
      `<BooleanInput source="${props.source}" />`,
  },
  date: {
    component: DateInput,
    representation: (props: InputProps) =>
      `<DateInput source="${props.source}" />`,
  },
  email: {
    component: TextInput,
    representation: (props: InputProps) =>
      `<TextInput source="${props.source}" />`,
  },
  id: {
    component: TextInput,
    representation: (props: InputProps) =>
      `<TextInput source="${props.source}" />`,
  },
  number: {
    component: NumberInput,
    representation: (props: InputProps) =>
      `<NumberInput source="${props.source}" />`,
  },
  reference: {
    component: ReferenceInput,
    representation: (
      props: ReferenceInputProps,
      children: InferredElement
    ) =>
      `<ReferenceInput source="${props.source}" reference="${props.reference
      }">${children.getRepresentation()}</ReferenceInput>`,
  },
  referenceChild: {
    component: (props: { children: ReactNode; } & InputProps) => (
      <SelectInput optionText="id" {...props} />
    ), // eslint-disable-line react/display-name
    representation: () => `<SelectInput optionText="id" />`,
  },
  referenceArray: {
    component: ReferenceArrayInput,
    representation: (props: ReferenceArrayInputProps) =>
      `<ReferenceArrayInput source="${props.source}" reference="${props.reference}"><TextInput source="id" /></ReferenceArrayInput>`,
  },
  referenceArrayChild: {
    component: (
      props: { children: ReactNode; } & InputProps
    ): ReactElement => <SelectInput optionText="id" {...props} />, // eslint-disable-line react/display-name
    representation: () => `<SelectInput optionText="id" />`,
  },
  richText: {
    component: TextInput,
    representation: (props: InputProps) =>
      `<TextInput source="${props.source}" />`,
  },
  string: {
    component: TextInput,
    representation: (props: InputProps) =>
      `<TextInput source="${props.source}" />`,
  },
  url: {
    component: TextInput,
    representation: (props: InputProps) =>
      `<TextInput source="${props.source}" />`,
  },
};
