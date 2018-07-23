import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Input, Button, Table, Divider, Modal } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const opType = { add: '0', edit: '1' };
const { confirm } = Modal;
@connect(({ authority, loading }) => ({
  authority,
  loading: loading.models.authority,
}))
class RoleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      searchVal: '',
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'authority/fetchRole',
      payload: {
        name: '',
        pageSize: this.state.pageSize,
      },
    });
  }

  handleSearch = pagination => {
    const { searchVal } = this.state;

    this.props.dispatch({
      type: 'authority/fetchRole',
      payload: {
        name: searchVal,
        ...pagination,
      },
    });
  };

  handleEdit = (editType, roleId) => {
    this.props.dispatch({
      type: 'authority/addRole',
      payload: { roleId, editType },
    });
  };

  handleDel = roleId => {
    const self = this;
    confirm({
      title: '确认要删除吗?',
      content: '删除后数据不可恢复。',
      okType: 'danger',
      onOk() {
        self.props.dispatch({
          type: 'authority/deleteRole',
          payload: { roleId, name: self.state.searchVal },
        });
      },
    });
  };

  handleSetStatus = () => {};

  render() {
    const that = this;
    const { pageSize } = this.state;
    const { authority: { roleData }, loading } = this.props;
    const columns = [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: '角色名', dataIndex: 'name', key: 'name' },
      {
        title: '权限列表',
        dataIndex: 'permissions',
        key: '',
        render(text) {
          const permissionArr = [];
          (text || []).forEach(item => permissionArr.push(item.name));
          return permissionArr.join(',');
        },
      },
      {
        title: '操作',
        dataIndex: '',
        render(text, record) {
          return (
            <div>
              <a
                href=""
                onClick={e => {
                  e.preventDefault();
                  that.handleDel(record.id);
                }}
              >
                删除
              </a>
              <Divider type="vertical" />
              <a
                href=""
                onClick={e => {
                  e.preventDefault();
                  that.handleEdit(opType.edit, record.id);
                }}
              >
                修改
              </a>
            </div>
          );
        },
      },
    ];

    return (
      <PageHeaderLayout title="">
        <Card>
          <Row>
            <Col span={4}>
              <Input
                placeholder="角色名"
                onChange={e => {
                  this.setState({
                    searchVal: e.target.value,
                  });
                }}
              />
            </Col>
            <Col span={17} offset={1}>
              <Button
                type="primary"
                onClick={() => {
                  this.handleSearch();
                }}
              >
                查询
              </Button>
            </Col>
            <Col span={2}>
              <Button
                type="primary"
                onClick={e => {
                  e.preventDefault();
                  this.handleEdit(opType.add);
                }}
              >
                +添加角色
              </Button>
            </Col>
          </Row>
          <Divider />
          <Table
            rowKey="id"
            dataSource={roleData.list}
            columns={columns}
            loading={loading}
            pagination={{ pageSize, total: roleData.pagination.total }}
            onChange={pagination => {
              this.handleSearch(pagination);
            }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
export default RoleList;
