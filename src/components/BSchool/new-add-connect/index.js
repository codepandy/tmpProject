import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal, Input, message } from 'antd';
import { trim } from '../../../utils/utils';

const { TextArea } = Input;
@connect(({ newAddConnect, loading }) => ({
  newAddConnect,
  loading: loading.models.list,
}))
export default class NewAddConnect extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  /**
   *   新增沟通
   */
  addConnectRecordVisible = visible => {
    const payLoad = {
      connectRecordVisible: visible,
    };
    if (!visible) {
      payLoad.writeConnectRecord = '';
    }
    this.props.dispatch({
      type: 'newAddConnect/setState',
      payload: payLoad,
    });
  };
  /**
   * 提交沟通记录
   */
  submitConnectRecord = () => {
    const { id: schoolId, dispatch, reFetchConnectRecord } = this.props;
    const { writeConnectRecord } = this.props.newAddConnect;
    if (trim(writeConnectRecord).length === 0) {
      return message.warning('您输入的字符全部无效，请重新输入');
    }
    dispatch({
      type: 'newAddConnect/submitConnectRecord',
      payload: {
        content: writeConnectRecord.replace(/ /gi, '&nbsp;').replace(/[\r\n]/g, '<br/>'),
        createUserId: 11111,
        schoolId: +schoolId,
        createName: '滤镜帅',
      },
      callback: () => {
        reFetchConnectRecord();
      },
    });
  };

  /**
   *  输入沟通记录
   */
  writeConnectRecord = e => {
    const { value } = e.target;
    if (value.length > 300) {
      return message.warning('您最多可输入300个字符');
    }
    this.props.dispatch({
      type: 'newAddConnect/setState',
      payload: {
        writeConnectRecord: value.slice(0, 300),
      },
    });
  };
  render() {
    const { connectRecordVisible, writeConnectRecord, confirmLoading } = this.props.newAddConnect;
    return (
      <Fragment>
        <div id="add_connect_record">
          <Modal
            title="新增沟通记录"
            visible={connectRecordVisible}
            onOk={this.submitConnectRecord}
            onCancel={this.addConnectRecordVisible.bind(null, false)}
            okText="提交"
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
        </div>
      </Fragment>
    );
  }
}
