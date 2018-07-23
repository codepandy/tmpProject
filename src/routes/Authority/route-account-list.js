import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Input, Button, Table, Divider } from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './route-account-list.less';
import AccountEdit from './route-account-edit';

const statusLabel = ['启用', '禁用'];
const titleLabel = { add: '添加账号', edit: '编辑账号' };

@connect(({ authority, loading }) => ({
  authority,
  loading: loading.models.authority,
}))
class AccountList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      allUserCount: 0,
      workingUserCount: 0,
      searchVal: '',
      modalTitle: titleLabel.add,
      modalVisible: false,
      eidtAccount: {
        id: '',
        createTime: moment().format('YYYY-MM-DD'),
        lastLoginTime: '',
        name: '',
        mobile: '',
        department: { id: '', name: '' },
        roles: [],
        roleIds: [],
      },
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'authority/fetchAcount',
      payload: {
        fuzzy: '',
        pageSize: this.state.pageSize,
        current: 1,
      },
    });
  }

  handleSearch = pagination => {
    const { searchVal } = this.state;
    this.props.dispatch({
      type: 'authority/fetchAcount',
      payload: {
        fuzzy: searchVal,
        ...pagination,
      },
    });
  };

  handleAdd = (title, record) => {
    const newRecord = { ...record, roleIds: record.roles.map(item => item.id) };
    this.setState({
      modalTitle: title,
      modalVisible: true,
      eidtAccount: newRecord,
    });
  };

  handleOk = () => {
    this.setState({ modalVisible: true });
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false,
      eidtAccount: {
        id: '',
        createTime: moment().format('YYYY-MM-DD'),
        lastLoginTime: '',
        name: '',
        mobile: '',
        department: { id: '', name: '' },
        roles: [],
      },
    });
  };

  handleSetStatus = text => {
    const { id: userId, status } = text;
    this.props.dispatch({
      type: 'authority/updateUserStatus',
      payload: { userId, status },
    });
  };

  render() {
    const that = this;
    const {
      allUserCount,
      workingUserCount,
      modalTitle,
      modalVisible,
      eidtAccount,
      pageSize,
    } = this.state;
    const { authority: { accountData }, loading } = this.props;
    const columns = [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: '姓名', dataIndex: 'name', key: 'name' },
      { title: '手机号', dataIndex: 'mobile', key: 'mobile' },
      {
        title: '所属部门',
        dataIndex: 'department',
        key: 'source',
        align: 'center',
        render(text) {
          return text ? text.name : '';
        },
      },
      {
        title: '角色',
        dataIndex: 'roles',
        key: 'roles',
        align: 'center',
        render(text) {
          return (text || []).map(item => item.name).join('、');
        },
      },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime', align: 'center' },
      { title: '最新登录时间', dataIndex: 'lastLoginTime', key: 'lastLoginTime', align: 'center' },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render(text) {
          const result = text === '0' ? statusLabel[0] : statusLabel[1];
          return (
            <span className={text === '0' ? styles.redColor : styles.greenColor}>{result}</span>
          );
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
                  that.handleSetStatus(text);
                }}
              >
                {statusLabel[Math.abs(text.status - 1)]}
              </a>
              <Divider type="vertical" />
              <a
                href=""
                onClick={e => {
                  e.preventDefault();
                  that.handleAdd(titleLabel.edit, record);
                }}
              >
                编辑
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
                placeholder="姓名/手机号"
                onChange={e => {
                  this.setState({
                    searchVal: e.target.value,
                  });
                }}
              />
            </Col>
            <Col span={18} offset={1}>
              <Button
                type="primary"
                onClick={() => {
                  this.handleSearch({ pageSize, current: 1 });
                }}
              >
                查询
              </Button>
            </Col>
            <Col span={1}>
              <Button
                type="primary"
                onClick={() => {
                  this.handleAdd(titleLabel.add, eidtAccount);
                }}
              >
                +添加
              </Button>
            </Col>
          </Row>
          <Divider />
          <div className={styles.marginBottom}>
            <span className={styles.marginRight}>共计{allUserCount}人</span>
            <span>启动状态{workingUserCount}人</span>
          </div>
          <Table
            rowKey="id"
            dataSource={accountData.list}
            columns={columns}
            loading={loading}
            pagination={{ pageSize, total: accountData.pagination.total }}
            onChange={pagination => {
              this.handleSearch(pagination);
            }}
          />
        </Card>
        <AccountEdit
          modalTitle={modalTitle}
          modalVisible={modalVisible}
          onCancel={() => {
            this.handleCancel();
          }}
          data={eidtAccount}
        />
      </PageHeaderLayout>
    );
  }
}
export default AccountList;
