import React, { Component } from 'react';
import { Form, Input, Modal, message, Row, Col } from 'antd';
import { connect } from 'dva';
import { trim } from '../../../src/utils/utils';

const { TextArea } = Input;

@connect(({ coachDetail }) => ({
  coachDetail,
}))
class AddCommunication extends Component {
  static defaultProps = {
    modalVisible: false,
  };
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
  onCancelVisible = () => {
    this.props.onCancelVisible();
    this.props.dispatch({
      type: 'coachDetail/setState',
      payload: {
        writeConnectRecord: '',
      },
    });
  };
  okHandle = () => {
    const { dispatch, onChangeVisible } = this.props;
    const { writeConnectRecord } = this.props.coachDetail;
    if (trim(writeConnectRecord).length === 0) {
      return message.warning('您输入的字符全部无效，请重新输入');
    }
    const params = {
      createUserId: 11111,
      createName: '零食',
      userId: this.props.coachId,
      content: writeConnectRecord.replace(/ /gi, '&nbsp;').replace(/[\r\n]/g, '<br/>'),
    };
    dispatch({
      type: 'coachDetail/updateCommunication',
      payload: params,
      callback: () => {
        onChangeVisible();
        this.props.dispatch({
          type: 'coachDetail/setState',
          payload: {
            writeConnectRecord: '',
          },
        });
      },
    });
  };
  writeConnectRecord = e => {
    if (e.target.value.length > 300) {
      return message.warning('您最多可输入300个字符');
    }
    this.props.dispatch({
      type: 'coachDetail/setState',
      payload: {
        writeConnectRecord: e.target.value.slice(0, 300),
      },
    });
  };

  render() {
    const { modalVisible } = this.state;
    const { width } = this.props;
    const { writeConnectRecord, confirmLoading } = this.props.coachDetail;
    return (
      <Modal
        title="新增沟通记录"
        maskClosable={false}
        width={width || 620}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={this.onCancelVisible}
        confirmLoading={confirmLoading}
      >
        <Row>
          <Col xs={24} sm={5} md={5} lg={5} xl={5}>
            沟通记录：
          </Col>
          <Col xs={24} sm={19} md={19} lg={19} xl={19}>
            <TextArea
              style={{ minHeight: 32 }}
              placeholder="请输入沟通记录"
              rows={6}
              value={writeConnectRecord}
              onChange={this.writeConnectRecord}
            />
            <span style={{ color: 'red' }}>{`${`${writeConnectRecord.length}/${300}`}`}</span>
          </Col>
        </Row>
      </Modal>
    );
  }
}
export default Form.create({
  mapPropsToFields(props) {
    if (!props.data) {
      return {};
    }
    return {
      content: Form.createFormField({
        value: '',
      }),
    };
  },
})(AddCommunication);
