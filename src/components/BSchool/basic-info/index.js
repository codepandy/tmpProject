import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Input } from 'antd';
import SubmitAddSchoolInfo from 'components/BSchool/submit-add-school-info';
import Blank from 'components/Blank';

import styles from './index.less';
@connect(({ bschoolBasicInfo, loading, editOrAddSchool }) => ({
  bschoolBasicInfo,
  loading: loading.effects['bschoolBasicInfo/getSchoolBasicInfo'],
  editOrAddSchool,
}))
export default class BasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount = () => {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'bschoolBasicInfo/getSchoolBasicInfo',
      payload: { schoolId: +id },
    });
  };
  fetchBasicInfo = () => {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'bschoolBasicInfo/getSchoolBasicInfo',
      payload: { schoolId: +id },
    });
  };
  submitEditSchoolInfo = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'editOrAddSchool/submitEditSchoolInfo',
      payload: { id: +this.props.id, ...value },
      callback: () => {
        this.fetchBasicInfo();
      },
    });
  };
  renderBasicInfo = () => {
    const rowStyle = { margin: '20px 10px' };
    const paddingTOp = { paddingTop: 5 };
    const { bschoolBasicInfo: { basicInfos: { data: basicInfo } } } = this.props;
    return (
      <div>
        <Row gutter={36} style={rowStyle}>
          <Col span={6}>
            <Row>
              <Col span={8} style={paddingTOp}>
                ID编号：
              </Col>
              <Col span={16}>
                <Input value={basicInfo.schoolId} className={styles.input_disable} disabled />
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row>
              <Col span={8} style={paddingTOp}>
                学校：
              </Col>
              <Col span={16}>
                <Input value={basicInfo.schoolName} className={styles.input_disable} disabled />
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row>
              <Col span={8} style={paddingTOp}>
                类型：
              </Col>
              <Col span={16}>
                <Input value={basicInfo.schoolType} className={styles.input_disable} disabled />
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row>
              <Col span={8} style={paddingTOp}>
                渠道来源：
              </Col>
              <Col span={16}>
                <Input
                  value={basicInfo.schoolOrigin ? basicInfo.schoolOrigin : '--'}
                  className={styles.input_disable}
                  disabled
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={36} style={rowStyle}>
          <Col span={6}>
            <Row>
              <Col span={8} style={paddingTOp}>
                入驻时间：
              </Col>
              <Col span={16}>
                <Input
                  value={
                    basicInfo.schoolEntryTime
                      ? moment(basicInfo.schoolEntryTime).format('YYYY-MM-DD')
                      : '--'
                  }
                  className={styles.input_disable}
                  disabled
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={36} style={rowStyle}>
          <Col span={6}>
            <Row>
              <Col span={8} style={paddingTOp}>
                地区：
              </Col>
              <Col span={16}>
                <Input value={basicInfo.schoolProvince} className={styles.input_disable} disabled />
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row>
              <Col span={16}>
                <Input value={basicInfo.schoolCity} className={styles.input_disable} disabled />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={36} style={rowStyle}>
          <Col span={6}>
            <Row>
              <Col span={8} style={paddingTOp}>
                管理员：
              </Col>
              <Col span={16}>
                <Input value={basicInfo.schoolAdmin} className={styles.input_disable} disabled />
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row>
              <Col span={8} style={paddingTOp}>
                联系方式：
              </Col>
              <Col span={16}>
                <Input value={basicInfo.schoolMobile} className={styles.input_disable} disabled />
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row>
              <Col span={8} style={paddingTOp}>
                看课模式：
              </Col>
              <Col span={16}>
                <Input value={basicInfo.schoolMode} className={styles.input_disable} disabled />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  };
  render() {
    const {
      bschoolBasicInfo: { basicInfos: { code: basicInfoCode, data: basicInfo } },
      loading,
    } = this.props;
    const { visible } = this.props.editOrAddSchool;
    if (basicInfoCode !== 1) {
      return (
        <Fragment>
          <Card title={<h3>基本信息</h3>} loading={loading}>
            <Blank />
          </Card>
        </Fragment>
      );
    }
    return (
      <Fragment>
        <Card
          title={<h3>基本信息</h3>}
          loading={loading}
          extra={
            <a
              onClick={() => {
                this.props.dispatch({ type: 'editOrAddSchool/fetchBschoolBasicDictionaries' });
              }}
            >
              编辑
            </a>
          }
        >
          {this.renderBasicInfo()}
          {visible ? (
            <SubmitAddSchoolInfo
              editState
              submitAddSchoolInfo={this.submitEditSchoolInfo}
              schoolName={basicInfo.schoolName}
              shcoolType={basicInfo.schoolTypeKey}
              schoolOrigin={basicInfo.schoolOriginKey}
              schoolAdmin={basicInfo.schoolAdmin}
              connectIphone={basicInfo.schoolMobile}
              lookCourseModel={basicInfo.schoolModeKey}
              area={[basicInfo.schoolProvinceKey, basicInfo.schoolCityKey]}
            />
          ) : null}
        </Card>
      </Fragment>
    );
  }
}
