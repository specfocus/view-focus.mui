import { Box, Card, Stack } from '@mui/material';
import { Resource } from '@specfocus/view-focus/resources';
import { useRecordContext } from '@specfocus/view-focus/records/useRecordContext';
import { createMemoryHistory } from 'history';
import { EditButton } from '../buttons';
import { BaseRoot } from '../core/BaseRoot';
import { Labeled } from '../core/Labeled';
import { TextField } from '../fields';
import TopToolbar from '../layouts/TopToolbar';
import { Show } from './Show';
import { SimpleShowLayout } from './SimpleShowLayout';

export default { title: 'view-focus.mui/details/Show' };

const dataProvider = {
  getOne: (resource, params) =>
    Promise.resolve({
      data: {
        id: 1,
        title: 'War and Peace',
        author: 'Leo Tolstoy',
        summary:
          "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
        year: 1869,
      },
    }),
} as any;

const history = createMemoryHistory({ initialEntries: ['/books/1/show'] });

const BookTitle = () => {
  const record = useRecordContext();
  return record ? <span>{record.title}</span> : null;
};

const PostShowBasic = () => (
  <Show>
    <BookTitle />
  </Show>
);

export const Basic = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" show={PostShowBasic} />
  </BaseRoot>
);

const PostShowWithFields = () => (
  <Show>
    <Stack spacing={2} sx={{ padding: 2 }}>
      <Labeled label="Title">
        <TextField source="title" />
      </Labeled>
      <Labeled label="Author">
        <TextField source="author" />
      </Labeled>
      <Labeled label="Summary">
        <TextField source="summary" />
      </Labeled>
      <Labeled label="Year">
        <TextField source="year" />
      </Labeled>
    </Stack>
  </Show>
);

export const WithFields = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" show={PostShowWithFields} />
  </BaseRoot>
);

const PostShowWithCustomActions = () => (
  <Show
    actions={
      <TopToolbar>
        <EditButton />
      </TopToolbar>
    }
  >
    <BookTitle />
  </Show>
);

export const Actions = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" show={PostShowWithCustomActions} />
  </BaseRoot>
);

const PostShowWithTitle = () => (
  <Show title="Hello">
    <BookTitle />
  </Show>
);

export const Title = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" show={PostShowWithTitle} />
  </BaseRoot>
);

const AsideComponent = () => <Card sx={{ padding: 2 }}>Aside</Card>;

const PostShowWithAside = () => (
  <Show aside={<AsideComponent />}>
    <BookTitle />
  </Show>
);

export const Aside = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" show={PostShowWithAside} />
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

const PostShowWithComponent = () => (
  <Show component={CustomWrapper}>
    <BookTitle />
  </Show>
);

export const Component = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" show={PostShowWithComponent} />
  </BaseRoot>
);

const PostShowWithStyles = () => (
  <Show
    sx={{
      padding: 2,
      border: '1px solid #333',
    }}
  >
    <BookTitle />
  </Show>
);

export const SX = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" show={PostShowWithStyles} />
  </BaseRoot>
);

const DefaultPostShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="title" />
      <TextField source="author" />
      <TextField source="summary" />
      <TextField source="year" />
    </SimpleShowLayout>
  </Show>
);

export const Default = () => (
  <BaseRoot dataProvider={dataProvider} history={history}>
    <Resource name="books" show={DefaultPostShow} edit={() => <span />} />
  </BaseRoot>
);
