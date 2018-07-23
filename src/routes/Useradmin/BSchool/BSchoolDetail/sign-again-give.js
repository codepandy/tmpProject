import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Form,
  Input,
  Modal,
  Select,
  DatePicker,
  Table,
  Card,
  message,
  InputNumber,
  Popconfirm,
} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import { parseSearch } from '../../../../utils/utils';
// import styles from './index.less';

const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const deleteCourseText = '删除该课程，可能会对用户的使用产生影响，请谨慎操作';
const deleteCourseClassText = '删除该班级，可能会对用户的使用产生影响，请谨慎操作';
let NEW_ADD_ID = -1;

@connect(({ signAgainGive, loading }) => ({
  signAgainGive,
  loading: loading.models.list,
}))
@Form.create()
export default class SignAgainGive extends Component {
  constructor(props) {
    super(props);
    const { search } = this.props.location;
    const { schoolId, signFlag, contractId } = parseSearch(search);
    this.state = {
      schoolId,
      signFlag,
      visible: false,
      contractId,
      courseVisible: false,
      classVisible: false,
    };
    this.setClassColumns = [
      {
        title: '班级设定',
        dataIndex: 'className',
        key: 'className',
        render: (className, record) => {
          const { teacherSimpleList } = this.props.signAgainGive;
          return (
            <div key={record.classId} style={{ marginTop: 20 }}>
              <Row gutter={6}>
                <Col span={4}>
                  <Input
                    defaultValue={className}
                    onChange={e => {
                      this.changeClassList(record.classId, e.target.value);
                    }}
                  />
                </Col>
                <Col span={4} style={{ textAlign: 'center', paddingTop: 5 }}>
                  关联教练：
                </Col>
                <Col span={16}>
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="请选择管理教练"
                    // defaultValue={this.getArrayKeysValue(record.teacherList, 'teacherId')}
                    defaultValue={record.teacherList}
                    onChange={value => {
                      this.changeTeacherList(record.classId, value);
                    }}
                  >
                    {teacherSimpleList.map(sitem => {
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
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (operation, record) => {
          return (
            <a>
              <Popconfirm
                placement="topLeft"
                title={deleteCourseClassText}
                onConfirm={() => {
                  this.delteCourseClass(record.classId);
                }}
                okText="确认"
                cancelText="取消"
              >
                删除
              </Popconfirm>
              {operation}
            </a>
          );
        },
      },
    ];
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
        width: 200,
        render: (effectiveTerm, record) => {
          return (
            <div>
              <span>
                {record ? moment(record.courseValidStart).format('YYYY-MM-DD') : effectiveTerm}
              </span>
              <span>
                ~{record ? moment(record.courseValidEnd).format('YYYY-MM-DD') : effectiveTerm}
              </span>
            </div>
          );
        },
      },
      {
        title: '学生上限设定',
        dataIndex: 'studentNumLimit',
        key: 'studentNumLimit',
        width: 60,
      },
      {
        title: '班级设定',
        dataIndex: 'classList',
        key: 'classList',
        width: 400,
        render: classList => {
          return classList.map(item => {
            return (
              <Row gutter={16} key={item.classId} style={{ margin: '5px 0' }}>
                <Col span={4}>
                  {/* <Button>{item.className}</Button> */}
                  <span>{item.className}</span>
                </Col>
                <Col span={5}>关联教练:</Col>
                <Col span={15}>
                  {item.teacherList.map(citem => {
                    return <span key={citem.teacherId}>{`${citem.teacherName}、`}</span>;
                  })}
                </Col>
              </Row>
            );
          });
        },
      },
      {
        title: '状态',
        dataIndex: 'courseSignState',
        key: 'courseSignState',
        width: 60,
        render: courseSignState => {
          return courseSignState ? (
            <span style={{ color: 'red' }}>已到期</span>
          ) : (
            <span style={{ color: 'blue' }}>未到期</span>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 200,
        render: (operation, record) => {
          const style = {
            textDecoration: 'undeline',
            padding: '0 5px',
          };
          return (
            <div>
              <a
                style={style}
                onClick={() => {
                  this.clickSetClass(record);
                }}
              >
                班级设置
              </a>
              <a
                style={style}
                onClick={() => {
                  this.clickEditCourse(record);
                }}
              >
                编辑
              </a>
              <a
                style={style}
                // onClick={() => {
                //   this.delteCourse(record.courseId);
                // }}
              >
                <Popconfirm
                  placement="topLeft"
                  title={deleteCourseText}
                  onConfirm={() => {
                    this.delteCourse(record.courseId);
                  }}
                  okText="确认"
                  cancelText="取消"
                >
                  删除
                </Popconfirm>
              </a>
              <a>{operation}</a>
            </div>
          );
        },
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
  componentWillMount = () => {
    this.props.dispatch({
      type: 'signAgainGive/clear',
    });
  };
  /**
   * 组件加载完毕，拉取合同和课程信息
   */
  componentDidMount = () => {
    const { schoolId, contractId } = this.state;
    const xhr = { schoolId };
    if (contractId) {
      xhr.contractId = contractId;
    }
    this.props.dispatch({
      type: 'signAgainGive/querySchoolContractBasicInfo',
      payload: {
        ...xhr,
      },
    });
  };

  getArrayKeysValue = (list, key) => {
    const arr = [];
    list.forEach(item => {
      arr.push(item[key]);
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
  /**
   * 班级设置
   */
  changeClassList = (classId, value) => {
    const { setCourseClassList } = this.props.signAgainGive;
    setCourseClassList.forEach(item => {
      if (item.classId === classId) {
        Object.defineProperty(item, 'className', { value });
      }
    });
    this.props.dispatch({
      type: 'signAgainGive/setState',
      payload: {
        setCourseClassList,
      },
    });
  };
  /**
   * 老师选择
   */
  changeTeacherList = (classId, value) => {
    const { setCourseClassList } = this.props.signAgainGive;
    setCourseClassList.forEach(item => {
      if (item.classId === classId) {
        Object.defineProperty(item, 'teacherList', { value, enumerable: true });
      }
    });
    this.props.dispatch({
      type: 'signAgainGive/setState',
      payload: {
        setCourseClassList,
      },
    });
  };
  /**
   * 提交班级设定列表
   */
  submitClassSetInfo = () => {
    const { setCourseClassList } = this.props.signAgainGive;
    const { contractId } = this.state;
    this.props.dispatch({
      type: 'signAgainGive/submitClassSetInfo',
      payload: setCourseClassList,
      callback: () => {
        this.setState({ classVisible: false });
        this.props.dispatch({
          type: 'signAgainGive/fetchSignClass',
          payload: {
            contractId,
          },
        });
      },
    });
  };
  /**
   * 班级设置（新增班级）
   */
  addSendCourse = () => {
    const { setCourseClassList, classCurrentCourseId } = this.props.signAgainGive;
    const { contractId } = this.state;
    NEW_ADD_ID -= 1;
    const newList = {
      classId: NEW_ADD_ID,
      className: '',
      teacherList: [],
      contractId,
      courseId: classCurrentCourseId,
    };
    this.props.dispatch({
      type: 'signAgainGive/setState',
      payload: {
        setCourseClassList: [...setCourseClassList, newList],
      },
    });
  };

  showEditVisible = () => {
    this.setState({
      visible: true,
    });
  };
  /**
   * 删除课程
   */
  delteCourse = courseId => {
    const { schoolId, contractId } = this.state;
    this.props.dispatch({
      type: 'signAgainGive/delteCourse',
      payload: {
        contractId,
        courseId,
        schoolId,
      },
      callback: () => {
        this.props.dispatch({
          type: 'signAgainGive/fetchSignClass',
          payload: {
            contractId,
          },
        });
      },
    });
  };
  /**
   * 删除 【班级设置】 的行信息
   */
  delteCourseClass = classId => {
    const { contractId } = this.state;
    const { classCurrentCourseId, setCourseClassList } = this.props.signAgainGive;
    const newClassList = setCourseClassList.filter(item => {
      return item.classId !== classId;
    });
    if (classId > 0) {
      this.props.dispatch({
        type: 'signAgainGive/delteCourseClass',
        payload: {
          courseId: classCurrentCourseId,
          contractId,
          classId,
        },
        callback: () => {
          this.props.dispatch({
            type: 'signAgainGive/setState',
            payload: {
              setCourseClassList: newClassList,
            },
          });
        },
      });
    } else {
      this.props.dispatch({
        type: 'signAgainGive/setState',
        payload: {
          setCourseClassList: newClassList,
        },
      });
    }
  };
  /**
   * 点击编辑课程
   */
  clickEditCourse = (item = { courseValidStart: '', courseValidEnd: '' }) => {
    if (this.state.contractId) {
      this.props.dispatch({
        type: 'signAgainGive/setState',
        payload: {
          editCourseItem: item,
        },
      });
      this.setState({ courseVisible: true });
    } else {
      return message.error('请确认订单信息，并提交');
    }
  };
  /**
   * 点击 [ 班级设置 ]
   */
  clickSetClass = item => {
    const { contractId } = this.state;
    const classList = JSON.parse(JSON.stringify(item.classList));
    if (typeof item.classList === 'object') {
      if (classList.length > 0) {
        classList.forEach(sitem => {
          Object.defineProperty(sitem, 'courseId', { value: item.courseId, enumerable: true });
          Object.defineProperty(sitem, 'contractId', { value: contractId, enumerable: true });
          Object.defineProperty(sitem, 'teacherList', {
            value: this.getArrayKeysValue(sitem.teacherList, 'teacherId'),
            enumerable: true,
          });
        });
      }
    }
    this.props.dispatch({
      type: 'signAgainGive/setState',
      payload: {
        setCourseClassList: classList,
        classCurrentCourseId: item.courseId,
      },
    });
    this.setState({ classVisible: true });
  };
  /**
   * 取消信息编辑
   */
  cancelEditInfo = () => {
    this.setState({ visible: false });
  };
  /**
   * 提交  合同编辑信息
   */
  submitEditInfo = () => {
    const { form } = this.props;
    const { schoolId, contractId, signFlag } = this.state;
    const xhr = { schoolId: +schoolId, signFlag };
    if (contractId) {
      xhr.contractId = contractId;
    }
    form.validateFields((error, row) => {
      const { contractSignTime, schoolRebate, contractCode } = row;
      if (error) {
        return;
      }
      const signTime = +moment(contractSignTime).format('x');
      xhr.signTime = signTime;
      xhr.contractCode = contractCode;
      xhr.schoolRebate = schoolRebate;
      this.props.dispatch({
        type: 'signAgainGive/submitEditInfo',
        payload: xhr,
        callback: Id => {
          this.setState({ visible: false, contractId: Id });
          const reXhr = { schoolId: +schoolId, contractId: Id };
          if (contractId) {
            reXhr.contractId = contractId;
          }
          this.props.dispatch({
            type: 'signAgainGive/querySchoolContractBasicInfo',
            payload: reXhr,
          });
        },
      });
    });
  };
  /**
   * 提交签约课程
   */
  submitSignCourse = () => {
    const { form } = this.props;
    const { contractId, schoolId } = this.state;
    const { editCourseItem: { courseId } } = this.props.signAgainGive;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const { selectCourseId, signTime: [validStart, validEnd], studentNumLimit } = row;
      const xhr = {
        contractId,
        oldCourseId: courseId || null,
        courseId: selectCourseId,
        schoolId: +schoolId,
        validStart: moment(validStart).format('x'),
        validEnd: moment(validEnd).format('x'),
        studentNumLimit,
      };
      this.props.dispatch({
        type: 'signAgainGive/submitSignCourse',
        payload: { ...xhr },
        callback: () => {
          this.setState({ courseVisible: false });
          this.props.dispatch({
            type: 'signAgainGive/fetchSignClass',
            payload: {
              contractId,
            },
          });
        },
      });
    });
  };
  /**
   * render合同信息。
   */
  renderContractInFo = () => {
    const { signFlag } = this.state;
    const { basicInfo } = this.props.signAgainGive;
    const rowStyle = { margin: '20px 10px' };
    const paddingTOp = { paddingTop: 5 };
    const warnStyle = { color: 'red' };
    const inputDisable = {
      backgroundColor: '#fff',
      color: '#333',
      cursor: 'auto',
    };
    const signPart = (
      <Row gutter={36} style={rowStyle}>
        <Col span={12}>
          <Row>
            <Col span={6} style={paddingTOp}>
              <span style={warnStyle}>*</span>签约合同编码：
            </Col>
            <Col span={14}>
              <Input
                placeholder="请输入"
                value={basicInfo.contractCode}
                style={inputDisable}
                disabled
              />
            </Col>
          </Row>
        </Col>
        <Col span={10}>
          <Row>
            <Col span={6} style={paddingTOp}>
              <span style={warnStyle}>*</span>签约时间：
            </Col>
            <Col span={14}>
              <Input
                placeholder="请输入"
                value={
                  basicInfo.contractSignTime === 0
                    ? ''
                    : moment(basicInfo.contractSignTime).format('YYYY-MM-DD')
                }
                style={inputDisable}
                disabled
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
    return (
      <div>
        <Row gutter={36} style={rowStyle}>
          <Col span={12}>
            <Row>
              <Col span={6} style={paddingTOp}>
                学校/机构：
              </Col>
              <Col span={14}>
                <Input value={basicInfo.schoolName} style={inputDisable} disabled />
              </Col>
            </Row>
          </Col>
          <Col span={10}>
            <Row>
              <Col span={6} style={paddingTOp}>
                类型：
              </Col>
              <Col span={14}>
                <Input value={basicInfo.schoolType} style={inputDisable} disabled />
              </Col>
            </Row>
          </Col>
        </Row>
        {signFlag === '1' ? signPart : null}
        <Row gutter={36} style={rowStyle}>
          <Col span={12}>
            <Row>
              <Col span={6} style={paddingTOp}>
                返点机构：
              </Col>
              <Col span={14}>
                <Input
                  placeholder="请输入"
                  style={inputDisable}
                  disabled
                  value={basicInfo.schoolRebate}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={36} style={rowStyle}>
          <Col span={12} style={paddingTOp}>
            <Row>
              <Col span={6} style={{ paddingTop: 10 }}>
                返点教练：
              </Col>
              <Col span={14}>
                <Input
                  placeholder="请填写"
                  style={inputDisable}
                  disabled
                  value={basicInfo.teachersRebate}
                />
              </Col>
            </Row>
          </Col>
          {typeof basicInfo.teacherList === 'object'
            ? basicInfo.teacherList.map(item => {
                return (
                  <Col span={5} key={item.teacherId} style={{ paddingTop: 10 }}>
                    <Row>
                      <Col span={24}>
                        <Input
                          placeholder="请填写"
                          style={inputDisable}
                          disabled
                          value={`${item.teacherName}：${item.teacherRebate}`}
                        />
                      </Col>
                    </Row>
                  </Col>
                );
              })
            : null}
        </Row>
      </div>
    );
  };

  renderTitle = () => {
    return (
      <div>
        <Row>
          <Col span={4}>
            <h3>签约基本信息</h3>
          </Col>
          <Col span={20} style={{ textAlign: 'right' }}>
            <a style={{ fontWeight: 400, fontSize: 14 }} onClick={this.showEditVisible}>
              编辑
            </a>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <h5 style={{ color: 'red', fontWeight: 400 }}>
              &nbsp;&nbsp;注：必须完整填写签约基本信息，否则该记录无效
            </h5>
          </Col>
        </Row>
      </div>
    );
  };
  renderCourseTitle = () => {
    return (
      <div>
        <Row>
          <Col span={4}>
            <h3>签约课程数据</h3>
          </Col>
          <Col span={20} style={{ textAlign: 'right' }}>
            <a style={{ fontWeight: 400, fontSize: 14 }} onClick={this.clickEditCourse}>
              新增课程
            </a>
          </Col>
        </Row>
      </div>
    );
  };
  /**
   * 编辑签约基本信息（弹窗编辑）
   */
  renderSignBasicInfo = () => {
    const { visible, signFlag } = this.state;
    const {
      basicInfo: {
        schoolName,
        schoolType,
        contractCode,
        schoolRebate,
        teachersRebate,
        teacherList,
        contractSignTime,
      },
    } = this.props.signAgainGive;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 16 },
      },
    };
    return (
      <div>
        <Modal
          title="签约基本信息"
          visible={visible}
          onOk={this.submitEditInfo}
          onCancel={this.cancelEditInfo}
          width={650}
        >
          <Form onSubmit={this.submitEditInfo}>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="学校/机构">
                  {getFieldDecorator('schoolName', { initialValue: schoolName })(
                    <Input disabled />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="类型">
                  {getFieldDecorator('schoolType', { initialValue: schoolType })(
                    <Input disabled />
                  )}
                </FormItem>
              </Col>
            </Row>
            {signFlag === '1' ? (
              <Row gutter={16}>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="合同编码">
                    {getFieldDecorator('contractCode', {
                      rules: [{ required: true, message: '请填写' }],
                      initialValue: contractCode,
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="签约时间">
                    {getFieldDecorator('contractSignTime', {
                      rules: [{ type: 'object', required: true, message: '请选择签约时间!' }],
                      initialValue: contractSignTime
                        ? moment(moment(contractSignTime).format('YYYY-MM-DD'), 'YYYY/MM/DD')
                        : null,
                    })(<DatePicker />)}
                  </FormItem>
                </Col>
              </Row>
            ) : null}

            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="返点机构">
                  {getFieldDecorator('schoolRebate', { initialValue: schoolRebate })(<Input />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="返点教练">
                  {getFieldDecorator('teachersRebate', { initialValue: teachersRebate })(
                    <Input disabled />
                  )}
                </FormItem>
              </Col>
              {typeof teacherList === 'object'
                ? teacherList.map(item => {
                    return (
                      <Col span={7} key={item.teacherId}>
                        <FormItem label="">
                          {getFieldDecorator('item', {
                            initialValue: `${item.teacherName}：${item.teacherRebate}`,
                          })(<Input disabled />)}
                        </FormItem>
                      </Col>
                    );
                  })
                : null}
            </Row>
          </Form>
        </Modal>
      </div>
    );
  };
  /**
   * 编辑签约课程数据
   */
  renderEditCourseInfo = () => {
    const { courseVisible } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {
      allCourseList,
      editCourseItem: { courseId, studentNumLimit, courseValidStart, courseValidEnd },
    } = this.props.signAgainGive;
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 16 },
      },
    };
    return (
      <div>
        <Modal
          title="签约课程编辑"
          maskClosable
          visible={courseVisible}
          onOk={this.submitSignCourse}
          onCancel={() => {
            this.setState({ courseVisible: false });
          }}
          width={650}
        >
          <Form onSubmit={this.submitEditInfo}>
            <FormItem label="有效期" {...formItemLayout}>
              {getFieldDecorator('signTime', {
                rules: [{ required: true, message: '请选择有效时间!' }],
                initialValue: [
                  moment(moment(courseValidStart).format('YYYY-MM-DD'), 'YYYY-MM-DD'),
                  moment(moment(courseValidEnd).format('YYYY-MM-DD'), 'YYYY-MM-DD'),
                ],
              })(<RangePicker format="YYYY-MM-DD" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="学生上限">
              {getFieldDecorator('studentNumLimit', {
                rules: [{ required: true, message: '请填写学生上限' }],
                initialValue: studentNumLimit,
              })(<InputNumber min={0} max={10000} />)}
            </FormItem>
            <FormItem label="选择课程" {...formItemLayout}>
              {getFieldDecorator('selectCourseId', {
                rules: [{ required: true, message: '请选择课程' }],
                initialValue: courseId,
              })(
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="请选择课程"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {allCourseList.map(domain => {
                    return (
                      <Option key={domain.courseId} value={domain.courseId}>
                        {domain.courseName}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  };
  /**
   * 班级设定 （弹窗—）
   */
  renderClassEditInfo = () => {
    const { classVisible } = this.state;
    const { setCourseClassList } = this.props.signAgainGive;
    return (
      <div>
        <Modal
          title="班级设置"
          maskClosable
          visible={classVisible}
          onOk={this.submitClassSetInfo}
          onCancel={() => {
            this.setState({ classVisible: false });
          }}
          width={650}
        >
          <Table
            rowKey={record => record.classId}
            dataSource={setCourseClassList}
            columns={this.setClassColumns}
            bordered
            pagination={false}
            footer={() => (
              <div style={{ textAlign: 'center' }}>
                <a onClick={this.addSendCourse}>新增班级+</a>
              </div>
            )}
          />
        </Modal>
      </div>
    );
  };
  render() {
    const { signFlag, visible, courseVisible, classVisible } = this.state;
    const { editLoading, schoolCourse } = this.props.signAgainGive;
    const rowStyle = { margin: '20px 10px' };
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
        title: signFlag === '1' ? '签约' : '赠课',
      },
    ];
    return (
      <PageHeaderLayout title="" breadcrumbList={breadcrumb}>
        <Fragment>
          <Card title={this.renderTitle()} loading={editLoading}>
            <div id="add_connect_record">
              <div>{this.renderContractInFo()}</div>
            </div>
          </Card>
          <Card title={this.renderCourseTitle()} loading={editLoading}>
            <Row gutter={36} style={rowStyle}>
              <Col span={24}>
                <Table
                  rowKey={record => record.courseId}
                  dataSource={schoolCourse}
                  columns={this.columns}
                  locale={{ emptyText: '暂无课程' }}
                  bordered
                />
              </Col>
            </Row>
          </Card>
          {visible ? this.renderSignBasicInfo() : null}
          {courseVisible ? this.renderEditCourseInfo() : null}
          {classVisible ? this.renderClassEditInfo() : null}
        </Fragment>
      </PageHeaderLayout>
    );
  }
}
