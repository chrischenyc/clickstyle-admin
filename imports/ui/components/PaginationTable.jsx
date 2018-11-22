import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Table, Menu, Icon } from 'semantic-ui-react';

class PaginationTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      limit: 25,
    };

    this.loadItems = this.loadItems.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  componentDidMount() {
    this.loadItems();
  }

  handlePrev() {
    const { page } = this.state;

    if (page > 0) {
      this.setState({ page: page - 1 });
      this.loadItems();
    }
  }

  handleNext() {
    const { page, limit } = this.state;
    const { total } = this.props;

    if ((page + 1) * limit < total) {
      this.setState({ page: page + 1 });
      this.loadItems();
    }
  }

  loadItems() {
    const { page, limit } = this.state;
    const { loadItems } = this.props;

    loadItems(page, limit);
  }

  render() {
    const {
      items, headerComponent, rowComponent, total,
    } = this.props;

    const { page, limit } = this.state;

    return (
      <Fragment>
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
};

PaginationTable.propTypes = {
  total: PropTypes.number,
  items: PropTypes.array.isRequired,
  loadItems: PropTypes.func.isRequired,
  headerComponent: PropTypes.func.isRequired,
  rowComponent: PropTypes.func.isRequired,
};

export default PaginationTable;
