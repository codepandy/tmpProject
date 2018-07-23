import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Table, Modal, Input, message, Card } from 'antd';
import styles from './index.less';

const { Search } = Input;
@connect(({ allDetail, loading }) => ({
  allDetail,
  loading: loading.models.list,
}))
export default class TeacherList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTeacherId: '',
    };
    this.columns = [
      {
        title: '教练名',
        dataIndex: 'teacherName',
        key: 'teacherName',
      },
      {
        title: '联系方式',
        dataIndex: 'teacherMobile',
        key: 'teacherMobile',
        render: teacherMobile => {
          return teacherMobile || '--';
        },
      },
      {
        title: '行政身份',
        dataIndex: 'teacherIdentity',
        key: 'teacherIdentity',
        render: teacherIdentity => {
          return teacherIdentity || '--';
        },
      },
      {
        title: '当前课程使用权限',
        dataIndex: 'teacherCoursePower',
        key: 'teacherCoursePower',
        render: teacherIdentity => {
          return typeof teacherIdentity === 'object' && teacherIdentity.length
            ? teacherIdentity.join('、')
            : '--';
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (operation, record) => {
          return (
            <a
              className={styles.item_title}
              onClick={this.editTeacherRemarksVisible.bind(null, true, record.teacherId)}
            >
              编辑备注
            </a>
          );
        },
      },
    ];
    this.addColumns = [
      {
        title: '教练名',
        dataIndex: 'teacherName',
        key: 'teacherName',
      },
      {
        title: '联系方式',
        dataIndex: 'teacherMobile',
        key: 'teacherMobile',
      },
      {
        title: '行政身份',
        dataIndex: 'teacherIdentity',
        key: 'teacherIdentity',
      },
    ];
  }
  /**
   * 新绑定教练弹窗
   */
  addTeacherAccountVisible = visible => {
    this.props.dispatch({
      type: 'allDetail/setState',
      payload: {
        addTeacherAccountVisible: visible,
        teacherAccount: '',
        addTeacherInfo: { data: [] },
      },
    });
  };
  /**
   * 提交绑定教练，只有code码返回1的情况可以
   */
  submitTeacherAccount = () => {
    this.props.dispatch({
      type: 'allDetail/submitTeacherAccount',
      payload: {
        schoolId: this.props.schoolId * 1,
      },
      callback: () => {
        this.props.dispatch({
          type: 'allDetail/fetchTeacherList',
          payload: {
            schoolId: this.props.schoolId * 1,
          },
        });
      },
    });
  };
  /**
   * 教练信息，点击编辑备注
   */
  editTeacherRemarksVisible = (visible, teacherId) => {
    this.setState({
      currentTeacherId: teacherId,
    });
    this.props.dispatch({
      type: 'allDetail/setState',
      payload: {
        editTeacherRemarksVisible: visible,
        editTeacherRemarks: '',
      },
    });
  };
  /**
   * 教练信息，提交备注信息(重新拉取教练信息)
   */
  submitEditTeacherRemarks = () => {
    const { schoolId, dispatch } = this.props;
    const { currentTeacherId } = this.state;
    dispatch({
      type: 'allDetail/submitEditTeacherRemarks',
      payload: {
        schoolId: +schoolId,
        teacherId: currentTeacherId,
      },
      callback: () => {
        dispatch({
          type: 'allDetail/fetchTeacherList',
          payload: { schoolId: +schoolId },
        });
      },
    });
  };
  /**
   * render教练标题
   */
  renderTeacherTitle = () => {
    const { teacherList } = this.props.allDetail;
    return (
      <div>
        <Row>
          <Col span={24}>教练列表</Col>
        </Row>
        <Row style={{ marginLeft: 10, marginTop: 20 }}>
          <Col span={24} style={{ fontSize: 14 }}>
            <a>共计教练{teacherList.schoolAllTeacher ? teacherList.schoolAllTeacher : 0}人</a>{' '}
            <a style={{ marginLeft: 15 }}>
              当前教练：{teacherList.schoolNowTeacher ? teacherList.schoolNowTeacher : 0}人
            </a>
          </Col>
        </Row>
      </div>
    );
  };
  /**
   * render编辑教练备注信息
   */
  renderEditTeacherInfo = () => {
    const { editTeacherRemarksVisible, editTeacherRemarks } = this.props.allDetail;
    return (
      <div>
        <Modal
          title="编辑教练备注信息"
          visible={editTeacherRemarksVisible}
          onOk={this.submitEditTeacherRemarks}
          onCancel={this.editTeacherRemarksVisible.bind(null, false)}
        >
          <Row gutter={36}>
            <Col xs={24} sm={6} md={6} lg={6} xl={6} style={{ textAlign: 'right' }}>
              备注信息：
            </Col>
            <Col xs={24} sm={18} md={18} lg={18} xl={18}>
              <Input
                placeholder="请输入备注信息"
                value={editTeacherRemarks}
                onChange={e => {
                  if (e.target.value.length > 20) {
                    return message.warning('您最多可输入20个字符!');
                  }
                  this.props.dispatch({
                    type: 'allDetail/setState',
                    payload: { editTeacherRemarks: e.target.value.slice(0, 20) },
                  });
                }}
              />
            </Col>
          </Row>
        </Modal>
      </div>
    );
  };
  /**
   * render绑定教练
   */
  renderAddTeacherInfo = () => {
    const { addTeacherInfo } = this.props.allDetail;
    if (addTeacherInfo.code === 1 || addTeacherInfo.code === 3) {
      return (
        <Row style={{ marginTop: 30 }}>
          <Col span={24}>
            <Table
              columns={this.addColumns}
              dataSource={addTeacherInfo.data}
              bordered
              rowKey={() => 1}
              pagination={false}
            />
            <div style={{ textAlign: 'center', marginTop: 10, color: 'red' }}>
              {addTeacherInfo.code === 3 ? addTeacherInfo.msg : ''}
            </div>
          </Col>
        </Row>
      );
    } else if (addTeacherInfo.code === 2) {
      return (
        <Card style={{ marginTop: 20 }}>
          <div style={{ textAlign: 'center' }}>{addTeacherInfo.msg}</div>
        </Card>
      );
    }
  };
  /**
   * render新绑定教练
   */
  renderAddTeacherAccount = () => {
    const { addTeacherAccountVisible, teacherAccount } = this.props.allDetail;
    return (
      <div>
        <Modal
          title="新绑定教练"
          visible={addTeacherAccountVisible}
          onOk={this.submitTeacherAccount}
          onCancel={this.addTeacherAccountVisible.bind(null, false)}
        >
          <Row gutter={36}>
            <Col xs={24} sm={6} md={6} lg={6} xl={6} style={{ textAlign: 'right' }}>
              教练账号：
            </Col>
            <Col xs={24} sm={18} md={18} lg={18} xl={18}>
              <Search
                placeholder="请输入教练账号"
                value={teacherAccount}
                enterButton
                onChange={e => {
                  this.props.dispatch({
                    type: 'allDetail/setState',
                    payload: { teacherAccount: e.target.value },
                  });
                }}
                onSearch={value => {
                  this.props.dispatch({
                    type: 'allDetail/searchTeacherInSchool',
                    payload: {
                      teacherAccount: value,
                      schoolId: this.props.schoolId,
                    },
                  });
                }}
                style={{ width: '90%' }}
              />
            </Col>
          </Row>
          {this.renderAddTeacherInfo()}
        </Modal>
      </div>
    );
  };
  render() {
    const { teacherList, teacherTableLoadding } = this.props.allDetail;
    return (
      <Fragment>
        <Card title={this.renderTeacherTitle()}>
          <Row gutter={36}>
            <Col span={24}>
              <Row>
                <Col span={24}>
                  <Table
                    rowKey={record => record.teacherId}
                    bordered
                    loading={teacherTableLoadding}
                    columns={this.columns}
                    dataSource={teacherList.list ? teacherList.list : []}
                    footer={() => (
                      <div style={{ textAlign: 'center' }}>
                        <a
                          className={styles.item_title}
                          onClick={this.addTeacherAccountVisible.bind(null, true)}
                        >
                          新绑定教练
                        </a>
                      </div>
                    )}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        {this.renderAddTeacherAccount()}
        {this.renderEditTeacherInfo()}
      </Fragment>
    );
  }
}
