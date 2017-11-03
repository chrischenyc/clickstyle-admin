import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message, Image, Button, Confirm } from 'semantic-ui-react';
import _ from 'lodash';
import { UploadField as FileField } from '@navjobs/upload';
import AvatarEditor from 'react-avatar-editor';

import ScaledImageURL from '../../../../modules/scaled-image-url';

// web version of the login form, stateless component

const ImageSize = 280;

class EditPhotoPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      scale: 1.0,
      rotate: 0,
      openRemoveConfirm: false,
    };
  }

  render() {
    const {
      photo,
      onPhotoSelected,
      onPhotoUpload,
      onPhotoRemove,
      photoUploading,
      photoPristine,
      photoError,
    } = this.props;

    const {
      file, scale, rotate, openRemoveConfirm,
    } = this.state;

    const photoOriginURL = photo !== undefined && photo && photo.origin ? photo.origin : null;
    const photoURL = photoOriginURL || Meteor.settings.public.image.defaultProfilePhoto;

    // if file selected, show photo editor UI
    return (
      <div>
        {file && !photoPristine ? (
          <div>
            <AvatarEditor
              image={file}
              width={ImageSize}
              height={ImageSize}
              scale={scale}
              rotate={rotate}
              border={0}
              ref={(editor) => {
                this.editor = editor;
              }}
            />

            <p>Your photo will appear on your public profile</p>

            <span>Zoom&nbsp;</span>
            <input
              type="range"
              min="100"
              max="300"
              defaultValue="100"
              disabled={photoUploading}
              onChange={(event) => {
                this.setState({ scale: event.target.value / 100.0 });
              }}
            />

            <span>&nbsp;&nbsp;Rotate&nbsp;</span>

            <Button
              icon="repeat"
              onClick={(event) => {
                event.preventDefault();
                this.setState({ rotate: rotate + 90 });
              }}
            />

            <div>
              <Button.Group>
                <Button
                  onClick={(event) => {
                    event.preventDefault();

                    this.setState({
                      file: null,
                      scale: 1.0,
                    });
                  }}
                  disabled={photoUploading}
                >
                  Cancel
                </Button>
                <Button.Or />
                <Button
                  positive
                  onClick={(event) => {
                    event.preventDefault();

                    const canvas = this.editor.getImage();

                    // convert to jpeg format
                    // rename file name to photo.jpeg
                    canvas.toBlob(
                      (blob) => {
                        onPhotoUpload(blob);
                      },
                      'image/jpeg',
                      1,
                    );
                  }}
                  loading={photoUploading}
                >
                  Save
                </Button>
              </Button.Group>
            </div>
          </div>
        ) : (
          <div>
            <Image src={ScaledImageURL(photoURL, 'small')} width={ImageSize} height={ImageSize} />

            <p>Your photo will appear on your public profile</p>

            {photoOriginURL && (
              <Button
                negative
                onClick={() => {
                  this.setState({ openRemoveConfirm: true });
                }}
                style={{ marginBottom: '0.5rem' }}
              >
                Remove photo
              </Button>
            )}

            <FileField
              onFiles={(files) => {
                this.setState({ file: files[0], scale: 1.0, rotate: 0 });
                onPhotoSelected();
              }}
              uploadProps={{
                accept: '.jpg,.jpeg,.png',
              }}
            >
              <Button color={Meteor.settings.public.semantic.color} loading={photoUploading}>
                Upload photo
              </Button>
              <span>
                &nbsp;maximum image file size: {Meteor.settings.public.image.maxFileSize}MB
              </span>
            </FileField>

            <Confirm
              open={openRemoveConfirm}
              onCancel={() => {
                this.setState({ openRemoveConfirm: false });
              }}
              onConfirm={() => {
                this.setState({ openRemoveConfirm: false });
                onPhotoRemove();
              }}
            />
          </div>
        )}

        {!_.isEmpty(photoError) && <Message error content={photoError} />}
      </div>
    );
  }
}

EditPhotoPage.defaultProps = {
  photo: {},
};

EditPhotoPage.propTypes = {
  photo: PropTypes.object,
  onPhotoSelected: PropTypes.func.isRequired,
  onPhotoUpload: PropTypes.func.isRequired,
  onPhotoRemove: PropTypes.func.isRequired,
  photoUploading: PropTypes.bool.isRequired,
  photoPristine: PropTypes.bool.isRequired,
  photoError: PropTypes.string.isRequired,
};

export default EditPhotoPage;
