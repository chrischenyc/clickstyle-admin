import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Container, Header, Button, Form, Checkbox, List, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { UploadField as FileField } from '@navjobs/upload';
import { Link } from 'react-router-dom';
import GeoSuggest from 'react-geosuggest';

import FormInputField from '../../components/FormInputField';
import { formatDate } from '../../../modules/format-date';

class StylistsJoinPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agreementChecked: false,
    };
  }

  render() {
    const {
      onSubmit,
      onChange,
      onServiceSelected,
      loading,
      errors,
      mobile,
      address,
      services,
      qualificationFile,
      referenceUrl,
      application,
    } = this.props;

    if (application) {
      if (application.approved) {
        return (
          <Container text style={{ padding: '8rem 0' }}>
            <Header as="h1">Welcome to the club!</Header>

            <p>
              Your application was approved on {formatDate(application.approvedAt)}. Thanks for
              being part of us.
            </p>

            <p>
              Meanwhile, if you have any question, feel free to&nbsp;
              <Link to="/contact-us">contact us</Link>.
            </p>
          </Container>
        );
      }

      return (
        <Container text style={{ padding: '8rem 0' }}>
          <Header as="h1">Relax and sit tight</Header>

          <p>
            Your previous application submitted on {formatDate(application.createdAt)} is under
            review process, we will contact you shortly.
          </p>

          <p>
            Meanwhile, if you have any question, feel free to&nbsp;
            <Link to="/contact-us">contact us</Link>.
          </p>
        </Container>
      );
    }

    return (
      <Container text style={{ padding: '8rem 0' }}>
        <Header as="h1">Tell us something about you</Header>

        <p>
          We need a bit extra information about you and the services you can provide... ducimus
          exercitationem ratione occaecati optio maxime non. Non perferendis praesentium error et.
          Illum molestias quibusdam cumque eum neque.
        </p>

        <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)} size="large">
          <FormInputField
            label={<Header>Mobile number</Header>}
            placeholder="Mobile number"
            name="mobile"
            onChange={onChange}
            errors={errors}
            note="This is not on your public profile. We may ring you to confirm ..."
            value={mobile}
          />

          <Form.Field>
            <label>
              <Header>Your address</Header>
            </label>

            <GeoSuggest
              placeholder="type to search address"
              country="au"
              name="address"
              onChange={(value) => {
                // convert to generic onChange param
                onChange({ target: { name: 'address', value } });
              }}
              onSuggestSelect={(suggest) => {
                // force onChange as well
                onChange({
                  target: { name: 'address', value: suggest.label },
                });
              }}
              initialValue={address}
            />

            {!_.isEmpty(errors.address) && (
              <Message
                error
                content={errors.address}
                style={{ marginTop: '-0.75rem', marginBottom: '1rem' }}
              />
            )}

            <p
              style={{
                marginTop: '0.25rem',
                marginBottom: '1rem',
                color: '#aaa',
              }}
            >
              {'This is not on your public profile. We need this info to confirm...'}
            </p>
          </Form.Field>

          <Form.Field>
            <label>
              <Header>Services</Header>
            </label>
            <List>
              {services.map(service => (
                <List.Item key={service._id}>
                  <Checkbox
                    label={service.name}
                    checked={service.checked}
                    onChange={(event, data) => {
                      onServiceSelected(service, data.checked);
                    }}
                  />
                </List.Item>
              ))}
            </List>

            {!_.isEmpty(errors.services) && (
              <Message
                error
                content={errors.services}
                style={{ marginTop: '-0.75rem', marginBottom: '1rem' }}
              />
            )}
          </Form.Field>

          <Form.Field>
            <label>
              <Header>Qualifications</Header>
            </label>

            {qualificationFile ? (
              <Message
                icon="file"
                content={qualificationFile.name}
                onDismiss={() => {
                  onChange({ target: { name: 'qualificationFile', value: null } });
                }}
              />
            ) : (
              <FileField
                name="qualificationFile"
                onFiles={(files) => {
                  onChange({ target: { name: 'qualificationFile', value: files[0] } });
                }}
                uploadProps={{
                  accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx,.dot',
                }}
              >
                <Button color={Meteor.settings.public.semantic.color} loading={false}>
                  Upload file
                </Button>
                <span>
                  &nbsp;maximum file size: {Meteor.settings.public.document.maxFileSize}MB
                </span>
              </FileField>
            )}

            {!_.isEmpty(errors.qualificationFile) && (
              <Message
                error
                content={errors.qualificationFile}
                style={{ marginTop: '-0.75rem', marginBottom: '1rem' }}
              />
            )}
          </Form.Field>

          <FormInputField
            fluid
            placeholder="Please provide a link to view your work e.g Facebook, Instagram or your website."
            label={<Header>Reference</Header>}
            name="referenceUrl"
            onChange={onChange}
            errors={errors}
            value={referenceUrl}
          />

          <Form.Field>
            <Checkbox
              defaultChecked
              label={
                <label htmlFor="agreement">
                  Check here to confirm that you agree to our&nbsp;
                  <Link to="/terms">Terms of Use</Link>&nbsp;and&nbsp;
                  <Link to="/privacy">Privacy</Link>.
                </label>
              }
              defaultChecked={this.state.agreementChecked}
              onChange={(event, data) => {
                this.setState({ agreementChecked: data.checked });
              }}
            />
          </Form.Field>

          <Button
            color={Meteor.settings.public.semantic.color}
            size="huge"
            type="submit"
            disabled={!this.state.agreementChecked}
          >
            Join
          </Button>
        </Form>
      </Container>
    );
  }
}

StylistsJoinPage.defaultProps = {
  application: null,
};

StylistsJoinPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onServiceSelected: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  mobile: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  services: PropTypes.array.isRequired,
  qualificationFile: PropTypes.object,
  referenceUrl: PropTypes.string.isRequired,
  application: PropTypes.object,
};

export default StylistsJoinPage;
