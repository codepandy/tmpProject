import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Input, Card, Table, Checkbox, Button, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './route-role-edit.less';

const breadcrumb = [
  {
    title: '首页',
    href: '/useradmin/coach-to-B',
  },
  {
    title: '权限管理',
    href: '/authority/account-list',
  },
  {
    title: '角色管理',
    href: '/authority/role-list',
  },
  {
    title: '角色详情',
    href: '/authority/role-edit',
  },
];
@connect(({ authority, loading }) => ({
  authority,
  loading: loading.models.authority,
}))
export default class RoleEdit extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'authority/fetchMenuList',
    });
  }

  getColumns = checkedMenus => {
    const that = this;
    return [
      {
        title: '一级菜单',
        dataIndex: 'name',
        key: 'name',
        render(text, record) {
          return (
            <Checkbox
              checked={that.isChecked(checkedMenus, record, true)}
              onChange={e => {
                that.handleCheckedMenu(record.id, e.target.checked, true, record.children);
              }}
            >
              {text}
            </Checkbox>
          );
        },
      },
      {
        title: '二级菜单',
        dataIndex: '',
        render(text, record) {
          return (record.children || []).map(item => {
            return (
              <Checkbox
                key={item.id}
                checked={that.isChecked(checkedMenus, item, false)}
                onChange={e => {
                  that.handleCheckedMenu(item.id, e.target.checked, false, record.children);
                }}
              >
                {item.name}
              </Checkbox>
            );
          });
        },
      },
    ];
  };
  isChecked = (checkedMenus, record, isParent) => {
    if (isParent) {
      return (
        checkedMenus.includes(record.id) ||
        record.children.some(item => checkedMenus.includes(item.id))
      );
    }
    return checkedMenus.includes(record.id);
  };
  handleCheckedMenu = (id, checked, isParent, children) => {
    this.props.dispatch({
      type: 'authority/setUserMenu',
      payload: { id, checked, isParent, children },
    });
  };
  handleAdd = () => {
    const { userRole } = this.props.authority;
    this.props.dispatch({
      type: 'authority/saveUserRole',
      payload: userRole,
    });
  };
  refresh = () => {
    this.props.dispatch({
      type: 'authority/refreshRoleDetail',
    });
  };
  editRoleName = e => {
    this.props.dispatch({
      type: 'authority/editRoleName',
      payload: e.target.value,
    });
  };
  render() {
    const that = this;
    const { authority: { menuData, userRole }, loading } = this.props;
    return (
      <PageHeaderLayout title="" breadcrumbList={breadcrumb}>
        <Card>
          <Row>
            <Col span={6}>
              <Input
                placeholder="请输入角色名(限8个字符)"
                value={userRole.name}
                onChange={this.editRoleName}
              />
            </Col>
            <Col span={6}>
              <span className={styles.redStar}>*</span>
              <span className={styles.errorFont}>信息有误，请检查后再进行保存！</span>
            </Col>
            <Col span={10} />
            <Col span={1}>
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  that.refresh();
                }}
              >
                取消
              </Button>
            </Col>
            <Col span={1}>
              <Button type="primary" size="small" onClick={that.handleAdd}>
                保存
              </Button>
            </Col>
          </Row>
          <Divider />
          <div className={styles.descSpan}>选定权限 </div>
          <Table
            childrenColumnName=""
            rowKey="id"
            bordered
            dataSource={menuData}
            columns={this.getColumns(userRole.roleMenuIds)}
            loading={loading}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
