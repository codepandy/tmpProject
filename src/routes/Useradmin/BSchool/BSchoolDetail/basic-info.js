import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Button, Form } from 'antd';
import BasicInfo from 'components/BSchool/basic-info';
import RecordList from 'components/BCStudent/record-list';
import TeacherList from 'components/BSchool/teacher-list';
import NewAddConnect from 'components/BSchool/new-add-connect';
import StudentSituation from 'components/BSchool/student-situation';
import { parseSearch } from '../../../../utils/utils';
import styles from './basic-info.less';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';

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
  },
];
@connect(({ allDetail, newAddConnect, loading }) => ({
  allDetail,
  newAddConnect,
  loading: loading.effects['allDetail/fetch'],
}))
@Form.create()
export default class BSchoolBasicInfo extends Component {
  constructor(props) {
    super(props);
    const { search } = this.props.location;
    const { schoolId } = parseSearch(search);
    this.state = {
      schoolId,
    };
  }
  componentDidMount() {
    const { schoolId } = this.state;
    this.props.dispatch({
      type: 'allDetail/fetch',
      payload: {
        schoolId,
      },
    });
  }
  /**
   *  新增沟通记录以后再次拉取沟通记录
   */
  fetchConnectRecord = () => {
    const { dispatch } = this.props;
    const { schoolId } = this.state;
    dispatch({
      type: 'allDetail/fetchConnectRecord',
      payload: { schoolId: +schoolId },
    });
  };
  /**
   *  点击新增沟通记录
   */
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
  /**
   *  签约 和赠课
   */
  signAgainGive = signFlag => {
    const { schoolId } = this.state;
    const url = `/useradmin/b-school/detail/sign-again-give?signFlag=${signFlag}&schoolId=${schoolId}`;
    this.props.dispatch(routerRedux.push(url));
  };
  /**
   * 点击查看更多路由跳转（签约数据、沟通记录、活动记录）
   */
  showMore = num => {
    let url = '';
    const { schoolId } = this.state;
    if (num === 1) {
      url = `/useradmin/b-school/detail/sign-detail/1}?schoolId=${schoolId}`;
    } else if (num === 2) {
      url = `/useradmin/b-school/detail/connect-detail/2?schoolId=${schoolId}`;
    } else {
      url = `/useradmin/b-school/detail/activity-detail/3?schoolId=${schoolId}`;
    }
    this.props.dispatch(routerRedux.push(url));
  };
  /**
   * 点击去签约详情，可以编辑课程信息
   */
  gotoSignDetail = (contractId, signFlag) => {
    const { schoolId } = this.state;
    const url = `/useradmin/b-school/detail/sign-again-give?schoolId=${schoolId}&contractId=${contractId}&signFlag=${signFlag}`;
    this.props.dispatch(routerRedux.push(url));
  };
  /**
   * render签约数据的card标题
   */
  renderClassTitle = () => {
    return (
      <div>
        <Row>
          <Col span={4}>
            <h3>签约数据</h3>
          </Col>
        </Row>
        <Row style={{ marginLeft: 15, marginTop: 10 }}>
          <Col span={24}>
            <Button
              type="primary"
              style={{ marginRight: 25 }}
              onClick={this.signAgainGive.bind(null, 1)}
            >
              签约
            </Button>
            <Button
              type="primary"
              style={{ marginRight: 25 }}
              onClick={this.signAgainGive.bind(null, 2)}
            >
              赠课
            </Button>
          </Col>
        </Row>
      </div>
    );
  };
  /**
   * render沟通记录的card标题
   */
  renderConnectTitle = () => {
    return (
      <div>
        <Row>
          <Col span={4}>
            <h3>沟通记录</h3>
          </Col>
        </Row>
        <Row style={{ marginLeft: 15, marginTop: 10 }}>
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
      </div>
    );
  };

  render() {
    const classShowMore = {
      content: '点击查看更多历史签约',
      showMoreMethod: this.showMore.bind(null, 1),
    };
    const connectShowMore = {
      content: '点击查看更多沟通记录',
      showMoreMethod: this.showMore.bind(null, 2),
    };
    const activityShowMore = {
      content: '点击查看更多',
      showMoreMethod: this.showMore.bind(null, 3),
    };
    const { purchaseClass, connectRecord, activityRecord } = this.props.allDetail;
    return (
      <PageHeaderLayout title="" breadcrumbList={breadcrumb}>
        <Fragment>
          <div style={{ marginBottom: 30 }}>
            <BasicInfo id={this.state.schoolId} reFetchBasicInfo={this.fetchBasicInfo} />
            <Row gutter={36} style={{ marginTop: 25 }}>
              <Col span={12}>
                <RecordList
                  loading={this.props.loading}
                  title={this.renderClassTitle()}
                  showMore={classShowMore}
                  recordList={purchaseClass}
                  clickGotoDetail={this.gotoSignDetail}
                  flagType={1}
                  height={styles.card_list_wrp}
                />
              </Col>
              <Col span={12}>
                <RecordList
                  loading={this.props.loading}
                  title={this.renderConnectTitle()}
                  contentOmission
                  showMore={connectShowMore}
                  recordList={connectRecord}
                  flagType={2}
                  height={styles.card_list_wrp}
                />
              </Col>
            </Row>
            <div style={{ marginTop: 25 }}>
              <TeacherList schoolId={this.state.schoolId} />
            </div>
            <div style={{ marginTop: 25 }}>
              <StudentSituation schoolId={this.state.schoolId} />
            </div>
            <div style={{ marginTop: 25 }}>
              <Row gutter={36}>
                <Col span={24}>
                  <RecordList
                    loading={this.props.loading}
                    title={
                      <Row>
                        <Col span={4}>
                          <h3>活动参与</h3>
                        </Col>
                      </Row>
                    }
                    showMore={activityShowMore}
                    recordList={activityRecord}
                    flagType={3}
                  />
                </Col>
              </Row>
            </div>
          </div>
          <NewAddConnect id={this.state.schoolId} reFetchConnectRecord={this.fetchConnectRecord} />
        </Fragment>
      </PageHeaderLayout>
    );
  }
}
