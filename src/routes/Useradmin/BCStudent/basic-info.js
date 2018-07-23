import React, { Component } from 'react';
import { Row, Col, Button, message } from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

import RecordList from 'components/BCStudent/record-list';
import BasicInfo from 'components/BCStudent/basic-info';
import CourseData from 'components/BCStudent/course-data';
import AddCommunication from '../../CoachToB/route-add-communication';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

import styles from './basic-info.less';
import { parseSearch } from '../../../utils/utils';

@connect(({ bcAllDetail, loading }) => ({
  bcAllDetail,
  loading: loading.effects['bcAllDetail/fetchAllInfo'],
}))
export default class StudentDetail extends Component {
  constructor(props) {
    super(props);
    const { search } = this.props.location;
    const { studentId } = parseSearch(search);
    this.state = {
      studentId,
      communicationModalVisible: false,
    };
  }
  componentDidMount() {
    const { studentId } = this.state;
    this.props.dispatch({
      type: 'bcAllDetail/fetchAllInfo',
      payload: {
        studentId,
      },
    });
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  /**
   * 查看更多页面跳转
   */
  showMore = num => {
    let url = '';
    const { studentId } = this.state;
    if (num === 1) {
      url = `/useradmin/b-c-student-class-detail/?studentId=${studentId}`;
    } else if (num === 2) {
      url = `/useradmin/b-c-student-connect-detail?studentId=${studentId}`;
    } else {
      url = `/useradmin/b-c-student-activity-detail?studentId=${studentId}`;
    }
    this.props.dispatch(routerRedux.push(url));
  };
  /**
   *  输入沟通记录
   */
  writeConnectRecord = e => {
    if (e.target.value.length > 300) {
      return message.warning('您最多可输入300个字符');
    }
    this.props.dispatch({
      type: 'bcAllDetail/setState',
      payload: {
        writeConnectRecord: e.target.value.slice(0, 300),
      },
    });
  };
  /**
   * render渲染购课标题
   */
  renderClassTitle = () => {
    const { statCourseNum } = this.props.bcAllDetail;
    return (
      <div>
        <Row>
          <Col span={4}>
            <h3>购课记录</h3>
          </Col>
        </Row>
        <Row style={{ marginLeft: 15, marginTop: 10 }}>
          <Col span={24}>
            <a style={{ fontSize: 14, fontWeight: 400, cursor: 'default' }}>
              共计课程：{statCourseNum.totalCourseNum}
            </a>
            <a style={{ marginLeft: 15, fontSize: 14, fontWeight: 400, cursor: 'default' }}>
              线下课程：{statCourseNum.underLineCourseNum}
            </a>
          </Col>
        </Row>
      </div>
    );
  };
  /**
   * render渲染沟通记录的标题
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
              onClick={() => {
                this.setState({
                  communicationModalVisible: true,
                });
              }}
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
      content: '点击查看更多历史购课',
      isHref: true,
      showMoreMethod: this.showMore.bind(null, 1),
    };
    const connectShowMore = {
      content: '点击查看更多沟通记录',
      isHref: true,
      showMoreMethod: this.showMore.bind(null, 2),
    };
    const activityShowMore = {
      content: '点击查看更多活动记录',
      isHref: true,
      showMoreMethod: this.showMore.bind(null, 3),
    };
    const { purchaseClass, connectRecord, activityRecord } = this.props.bcAllDetail;

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
      },
    ];
    return (
      <PageHeaderLayout title="" breadcrumbList={breadcrumb}>
        <BasicInfo loading={this.props.loading} studentId={this.state.studentId} />
        <Row gutter={36} className={styles.item_container}>
          <Col span={12}>
            <RecordList
              loading={this.props.loading}
              title={this.renderClassTitle()}
              showMore={classShowMore}
              recordList={purchaseClass}
              flagType={1}
              height={styles.card_list_wrp}
            />
          </Col>
          <Col span={12}>
            <RecordList
              loading={this.props.loading}
              title={this.renderConnectTitle()}
              showMore={connectShowMore}
              contentOmission
              recordList={connectRecord}
              flagType={2}
              height={styles.card_list_wrp}
            />
          </Col>
        </Row>
        <CourseData studentId={this.state.studentId} />
        <Row gutter={36} className={styles.item_container}>
          <Col span={24}>
            <RecordList
              loading={this.props.loading}
              title="活动参与"
              showMore={activityShowMore}
              recordList={activityRecord}
              flagType={3}
              height={styles.card_list_wrp}
            />
          </Col>
        </Row>
        <div id="add_connect_record">
          <AddCommunication
            modalVisible={this.state.communicationModalVisible}
            coachId={this.state.studentId}
            onCancelVisible={() => {
              this.setState({
                communicationModalVisible: false,
              });
            }}
            onChangeVisible={flag => {
              this.props.dispatch({
                type: 'bcAllDetail/fetchCommunication',
                payload: { userId: this.state.studentId },
                callback: () => {
                  this.setState({
                    communicationModalVisible: !!flag,
                  });
                },
              });
            }}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
