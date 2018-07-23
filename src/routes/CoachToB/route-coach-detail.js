import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Button, Table, Cascader } from 'antd';
import RecordList from 'components/BCStudent/record-list';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './route-coach-detail.less';

import RouteCoachAdd from './route-coach-add';
import SetAuthority from './route-set-authority';
import AddCommunication from './route-add-communication';
import { parseSearch } from '../../../src/utils/utils';

const { Option } = Select;

const modalType = {
  editInfo: 'editInfo',
  setQRCode: 'setQRCode',
  addCommunication: 'addCommunication',
};

@connect(({ coachDetail, loading }) => ({
  coachDetail,
  loading: loading.models.coach,
}))
class CoachDetail extends Component {
  constructor(props) {
    super(props);
    const { search } = this.props.location;
    const { coachId } = parseSearch(search);
    this.state = {
      addModalVisible: false,
      setModalVisible: false,
      communicationModalVisible: false,
      coachId,
    };
  }
  componentDidMount = () => {
    const { coachId } = this.state;
    this.props.dispatch({
      type: 'coachDetail/fetchTeacherBasicInfo',
      payload: {
        coachId,
      },
    });
  };
  handleModalVisible = (type, flag) => {
    const { coachId } = this.state;
    if (type === modalType.editInfo) {
      // 课程设置
      this.props.dispatch({
        type: 'coachDetail/addCoachInfo',
      });
      this.setState({
        addModalVisible: !!flag,
      });
    } else if (type === modalType.setQRCode) {
      // this.setState({
      //   setModalVisible: !!flag,
      // });
      this.props.dispatch(routerRedux.push(`/useradmin/coach-course-order?coachId=${coachId}`));
    } else if (type === modalType.addCommunication) {
      this.props.dispatch({
        type: 'coachDetail/fetchCommunication',
        payload: { userId: this.state.coachId },
        callback: () => {
          this.setState({
            communicationModalVisible: !!flag,
          });
        },
      });
    }
  };
  submitCoachInfo = values => {
    this.setState({
      addModalVisible: false,
    });
    this.props.dispatch({
      type: 'coachDetail/submitCoachInfo',
      payload: { ...values },
      callback: () => {
        const { coachId } = this.state;
        this.props.dispatch({
          type: 'coachDetail/fetchTeacherBasicInfo',
          payload: {
            coachId,
          },
        });
      },
    });
  };
  handleShowMore = type => {
    const { coachId } = this.state;
    if (type === 'authority') {
      this.props.dispatch({
        type: 'coach/fetchAuthrotys',
        callback: () => {},
      });
    } else if (type === 'communication') {
      this.props.dispatch({
        type: 'coach/fetchCommunications',
      });
    } else if (type === 'activity') {
      this.props.dispatch({
        type: 'coach/fetchaActivity',
      });
    } else if (type === 'qrcode') {
      this.props.dispatch(routerRedux.push(`/useradmin/coach-qrcode?coachId=${coachId}`));
    }
  };
  showMore = num => {
    let url = '';
    const { coachId } = this.state;
    if (num === 1) {
      url = `/useradmin/coach-authority?coachId=${coachId}`;
    } else if (num === 2) {
      url = `/useradmin/coach-communications?coachId=${coachId}`;
    } else {
      url = `/useradmin/coach-activities?coachId=${coachId}`;
    }
    this.props.dispatch(routerRedux.push(url));
  };
  gotoSignDetail = contractId => {
    const { coachId } = this.state;
    this.props.dispatch(
      routerRedux.push(`/useradmin/coach-course-order?coachId=${coachId}&contractId=${contractId}`)
    );
  };
  renderCoachBasicInfo = () => {
    const { coachDetail: { currentCoach } } = this.props;
    return (
      <Card
        title="基本信息"
        extra={
          <a
            href=""
            onClick={e => {
              e.preventDefault();
              this.handleModalVisible(modalType.editInfo, true);
            }}
          >
            编辑
          </a>
        }
      >
        <Row className={styles.rowMargin}>
          <Col span={4}>
            <Input
              addonBefore="ID"
              className={styles.disableInput}
              disabled
              value={currentCoach.id}
            />
          </Col>
          <Col span={1} />
          <Col span={6}>
            <Input
              addonBefore="注册时间"
              className={styles.disableInput}
              disabled
              value={
                currentCoach.registerTime
                  ? moment(currentCoach.registerTime).format('YYYY-MM-DD')
                  : ''
              }
            />
          </Col>
        </Row>
        <Row className={styles.rowMargin}>
          <Col span={4}>
            <Input
              addonBefore="姓名"
              className={styles.disableInput}
              disabled
              value={currentCoach.name}
            />
          </Col>
          <Col span={1} />
          <Col span={6}>
            <Input
              addonBefore="联系方式"
              className={styles.disableInput}
              disabled
              value={currentCoach.mobile}
            />
          </Col>
        </Row>
        <Row className={styles.rowMargin}>
          <Col span={4}>
            <Input
              addonBefore="地区"
              className={styles.disableInput}
              disabled
              value={currentCoach.teacherProvince}
            />
          </Col>
          <Col span={1} />
          <Col span={4}>
            <Input className={styles.disableInput} disabled value={currentCoach.teacherCity} />
          </Col>
        </Row>
        <Row className={styles.rowMargin}>
          <Col span={4}>
            <Input
              addonBefore="所属"
              className={styles.disableInput}
              disabled
              value={currentCoach.schoolName}
            />
          </Col>
          <Col span={1} />
          <Col span={4}>
            <Input className={styles.disableInput} disabled value={currentCoach.schoolType} />
          </Col>
          <Col span={1} />
          <Col span={4}>
            <Input className={styles.disableInput} disabled value={currentCoach.schoolContract} />
          </Col>
          <Col span={1} />
          <Col span={6}>
            <Input
              addonBefore="行政身份"
              className={styles.disableInput}
              disabled
              value={currentCoach.teacherIdentity}
            />
          </Col>
        </Row>
      </Card>
    );
  };
  renderCoachStudentList = () => {
    const goodsColumns = [
      { title: '学生ID', dataIndex: 'studentId', key: 'studentId' },
      { title: '学生名', dataIndex: 'studentName', key: 'studentName' },
      { title: '手机号', dataIndex: 'studentMobile', key: 'studentMobile' },
      { title: '渠道来源', dataIndex: 'studentOrigin', key: 'studentOrigin', align: 'center' },
      { title: '课程数', dataIndex: 'studentClassNum', key: 'studentClassNum', align: 'center' },
      {
        title: '历史完课率',
        dataIndex: 'studentHistoryOverPercent',
        key: 'studentHistoryOverPercent',
        align: 'center',
        render: studentHistoryOverPercent => `${parseInt(studentHistoryOverPercent * 100, 10)}%`,
      },
      {
        title: '当前在读数',
        dataIndex: 'studentNowReadNum',
        key: 'studentNowReadNum',
        align: 'center',
      },
      {
        title: '完课率',
        dataIndex: 'studentNowOverPercent',
        key: 'studentNowOverPercent',
        align: 'center',
        render: studentNowOverPercent => `${parseInt(studentNowOverPercent * 100, 10)}%`,
      },
    ];
    const {
      coachDetail: {
        courseTypeAndStatusList,
        selectCourseTypeAndStatu,
        courseAndClassList,
        selectCourseAndClassList,
        studentCourseItemList,
        teacherStudentCount,
      },
    } = this.props;
    return (
      <Card
        title={
          <Row>
            <Col span={24}>
              <h3>学生列表</h3>
            </Col>
          </Row>
        }
        style={{ marginTop: 25 }}
      >
        <Row gutter={26}>
          <Col span={6}>
            <Select
              style={{ width: '200px' }}
              value={selectCourseTypeAndStatu}
              onChange={value => {
                this.props.dispatch({
                  type: 'coachDetail/fetchStatStudentCourseItemList',
                  payload: { selectCourseTypeAndStatu: value, selectCourseAndClassList },
                });
              }}
            >
              {courseTypeAndStatusList.map(item => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.value}
                  </Option>
                );
              })}
            </Select>
          </Col>
          <Col span={16}>
            <Cascader
              value={selectCourseAndClassList}
              options={courseAndClassList}
              onChange={value => {
                this.props.dispatch({
                  type: 'coachDetail/fetchStatStudentCourseItemList',
                  payload: { selectCourseTypeAndStatu, selectCourseAndClassList: value },
                });
              }}
              placeholder="请选择课程"
              style={{ width: 300 }}
            />
          </Col>
        </Row>
        <div style={{ margin: 20 }}>
          <a>在读学员：{teacherStudentCount.nowNum}人</a>
          <a className={styles.marginLeft}>历史学员人次：{teacherStudentCount.historyNum}人</a>
        </div>
        <div className={styles.marginTopBottom} />
        <Table
          style={{ marginBottom: 24 }}
          pagination={false}
          rowKey={record => record.studentId}
          dataSource={studentCourseItemList}
          columns={goodsColumns}
          bordered
        />
      </Card>
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
              onClick={e => {
                e.preventDefault();
                this.handleModalVisible(modalType.addCommunication, true);
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
    const { addModalVisible, setModalVisible, communicationModalVisible } = this.state;
    const {
      coachDetail: {
        currentCoach,
        city,
        allSchoolList,
        connectRecord,
        activityRecord,
        classRecord,
      },
    } = this.props;

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
        title: 'B端教练详情',
      },
    ];
    const connectShowMore = {
      content: '点击查看更多沟通记录',
      showMoreMethod: this.showMore.bind(null, 2),
    };
    const activityShowMore = {
      content: '点击查看更多',
      showMoreMethod: this.showMore.bind(null, 3),
    };
    const classShowMore = {
      content: '点击查看更多历史签约',
      showMoreMethod: this.showMore.bind(null, 1),
    };
    return (
      <PageHeaderLayout title="" breadcrumbList={breadcrumb}>
        {this.renderCoachBasicInfo()}
        <Row style={{ marginTop: 25 }} gutter={26}>
          <Col span={12}>
            <RecordList
              loading={this.props.loading}
              title={this.renderClassTitle()}
              clickGotoDetail={this.gotoSignDetail}
              showNum={3}
              showMore={classShowMore}
              recordList={classRecord}
              flagType={1}
              height={styles.card_list_wrp}
            />
          </Col>
          <Col span={12}>
            <RecordList
              loading={this.props.loading}
              title={this.renderConnectTitle()}
              showNum={3}
              showMore={connectShowMore}
              recordList={connectRecord}
              flagType={2}
              height={styles.card_list_wrp}
            />
          </Col>
        </Row>
        {this.renderCoachStudentList()}
        <div style={{ marginTop: 25 }}>
          <RecordList
            loading={this.props.loading}
            title={
              <Row>
                <Col span={4}>
                  <h3>活动参与</h3>
                </Col>
              </Row>
            }
            showNum={3}
            showMore={activityShowMore}
            recordList={activityRecord}
            flagType={2}
          />
        </div>
        <RouteCoachAdd
          data={currentCoach}
          city={city}
          enable
          allSchoolList={allSchoolList}
          modalVisible={addModalVisible}
          submitCoachInfo={this.submitCoachInfo}
          onChangeVisible={flag => {
            this.handleModalVisible(modalType.editInfo, flag);
          }}
        />
        <SetAuthority
          width={900}
          modalVisible={setModalVisible}
          onChangeVisible={flag => {
            this.handleModalVisible(modalType.setQRCode, flag);
          }}
        />
        <AddCommunication
          modalVisible={communicationModalVisible}
          coachId={this.state.coachId}
          onCancelVisible={() => {
            this.setState({
              communicationModalVisible: false,
            });
          }}
          onChangeVisible={flag => {
            this.handleModalVisible(modalType.addCommunication, flag);
          }}
        />
      </PageHeaderLayout>
    );
  }
}
export default Form.create()(CoachDetail);
