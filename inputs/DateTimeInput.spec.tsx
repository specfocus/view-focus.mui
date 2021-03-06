import { testDataProvider } from '@specfocus/view-focus.data/providers/testDataProvider';
import { useFormState } from '@specfocus/view-focus.forms/forms/useFormState';
import { required } from '@specfocus/view-focus.forms/forms/validate';
import { BaseRootContext } from '@specfocus/view-focus/layouts/BaseRootContext';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { format } from 'date-fns';
import expect from 'expect';
import { SaveButton } from '../buttons';
import { SimpleForm, Toolbar } from '../forms';
import { ArrayInput, SimpleFormIterator } from './ArrayInput';
import { DateTimeInput } from './DateTimeInput';

describe('<DateTimeInput />', () => {
  const defaultProps = {
    resource: 'posts',
    source: 'publishedAt',
  };

  it('should render a date time input', () => {
    render(
      <BaseRootContext dataProvider={testDataProvider()}>
        <SimpleForm onSubmit={jest.fn()}>
          <DateTimeInput {...defaultProps} />
        </SimpleForm>
      </BaseRootContext>
    );
    const input = screen.getByLabelText(
      'resources.posts.fields.publishedAt'
    ) as HTMLInputElement;
    expect(input.type).toBe('datetime-local');
  });

  it('should not make the form dirty on initialization', () => {
    const publishedAt = new Date();
    const FormState = () => {
      const { isDirty } = useFormState();

      return <p>Dirty: {isDirty.toString()}</p>;
    };
    render(
      <BaseRootContext dataProvider={testDataProvider()}>
        <SimpleForm
          onSubmit={jest.fn()}
          record={{ id: 1, publishedAt: publishedAt.toISOString() }}
        >
          <DateTimeInput {...defaultProps} />
          <FormState />
        </SimpleForm>
      </BaseRootContext>
    );
    expect(
      screen.getByDisplayValue(format(publishedAt, "yyyy-MM-dd'T'HH:mm"))
    );
    expect(screen.queryByText('Dirty: false')).not.toBeNull();
  });

  it('should display a default value inside an ArrayInput', () => {
    const date = new Date('Wed Oct 05 2011 16:48:00 GMT+0200');
    const backlinksDefaultValue = [
      {
        date,
      },
    ];
    render(
      <BaseRootContext dataProvider={testDataProvider()}>
        <SimpleForm onSubmit={jest.fn()}>
          <ArrayInput
            defaultValue={backlinksDefaultValue}
            source="backlinks"
          >
            <SimpleFormIterator>
              <DateTimeInput source="date" />
            </SimpleFormIterator>
          </ArrayInput>
        </SimpleForm>
      </BaseRootContext>
    );

    expect(screen.getByDisplayValue(format(date, "yyyy-MM-dd'T'HH:mm")));
  });

  it('should submit the form default value with its timezone', async () => {
    const publishedAt = new Date('Wed Oct 05 2011 16:48:00 GMT+0200');
    const onSubmit = jest.fn();
    render(
      <BaseRootContext dataProvider={testDataProvider()}>
        <SimpleForm
          onSubmit={onSubmit}
          defaultValues={{ publishedAt }}
          toolbar={
            <Toolbar>
              <SaveButton alwaysEnable />
            </Toolbar>
          }
        >
          <DateTimeInput {...defaultProps} />
        </SimpleForm>
      </BaseRootContext>
    );
    expect(
      screen.queryByDisplayValue(
        format(publishedAt, "yyyy-MM-dd'T'HH:mm")
      )
    ).not.toBeNull();
    fireEvent.click(screen.getByLabelText('action.save'));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        publishedAt,
      });
    });
  });

  it('should submit the input default value with its timezone', async () => {
    const publishedAt = new Date('Wed Oct 05 2011 16:48:00 GMT+0200');
    const onSubmit = jest.fn();
    render(
      <BaseRootContext dataProvider={testDataProvider()}>
        <SimpleForm
          onSubmit={onSubmit}
          toolbar={
            <Toolbar>
              <SaveButton alwaysEnable />
            </Toolbar>
          }
        >
          <DateTimeInput
            {...defaultProps}
            defaultValue={publishedAt}
          />
        </SimpleForm>
      </BaseRootContext>
    );
    expect(
      screen.queryByDisplayValue(
        format(publishedAt, "yyyy-MM-dd'T'HH:mm")
      )
    ).not.toBeNull();
    fireEvent.click(screen.getByLabelText('action.save'));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        publishedAt,
      });
    });
  });

  describe('error message', () => {
    it('should not be displayed if field is pristine', () => {
      render(
        <BaseRootContext dataProvider={testDataProvider()}>
          <SimpleForm onSubmit={jest.fn()}>
            <DateTimeInput
              {...defaultProps}
              validate={required()}
            />
          </SimpleForm>
        </BaseRootContext>
      );
      expect(screen.queryByText('validation.required')).toBeNull();
    });

    it('should be displayed if field has been touched and is invalid', async () => {
      render(
        <BaseRootContext dataProvider={testDataProvider()}>
          <SimpleForm onSubmit={jest.fn()} mode="onBlur">
            <DateTimeInput
              {...defaultProps}
              validate={required()}
            />
          </SimpleForm>
        </BaseRootContext>
      );
      const input = screen.getByLabelText(
        'resources.posts.fields.publishedAt *'
      );
      fireEvent.blur(input);
      await waitFor(() => {
        expect(
          screen.queryByText('validation.required')
        ).not.toBeNull();
      });
    });

    it('should be displayed if field has been touched multiple times and is invalid', async () => {
      const onSubmit = jest.fn();
      render(
        <BaseRootContext dataProvider={testDataProvider()}>
          <SimpleForm onSubmit={onSubmit}>
            <DateTimeInput
              {...defaultProps}
              validate={required()}
            />
          </SimpleForm>
        </BaseRootContext>
      );
      const input = screen.getByLabelText(
        'resources.posts.fields.publishedAt *'
      );
      fireEvent.change(input, {
        target: { value: new Date().toISOString() },
      });
      fireEvent.blur(input);
      await waitFor(() => {
        expect(screen.queryByText('validation.required')).toBeNull();
      });
      fireEvent.change(input, {
        target: { value: '' },
      });
      fireEvent.blur(input);
      fireEvent.click(screen.getByText('action.save'));
      await waitFor(() => {
        expect(
          screen.queryByText('validation.required')
        ).not.toBeNull();
      });
    });
  });
});
