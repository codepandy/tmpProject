import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal, Card, Input, Select, DatePicker, message, Cascader } from 'antd';
import moment from 'moment';
import styles from './index.less';

const { Option } = Select;
@connect(({ editStudentInfo, loading }) => ({
  editStudentInfo,
  loading: loading.effects['editStudentInfo/fetch'],
}))
export default class BasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'editStudentInfo/fetch',
      payload: {
        studentId: this.props.studentId,
      },
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'editStudentInfo/clear',
    });
  }
  editBasicInfo = () => {
    this.props.dispatch({
      type: 'editStudentInfo/queryEditStudentInfo',
    });
  };
  /**
   * 编辑信息提交
   */
  submitStudentInfo = () => {
    const { writeRegisterTime, writeTrialAccount } = this.props.editStudentInfo;
    if (!writeRegisterTime) {
      return message.warning('请填写注册时间');
    }
    if (!writeTrialAccount && writeTrialAccount !== 0) {
      return message.warning('请选择是否是试用账号');
    }
    this.props.dispatch({
      type: 'editStudentInfo/submitStudentInfo',
      payload: {
        studentId: this.props.studentId,
      },
      callback: () => {
        this.props.dispatch({
          type: 'editStudentInfo/fetch',
          payload: {
            studentId: this.props.studentId,
          },
        });
      },
    });
  };
  /**
   * 基本信息展示
   */
  renderBasicInfo = () => {
    const rowStyle = {
      margin: '20px 10px',
    };
    const paddingTOp = {
      paddingTop: 2,
    };
    const { basicInfo } = this.props.editStudentInfo;
    return (
      <div>
        <Row gutter={36} style={rowStyle}>
          <Col span={6}>
            <Row>
              <Col span={8} style={paddingTOp}>
                姓名：
              </Col>
              <Col span={16}>
                <Input
                  value={basicInfo.name ? basicInfo.name : '--'}
                  className={styles.input_disable}
                  disabled
                />
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row>
              <Col span={8} style={paddingTOp}>
                联系方式：
              </Col>
              <Col span={16}>
                <Input
                  value={basicInfo.mobile ? basicInfo.mobile : '--'}
                  className={styles.input_disable}
                  disabled
                />
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row>
              <Col span={8} style={paddingTOp}>
                注册时间：
              </Col>
              <Col span={16}>
                <Input
                  value={
                    basicInfo.registerTime
                      ? moment(basicInfo.registerTime).format('YYYY-MM-DD')
                      : '--'
                  }
                  className={styles.input_disable}
                  disabled
                />
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row>
              <Col span={8} style={paddingTOp}>
                试用账号：
              </Col>
              <Col span={16}>
                <Input
                  value={basicInfo.tryFlag ? '是' : '非'}
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
                渠道来源：
              </Col>
              <Col span={16}>
                <Input
                  value={basicInfo.origin ? basicInfo.origin : '--'}
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
                <Input
                  value={basicInfo.studentProvince ? basicInfo.studentProvince : '--'}
                  className={styles.input_disable}
                  disabled
                />
              </Col>
            </Row>
          </Col>
          <Col span={4}>
            <Row>
              <Col span={24}>
                <Input
                  value={basicInfo.studentCity ? basicInfo.studentCity : '--'}
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
                就读：
              </Col>
              <Col span={16}>
                <Input
                  value={basicInfo.realSchoolName ? basicInfo.realSchoolName : '--'}
                  className={styles.input_disable}
                  disabled
                />
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row>
              <Col span={8} style={paddingTOp}>
                所属：
              </Col>
              <Col span={16}>
                <Input
                  value={basicInfo.schoolName ? basicInfo.schoolName : '--'}
                  className={styles.input_disable}
                  disabled
                />
              </Col>
            </Row>
          </Col>
          <Col span={4}>
            <Row>
              <Col span={24}>
                <Input
                  value={basicInfo.schoolType ? basicInfo.schoolType : '--'}
                  className={styles.input_disable}
                  disabled
                />
              </Col>
            </Row>
          </Col>
          <Col span={4}>
            <Row>
              <Col span={24}>
                <Input
                  value={basicInfo.schoolContract ? '签约' : '没有签约'}
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
                最高获奖：
              </Col>
              <Col span={16}>
                <Input
                  value={basicInfo.highestAward ? basicInfo.highestAward : '--'}
                  className={styles.input_disable}
                  disabled
                />
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row>
              <Col span={8} style={paddingTOp}>
                自招：
              </Col>
              <Col span={16}>
                <Input
                  value={basicInfo.independentEnrolment ? basicInfo.independentEnrolment : '--'}
                  className={styles.input_disable}
                  disabled
                />
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row>
              <Col span={8} style={paddingTOp}>
                毕业去向：
              </Col>
              <Col span={16}>
                <Input
                  value={basicInfo.graduating ? basicInfo.graduating : '--'}
                  className={styles.input_disable}
                  disabled
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  };
  /**
   * 编辑基本信息
   */
  renderEditBasicInfo = () => {
    const rowStyle = {
      margin: '20px 10px',
    };
    const paddingTOp = {
      paddingTop: 2,
    };
    const {
      basicInfoEditVisible,
      editStudentConfirmLoading,
      city,
      allSchoolList,
      writeStudentName,
      writeRegisterTime,
      writeTrialAccount,
      writeStudentConnect,
      writeProvice,
      writeRealSchoolName,
      highestAward,
      selfConfess,
      graduateForPlace,
      writeSchoolName,
    } = this.props.editStudentInfo;
    return (
      <div>
        <Modal
          title="学生基本信息编辑"
          visible={basicInfoEditVisible}
          onOk={this.submitStudentInfo}
          confirmLoading={editStudentConfirmLoading}
          width={750}
          onCancel={() => {
            this.props.dispatch({
              type: 'editStudentInfo/setState',
              payload: {
                basicInfoEditVisible: false,
              },
            });
          }}
        >
          <div>
            <Row gutter={36} style={rowStyle}>
              <Col span={8}>
                <Row>
                  <Col span={10} style={paddingTOp}>
                    <span className={styles.edit_student_required}>*</span>姓名：
                  </Col>
                  <Col span={14}>
                    <Input
                      placeholder="请填写"
                      disabled
                      defaultValue={writeStudentName}
                      onChange={e => {
                        this.props.dispatch({
                          type: 'editStudentInfo/setState',
                          payload: { writeStudentName: e.target.value },
                        });
                      }}
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={8}>
                <Row>
                  <Col span={10} style={paddingTOp}>
                    <span className={styles.edit_student_required}>*</span>注册时间：
                  </Col>
                  <Col span={14}>
                    <DatePicker
                      defaultValue={moment(
                        moment(writeRegisterTime).format('YYYY-MM-DD'),
                        'YYYY-MM-DD'
                      )}
                      disabled
                      onChange={data => {
                        this.props.dispatch({
                          type: 'editStudentInfo/setState',
                          payload: { writeRegisterTime: moment(data).format('x') },
                        });
                      }}
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={8}>
                <Row>
                  <Col span={10} style={paddingTOp}>
                    <span className={styles.edit_student_required}>*</span>试用账号：
                  </Col>
                  <Col span={14}>
                    <Select
                      style={{ width: '100px' }}
                      placeholder="请选择"
                      defaultValue={`${writeTrialAccount}`}
                      onChange={value => {
                        this.props.dispatch({
                          type: 'editStudentInfo/setState',
                          payload: { writeTrialAccount: value },
                        });
                      }}
                    >
                      <Option value="1">是</Option>
                      <Option value="0">非</Option>
                    </Select>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={36} style={rowStyle}>
              <Col span={8}>
                <Row>
                  <Col span={10} style={paddingTOp}>
                    <span className={styles.edit_student_required}>*</span>联系方式
                  </Col>
                  <Col span={14}>
                    <Input
                      defaultValue={writeStudentConnect}
                      disabled
                      placeholder="请输入"
                      onChange={e => {
                        this.props.dispatch({
                          type: 'editStudentInfo/setState',
                          payload: { writeStudentConnect: e.target.value },
                        });
                      }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={36} style={rowStyle}>
              <Col span={8}>
                <Row>
                  <Col span={10} style={paddingTOp}>
                    地区：
                  </Col>
                  <Col span={14}>
                    <Cascader
                      options={city}
                      style={{ width: 200 }}
                      defaultValue={writeProvice}
                      placeholder="请选择地区"
                      onChange={value => {
                        this.props.dispatch({
                          type: 'editStudentInfo/setState',
                          payload: { writeProvice: value },
                        });
                      }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={36} style={rowStyle}>
              <Col span={8}>
                <Row>
                  <Col span={10} style={paddingTOp}>
                    就读学校：
                  </Col>
                  <Col span={14}>
                    <Input
                      placeholder="请填写"
                      disabled
                      defaultValue={writeRealSchoolName}
                      onChange={e => {
                        this.props.dispatch({
                          type: 'editStudentInfo/setState',
                          payload: { writeRealSchoolName: e.target.value },
                        });
                      }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={36} style={rowStyle}>
              <Col span={8}>
                <Row>
                  <Col span={10} style={paddingTOp}>
                    所属学校：
                  </Col>
                  <Col span={14}>
                    <Cascader
                      defaultValue={writeSchoolName}
                      options={allSchoolList}
                      onChange={value => {
                        this.props.dispatch({
                          type: 'editStudentInfo/setState',
                          payload: { writeSchoolName: value },
                        });
                      }}
                      style={{ width: 300 }}
                    />
                  </Col>
                </Row>
              </Col>

              {/* <Col span={8}>
                <Row>
                  <Col span={10} style={paddingTOp}>
                    所属学校：
                  </Col>
                  <Col span={14}>
                    <Input
                      placeholder="请填写"
                      defaultValue={basicInfo.schoolName ? basicInfo.schoolName : ''}
                      onChange={e => {
                        this.props.dispatch({
                          type: 'editStudentInfo/setState',
                          payload: { writeschoolName: e.target.value },
                        });
                      }}
                    />
                  </Col>
                </Row>
              </Col> */}
              {/* <Col span={6}>
                <Row>
                  <Col span={24}>
                    <Select
                      style={{ width: '100px' }}
                      placeholder="请选择"
                      onChange={value => {
                        this.props.dispatch({
                          type: 'editStudentInfo/setState',
                          payload: { writeStudentForOrigination: value },
                        });
                      }}
                    >
                      <Option value="1">北京四中</Option>
                    </Select>
                  </Col>
                </Row>
              </Col> */}
              {/* <Col span={6}>
                <Row>
                  <Col span={24}>
                    <Select
                      style={{ width: '100px' }}
                      placeholder="请选择"
                      onChange={value => {
                        this.props.dispatch({
                          type: 'editStudentInfo/setState',
                          payload: { writeStudentIsSign: value },
                        });
                      }}
                    >
                      <Option value="1">北京四中</Option>
                    </Select>
                  </Col>
                </Row>
              </Col> */}
            </Row>
            <Row gutter={36} style={rowStyle}>
              <Col span={8}>
                <Row>
                  <Col span={10} style={paddingTOp}>
                    最高获奖：
                  </Col>
                  <Col span={14}>
                    <Input
                      defaultValue={highestAward}
                      placeholder="请填写"
                      onChange={e => {
                        this.props.dispatch({
                          type: 'editStudentInfo/setState',
                          payload: { highestAward: e.target.value },
                        });
                      }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={36} style={rowStyle}>
              <Col span={8}>
                <Row>
                  <Col span={10} style={paddingTOp}>
                    自招：
                  </Col>
                  <Col span={14}>
                    <Input
                      defaultValue={selfConfess}
                      placeholder="选填"
                      onChange={e => {
                        this.props.dispatch({
                          type: 'editStudentInfo/setState',
                          payload: { selfConfess: e.target.value },
                        });
                      }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={36} style={rowStyle}>
              <Col span={8}>
                <Row>
                  <Col span={10} style={paddingTOp}>
                    毕业去向：
                  </Col>
                  <Col span={14}>
                    <Input
                      defaultValue={graduateForPlace}
                      placeholder="请填写"
                      onChange={e => {
                        this.props.dispatch({
                          type: 'editStudentInfo/setState',
                          payload: { graduateForPlace: e.target.value },
                        });
                      }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    );
  };
  render() {
    const { basicInfoEditVisible } = this.props.editStudentInfo;
    return (
      <Fragment>
        <Card
          title="基本信息"
          extra={<a onClick={this.editBasicInfo}>编辑</a>}
          loading={this.props.loading}
        >
          {this.renderBasicInfo()}
          {this.renderEditBasicInfo()}
          {basicInfoEditVisible ? this.renderEditBasicInfo() : null}
        </Card>
      </Fragment>
    );
  }
}
