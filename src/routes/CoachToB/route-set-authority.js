import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Modal, Input, Table } from 'antd';
import styles from './route-set-authority.less';

const FormItem = Form.Item;
const { Option } = Select;
const IsDueLabels = ['未到期', '已到期'];
const columns = [
  {
    title: '课程名',
    dataIndex: 'name',
  },
  {
    title: '有效期设定',
    dataIndex: 'indate',
  },
  {
    title: '学生上限设定',
    dataIndex: 'maxStudents',
  },
  {
    title: '班级设定',
    dataIndex: 'nameOfClass',
    width: '30%',
    render: (text, record) => {
      const coachs = record.coachs.map(item => item.name).join(',');
      return (
        <div>
          <span className={styles.spanGrayBorder}>{record.nameOfClass}</span>
          {coachs && <span>关联教练：{coachs}</span>}
        </div>
      );
    },
  },
  {
    title: '状态',
    dataIndex: 'IsDue',
    render: text => {
      const color = text === '0' ? 'green' : 'red';
      return <span style={{ color }}>{text === '0' ? IsDueLabels[0] : IsDueLabels[1]}</span>;
    },
  },
];

@connect(({ coach, loading }) => ({
  coach,
  loading: loading.models.coach,
}))
class SetAuthority extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMode: '1',
      modalVisible: false,
      selectedRowKeys: [],
    };
  }
  componentDidMount() {
    // this.props.dispatch({
    //   type: 'coach/fetchSchool',
    // });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      modalVisible: nextProps.modalVisible,
    });
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible } = this.state;
    const { width, coach: { schoolData }, onChangeVisible } = this.props;

    const schoolOptions = (schoolData.list || []).map(item => (
      <Option key={item.Id}>{item.displayName}</Option>
    ));
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

    const { selectedRowKeys, selectedMode } = this.state;

    const rowSelection = {
      selectedRowKeys,
      hideDefaultSelections: true,
      onChange: this.onSelectChange,
      selections: true,
    };

    const data = [
      {
        id: '0001',
        name: '初一数学',
        indate: '2018.01.01 - 2018.10.10',
        maxStudents: '201人',
        nameOfClass: '1班',
        coachs: [{ id: '00001', name: '小李子' }, { id: '00002', name: '小剪子' }],
        IsDue: '0',
      },
      {
        id: '0002',
        name: '初一数学',
        indate: '2018.01.01 - 2018.10.10',
        maxStudents: '201人',
        nameOfClass: '2班',
        coachs: [{ id: '00001', name: '小李子' }, { id: '00002', name: '小剪子' }],
        IsDue: '0',
      },
      {
        id: '0003',
        name: '初一数学',
        indate: '2018.01.01 - 2018.10.10',
        maxStudents: '201人',
        nameOfClass: '2班',
        coachs: [{ id: '00001', name: '我爱罗' }],
        IsDue: '1',
      },
    ];
    return (
      <Modal
        title="课程使用权限设置"
        maskClosable={false}
        width={width || 620}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => onChangeVisible(false)}
      >
        <FormItem {...formItemLayout} label="设置类型">
          {getFieldDecorator('coachName', {
            initialValue: '1',
          })(
            <Select style={{ width: 200 }} onChange={this.handlePaymentModeChange}>
              <Option value="1">学校支付</Option>
              <Option value="2">个人支付</Option>
              <Option value="3">导流学生(赠送)</Option>
            </Select>
          )}
        </FormItem>
        {selectedMode === '1' && (
          <FormItem {...formItemLayout} label="所属学校">
            {getFieldDecorator('belongSchool', {
              rules: [
                {
                  required: true,
                  message: '请选择学校',
                },
              ],
            })(<Select style={{ width: 200 }}>{schoolOptions}</Select>)}
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
            })(<Input style={{ width: 200 }} />)}
          </FormItem>
        )}
        {selectedMode === '3' && (
          <FormItem {...formItemLayout} label="引流学生数">
            {getFieldDecorator('rebateStudentNum', {
              rules: [
                {
                  required: true,
                  message: '请输入引流学生数',
                },
              ],
            })(<Input style={{ width: 200 }} />)}
          </FormItem>
        )}
        <FormItem {...formItemLayout} label="返点教练">
          {getFieldDecorator('rebates')(<Input style={{ width: 200 }} />)}
        </FormItem>
        <div className={styles.marginTopBottom}>该校可用课程：</div>
        <Table
          bordered
          rowKey="id"
          pagination={false}
          size="small"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
        />
      </Modal>
    );
  }
}
SetAuthority.defaultProps = {
  modalVisible: false,
};
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
})(SetAuthority);
