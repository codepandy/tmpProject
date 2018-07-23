import React, { Component } from 'react';
import { Form, Modal, Input, Col, Cascader } from 'antd';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

class RouteCoachAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      modalVisible: nextProps.modalVisible,
    });
  }
  /**
   * 提交教练信息
   */
  submitCoachInfo = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.submitCoachInfo(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible } = this.state;
    const { width, onChangeVisible, enable } = this.props;
    return (
      <Modal
        title="添加/编辑教练"
        maskClosable={false}
        width={width || 620}
        visible={modalVisible}
        onOk={this.submitCoachInfo}
        onCancel={() => onChangeVisible(false)}
      >
        <FormItem {...formItemLayout} label="教练ID">
          {getFieldDecorator('coachID', {
            rules: [
              {
                required: true,
                message: '请输入ID！',
              },
            ],
          })(
            enable ? (
              <Input style={{ width: 200 }} placeholder="请输入ID！" disabled />
            ) : (
              <Input style={{ width: 200 }} placeholder="请输入ID！" />
            )
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="教练名">
          {getFieldDecorator('coachName', {
            rules: [
              {
                required: true,
                message: '请输入名称！',
              },
            ],
          })(<Input style={{ width: 200 }} placeholder="请输入名称！" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="电话">
          {getFieldDecorator('phoneNumber', {
            rules: [
              {
                required: true,
                pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
                message: '请输入正确的电话号码！',
              },
            ],
          })(<Input style={{ width: 200 }} placeholder="请输入电话号码！" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="地区">
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('province')(
                <Cascader
                  options={this.props.city}
                  placeholder="请选择地区"
                  style={{ width: 250 }}
                />
              )}
            </FormItem>
          </Col>
        </FormItem>
        <FormItem {...formItemLayout} label="行政身份">
          {getFieldDecorator('identity', {
            rules: [
              {
                required: false,
                message: '请输入行政身份！',
              },
            ],
          })(<Input style={{ width: 200 }} placeholder="请输入名称！" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="所属学校">
          <Col span={8}>
            {getFieldDecorator('attendSchool')(
              <Cascader
                options={this.props.allSchoolList}
                style={{ width: 300 }}
                placeholder="所属学校"
              />
            )}
          </Col>
        </FormItem>
      </Modal>
    );
  }
}
RouteCoachAdd.defaultProps = {
  modalVisible: false,
  enable: false,
};
export default Form.create({
  mapPropsToFields(props) {
    if (!props.data) {
      return {};
    }
    return {
      coachID: Form.createFormField({
        value: props.data.id,
      }),
      coachName: Form.createFormField({
        value: props.data.name,
      }),
      phoneNumber: Form.createFormField({
        value: props.data.mobile,
      }),
      identity: Form.createFormField({
        value: props.data.teacherIdentity,
      }),
      province: Form.createFormField({
        value: [props.data.teacherProvinceKey, props.data.teacherCityKey],
      }),
      attendSchool: Form.createFormField({
        value: [props.data.schoolId, props.data.schoolTypeKey, props.data.schoolContractKey],
      }),
    };
  },
})(RouteCoachAdd);
