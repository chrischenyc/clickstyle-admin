import React from 'react';
import { Button, Container, Divider, Header, Segment } from 'semantic-ui-react';

const ArticlesSegment = () => (
  <Segment style={{ padding: '8rem 0' }} vertical inverted>
    <Container text>
      <Header as="h3" style={{ fontSize: '2rem' }} inverted>
        Commodi ut aliquid sint?
      </Header>
      <p style={{ fontSize: '1.33rem' }}>
        Commodi itaque esse ut beatae atque et aperiam sed. Aut et voluptatem iusto. Consectetur
        amet expedita quidem quis in. Dicta voluptatem ea veniam. Quae aspernatur delectus. Aut
        laboriosam in et eius nam quas est. Porro sunt commodi dolorem exercitationem tempore
        aspernatur quasi. Voluptas labore pariatur rerum aut fugiat.
      </p>
      <Button as="a" size="large" inverted>
        Read More
      </Button>

      <Divider horizontal inverted style={{ margin: '3rem 0' }}>
        case studies
      </Divider>

      <Header as="h3" style={{ fontSize: '2rem' }} inverted>
        Sunt voluptate dolore voluptatem reiciendis!
      </Header>
      <p style={{ fontSize: '1.33rem' }}>
        Ipsa deleniti vel. Ut non consectetur. Maxime vel repudiandae. Possimus hic quos. Fugiat
        quis culpa. Non aut doloremque qui beatae dolor alias omnis. Rerum adipisci vel dignissimos
        quia consectetur. Voluptas ipsam sunt rerum ipsam illo accusamus porro error nam.
      </p>
      <Button as="a" size="large" inverted>
        I am Still Quite Interested
      </Button>
    </Container>
  </Segment>
);

export default ArticlesSegment;
