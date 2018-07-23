import React, { Component, Fragment } from 'react';
import { connect } from 'dva';

import { Row, Col, Modal, Form, Input, Select, DatePicker, Table, Button } from 'antd';
import styles from './index.less';

const { Option } = Select;
const children = [];
for (let i = 10; i < 3; i + 1) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

@connect(({ signAgainGive, loading }) => ({
  signAgainGive,
  loading: loading.models.list,
}))
@Form.create()
export default class SignAgainGive extends Component {
  // static defaultProps = {
  //   showSign
  // }
  constructor(props) {
    super(props);
    this.state = {
      // addFlag: 0,
    };
    this.columns = [
      {
        title: '课程名',
        dataIndex: 'courseName',
        key: 'courseName',
      },
      {
        title: '有效期设定',
        dataIndex: 'effectiveTerm',
        key: 'effectiveTerm',
      },
      {
        title: '学生上限设定',
        dataIndex: 'studentTOpLimit',
        key: 'studentTOpLimit',
      },
      {
        title: '班级设定',
        dataIndex: 'classSet',
        key: 'classSet',
        width: 300,
        render: (classSet, record, rowIndex) => {
          let key = 0;
          return (
            <div>
              {record.classSet.map(item => {
                key += 1;
                const isSelectClass = this.getArrayKeysValue(
                  item.connectClass,
                  'isSelect',
                  'classId'
                );
                return (
                  <div key={key} style={{ marginTop: 20 }}>
                    <Row gutter={6}>
                      <Col span={7}>
                        <Select
                          defaultValue={isSelectClass}
                          style={{ width: '100%' }}
                          disabled={!!isSelectClass.length}
                          placeholder="请选择班级"
                        >
                          {item.connectClass.map(citem => {
                            return (
                              <Option value={citem.classId} key={citem.classId}>
                                {citem.className}
                              </Option>
                            );
                          })}
                        </Select>
                      </Col>
                      <Col span={7} style={{ textAlign: 'center', paddingTop: 5 }}>
                        关联教练：
                      </Col>
                      <Col span={10}>
                        <Select
                          mode="multiple"
                          style={{ width: '100%' }}
                          placeholder="Please select"
                          defaultValue={this.getArrayKeysValue(
                            item.connectTeacher,
                            'isConnect',
                            'teacherId'
                          )}
                          onChange={() => {}}
                        >
                          {item.connectTeacher.map(sitem => {
                            return (
                              <Option key={sitem.teacherId} value={sitem.teacherId}>
                                {sitem.teacherName}
                              </Option>
                            );
                          })}
                        </Select>
                      </Col>
                    </Row>
                  </div>
                );
              })}
              <Row style={{ marginTop: 20 }}>
                <Col span={24} style={{ textAlign: 'center', paddingTop: 5 }}>
                  <Button
                    type="primary"
                    onClick={this.addSignClass.bind(null, rowIndex)}
                    loading={this.props.signAgainGive.confirmLoadding}
                  >
                    新增班级
                  </Button>
                </Col>
              </Row>
            </div>
          );
        },
      },
      {
        title: '状态',
        dataIndex: 'condition',
        key: 'condition',
      },
    ];
    this.dataSource = [
      {
        key: '1',
        courseName: '初一数学',
        effectiveTerm: 32,
        studentTOpLimit: 100,
        classSet: [
          {
            connectClass: [
              {
                classId: 1,
                isSelect: true,
                className: '1班',
              },
              {
                classId: 2,
                isSelect: false,
                className: '2班',
              },
            ],
            connectTeacher: [
              {
                teacherId: 1,
                isConnect: true,
                teacherName: '王老师',
              },
              {
                teacherId: 2,
                isConnect: true,
                teacherName: '黄老师',
              },
              {
                teacherId: 3,
                isConnect: false,
                teacherName: '章老师',
              },
            ],
          },
        ],
        condition: '过期',
      },
    ];
  }
  getArrayKeysValue = (list, filterKey, key) => {
    const arr = [];
    list.forEach(item => {
      if (item[filterKey]) {
        arr.push(item[key]);
      }
    });
    return arr;
  };

  addSignClass = rowIndex => {
    this.props.dispatch({
      type: 'signAgainGive/setState',
      payload: {
        confirmLoadding: true,
      },
    });
    setTimeout(() => {
      this.dataSource[rowIndex].classSet.push({
        connectClass: [
          {
            classId: 1,
            isSelect: false,
            className: '1班',
          },
          {
            classId: 2,
            isSelect: false,
            className: '2班',
          },
        ],
        connectTeacher: [
          {
            teacherId: 1,
            isConnect: false,
            teacherName: '王老师',
          },
          {
            teacherId: 2,
            isConnect: false,
            teacherName: '黄老师',
          },
          {
            teacherId: 3,
            isConnect: false,
            teacherName: '章老师',
          },
        ],
      });
      this.props.dispatch({
        type: 'signAgainGive/setState',
        payload: {
          confirmLoadding: false,
        },
      });
    }, 2000);
  };
  signAgainGive = visible => {
    this.props.dispatch({
      type: 'signAgainGive/setState',
      payload: {
        signAgainGiveVisible: visible,
      },
    });
  };

  addSendCourse = () => {
    this.dataSource.push({
      key: '2',
      courseName: '初一数学',
      effectiveTerm: 32,
      studentTOpLimit: 100,
      classSet: [
        {
          connectClass: [
            {
              classId: 1,
              isSelect: true,
              className: '1班',
            },
            {
              classId: 2,
              isSelect: false,
              className: '2班',
            },
          ],
          connectTeacher: [
            {
              teacherId: 1,
              isConnect: true,
              teacherName: '王老师',
            },
            {
              teacherId: 2,
              isConnect: true,
              teacherName: '黄老师',
            },
            {
              teacherId: 3,
              isConnect: false,
              teacherName: '章老师',
            },
          ],
        },
      ],
      condition: '过期',
    });
    this.props.dispatch({
      type: 'signAgainGive/setState',
      payload: {
        confirmLoadding: false,
      },
    });
  };
  render() {
    const { signAgainGiveVisible, signAgainGiveShowSign } = this.props.signAgainGive;
    const rowStyle = {
      margin: '20px 10px',
    };
    const paddingTOp = {
      paddingTop: 5,
    };

    return (
      <Fragment>
        <div id="add_connect_record">
          <Modal
            title={this.props.title}
            visible={signAgainGiveVisible}
            onOk={() => {}}
            onCancel={this.signAgainGive.bind(null, false)}
            okText="提交"
            width={750}
          >
            <div>
              <Row gutter={36} style={rowStyle}>
                <Col span={12}>
                  <Row>
                    <Col span={10} style={paddingTOp}>
                      学校/机构：
                    </Col>
                    <Col span={14}>
                      <Input value="北京四中" disabled />
                    </Col>
                  </Row>
                </Col>
                <Col span={10}>
                  <Row>
                    <Col span={10} style={paddingTOp}>
                      类型：
                    </Col>
                    <Col span={14}>
                      <Select
                        style={{ width: '150px' }}
                        placeholder="请选择"
                        value="学校-高中"
                        disabled
                      >
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
                      </Select>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {signAgainGiveShowSign ? (
                <Row gutter={36} style={rowStyle}>
                  <Col span={12}>
                    <Row>
                      <Col span={10} style={paddingTOp}>
                        <span className={styles.edit_student_required}>*</span>签约合同编码：
                      </Col>
                      <Col span={14}>
                        <Input
                          placeholder="请输入"
                          onChange={e => {
                            this.props.dispatch({
                              type: 'signAgainGive/setState',
                              payload: { writeSignCode: e.target.value },
                            });
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col span={10}>
                    <Row>
                      <Col span={10} style={paddingTOp}>
                        <span className={styles.edit_student_required}>*</span>签约时间：
                      </Col>
                      <Col span={14}>
                        <DatePicker
                          onChange={(data, dataString) => {
                            this.props.dispatch({
                              type: 'signAgainGive/setState',
                              payload: { writeSignTime: dataString },
                            });
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              ) : null}

              <Row gutter={36} style={rowStyle}>
                <Col span={12}>
                  <Row>
                    <Col span={10} style={paddingTOp}>
                      返点机构：
                    </Col>
                    <Col span={14}>
                      <Input
                        placeholder="请输入"
                        onChange={e => {
                          this.props.dispatch({
                            type: 'signAgainGive/setState',
                            payload: { writeSignBackOrganization: e.target.value },
                          });
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row gutter={36} style={rowStyle}>
                <Col span={12}>
                  <Row>
                    <Col span={10} style={paddingTOp}>
                      返点教练：
                    </Col>
                    <Col span={14}>
                      <Input
                        placeholder="请填写"
                        onChange={e => {
                          this.props.dispatch({
                            type: 'signAgainGive/setState',
                            payload: { writeSingBackTeacherA: e.target.value },
                          });
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col span={5}>
                  <Row>
                    <Col span={24}>
                      <Input
                        placeholder="请填写"
                        onChange={e => {
                          this.props.dispatch({
                            type: 'signAgainGive/setState',
                            payload: { writeSingBackTeacherB: e.target.value },
                          });
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col span={5}>
                  <Row>
                    <Col span={24}>
                      <Input
                        placeholder="请填写"
                        onChange={e => {
                          this.props.dispatch({
                            type: 'signAgainGive/setState',
                            payload: { writeSingBackTeacherC: e.target.value },
                          });
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row gutter={36} style={rowStyle}>
                <Col span={24}>
                  <Row>
                    <Col span={10} style={paddingTOp}>
                      预约课程：
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row gutter={36} style={rowStyle}>
                <Col span={24}>
                  <Table
                    dataSource={this.dataSource}
                    columns={this.columns}
                    bordered
                    footer={() => (
                      <div style={{ textAlign: 'center' }}>
                        <a className={styles.item_title} onClick={this.addSendCourse}>
                          增加课程
                        </a>
                      </div>
                    )}
                  />
                </Col>
              </Row>
            </div>
          </Modal>
        </div>
      </Fragment>
    );
  }
}
