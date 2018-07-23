import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Button } from 'antd';
import RecordList from 'components/BCStudent/record-list';
import NewAddConnect from 'components/BSchool/new-add-connect';
import { parseSearch } from '../../../../utils/utils';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
@connect(({ connectDetail, newAddConnect, loading }) => ({
  connectDetail,
  newAddConnect,
  loading: loading.effects['connectDetail/fetch'],
}))
export default class ConnectDetail extends Component {
  constructor(props) {
    super(props);
    const { search } = this.props.location;
    const { schoolId } = parseSearch(search);
    this.state = {
      pageSize: 3,
      pageNo: 0,
      schoolId,
    };
  }
  componentDidMount = () => {
    const { search } = this.props.location;
    const { schoolId } = parseSearch(search);
    this.setState({ schoolId }, () => {
      this.showMore();
    });
  };
  componentWillUnmount = () => {
    this.props.dispatch({
      type: 'connectDetail/clear',
    });
  };
  /**
   * 新增沟通记录以后再次拉取沟通记录
   */
  fetchConnectRecord = () => {
    const { dispatch } = this.props;
    const { schoolId } = this.state;
    dispatch({
      type: 'connectDetail/fetchConnectRecord',
      payload: {
        pageNo: 1,
        pageSize: 3,
        schoolId,
      },
    });
  };
  /**
   * 点击查看更多
   */
  showMore = () => {
    const { pageNo } = this.state;
    this.setState({ pageNo: pageNo + 1 }, () => {
      this.props.dispatch({
        type: 'connectDetail/fetchConnectRecord',
        payload: {
          pageNo: this.state.pageNo,
          pageSize: this.state.pageSize,
          schoolId: this.state.schoolId,
        },
      });
    });
  };
  addConnectRecordVisible = visible => {
    const payLoad = {
      connectRecordVisible: visible,
    };
    if (!visible) {
      payLoad.writeConnectRecord = '';
    }
    this.props.dispatch({
      type: 'newAddConnect/setState',
      payload: payLoad,
    });
  };

  render() {
    const { recordList } = this.props.connectDetail;
    const connectTitle = (
      <div>
        <Row>
          <Col span={24}>
            <Button
              type="primary"
              style={{ marginRight: 25 }}
              onClick={this.addConnectRecordVisible.bind(null, true)}
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
    const breadcrumb = [
      {
        title: '首页',
        href: '/useradmin/b-school/info',
      },
      {
        title: '用户管理',
        href: '/useradmin/b-school/info',
      },
      {
        title: 'B端学校',
        href: '/useradmin/b-school/info',
      },
      {
        title: '详情',
        href: `/useradmin/b-school/all-detail/1?schoolId=${this.state.schoolId}`,
      },
      {
        title: '更多历史签约',
      },
    ];
    return (
      <PageHeaderLayout title="" breadcrumbList={breadcrumb}>
        <Fragment>
          <RecordList
            title={connectTitle}
            showMore={{
              content: '点击查看更多历史沟通',
              showMoreMethod: this.showMore,
            }}
            recordList={recordList}
            flagType={2}
            loading={this.props.loading}
          />
          <NewAddConnect id={this.state.schoolId} reFetchConnectRecord={this.fetchConnectRecord} />
        </Fragment>
      </PageHeaderLayout>
    );
  }
}
