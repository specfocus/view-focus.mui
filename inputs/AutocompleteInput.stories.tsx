import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  TextField
} from '@mui/material';
import { Resource } from '@specfocus/view-focus/resources';
import { useCreate } from '@specfocus/view-focus.data/operations/create/useCreate';
import { required } from '@specfocus/view-focus.forms/forms/validate';
import { useRecordContext } from '@specfocus/view-focus/records/useRecordContext';
import { createMemoryHistory } from 'history';
import React from 'react';
import { BaseRoot } from '../core/BaseRoot';
import { Edit } from '../details';
import { SimpleForm } from '../forms';
import { AutocompleteInput } from './AutocompleteInput';
import { ReferenceInput } from './ReferenceInput';
import { useCreateSuggestionContext } from './useSupportCreateSuggestion';

export default { title: 'view-focus.mui/inputs/AutocompleteInput' };

const dataProvider = {
  getOne: (resource, params) =>
    Promise.resolve({
      data: {
        id: 1,
        title: 'War and Peace',
        author: 1,
        summary:
          "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
        year: 1869,
      },
    }),
  update: (resource, params) => Promise.resolve(params),
} as any;

const history = createMemoryHistory({ initialEntries: ['/books/1'] });

const BookEdit = () => {
  const choices = [
    { id: 1, name: 'Leo Tolstoy' },
    { id: 2, name: 'Victor Hugo' },
    { id: 3, name: 'William Shakespeare' },
    { id: 4, name: 'Charles Baudelaire' },
    { id: 5, name: 'Marcel Proust' },
  ];
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
        <AutocompleteInput
          source="author"
          choices={choices}
          validate={required()}
          fullWidth
        />
      </SimpleForm>
    </Edit>
  );
};

export const Basic = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" edit={BookEdit} />
  </BaseRoot>
);

const BookEditCustomText = () => {
  const choices = [
    { id: 1, fullName: 'Leo Tolstoy' },
    { id: 2, fullName: 'Victor Hugo' },
    { id: 3, fullName: 'William Shakespeare' },
    { id: 4, fullName: 'Charles Baudelaire' },
    { id: 5, fullName: 'Marcel Proust' },
  ];
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
        <AutocompleteInput
          source="author"
          optionText="fullName"
          choices={choices}
          fullWidth
        />
      </SimpleForm>
    </Edit>
  );
};

export const CustomText = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" edit={BookEditCustomText} />
  </BaseRoot>
);

const BookEditCustomTextFunction = () => {
  const choices = [
    { id: 1, fullName: 'Leo Tolstoy' },
    { id: 2, fullName: 'Victor Hugo' },
    { id: 3, fullName: 'William Shakespeare' },
    { id: 4, fullName: 'Charles Baudelaire' },
    { id: 5, fullName: 'Marcel Proust' },
  ];
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
        <AutocompleteInput
          source="author"
          optionText={choice => choice?.fullName}
          choices={choices}
          fullWidth
        />
      </SimpleForm>
    </Edit>
  );
};

export const CustomTextFunction = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" edit={BookEditCustomTextFunction} />
  </BaseRoot>
);

const CustomOption = props => {
  const record = useRecordContext();

  return (
    <div {...props}>
      {record?.fullName}&nbsp;<i>({record?.language})</i>
    </div>
  );
};

const BookEditCustomOptions = () => {
  const choices = [
    { id: 1, fullName: 'Leo Tolstoy', language: 'Russian' },
    { id: 2, fullName: 'Victor Hugo', language: 'French' },
    { id: 3, fullName: 'William Shakespeare', language: 'English' },
    { id: 4, fullName: 'Charles Baudelaire', language: 'French' },
    { id: 5, fullName: 'Marcel Proust', language: 'French' },
  ];
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
        <AutocompleteInput
          fullWidth
          source="author"
          optionText={<CustomOption />}
          inputText={record => record.fullName}
          matchSuggestion={(searchText, record) => {
            const searchTextLower = searchText.toLowerCase();
            const match =
              record.fullName
                .toLowerCase()
                .includes(searchTextLower) ||
              record.language
                .toLowerCase()
                .includes(searchTextLower);

            return match;
          }}
          choices={choices}
        />
      </SimpleForm>
    </Edit>
  );
};

export const CustomOptions = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" edit={BookEditCustomOptions} />
  </BaseRoot>
);

const choicesForCreationSupport = [
  { id: 1, name: 'Leo Tolstoy' },
  { id: 2, name: 'Victor Hugo' },
  { id: 3, name: 'William Shakespeare' },
  { id: 4, name: 'Charles Baudelaire' },
  { id: 5, name: 'Marcel Proust' },
];
const BookEditWithCreationSupport = () => (
  <Edit
    mutationMode="pessimistic"
    mutationOptions={{
      onSuccess: data => {
        console.log(data);
      },
    }}
  >
    <SimpleForm>
      <AutocompleteInput
        source="author"
        choices={choicesForCreationSupport}
        onCreate={filter => {
          const newAuthorName = window.prompt(
            'Enter a new author',
            filter
          );

          if (newAuthorName) {
            const newAuthor = {
              id: choicesForCreationSupport.length + 1,
              name: newAuthorName,
            };
            choicesForCreationSupport.push(newAuthor);
            return newAuthor;
          }
        }}
        fullWidth
      />
    </SimpleForm>
  </Edit>
);

export const CreationSupport = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" edit={BookEditWithCreationSupport} />
  </BaseRoot>
);

const authors = [
  { id: 1, name: 'Leo Tolstoy', language: 'Russian' },
  { id: 2, name: 'Victor Hugo', language: 'French' },
  { id: 3, name: 'William Shakespeare', language: 'English' },
  { id: 4, name: 'Charles Baudelaire', language: 'French' },
  { id: 5, name: 'Marcel Proust', language: 'French' },
];

const dataProviderWithAuthors = {
  getOne: (resource, params) =>
    Promise.resolve({
      data: {
        id: 1,
        title: 'War and Peace',
        author: 1,
        summary:
          "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
        year: 1869,
      },
    }),
  getMany: (resource, params) =>
    Promise.resolve({
      data: authors.filter(author => params.ids.includes(author.id)),
    }),
  getList: (resource, params) =>
    new Promise(resolve => {
      // eslint-disable-next-line eqeqeq
      if (params.filter.q == undefined) {
        setTimeout(
          () =>
            resolve({
              data: authors,
              total: authors.length,
            }),
          500
        );
        return;
      }

      const filteredAuthors = authors.filter(author =>
        author.name
          .toLowerCase()
          .includes(params.filter.q.toLowerCase())
      );

      setTimeout(
        () =>
          resolve({
            data: filteredAuthors,
            total: filteredAuthors.length,
          }),
        500
      );
    }),
  update: (resource, params) => Promise.resolve(params),
  create: (resource, params) => {
    const newAuthor = {
      id: authors.length + 1,
      name: params.data.name,
      language: params.data.language,
    };
    authors.push(newAuthor);
    return Promise.resolve({ data: newAuthor });
  },
} as any;

const BookEditWithReference = () => (
  <Edit
    mutationMode="pessimistic"
    mutationOptions={{
      onSuccess: data => {
        console.log(data);
      },
    }}
  >
    <SimpleForm>
      <ReferenceInput reference="authors" source="author">
        <AutocompleteInput fullWidth />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export const InsideReferenceInput = () => (
  <BaseRoot dataProvider={dataProviderWithAuthors} history={history}>
    <Resource name="authors" />
    <Resource name="books" edit={BookEditWithReference} />
  </BaseRoot>
);

const CreateAuthor = () => {
  const { filter, onCancel, onCreate } = useCreateSuggestionContext();
  const [name, setName] = React.useState(filter || '');
  const [language, setLanguage] = React.useState('');
  const [create] = useCreate();

  const handleSubmit = event => {
    event.preventDefault();
    create(
      'authors',
      {
        data: {
          name,
          language,
        },
      },
      {
        onSuccess: ({ data }) => {
          setName('');
          setLanguage('');
          onCreate(data);
        },
      }
    );
  };

  return (
    <Dialog open onClose={onCancel}>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack gap={4}>
            <TextField
              name="name"
              label="The author name"
              value={name}
              onChange={event => setName(event.target.value)}
              autoFocus
            />
            <TextField
              name="language"
              label="The author language"
              value={language}
              onChange={event => setLanguage(event.target.value)}
              autoFocus
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="submit">Save</Button>
          <Button onClick={onCancel}>Cancel</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const BookEditWithReferenceAndCreationSupport = () => (
  <Edit
    mutationMode="pessimistic"
    mutationOptions={{
      onSuccess: data => {
        console.log(data);
      },
    }}
  >
    <SimpleForm>
      <ReferenceInput reference="authors" source="author">
        <AutocompleteInput create={<CreateAuthor />} fullWidth />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export const InsideReferenceInputWithCreationSupport = () => (
  <BaseRoot dataProvider={dataProviderWithAuthors} history={history}>
    <Resource name="authors" />
    <Resource name="books" edit={BookEditWithReferenceAndCreationSupport} />
  </BaseRoot>
);
