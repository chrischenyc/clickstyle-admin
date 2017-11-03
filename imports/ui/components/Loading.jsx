import React from 'react';
import { Segment } from 'semantic-ui-react';
import '../../../client/loading.css';

const Loading = () => (
  <Segment
    style={{
      padding: '2rem 0',
    }}
    vertical
  >
    {/* TODO: fix loading css size */}
    <div className="timeline-item">
      <div className="animated-background">
        <div className="background-masker header-top" />
        <div className="background-masker header-left" />
        <div className="background-masker header-right" />
        <div className="background-masker header-bottom" />
        <div className="background-masker subheader-left" />
        <div className="background-masker subheader-right" />
        <div className="background-masker subheader-bottom" />
        <div className="background-masker content-top" />
        <div className="background-masker content-first-end" />
        <div className="background-masker content-second-line" />
        <div className="background-masker content-second-end" />
        <div className="background-masker content-third-line" />
        <div className="background-masker content-third-end" />
      </div>
    </div>
  </Segment>
);

export default Loading;
