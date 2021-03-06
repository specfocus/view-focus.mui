import { testDataProvider } from '@specfocus/view-focus.data/providers/testDataProvider';
import { BaseRootContext } from '@specfocus/view-focus/layouts/BaseRootContext';
import { fireEvent, render, screen } from '@testing-library/react';
import expect from 'expect';
import { createMemoryHistory } from 'history';
import { TextField } from '../fields';
import { Tab } from './Tab';
import { TabbedShowLayout } from './TabbedShowLayout';

describe('<TabbedShowLayout />', () => {
  it('should display the first Tab component and its content', () => {
    const history = createMemoryHistory();
    render(
      <BaseRootContext
        dataProvider={testDataProvider()}
        history={history}
      >
        <TabbedShowLayout record={{ id: 123 }}>
          <Tab label="Tab1">
            <TextField label="Field On Tab1" source="field1" />
          </Tab>
          <Tab label="Tab2">
            <TextField label="Field On Tab2" source="field2" />
          </Tab>
        </TabbedShowLayout>
      </BaseRootContext>
    );

    expect(screen.queryByText('Tab1')).not.toBeNull();
    expect(screen.queryByText('Field On Tab1')).not.toBeNull();
  });

  it('should display the first valid Tab component and its content', () => {
    const history = createMemoryHistory();
    render(
      <BaseRootContext
        dataProvider={testDataProvider()}
        history={history}
      >
        <TabbedShowLayout record={{ id: 123 }}>
          {null}
          <Tab label="Tab1">
            <TextField label="Field On Tab1" source="field1" />
          </Tab>
          <Tab label="Tab2">
            <TextField label="Field On Tab2" source="field2" />
          </Tab>
        </TabbedShowLayout>
      </BaseRootContext>
    );

    expect(screen.queryByText('Tab1')).not.toBeNull();
    expect(screen.queryByText('Field On Tab1')).not.toBeNull();
  });

  it('should sync tabs with location by default', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });

    render(
      <BaseRootContext
        dataProvider={testDataProvider()}
        history={history}
      >
        <TabbedShowLayout record={{ id: 123 }}>
          {null}
          <Tab label="Tab1">
            <TextField label="Field On Tab1" source="field1" />
          </Tab>
          <Tab label="Tab2">
            <TextField label="Field On Tab2" source="field2" />
          </Tab>
        </TabbedShowLayout>
      </BaseRootContext>
    );

    fireEvent.click(screen.getByText('Tab2'));
    expect(history.location.pathname).toEqual('/1');
    expect(screen.queryByText('Field On Tab2')).not.toBeNull();
    expect(screen.queryByText('Field On Tab1')).toBeNull();
    fireEvent.click(screen.getByText('Tab1'));
    expect(history.location.pathname).toEqual('/');
    expect(screen.queryByText('Field On Tab1')).not.toBeNull();
    expect(screen.queryByText('Field On Tab2')).toBeNull();
  });

  it('should sync tabs with location by default when using custom tab paths', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });

    render(
      <BaseRootContext
        dataProvider={testDataProvider()}
        history={history}
      >
        <TabbedShowLayout record={{ id: 123 }}>
          {null}
          <Tab label="Tab1">
            <TextField label="Field On Tab1" source="field1" />
          </Tab>
          <Tab label="Tab2" path="second">
            <TextField label="Field On Tab2" source="field2" />
          </Tab>
        </TabbedShowLayout>
      </BaseRootContext>
    );

    fireEvent.click(screen.getByText('Tab2'));
    expect(history.location.pathname).toEqual('/second');
    expect(screen.queryByText('Field On Tab2')).not.toBeNull();
    expect(screen.queryByText('Field On Tab1')).toBeNull();
    fireEvent.click(screen.getByText('Tab1'));
    expect(history.location.pathname).toEqual('/');
    expect(screen.queryByText('Field On Tab1')).not.toBeNull();
    expect(screen.queryByText('Field On Tab2')).toBeNull();
  });

  it('should not sync tabs with location if syncWithLocation is false', async () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    const record = { id: 123 };
    render(
      <BaseRootContext
        dataProvider={testDataProvider()}
        history={history}
      >
        <TabbedShowLayout record={record} syncWithLocation={false}>
          {null}
          <Tab label="Tab1">
            <TextField label="Field On Tab1" source="field1" />
          </Tab>
          <Tab label="Tab2">
            <TextField label="Field On Tab2" source="field2" />
          </Tab>
        </TabbedShowLayout>
      </BaseRootContext>
    );

    fireEvent.click(screen.getByText('Tab2'));
    expect(history.location.pathname).toEqual('/');
    expect(screen.queryByText('Field On Tab2')).not.toBeNull();
    expect(screen.queryByText('Field On Tab1')).toBeNull();
    fireEvent.click(screen.getByText('Tab1'));
    expect(history.location.pathname).toEqual('/');
    expect(screen.queryByText('Field On Tab1')).not.toBeNull();
    expect(screen.queryByText('Field On Tab2')).toBeNull();
  });
});
