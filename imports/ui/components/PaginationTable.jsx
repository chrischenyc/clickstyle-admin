import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Table, Menu, Icon, Input,
} from 'semantic-ui-react';

class PaginationTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      limit: 25,
      search: '',
    };

    this.reloadItems = this.reloadItems.bind(this);
    this.loadItemsForPage = this.loadItemsForPage.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  componentDidMount() {
    this.reloadItems();
  }

  handlePrev() {
    const { page } = this.state;

    if (page > 0) {
      this.setState({ page: page - 1 });
      this.loadItemsForPage();
    }
  }

  handleNext() {
    const { page, limit } = this.state;
    const { total } = this.props;

    if ((page + 1) * limit < total) {
      this.setState({ page: page + 1 });
      this.loadItemsForPage();
    }
  }

  reloadItems() {
    const { page, limit, search } = this.state;
    const { onReloadItems } = this.props;

    this.setState({ page: 0 });

    onReloadItems(page, limit, search);
  }

  loadItemsForPage() {
    const { page, limit, search } = this.state;
    const { onLoadItemsForPage } = this.props;

    onLoadItemsForPage(page, limit, search);
  }

  render() {
    const {
      items, headerComponent, rowComponent, total, searchPlaceholder,
    } = this.props;

    const { page, limit } = this.state;

    return (
      <Fragment>
        <Input
          placeholder={searchPlaceholder}
          input={{ size: '40' }}
          onChange={(event) => {
            const search = event.target.value;
            this.setState({ search });
            setTimeout(() => {
              this.reloadItems();
            }, 500);
          }}
        />

        <Table celled>
          <Table.Header>{headerComponent()}</Table.Header>

          <Table.Body>{items.map(rowComponent)}</Table.Body>
        </Table>

        <Menu floated="right" pagination>
          <Menu.Item as="a" icon disabled={page === 0} onClick={this.handlePrev}>
            <Icon name="left chevron" />
          </Menu.Item>

          <Menu.Item as="a">{page + 1}</Menu.Item>

          <Menu.Item as="a" icon disabled={(page + 1) * limit >= total} onClick={this.handleNext}>
            <Icon name="right chevron" />
          </Menu.Item>
        </Menu>
      </Fragment>
    );
  }
}

PaginationTable.defaultProps = {
  total: 0,
  searchPlaceholder: 'search for first name, last name, or email',
};

PaginationTable.propTypes = {
  total: PropTypes.number,
  items: PropTypes.array.isRequired,
  onReloadItems: PropTypes.func.isRequired,
  onLoadItemsForPage: PropTypes.func.isRequired,
  headerComponent: PropTypes.func.isRequired,
  rowComponent: PropTypes.func.isRequired,
  searchPlaceholder: PropTypes.string,
};

export default PaginationTable;
