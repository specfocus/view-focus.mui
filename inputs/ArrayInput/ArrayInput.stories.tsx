import { Resource } from '@specfocus/view-focus/resources';
import { createMemoryHistory } from 'history';
import { BaseRoot } from '../../core/BaseRoot';
import { Edit } from '../../details';
import { SimpleForm } from '../../forms';
import { AutocompleteInput } from '../AutocompleteInput';
import { TextInput } from '../TextInput';
import { ArrayInput } from './ArrayInput';
import { SimpleFormIterator } from './SimpleFormIterator';

export default { title: 'view-focus.mui/inputs/ArrayInput' };

const dataProvider = {
  getOne: (resource, params) =>
    Promise.resolve({
      data: {
        id: 1,
        title: 'War and Peace',
        authors: [
          {
            name: 'Leo Tolstoy',
            role: 'head_writer',
          },
          {
            name: 'Alexander Pushkin',
            role: 'co_writer',
          },
        ],
      },
    }),
  update: (resource, params) => Promise.resolve(params),
} as any;

const history = createMemoryHistory({ initialEntries: ['/books/1'] });

const BookEdit = () => {
  return (
    <Edit
      mutationMode="pessimistic"
      mutationOptions={{
        onSuccess: data => {
          console.log(data);
        },
      }}
    >
      <SimpleForm>
        <ArrayInput source="authors" fullWidth>
          <SimpleFormIterator>
            <TextInput source="name" />
            <TextInput source="role" />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Edit>
  );
};

export const Basic = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" edit={BookEdit} />
  </BaseRoot>
);

const BookEditWithAutocomplete = () => {
  return (
    <Edit
      mutationMode="pessimistic"
      mutationOptions={{
        onSuccess: data => {
          console.log(data);
        },
      }}
    >
      <SimpleForm>
        <ArrayInput source="authors" fullWidth>
          <SimpleFormIterator>
            <AutocompleteInput
              source="role"
              choices={[
                { id: 'head_writer', name: 'Head Writer' },
                { id: 'co_writer', name: 'Co-Writer' },
              ]}
            />
            <TextInput source="name" />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Edit>
  );
};

export const AutocompleteFirst = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" edit={BookEditWithAutocomplete} />
  </BaseRoot>
);
