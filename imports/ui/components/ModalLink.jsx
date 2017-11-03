import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { openModal } from '../../modules/client/redux/modal';

const ModalLink = props => (
  <Link
    {..._.omit(props, ['component', 'title', 'openModal'])}
    onClick={(e) => {
      e.preventDefault();
      props.openModal(props.to, props.component, props.title);
    }}
  />
);

ModalLink.defaultProps = {
  title: null,
};

ModalLink.propTypes = {
  to: PropTypes.string.isRequired,
  component: PropTypes.node.isRequired,
  title: PropTypes.string,
  openModal: PropTypes.func.isRequired,
};

export default connect(null, { openModal })(ModalLink);
