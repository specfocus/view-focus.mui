import React from 'react';
import expect from 'expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  testDataProvider,
  TestTranslationProvider,
  useRecordContext,
} from '@specfocus/view-focus/resources';

import { BaseRootContext } from '@specfocus/view-focus/layouts/BaseRootContext';
import { SimpleForm } from '../forms';
import { RadioButtonGroupInput } from './RadioButtonGroupInput';

describe('<RadioButtonGroupInput />', () => {
  const defaultProps = {
    resource: 'creditcards',
    source: 'type',
    choices: [
      { id: 'visa', name: 'VISA' },
      { id: 'mastercard', name: 'Mastercard' },
    ],
  };

  it('should render choices as radio inputs', () => {
    render(
      <BaseRootContext dataProvider={testDataProvider()}>
        <SimpleForm
          defaultValues={{ type: 'visa' }}
          onSubmit={jest.fn()}
        >
          <RadioButtonGroupInput
            {...defaultProps}
            label="Credit card"
          />
        </SimpleForm>
      </BaseRootContext>
    );
    expect(screen.queryByText('Credit card')).not.toBeNull();
    const input1 = screen.getByLabelText('VISA') as HTMLInputElement;
    expect(input1.type).toBe('radio');
    expect(input1.name).toBe('type');
    expect(input1.checked).toEqual(true);
    const input2 = screen.getByLabelText('Mastercard') as HTMLInputElement;
    expect(input2.type).toBe('radio');
    expect(input2.name).toBe('type');
    expect(input2.checked).toBeFalsy();
  });

  it('should set labels correctly for react component choices', () => {
    const FullNameField = ({ record }) => (
      <span>
        {record.first_name} {record.last_name}
      </span>
    );

    render(
      <BaseRootContext dataProvider={testDataProvider()}>
        <SimpleForm
          defaultValues={{ type: 'visa' }}
          onSubmit={jest.fn()}
        >
          <RadioButtonGroupInput
            resource={'people'}
            source="type"
            choices={[
              {
                id: 123,
                first_name: 'Leo',
                last_name: 'Tolstoi',
              },
              {
                id: 456,
                first_name: 'Jane',
                last_name: 'Austen',
              },
            ]}
            optionText={record => <FullNameField record={record} />}
            label="People"
          />
        </SimpleForm>
      </BaseRootContext>
    );
    expect(screen.queryByText('People')).not.toBeNull();
    const input1 = screen.getByLabelText('Leo Tolstoi');
    expect(input1.id).toBe('type_123');
    const input2 = screen.getByLabelText('Jane Austen');
    expect(input2.id).toBe('type_456');
  });

  it('should trigger custom onChange when clicking radio button', async () => {
    const onChange = jest.fn();
    render(
      <BaseRootContext dataProvider={testDataProvider()}>
        <SimpleForm
          defaultValues={{ type: 'visa' }}
          onSubmit={jest.fn()}
        >
          <RadioButtonGroupInput
            {...defaultProps}
            label="Credit card"
            onChange={onChange}
          />
        </SimpleForm>
      </BaseRootContext>
    );
    expect(screen.queryByText('Credit card')).not.toBeNull();

    const input2 = screen.getByLabelText('Mastercard') as HTMLInputElement;
    fireEvent.click(input2);
    await waitFor(() => {
      expect(onChange).toBeCalledWith(expect.anything(), 'mastercard');
    });

    const input1 = screen.getByLabelText('VISA') as HTMLInputElement;
    fireEvent.click(input1);
    await waitFor(() => {
      expect(onChange).toBeCalledWith(expect.anything(), 'visa');
    });
  });

  it('should use the value provided by the form default values', () => {
    render(
      <BaseRootContext dataProvider={testDataProvider()}>
        <SimpleForm
          onSubmit={jest.fn()}
          defaultValues={{ type: 'mastercard' }}
        >
          <RadioButtonGroupInput {...defaultProps} />
        </SimpleForm>
      </BaseRootContext>
    );
    expect(
      (screen.getByLabelText('VISA') as HTMLInputElement).checked
    ).toBeFalsy();
    expect(
      (screen.getByLabelText('Mastercard') as HTMLInputElement).checked
    ).toBeTruthy();
  });

  it('should work correctly when ids are numbers', () => {
    const choices = [
      { id: 1, name: 'VISA' },
      { id: 2, name: 'Mastercard' },
    ];
    render(
      <BaseRootContext dataProvider={testDataProvider()}>
        <SimpleForm onSubmit={jest.fn()} defaultValues={{ type: 1 }}>
          <RadioButtonGroupInput
            {...defaultProps}
            choices={choices}
          />
        </SimpleForm>
      </BaseRootContext>
    );
    const input = screen.getByLabelText('Mastercard') as HTMLInputElement;
    expect(input.checked).toBe(false);
    fireEvent.click(input);
    expect(input.checked).toBe(true);
  });

  it('should use optionValue as value identifier', () => {
    render(
      <BaseRootContext dataProvider={testDataProvider()}>
        <SimpleForm defaultValues={{ type: 'mc' }} onSubmit={jest.fn()}>
          <RadioButtonGroupInput
            {...defaultProps}
            optionValue="short"
            choices={[{ short: 'mc', name: 'Mastercard' }]}
          />
        </SimpleForm>
      </BaseRootContext>
    );
    expect(
      (screen.getByLabelText('Mastercard') as HTMLInputElement).value
    ).toBe('mc');
  });

  it('should use optionValue including "." as value identifier', () => {
    render(
      <BaseRootContext dataProvider={testDataProvider()}>
        <SimpleForm defaultValues={{ type: 'mc' }} onSubmit={jest.fn()}>
          <RadioButtonGroupInput
            {...defaultProps}
            optionValue="details.id"
            choices={[
              { details: { id: 'mc' }, name: 'Mastercard' },
            ]}
          />
        </SimpleForm>
      </BaseRootContext>
    );
    expect(
      (screen.getByLabelText('Mastercard') as HTMLInputElement).value
    ).toBe('mc');
  });

  it('should use optionText with a string value as text identifier', () => {
    render(
      <BaseRootContext dataProvider={testDataProvider()}>
        <SimpleForm defaultValues={{ type: 'mc' }} onSubmit={jest.fn()}>
          <RadioButtonGroupInput
            {...defaultProps}
            optionText="longname"
            choices={[{ id: 'mc', longname: 'Mastercard' }]}
          />
        </SimpleForm>
      </BaseRootContext>
    );
    expect(screen.queryByText('Mastercard')).not.toBeNull();
  });

  it('should use optionText with a string value including "." as text identifier', () => {
    render(
      <BaseRootContext dataProvider={testDataProvider()}>
        <SimpleForm defaultValues={{ type: 'mc' }} onSubmit={jest.fn()}>
          <RadioButtonGroupInput
            {...defaultProps}
            optionText="details.name"
            choices={[
              { id: 'mc', details: { name: 'Mastercard' } },
            ]}
          />
        </SimpleForm>
      </BaseRootContext>
    );
    expect(screen.queryByText('Mastercard')).not.toBeNull();
  });

  it('should use optionText with a function value as text identifier', () => {
    render(
      <BaseRootContext dataProvider={testDataProvider()}>
        <SimpleForm defaultValues={{ type: 'mc' }} onSubmit={jest.fn()}>
          <RadioButtonGroupInput
            {...defaultProps}
            optionText={choice => choice.longname}
            choices={[{ id: 'mc', longname: 'Mastercard' }]}
          />
        </SimpleForm>
      </BaseRootContext>
    );
    expect(screen.queryByText('Mastercard')).not.toBeNull();
  });

  it('should use optionText with an element value as text identifier', () => {
    const Foobar = () => {
      const record = useRecordContext();
      return <span data-testid="label">{record.longname}</span>;
    };
    render(
      <BaseRootContext dataProvider={testDataProvider()}>
        <SimpleForm defaultValues={{ type: 'mc' }} onSubmit={jest.fn()}>
          <RadioButtonGroupInput
            {...defaultProps}
            optionText={<Foobar />}
            choices={[{ id: 'mc', longname: 'Mastercard' }]}
          />
        </SimpleForm>
      </BaseRootContext>
    );
    expect(screen.queryByText('Mastercard')).not.toBeNull();
  });

  it('should translate the choices by default', () => {
    render(
      <BaseRootContext dataProvider={testDataProvider()}>
        <TestTranslationProvider translate={x => `**${x}**`}>
          <SimpleForm
            defaultValues={{ type: 'mc' }}
            onSubmit={jest.fn()}
          >
            <RadioButtonGroupInput
              {...defaultProps}
              choices={[{ id: 'mc', name: 'Mastercard' }]}
            />
          </SimpleForm>
        </TestTranslationProvider>
      </BaseRootContext>
    );
    expect(screen.queryByText('**Mastercard**')).not.toBeNull();
  });

  it('should not translate the choices if translateChoice is false', () => {
    render(
      <BaseRootContext dataProvider={testDataProvider()}>
        <TestTranslationProvider translate={x => `**${x}**`}>
          <SimpleForm
            defaultValues={{ type: 'mc' }}
            onSubmit={jest.fn()}
          >
            <RadioButtonGroupInput
              {...defaultProps}
              choices={[{ id: 'mc', name: 'Mastercard' }]}
              translateChoice={false}
            />
          </SimpleForm>
        </TestTranslationProvider>
      </BaseRootContext>
    );
    expect(screen.queryByText('**Mastercard**')).toBeNull();
    expect(screen.queryByText('Mastercard')).not.toBeNull();
  });

  it('should display helperText if prop is present in meta', () => {
    render(
      <BaseRootContext dataProvider={testDataProvider()}>
        <SimpleForm
          defaultValues={{ type: 'visa' }}
          onSubmit={jest.fn()}
        >
          <RadioButtonGroupInput
            {...defaultProps}
            helperText="Can I help you?"
          />
        </SimpleForm>
      </BaseRootContext>
    );
    expect(screen.queryByText('Can I help you?')).not.toBeNull();
  });

  describe('error message', () => {
    it('should not be displayed if field is pristine', () => {
      // This validator always returns an error
      const validate = () => 'validation.error';

      render(
        <BaseRootContext dataProvider={testDataProvider()}>
          <SimpleForm
            defaultValues={{ type: 'visa' }}
            onSubmit={jest.fn()}
            mode="onBlur"
          >
            <RadioButtonGroupInput
              {...defaultProps}
              validate={validate}
            />
          </SimpleForm>
        </BaseRootContext>
      );
      expect(screen.queryByText('validation.required')).toBeNull();
    });

    it('should be displayed if field has been touched and is invalid', async () => {
      // This validator always returns an error
      const validate = () => 'validation.error';

      render(
        <BaseRootContext dataProvider={testDataProvider()}>
          <SimpleForm
            defaultValues={{ type: 'visa' }}
            onSubmit={jest.fn()}
            mode="onBlur"
          >
            <RadioButtonGroupInput
              {...defaultProps}
              validate={validate}
            />
          </SimpleForm>
        </BaseRootContext>
      );

      const input = screen.getByLabelText(
        'Mastercard'
      ) as HTMLInputElement;
      fireEvent.click(input);
      expect(input.checked).toBe(true);

      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.getByText('validation.error')).not.toBeNull();
      });
    });

    it('should be displayed even with a helper Text', async () => {
      // This validator always returns an error
      const validate = () => 'validation.error';

      render(
        <BaseRootContext dataProvider={testDataProvider()}>
          <SimpleForm
            defaultValues={{ type: 'visa' }}
            onSubmit={jest.fn()}
            mode="onBlur"
          >
            <RadioButtonGroupInput
              {...defaultProps}
              validate={validate}
              helperText="Can I help you?"
            />
          </SimpleForm>
        </BaseRootContext>
      );
      const input = screen.getByLabelText(
        'Mastercard'
      ) as HTMLInputElement;
      fireEvent.click(input);
      expect(input.checked).toBe(true);

      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.getByText('validation.error')).not.toBeNull();
      });
      expect(screen.queryByText('Can I help you?')).toBeNull();
    });
  });

  it('should not render a LinearProgress if isLoading is true and a second has not passed yet', () => {
    render(
      <BaseRootContext dataProvider={testDataProvider()}>
        <SimpleForm
          defaultValues={{ type: 'visa' }}
          onSubmit={jest.fn()}
        >
          <RadioButtonGroupInput {...defaultProps} isLoading />
        </SimpleForm>
      </BaseRootContext>
    );

    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  it('should render a LinearProgress if isLoading is true and a second has passed', async () => {
    render(
      <BaseRootContext dataProvider={testDataProvider()}>
        <SimpleForm
          defaultValues={{ type: 'visa' }}
          onSubmit={jest.fn()}
        >
          <RadioButtonGroupInput {...defaultProps} isLoading />
        </SimpleForm>
      </BaseRootContext>
    );

    await new Promise(resolve => setTimeout(resolve, 1001));

    expect(screen.queryByRole('progressbar')).not.toBeNull();
  });

  it('should not render a LinearProgress if isLoading is false', () => {
    render(
      <BaseRootContext dataProvider={testDataProvider()}>
        <SimpleForm
          defaultValues={{ type: 'visa' }}
          onSubmit={jest.fn()}
        >
          <RadioButtonGroupInput {...defaultProps} />
        </SimpleForm>
      </BaseRootContext>
    );

    expect(screen.queryByRole('progressbar')).toBeNull();
  });
});
