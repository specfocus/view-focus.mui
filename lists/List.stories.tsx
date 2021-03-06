import { Box, Card, Stack, Typography } from '@mui/material';
import fakeRestDataProvider from '@specfocus/sham-focus.rest';
import { Resource } from '@specfocus/view-focus/resources';
import { useListContext } from '@specfocus/view-focus/lists/useListContext';
import { createMemoryHistory } from 'history';
import { BaseRoot } from '../core/BaseRoot';
import { TextField } from '../fields';
import { SearchInput, TextInput } from '../inputs';
import { Datagrid } from './datagrid';
import { List } from './List';

export default { title: 'view-focus.mui/list/List' };

const dataProvider = fakeRestDataProvider({
  books: [
    {
      id: 1,
      title: 'War and Peace',
      author: 'Leo Tolstoy',
      year: 1869,
    },
    {
      id: 2,
      title: 'Pride and Predjudice',
      author: 'Jane Austen',
      year: 1813,
    },
    {
      id: 3,
      title: 'The Picture of Dorian Gray',
      author: 'Oscar Wilde',
      year: 1890,
    },
    {
      id: 4,
      title: 'Le Petit Prince',
      author: 'Antoine de Saint-Exupéry',
      year: 1943,
    },
    {
      id: 5,
      title: "Alice's Adventures in Wonderland",
      author: 'Lewis Carroll',
      year: 1865,
    },
    {
      id: 6,
      title: 'Madame Bovary',
      author: 'Gustave Flaubert',
      year: 1856,
    },
    {
      id: 7,
      title: 'The Lord of the Rings',
      author: 'J. R. R. Tolkien',
      year: 1954,
    },
    {
      id: 8,
      title: "Harry Potter and the Philosopher's Stone",
      author: 'J. K. Rowling',
      year: 1997,
    },
    {
      id: 9,
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      year: 1988,
    },
    {
      id: 10,
      title: 'A Catcher in the Rye',
      author: 'J. D. Salinger',
      year: 1951,
    },
    {
      id: 11,
      title: 'Ulysses',
      author: 'James Joyce',
      year: 1922,
    },
  ],
  authors: [],
});

const history = createMemoryHistory({ initialEntries: ['/books'] });

const BookList = () => {
  const { data, isLoading } = useListContext();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Stack spacing={2} sx={{ padding: 2 }}>
      {data.map(book => (
        <Typography key={book.id}>
          <i>{book.title}</i>, by {book.author} ({book.year})
        </Typography>
      ))}
    </Stack>
  );
};

const BookListBasic = () => (
  <List>
    <BookList />
  </List>
);

export const Basic = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" list={BookListBasic} />
  </BaseRoot>
);

const BookListBasicWithCustomActions = () => (
  <List actions={<Box sx={{ backgroundColor: 'info.main' }}>Actions</Box>}>
    <BookList />
  </List>
);

export const Actions = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" list={BookListBasicWithCustomActions} />
  </BaseRoot>
);

const BookListWithFilters = () => (
  <List
    filters={[
      <SearchInput source="q" alwaysOn />,
      <TextInput source="title" />,
    ]}
  >
    <BookList />
  </List>
);

export const Filters = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" list={BookListWithFilters} />
  </BaseRoot>
);

const BookListWithPermanentFilter = () => (
  <List filter={{ id: 2 }}>
    <BookList />
  </List>
);

export const Filter = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" list={BookListWithPermanentFilter} />
  </BaseRoot>
);

const BookListWithCustomTitle = () => (
  <List title="Custom list title">
    <BookList />
  </List>
);

export const Title = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" list={BookListWithCustomTitle} />
  </BaseRoot>
);

const BookListWithCreate = () => (
  <List hasCreate={true}>
    <BookList />
  </List>
);

export const HasCreate = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" list={BookListWithCreate} />
  </BaseRoot>
);

const AsideComponent = () => <Card sx={{ padding: 2 }}>Aside</Card>;

const BookListWithAside = () => (
  <List aside={<AsideComponent />}>
    <BookList />
  </List>
);

export const Aside = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" list={BookListWithAside} />
  </BaseRoot>
);

const CustomWrapper = ({ children }) => (
  <Box
    sx={{ padding: 2, width: 200, border: 'solid 1px black' }}
    data-testid="custom-component"
  >
    {children}
  </Box>
);

const BookListWithCustomComponent = () => (
  <List component={CustomWrapper}>
    <BookList />
  </List>
);

export const Component = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" list={BookListWithCustomComponent} />
  </BaseRoot>
);

const EmptyAuthorList = () => (
  <List>
    <span />
  </List>
);
const CreateAuthor = () => <span />;

const historyAuthors = createMemoryHistory({ initialEntries: ['/authors'] });

export const Empty = () => (
  <BaseRoot dataProvider={dataProvider} history={historyAuthors}>
    <Resource name="authors" list={EmptyAuthorList} create={CreateAuthor} />
  </BaseRoot>
);

const BookListWithStyles = () => (
  <List
    sx={{
      backgroundColor: 'yellow',
      '& .RaList-content': {
        backgroundColor: 'red',
      },
    }}
  >
    <BookList />
  </List>
);

export const SX = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" list={BookListWithStyles} />
  </BaseRoot>
);

const BookListWithDatagrid = () => (
  <List filters={[<SearchInput source="q" alwaysOn />]}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="author" />
      <TextField source="year" />
    </Datagrid>
  </List>
);

export const Default = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" list={BookListWithDatagrid} />
  </BaseRoot>
);
