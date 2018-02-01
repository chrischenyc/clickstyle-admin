import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Slingshot } from 'meteor/edgee:slingshot';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Services from '../../../../api/services/services';
import Addons from '../../../../api/addons/addons';
import ServicePage from './ServicePage';

class Service extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saving: false,
      error: '',
      photoUploading: false,
      photoPristine: true,
      photoError: '',
    };

    this.handlePublishAddon = this.handlePublishAddon.bind(this);
    this.handleRemoveAddon = this.handleRemoveAddon.bind(this);
    this.handlePhotoSelected = this.handlePhotoSelected.bind(this);
    this.handlePhotoRemove = this.handlePhotoRemove.bind(this);
    this.handlePhotoUpload = this.handlePhotoUpload.bind(this);
  }

  handlePhotoSelected() {
    this.setState({ photoPristine: false });
  }

  handlePhotoRemove() {
    Meteor.call('services.photo.remove', this.props.service._id, (callError) => {
      if (callError) {
        this.setState({ photoError: callError.reason });
      }
    });
  }

  handlePhotoUpload(file) {
    this.setState({ photoError: '' });

    const upload = new Slingshot.Upload(Meteor.settings.public.SlingshotCloudinaryImage);
    const validateError = upload.validate(file);

    if (validateError) {
      this.setState({ photoError: validateError.reason });
    } else {
      this.setState({ photoUploading: true });

      upload.send(file, (uploadError, downloadUrl) => {
        if (uploadError) {
          this.setState({
            photoUploading: false,
            photoError: uploadError.reason,
          });
        } else {
          // attach cloudinary url to profile
          Meteor.call(
            'services.photo.add',
            { _id: this.props.service._id, url: downloadUrl.replace('http://', 'https://') },
            (callError) => {
              this.setState({ photoUploading: false, photoError: '' });

              if (callError) {
                this.setState({ photoError: callError.reason });
              } else {
                this.setState({ photoPristine: true });
              }
            },
          );
        }
      });
    }
  }

  handlePublishAddon(addon, publish) {
    this.setState({ saving: true });

    Meteor.call('addon.publish', { _id: addon._id, publish }, () => {
      this.setState({ saving: false });
    });
  }

  handleRemoveAddon(addon) {
    this.setState({ saving: true });

    Meteor.call('addon.remove', { _id: addon._id }, () => {
      this.setState({ saving: false });
    });
  }

  render() {
    return this.props.ready ? (
      <ServicePage
        service={{ ...this.props.service, addons: this.props.addons }}
        saving={this.state.saving}
        error={this.state.error}
        onAddonPublish={this.handlePublishAddon}
        onAddonRemove={this.handleRemoveAddon}
        onPhotoSelected={this.handlePhotoSelected}
        onPhotoUpload={this.handlePhotoUpload}
        onPhotoRemove={this.handlePhotoRemove}
        photoUploading={this.state.photoUploading}
        photoPristine={this.state.photoPristine}
        photoError={this.state.photoError}
      />
    ) : (
      <p>loading...</p>
    );
  }
}

Service.defaultProps = {
  ready: false,
  service: null,
  addons: [],
};

Service.propTypes = {
  match: PropTypes.object.isRequired,
  ready: PropTypes.bool,
  service: PropTypes.object,
  addons: PropTypes.array,
};

export default withTracker((props) => {
  const serviceHandle = Meteor.subscribe('service', props.match.params.id);
  const addonsHandle = Meteor.subscribe('service.addons', props.match.params.id);

  return {
    ready: serviceHandle.ready() && addonsHandle.ready(),
    service: Services.findOne({ _id: props.match.params.id }),
    addons: Addons.find({ serviceId: props.match.params.id }).fetch(),
  };
})(Service);
