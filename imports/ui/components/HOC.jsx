import React from 'react';
import { Grid } from 'semantic-ui-react';

import SideMenu from './SideMenu';

export const withSideMenu = WrappedComponent => props => (
  <Grid stackable>
    <Grid.Row>
      <Grid.Column width="1">
        <SideMenu />
      </Grid.Column>
      <Grid.Column width="15">
        <WrappedComponent {...props} />
      </Grid.Column>
    </Grid.Row>
  </Grid>
);
