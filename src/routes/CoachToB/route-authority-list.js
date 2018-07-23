import React, { Component, Fragment } from 'react';
import { Row, Col, Button } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import RecordList from 'components/BCStudent/record-list';
import { parseSearch } from '../../utils/utils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const modalType = {
  editInfo: 'editInfo',
  setQRCode: 'setQRCode',
  addCommunication: 'addCommunication',
};

@connect(({ coachCourseDetail, loading }) => ({
  coachCourseDetail,
  loading: loading.effects['coachCourseDetail/fetch'],
}))
export default class ActivityList extends Component {
  constructor(props) {
    super(props);
    const { search } = this.props.location;
    const { coachId } = parseSearch(search);
    this.state = {
      pageSize: 3,
      pageNo: 0,
      coachId,
    };
  }
  componentDidMount = () => {
    this.showMore();
  };
  componentWillUnmount = () => {
    this.props.dispatch({
      type: 'coachCourseDetail/clear',
    });
  };
  showMore = () => {
    const { pageNo, coachId } = this.state;
    this.setState({ pageNo: pageNo + 1 }, () => {
      this.props.dispatch({
        type: 'coachCourseDetail/fetch',
        payload: {
          pageNo: this.state.pageNo,
          pageSize: this.state.pageSize,
          coachId,
        },
      });
    });
  };
  handleModalVisible = () => {
    const { coachId } = this.state;
    this.props.dispatch(routerRedux.push(`/useradmin/coach-course-order?coachId=${coachId}`));
  };
  handleShowMore = () => {
    const { coachId } = this.state;
    this.props.dispatch(routerRedux.push(`/useradmin/coach-qrcode?coachId=${coachId}`));
  };
  gotoSignDetail = contractId => {
    const { coachId } = this.state;
    this.props.dispatch(
      routerRedux.push(`/useradmin/coach-course-order?coachId=${coachId}&contractId=${contractId}`)
    );
  };
  renderClassTitle = () => {
    return (
      <div>
        <Row>
          <Col span={4}>
            <h3>课程使用权限</h3>
          </Col>
        </Row>
        <Row style={{ marginLeft: 15, marginTop: 10 }}>
          <Col span={24}>
            <Button
              type="primary"
              style={{ marginRight: 25 }}
              onClick={e => {
                e.preventDefault();
                this.handleModalVisible(modalType.setQRCode, true);
              }}
            >
              设置
            </Button>
            <Button
              type="primary"
              style={{ marginRight: 25 }}
              onClick={e => {
                e.preventDefault();
                this.handleShowMore('qrcode');
              }}
            >
              生成二维码
            </Button>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const { recordList } = this.props.coachCourseDetail;
    const breadcrumb = [
      {
        title: '首页',
        href: '/useradmin/coach-to-B',
      },
      {
        title: '用户管理',
        href: '/useradmin/coach-to-B',
      },
      {
        title: 'B端教练',
        href: '/useradmin/coach-to-B',
      },
      {
        title: '详情',
        href: `/useradmin/coach-detail?coachId=${this.state.coachId}`,
      },
      {
        title: '更多签约历史',
      },
    ];
    const classShowMore = {
      content: '点击查看更多历史签约',
      showMoreMethod: this.showMore.bind(null, 1),
    };
    return (
      <PageHeaderLayout title="" breadcrumbList={breadcrumb}>
        <Fragment>
          <RecordList
            loading={this.props.loading}
            title={this.renderClassTitle()}
            clickGotoDetail={this.gotoSignDetail}
            showNum={3}
            showMore={classShowMore}
            recordList={recordList}
            flagType={1}
          />
        </Fragment>
      </PageHeaderLayout>
    );
  }
}
