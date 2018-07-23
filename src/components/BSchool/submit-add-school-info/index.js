import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Select, Cascader, Modal } from 'antd';

const { Option } = Select;
const FormItem = Form.Item;

@Form.create()
@connect(({ editOrAddSchool }) => ({
  editOrAddSchool,
}))
export default class SubmitAddSchoolInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
  }

  componentDidMount = () => {
    if (this.props.editState) {
      const {
        schoolName,
        shcoolType,
        schoolOrigin,
        schoolAdmin,
        connectIphone,
        lookCourseModel,
        area,
      } = this.props;
      this.props.dispatch({
        type: 'editOrAddSchool/setState',
        payload: {
          writeSchoolName: schoolName,
          writeOrganization: shcoolType,
          writeOrigin: schoolOrigin,
          writeAdminer: schoolAdmin,
          writeProvice: area,
          writeIphone: connectIphone,
          writeModel: lookCourseModel,
        },
      });
    } else {
      this.props.dispatch({
        type: 'editOrAddSchool/setState',
        payload: {
          writeSchoolName: '',
          writeOrganization: undefined,
          writeOrigin: undefined,
          writeAdminer: '',
          writeProvice: '',
          writeIphone: '',
          writeModel: undefined,
          organizationType: this.props.organizationType,
          origin: this.props.origin,
          city: this.props.city,
        },
      });
    }
  };

  componentWillUnmount = () => {
    this.props.dispatch({
      type: 'editOrAddSchool/clear',
    });
  };

  submitAddSchoolInfo = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.submitAddSchoolInfo(values);
      }
    });
  };
  render() {
    const {
      writeSchoolName,
      writeAdminer,
      writeIphone,
      writeOrganization,
      writeOrigin,
      writeModel,
      writeProvice,
      organizationType,
      origin,
      city,
      schoolModel,
    } = this.props.editOrAddSchool;
    const { getFieldDecorator } = this.props.form;
    const { visible, confirmLoadding } = this.props.editOrAddSchool;
    return (
      <div>
        <Modal
          title="学校/机构添加"
          visible={visible}
          onOk={this.submitAddSchoolInfo}
          confirmLoading={confirmLoadding}
          onCancel={() => {
            this.props.dispatch({
              type: 'editOrAddSchool/setState',
              payload: {
                visible: false,
              },
            });
          }}
        >
          <Card bordered={false}>
            <Form hideRequiredMark style={{ marginTop: 8 }}>
              <FormItem {...this.formItemLayout} label="学校/机构名：">
                {getFieldDecorator('writeSchoolName', {
                  rules: [
                    {
                      required: true,
                      message: '请填写学校/机构名：',
                    },
                  ],
                  initialValue: writeSchoolName,
                })(<Input placeholder="请输入学校/机构名！" />)}
              </FormItem>
              <FormItem {...this.formItemLayout} label="学校/机构类型：">
                {getFieldDecorator('writeOrganization', {
                  rules: [
                    {
                      required: true,
                      message: '请填写学校/机构类型：：',
                    },
                  ],
                  initialValue: writeOrganization,
                })(
                  <Select style={{ width: '100%' }} placeholder="请填写学校/机构类型：">
                    {organizationType.map(item => {
                      return (
                        <Option value={item.resultKey} key={item.resultKey}>
                          {item.resultValue}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
              <FormItem {...this.formItemLayout} label="渠道来源">
                {getFieldDecorator('writeOrigin', {
                  initialValue: writeOrigin,
                })(
                  <Select style={{ width: '100%' }} placeholder="请填写渠道来源">
                    {origin.map(item => {
                      return (
                        <Option value={item.resultKey} key={item.resultKey}>
                          {item.resultValue}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
              <FormItem {...this.formItemLayout} label="地区">
                {getFieldDecorator('writeProvice', {
                  initialValue: writeProvice,
                  rules: [
                    {
                      required: true,
                      message: '请选择地区',
                    },
                  ],
                })(<Cascader options={city} placeholder="请选择地区" />)}
              </FormItem>
              <FormItem {...this.formItemLayout} label="管理员：">
                {getFieldDecorator('writeAdminer', {
                  initialValue: writeAdminer,
                })(<Input placeholder="请填写管理员" />)}
              </FormItem>
              <FormItem {...this.formItemLayout} label="电话：">
                {getFieldDecorator('writeIphone', {
                  initialValue: writeIphone,
                  rules: [
                    {
                      required: true,
                      message: '请填写电话号',
                    },
                  ],
                })(<Input placeholder="请填写电话号" />)}
              </FormItem>
              <FormItem {...this.formItemLayout} label="看课模式：">
                {getFieldDecorator('writeModel', {
                  initialValue: writeModel,
                })(
                  <Select style={{ width: '100%' }} placeholder="请选择看课模式">
                    {schoolModel.map(item => {
                      return (
                        <Option value={item.resultKey} key={item.resultKey}>
                          {item.resultValue}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
            </Form>
          </Card>
        </Modal>
      </div>
    );
  }
}
// SubmitAddSchoolInfo.defaultProps = {
//   modalVisible: false,
//   enable: false,
// };
// export default Form.create({
//   mapPropsToFields(props) {
//     if (!props.data) {
//       return {};
//     }
//     return {
//       coachID: Form.createFormField({
//         value: props.data.id,
//       }),
//       coachName: Form.createFormField({
//         value: props.data.name,
//       }),
//       phoneNumber: Form.createFormField({
//         value: props.data.mobile,
//       }),
//       identity: Form.createFormField({
//         value: props.data.teacherIdentity,
//       }),
//       province: Form.createFormField({
//         value: [props.data.teacherProvinceKey, props.data.teacherCityKey],
//       }),
//       attendSchool: Form.createFormField({
//         value: [props.data.schoolId, props.data.schoolTypeKey, props.data.schoolContractKey],
//       }),
//     };
//   },
// })(SubmitAddSchoolInfo);
