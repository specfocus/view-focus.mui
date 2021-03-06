import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import {
  BaseRootContext,
  ResourceContextProvider
} from '@specfocus/view-focus/resources';
import { createMemoryHistory } from 'history';
import { useState } from 'react';
import { ListContextProvider } from '@specfocus/view-focus/lists/ListContextProvider';
import { RecordContextProvider } from '@specfocus/view-focus/records/RecordContext';
import { TextField } from '.';
import { SimpleShowLayout } from '../details/SimpleShowLayout';
import { Datagrid } from '../lists/datagrid/Datagrid';
import { ReferenceOneField } from './ReferenceOneField';

export default { title: 'view-focus.mui/fields/ReferenceOneField' };

const defaultDataProvider = {
  getManyReference: () =>
    Promise.resolve({
      data: [{ id: 1, ISBN: '9780393966473', genre: 'novel' }],
      total: 1,
    }),
} as any;

const history = createMemoryHistory({ initialEntries: ['/books/1/show'] });

const Wrapper = ({ children, dataProvider = defaultDataProvider }) => (
  <BaseRootContext dataProvider={dataProvider} history={history}>
    <ResourceContextProvider value="books">
      <RecordContextProvider value={{ id: 1, title: 'War and Peace' }}>
        {children}
      </RecordContextProvider>
    </ResourceContextProvider>
  </BaseRootContext>
);

export const Basic = () => (
  <Wrapper>
    <ReferenceOneField reference="book_details" target="book_id">
      <TextField source="ISBN" />
    </ReferenceOneField>
  </Wrapper>
);

const slowDataProvider = {
  getManyReference: (resource, params) =>
    new Promise(resolve => {
      setTimeout(
        () =>
          resolve({
            data: [{ id: 1, ISBN: '9780393966473' }],
            total: 1,
          }),
        1500
      );
    }),
} as any;

export const Loading = () => (
  <Wrapper dataProvider={slowDataProvider}>
    <ReferenceOneField reference="book_details" target="book_id">
      <TextField source="ISBN" />
    </ReferenceOneField>
  </Wrapper>
);

const emptyDataProvider = {
  getManyReference: (resource, params) =>
    Promise.resolve({
      data: [],
      total: 0,
    }),
} as any;

export const Empty = () => (
  <Wrapper dataProvider={emptyDataProvider}>
    <ReferenceOneField
      reference="book_details"
      target="book_id"
      emptyText="no detail"
    >
      <TextField source="ISBN" />
    </ReferenceOneField>
  </Wrapper>
);

export const Link = () => (
  <Wrapper>
    <ReferenceOneField
      reference="book_details"
      target="book_id"
      link="show"
    >
      <TextField source="ISBN" />
    </ReferenceOneField>
  </Wrapper>
);

export const Multiple = () => {
  const [calls, setCalls] = useState([]);
  const dataProviderWithLogging = {
    getManyReference: (resource, params) => {
      setCalls(calls =>
        calls.concat({ type: 'getManyReference', resource, params })
      );
      return Promise.resolve({
        data: [
          {
            id: 1,
            ISBN: '9780393966473',
            genre: 'novel',
          },
        ],
        total: 1,
      });
    },
  } as any;
  return (
    <Wrapper dataProvider={dataProviderWithLogging}>
      <div style={{ display: 'flex', paddingLeft: '1em' }}>
        <div>
          <h3>Title</h3>
          <TextField source="title" />
          <h3>ISBN</h3>
          <ReferenceOneField
            reference="book_details"
            target="book_id"
          >
            <TextField source="ISBN" />
          </ReferenceOneField>
          <h3>Genre</h3>
          <ReferenceOneField
            reference="book_details"
            target="book_id"
          >
            <TextField source="genre" />
          </ReferenceOneField>
        </div>
        <div style={{ color: '#ccc', paddingLeft: '2em' }}>
          <p>Number of calls: {calls.length}</p>
          <pre>{JSON.stringify(calls, null, 2)}</pre>
        </div>
      </div>
    </Wrapper>
  );
};

export const InShowLayout = () => (
  <Wrapper>
    <SimpleShowLayout>
      <TextField source="title" />
      <ReferenceOneField
        label="ISBN"
        reference="book_details"
        target="book_id"
      >
        <TextField source="ISBN" />
      </ReferenceOneField>
    </SimpleShowLayout>
  </Wrapper>
);

const ListWrapper = ({ children }) => (
  <ThemeProvider theme={createTheme()}>
    <Wrapper>
      <ListContextProvider
        value={{
          total: 1,
          data: [{ id: 1, title: 'War and Peace' }],
          sort: { field: 'title', order: 'ASC' },
        }}
      >
        {children}
      </ListContextProvider>
    </Wrapper>
  </ThemeProvider>
);

export const InDatagrid = () => (
  <ListWrapper>
    <Datagrid>
      <TextField source="title" />
      <ReferenceOneField
        label="ISBN"
        reference="book_details"
        target="book_id"
      >
        <TextField source="ISBN" />
      </ReferenceOneField>
    </Datagrid>
  </ListWrapper>
);
