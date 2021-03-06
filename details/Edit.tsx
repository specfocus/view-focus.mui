import { useCheckMinimumRequiredProps } from '@specfocus/view-focus/controllers/checkMinimumRequiredProps';
import { EditBase } from '@specfocus/view-focus/mutations/EditBase';
import { Entity } from '@specfocus/spec-focus/entities/Entity';
import PropTypes from 'prop-types';
import { ReactNode } from 'react';
import { EditProps } from '../types';
import { EditView } from './EditView';

/**
 * Page component for the Edit view
 *
 * The `<Edit>` component renders the page title and actions,
 * fetches the record from the data provider.
 * It is not responsible for rendering the actual form -
 * that's the job of its child component (usually `<SimpleForm>`),
 * to which it passes the `record` as prop.
 *
 * The <Edit> component accepts the following props:
 *
 * - actions
 * - aside
 * - component
 * - title
 * - mutationMode
 * - mutationOptions
 *
 * @example
 *
 * // in src/posts.js
 * import React from "react";
 * import { Edit, SimpleForm, TextInput } from '@specfocus/view-focus.mui-demo';
 *
 * export const PostEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <TextInput source="title" />
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * // in src/App.js
 * import React from "react";
 * import { BaseRoot, Resource } from '@specfocus/view-focus.mui-demo';
 *
 * import { PostEdit } from './posts';
 *
 * const App = () => (
 *     <BaseRoot dataProvider={...}>
 *         <Resource name="posts" edit={PostEdit} />
 *     </BaseRoot>
 * );
 * export default App;
 */
export const Edit = <RecordType extends Entity = any>(
  props: EditProps<RecordType> & { children: ReactNode; }
) => {
  useCheckMinimumRequiredProps('Edit', ['children'], props);
  const {
    resource,
    id,
    mutationMode,
    mutationOptions,
    queryOptions,
    redirect,
    transform,
    disableAuthentication,
    ...rest
  } = props;
  return (
    <EditBase
      resource={resource}
      id={id}
      mutationMode={mutationMode}
      mutationOptions={mutationOptions}
      queryOptions={queryOptions}
      redirect={redirect}
      transform={transform}
      disableAuthentication={disableAuthentication}
    >
      <EditView {...rest} />
    </EditBase>
  );
};

Edit.propTypes = {
  actions: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
  aside: PropTypes.element,
  children: PropTypes.node,
  className: PropTypes.string,
  disableAuthentication: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasList: PropTypes.bool,
  id: PropTypes.any,
  mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
  mutationOptions: PropTypes.object,
  queryOptions: PropTypes.object,
  redirect: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.func,
  ]),
  resource: PropTypes.string,
  title: PropTypes.node,
  transform: PropTypes.func,
  sx: PropTypes.any,
};
