import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';

import StylistApplications from '../../../../api/stylist_applications/stylist_applications';
import Profiles from '../../../../api/profiles/profiles';
import Services from '../../../../api/services/services';
import SideMenuContainer from '../../../components/SideMenuContainer';
import StylistApplicationPage from './StylistApplicationPage';

const StylistApplication = props => (
  <SideMenuContainer>
    <StylistApplicationPage application={props.application} />
  </SideMenuContainer>
);

StylistApplication.defaultProps = {
  application: null,
};

StylistApplication.propTypes = {
  match: PropTypes.object.isRequired,
  application: PropTypes.object,
};

export default withTracker((props) => {
  Meteor.subscribe('stylist.application', props.match.params.id);

  const application = StylistApplications.findOne(
    {},
    {
      transform: (doc) => {
        const profile = Profiles.findOne({ owner: doc.userId });
        const services = Services.find({ _id: { $in: doc.services } }).fetch();

        return {
          ...doc,
          profile,
          services,
        };
      },
    },
  );

  return {
    application,
  };
})(StylistApplication);
