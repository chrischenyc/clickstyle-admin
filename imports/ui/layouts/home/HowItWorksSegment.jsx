import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Grid, Header, Icon, Segment } from 'semantic-ui-react';

const HowItWorksSegment = () => (
  <Segment style={{ padding: '4rem' }} vertical textAlign="center">
    <Header as="h2" style={{ fontSize: '2rem' }}>
      HOW IT WORKS
    </Header>

    <Grid columns="equal" stackable>
      <Grid.Row textAlign="center">
        <Grid.Column style={{ padding: '2rem 2rem' }}>
          <Icon name="search" size="big" color={Meteor.settings.public.semantic.color} />
          <Header as="h3" style={{ fontSize: '1.2rem' }}>
            View and select our services
          </Header>
          <p style={{ fontSize: '1.2rem' }}>
            Non dignissimos quidem quae assumenda enim quasi et. Officiis rem ut qui voluptatem
            laboriosam commodi quibusdam hic. Odio quia sunt sed quod totam sequi reiciendis quia.
            Dolores quibusdam et doloribus qui et consequatur fugit vel totam. Beatae ea quia non
            non necessitatibus rerum explicabo.
          </p>
        </Grid.Column>
        <Grid.Column style={{ padding: '2rem 2rem' }}>
          <Icon name="checked calendar" size="big" color={Meteor.settings.public.semantic.color} />
          <Header as="h3" style={{ fontSize: '1.2rem' }}>
            Book your appointment
          </Header>
          <p style={{ fontSize: '1.2rem' }}>
            Est maiores explicabo neque amet. Culpa quia qui est magnam adipisci neque quae
            consectetur aliquam. Velit suscipit et ex eum voluptatem.
          </p>
        </Grid.Column>
        <Grid.Column style={{ padding: '2rem 2rem' }}>
          <Icon name="smile" size="big" color={Meteor.settings.public.semantic.color} />
          <Header as="h3" style={{ fontSize: '1.2rem' }}>
            Prepare to get pampered
          </Header>
          <p style={{ fontSize: '1.2rem' }}>
            Consequatur similique sunt est iure est accusantium sunt et. Necessitatibus autem
            explicabo. Porro temporibus nostrum. Repellendus vel nostrum sapiente non autem hic
            distinctio. Aut rerum quia enim rerum dignissimos aut sunt.
          </p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Segment>
);

export default HowItWorksSegment;
