import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const Pagination = props => (
  <Menu floated="right" pagination>
    <Menu.Item as="a" icon disabled={props.page === 0} onClick={props.onPrev}>
      <Icon name="left chevron" />
    </Menu.Item>
    <Menu.Item as="a">{props.page + 1}</Menu.Item>
    <Menu.Item as="a" icon disabled={!props.hasMore} onClick={props.onNext}>
      <Icon name="right chevron" />
    </Menu.Item>
  </Menu>
);

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
};

export default Pagination;
