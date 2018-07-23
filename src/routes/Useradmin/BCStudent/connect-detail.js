import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Button } from 'antd';
import RecordList from 'components/BCStudent/record-list';
import AddCommunication from '../../CoachToB/route-add-communication';
import { parseSearch } from '../../../utils/utils';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
@connect(({ BCstudentConnectDetail, loading }) => ({
  BCstudentConnectDetail,
  loading: loading.effects['BCstudentConnectDetail/fetch'],
}))
export default class ConnectDetail extends Component {
  constructor(props) {
    super(props);
    const { search } = this.props.location;
    const { studentId } = parseSearch(search);
    this.state = {
      pageSize: 3,
      pageNo: 0,
      studentId,
      communicationModalVisible: false,
    };
  }
  componentDidMount = () => {
    this.showMore();
  };
  componentWillUnmount = () => {
    this.props.dispatch({
      type: 'BCstudentConnectDetail/clear',
    });
  };
  showMore = () => {
    const { pageNo, studentId } = this.state;
    this.setState({ pageNo: pageNo + 1 }, () => {
      this.props.dispatch({
        type: 'BCstudentConnectDetail/fetch',
        payload: {
          pageNo: this.state.pageNo,
          pageSize: this.state.pageSize,
          userId: studentId,
        },
      });
    });
  };
  render() {
    const { recordList } = this.props.BCstudentConnectDetail;
    const breadcrumb = [
      {
        title: '首页',
        href: '/useradmin/b-c-student',
      },
      {
        title: '用户管理',
        href: '/useradmin/b-c-student',
      },
      {
        title: 'B-C端学生',
        href: '/useradmin/b-c-student',
      },
      {
        title: '详情',
        href: `/useradmin/b-c-student-detail/3?studentId=${this.state.studentId}`,
      },
      {
        title: '更多沟通记录',
      },
    ];
    const connectTitle = (
      <div>
        <Row>
          <Col span={24}>
            <Button
              type="primary"
              style={{ marginRight: 25 }}
              onClick={(flag = true) => {
                this.setState({
                  communicationModalVisible: !!flag,
                });
              }}
            >
              新增沟通
            </Button>
          </Col>
        </Row>
        <Row style={{ marginTop: 25 }}>
          <Col span={4}>
            <h3>历史沟通记录</h3>
          </Col>
        </Row>
      </div>
    );
    return (
      <PageHeaderLayout title="" breadcrumbList={breadcrumb}>
        <RecordList
          title={connectTitle}
          showMore={{
            content: '点击查看更多历史沟通',
            showMoreMethod: this.showMore,
          }}
          recordList={recordList}
          flagType={3}
          loading={this.props.loading}
        />
        <AddCommunication
          modalVisible={this.state.communicationModalVisible}
          onCancelVisible={() => {
            this.setState({
              communicationModalVisible: false,
            });
          }}
          coachId={this.state.studentId}
          onChangeVisible={flag => {
            this.props.dispatch({
              type: 'BCstudentConnectDetail/fetch',
              payload: {
                pageNo: 1,
                pageSize: 3,
                userId: this.state.studentId,
              },
              callback: () => {
                this.setState({
                  communicationModalVisible: !!flag,
                });
              },
            });
          }}
        />
      </PageHeaderLayout>
    );
  }
}
