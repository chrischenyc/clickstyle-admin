import { Accounts } from 'meteor/accounts-base';
import React from 'react';
import PropTypes from 'prop-types';
import { Container, Message, Icon } from 'semantic-ui-react';

class VerifyEmailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, error: null };
  }

  componentDidMount() {
    Accounts.verifyEmail(this.props.match.params.token, (error) => {
      if (error) {
        this.setState({
          loading: false,
          error: `${error.reason}. Please try again.`,
        });
      } else {
        this.setState({ loading: false, error: null });

        setTimeout(() => {
          this.props.history.push('/dashboard');
        }, 1500);
      }
    });
  }

  renderMessage() {
    if (this.state.loading) {
      return (
        <Message icon>
          <Icon name="spinner" loading />

          <Message.Content>Just one second, we are verifying your email...</Message.Content>
        </Message>
      );
    } else if (this.state.error) {
      return (
        <Message icon error>
          <Icon name="warning" />

          <Message.Content>{this.state.error}</Message.Content>
        </Message>
      );
    }

    return (
      <Message icon success>
        <Icon name="checkmark" />

        <Message.Content>All set, thank! Sending you to Dashboard...</Message.Content>
      </Message>
    );
  }

  render() {
    return (
      <Container text textAlign="center" className="below-fixed-menu" style={{ padding: '8rem 0' }}>
        {this.renderMessage()}
      </Container>
    );
  }
}

VerifyEmailPage.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default VerifyEmailPage;
