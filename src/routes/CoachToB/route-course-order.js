/*
 * @Author: lvjingshuai 
 * @Date: 2018-07-06 16:29:24 
 * @Last Modified by: lvjingshuai
 * @Last Modified time: 2018-07-11 17:54:08
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Form,
  Select,
  Input,
  Table,
  Card,
  Row,
  Col,
  Modal,
  DatePicker,
  InputNumber,
  message,
  Popconfirm,
} from 'antd';
// import styles from './route-set-authority.less';
import { parseSearch } from '../../../src/utils/utils';
import PageHeaderLayout from '../../../src/layouts/PageHeaderLayout';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
let NEW_ADD_ID = -1;

const deleteCourseText = '删除该课程，可能会对用户的使用产生影响，请谨慎操作';
const deleteCourseClassText = '删除该班级，可能会对用户的使用产生影响，请谨慎操作';
@connect(({ coachCourseOrder, loading }) => ({
  coachCourseOrder,
  loading: loading.models.coach,
}))
class CourseOrder extends Component {
  constructor(props) {
    super(props);
    const { search } = this.props.location;
    const { coachId, contractId } = parseSearch(search);
    this.state = {
      coachId,
      contractId,

      selectedMode: '2',

      selectedRowKeys: [],

      editVisible: false,
      courseVisible: false,
      classVisible: false,
    };
  }

  componentDidMount() {
    const { coachId, contractId } = this.state;
    this.props.dispatch({
      type: 'coachCourseOrder/queryTeacherContractBasicInfo',
      payload: {
        teacherId: coachId,
        contractId: contractId || null,
      },
      callback: basicInfo => {
        if (basicInfo.contractType) {
          this.setState({ selectedMode: `${basicInfo.contractType}` });
        }
      },
    });
  }
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
  getArrayKeysValue = (list, key) => {
    const arr = [];
    list.forEach(item => {
      arr.push(item[key]);
    });
    return arr;
  };
  setClassColumns = [
    {
      title: '班级设定',
      dataIndex: 'className',
      key: 'className',
      render: (className, record) => {
        const { teacherSimpleList } = this.props.coachCourseOrder;
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
  columns = [
    {
      title: '课程名',
      dataIndex: 'courseName',
      width: '10%',
    },
    {
      title: '有效期设定',
      dataIndex: 'indate',
      width: 200,
      render: (indata, record) => {
        return (
          <span>
            {moment(record.courseValidStart).format('YYYY-MM-DD')}~{moment(
              record.courseValidEnd
            ).format('YYYY-MM-DD')}
          </span>
        );
      },
    },
    {
      title: '学生上限设定',
      dataIndex: 'studentNumLimit',
      width: 60,
    },
    {
      title: '班级设定',
      dataIndex: 'classList',
      width: 400,
      render: classList => {
        return classList.map(item => {
          return (
            <Row gutter={16} key={item.classId} style={{ margin: '5px 0' }}>
              <Col span={4}>
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
      width: 60,
      render: courseSignState => {
        return courseSignState ? (
          <span style={{ color: 'red' }}>已过期</span>
        ) : (
          <span style={{ color: 'blue' }}>未过期</span>
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
        const { selectedMode } = this.state;
        if (selectedMode === '1') {
          return null;
        }
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
            <a style={style}>
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

  handleSubmit = () => {};
  okHandle = () => {
    const { props } = this;
    let params = null;
    props.form.validateFields((err, values) => {
      if (!err) {
        params = Object.assign({}, values);
        params = Object.assign({}, params, { selectedRowKeys: this.state.selectedRowKeys });
        props.dispatch({
          type: 'coach/updateAuthority',
          payload: params,
        });
      }
    });
  };
  handlePaymentModeChange = value => {
    this.setState({
      selectedMode: value,
    });
  };
  changeClassList = (classId, value) => {
    const { setCourseClassList } = this.props.coachCourseOrder;
    setCourseClassList.forEach(item => {
      if (item.classId === classId) {
        Object.defineProperty(item, 'className', { value });
      }
    });
    this.props.dispatch({
      type: 'coachCourseOrder/setState',
      payload: {
        setCourseClassList,
      },
    });
  };
  changeTeacherList = (classId, value) => {
    const { setCourseClassList } = this.props.coachCourseOrder;
    setCourseClassList.forEach(item => {
      if (item.classId === classId) {
        Object.defineProperty(item, 'teacherList', { value, enumerable: true });
      }
    });
    this.props.dispatch({
      type: 'coachCourseOrder/setState',
      payload: {
        setCourseClassList,
      },
    });
  };
  delteCourseClass = classId => {
    const { contractId } = this.state;
    const { classCurrentCourseId, setCourseClassList } = this.props.coachCourseOrder;
    const newClassList = setCourseClassList.filter(item => {
      return item.classId !== classId;
    });
    if (classId > 0) {
      this.props.dispatch({
        type: 'coachCourseOrder/delteCourseClass',
        payload: {
          courseId: classCurrentCourseId,
          contractId,
          classId,
        },
        callback: () => {
          this.props.dispatch({
            type: 'coachCourseOrder/setState',
            payload: {
              setCourseClassList: newClassList,
            },
          });
        },
      });
    } else {
      this.props.dispatch({
        type: 'coachCourseOrder/setState',
        payload: {
          setCourseClassList: newClassList,
        },
      });
    }
  };
  submitClassSetInfo = () => {
    const { setCourseClassList } = this.props.coachCourseOrder;
    const { contractId, coachId } = this.state;
    this.props.dispatch({
      type: 'coachCourseOrder/submitClassSetInfo',
      payload: setCourseClassList,
      callback: () => {
        this.setState({ classVisible: false });
        this.props.dispatch({
          type: 'coachCourseOrder/fetchSignClass',
          payload: {
            // contractId,
            teacherId: coachId,
            contractId,
          },
        });
      },
    });
  };
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
      type: 'coachCourseOrder/setState',
      payload: {
        setCourseClassList: classList,
        classCurrentCourseId: item.courseId,
      },
    });
    this.setState({ classVisible: true });
  };
  /**
   * 班级设置（新增班级）
   */
  addSendCourse = () => {
    const { setCourseClassList, classCurrentCourseId } = this.props.coachCourseOrder;
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
      type: 'coachCourseOrder/setState',
      payload: {
        setCourseClassList: [...setCourseClassList, newList],
      },
    });
  };
  showEditVisible = () => {
    this.setState({
      editVisible: true,
    });
  };
  submitEditInfo = () => {
    const { props } = this;
    const { coachId, contractId, selectedMode } = this.state;
    props.form.validateFields((err, values) => {
      if (!err) {
        const { studentGiveNum, teacherRebate, contractCode } = values;
        props.dispatch({
          type: 'coachCourseOrder/submitEditInfo',
          payload: {
            contractId,
            signFlag: selectedMode,
            studentGiveNum,
            teacherRebate,
            contractCode,
            teacherId: coachId,
          },
          callback: id => {
            this.setState({ editVisible: false, contractId: id });
            this.props.dispatch({
              type: 'coachCourseOrder/fetchBasicInfo',
              payload: {
                teacherId: coachId,
                contractId: id,
              },
            });
          },
        });
      }
    });
  };
  cancelEditInfo = () => {
    this.setState({
      editVisible: false,
    });
  };
  clickEditCourse = (item = { courseValidStart: '', courseValidEnd: '' }) => {
    const { selectedMode, contractId } = this.state;
    if (contractId) {
      if (selectedMode === '1') {
        return message.error('学校支付不可对课程，班级进行编辑');
      } else {
        this.props.dispatch({
          type: 'coachCourseOrder/setState',
          payload: {
            editCourseItem: item,
          },
        });
        this.setState({ courseVisible: true });
      }
    } else {
      return message.error('请确认订单信息，并提交');
    }
  };
  submitSignCourse = () => {
    const { form } = this.props;
    const { contractId, coachId } = this.state;
    const { editCourseItem: { courseId } } = this.props.coachCourseOrder;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const { selectCourseId, signTime: [validStart, validEnd], studentNumLimit } = row;
      const xhr = {
        contractId,
        oldCourseId: courseId || null,
        courseId: selectCourseId,
        teacherId: +coachId,
        validStart: moment(validStart).format('x'),
        validEnd: moment(validEnd).format('x'),
        studentNumLimit,
      };
      this.props.dispatch({
        type: 'coachCourseOrder/submitSignCourse',
        payload: { ...xhr },
        callback: () => {
          this.setState({ courseVisible: false });
          this.props.dispatch({
            type: 'coachCourseOrder/fetchSignClass',
            payload: {
              teacherId: coachId,
              contractId,
            },
          });
        },
      });
    });
  };
  delteCourse = courseId => {
    const { coachId, contractId } = this.state;
    this.props.dispatch({
      type: 'coachCourseOrder/delteCourse',
      payload: {
        contractId,
        courseId,
        teacherId: coachId,
      },
      callback: () => {
        this.props.dispatch({
          type: 'coachCourseOrder/fetchSignClass',
          payload: {
            teacherId: coachId,
            contractId,
          },
        });
      },
    });
  };
  renderTitle = () => {
    return (
      <div>
        <Row>
          <Col span={4}>
            <h3>课程使用权限设置</h3>
          </Col>
          <Col span={20} style={{ textAlign: 'right' }}>
            <a style={{ fontWeight: 400, fontSize: 14 }} onClick={this.showEditVisible}>
              编辑
            </a>
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
            <h3>该校可用课程：</h3>
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
  renderCoursetype = () => {
    const { selectedMode } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { basicInfo } = this.props.coachCourseOrder;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <div>
        <FormItem {...formItemLayout} label="设置类型">
          {getFieldDecorator('courseType', {
            initialValue: selectedMode,
          })(
            <Select style={{ width: 200 }} disabled>
              <Option value="1">学校支付</Option>
              <Option value="2">个人支付</Option>
              <Option value="3">导流学生(赠送)</Option>
            </Select>
          )}
        </FormItem>
        {selectedMode === '1' && (
          <FormItem {...formItemLayout} label="所属学校">
            {getFieldDecorator('belongSchool', {
              initialValue: basicInfo.schoolName,
            })(<Input style={{ width: 200 }} disabled />)}
          </FormItem>
        )}
        {selectedMode === '2' && (
          <FormItem {...formItemLayout} label="签约合同编码">
            {getFieldDecorator('contractCodePerson', {
              initialValue: basicInfo.contractCode,
            })(<Input style={{ width: 200 }} disabled />)}
          </FormItem>
        )}
        {selectedMode === '3' && (
          <FormItem {...formItemLayout} label="引流学生数">
            {getFieldDecorator('rebateStudentNum', {
              initialValue: basicInfo.studentGiveNum,
            })(<Input style={{ width: 200 }} disabled />)}
          </FormItem>
        )}
        <FormItem {...formItemLayout} label="返点教练">
          {getFieldDecorator('rebates', {
            initialValue: basicInfo.teacherRebate,
          })(<Input style={{ width: 200 }} disabled />)}
        </FormItem>
      </div>
    );
  };
  renderSignBasicInfo = () => {
    const { editVisible, selectedMode } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { basicInfo } = this.props.coachCourseOrder;
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
          maskClosable={false}
          visible={editVisible}
          onOk={this.submitEditInfo}
          onCancel={this.cancelEditInfo}
          width={650}
        >
          <Form onSubmit={this.submitEditInfo}>
            <FormItem {...formItemLayout} label="设置类型">
              {getFieldDecorator('contractType', {
                initialValue: selectedMode,
              })(
                <Select
                  style={{ width: 200 }}
                  placeholder="请选择类型"
                  disabled={selectedMode === '1'}
                  onChange={this.handlePaymentModeChange}
                >
                  <Option value="1" disabled>
                    学校支付
                  </Option>
                  <Option value="2">个人支付</Option>
                  <Option value="3">导流学生(赠送)</Option>
                </Select>
              )}
            </FormItem>
            {selectedMode === '1' && (
              <FormItem {...formItemLayout} label="所属学校">
                {getFieldDecorator('schoolName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择学校',
                    },
                  ],
                  initialValue: basicInfo.schoolName,
                })(<Input style={{ width: 200 }} disabled={selectedMode === '1'} />)}
              </FormItem>
            )}
            {selectedMode === '2' && (
              <FormItem {...formItemLayout} label="签约合同编码">
                {getFieldDecorator('contractCode', {
                  rules: [
                    {
                      required: true,
                      message: '请输入签约合同编码',
                    },
                  ],
                  initialValue: basicInfo.contractCode,
                })(<Input style={{ width: 200 }} />)}
              </FormItem>
            )}
            {selectedMode === '3' && (
              <FormItem {...formItemLayout} label="引流学生数">
                {getFieldDecorator('studentGiveNum', {
                  rules: [
                    {
                      required: true,
                      message: '请输入引流学生数',
                    },
                  ],
                  initialValue: basicInfo.studentGiveNum,
                })(<Input style={{ width: 200 }} />)}
              </FormItem>
            )}
            <FormItem {...formItemLayout} label="返点教练">
              {getFieldDecorator('teacherRebate', {
                initialValue: basicInfo.teacherRebate,
              })(<Input style={{ width: 200 }} />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  };
  renderEditCourseInfo = () => {
    const { courseVisible } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {
      allCourseList,
      editCourseItem: { courseId, studentNumLimit, courseValidStart, courseValidEnd },
    } = this.props.coachCourseOrder;
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
  renderClassEditInfo = () => {
    const { classVisible } = this.state;
    const { setCourseClassList } = this.props.coachCourseOrder;
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
    const { editVisible, courseVisible, classVisible } = this.state;
    const { coachCourse } = this.props.coachCourseOrder;
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
        title: '课程使用权限',
      },
    ];
    return (
      <PageHeaderLayout title="" breadcrumbList={breadcrumb}>
        <Fragment>
          <Card title={this.renderTitle()}>{this.renderCoursetype()}</Card>
          <Card title={this.renderCourseTitle()}>
            <Row gutter={36}>
              <Col span={24}>
                <Table
                  rowKey={record => record.courseId}
                  dataSource={coachCourse}
                  columns={this.columns}
                  locale={{ emptyText: '暂无课程' }}
                  bordered
                />
              </Col>
            </Row>
          </Card>
          {editVisible ? this.renderSignBasicInfo() : null}
          {courseVisible ? this.renderEditCourseInfo() : null}
          {classVisible ? this.renderClassEditInfo() : null}
        </Fragment>
      </PageHeaderLayout>
    );
  }
}
CourseOrder.defaultProps = {};
export default Form.create({
  mapPropsToFields(props) {
    if (!props.data) {
      return {};
    }
    return {
      coachName: Form.createFormField({
        value: props.data.coachName,
      }),
      belongSchool: Form.createFormField({
        value: props.data.belongSchool,
      }),
      contractCode: Form.createFormField({
        value: props.data.contractCode,
      }),
      rebateStudentNum: Form.createFormField({
        value: props.data.rebateStudentNum,
      }),
      rebates: Form.createFormField({
        value: props.data.rebates,
      }),
    };
  },
})(CourseOrder);
