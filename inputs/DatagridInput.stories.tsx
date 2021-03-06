import { Resource } from '@specfocus/view-focus/resources';
import { createMemoryHistory } from 'history';
import { BaseRoot } from '../core/BaseRoot';
import { Edit } from '../details';
import { TextField } from '../fields';
import { SimpleForm } from '../forms';
import { DatagridInput } from './DatagridInput';
import { ReferenceArrayInput } from './ReferenceArrayInput';

export default { title: 'view-focus.mui/inputs/DatagridInput' };

const dataProvider = {
  getOne: (resource, params) =>
    Promise.resolve({
      data: {
        id: 1,
        title: 'War and Peace',
        author: [1, 2],
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
        <DatagridInput
          source="author"
          choices={choices}
          fullWidth
          rowClick="toggleSelection"
        >
          <TextField source="name" />
        </DatagridInput>
      </SimpleForm>
    </Edit>
  );
};

export const Basic = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" edit={BookEdit} />
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
        author: [1, 2],
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
      <ReferenceArrayInput reference="authors" source="author" fullWidth>
        <DatagridInput rowClick="toggleSelection">
          <TextField source="name" />
        </DatagridInput>
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
);

export const InsideReferenceInput = () => (
  <BaseRoot dataProvider={dataProviderWithAuthors} history={history}>
    <Resource name="authors" />
    <Resource name="books" edit={BookEditWithReference} />
  </BaseRoot>
);
