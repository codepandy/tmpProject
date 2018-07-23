import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Button, Table, Divider, Modal, Input, InputNumber } from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import CheckableTagGroup from '../../../components/CheckableTagGroup';
import styles from './route-material-common.less';

const sourceTypes = [{ value: '0', text: '试卷' }, { value: '1', text: '书籍' }];
@connect(({ teachResearch, loading }) => ({
  teachResearch,
  loading: loading.models.teachResearch,
}))
class SourceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceType: '0',
      pageSize: 10,
      newAddVisible: false,
      currentYear: moment().year(),
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'teachResearch/fetchSourceList',
      payload: {
        pageSize: this.state.pageSize,
        current: 1,
      },
    });
  }

  showDetail = record => {
    this.props.dispatch({
      type: 'teachResearch/viewKnowledgeDetail',
      payload: record,
    });
  };

  addKnowledge = () => {};
  showAddVisible = visible => {
    this.setState({
      newAddVisible: visible,
    });
  };

  render() {
    const that = this;
    const { pageSize, newAddVisible, sourceType, currentYear } = this.state;
    const { teachResearch: { knowledgeData }, loading } = this.props;
    const columns = [
      { title: '序号', dataIndex: 'id', key: 'id' },
      {
        title: '类型',
        dataIndex: 'sourceType',
        key: 'sourceType',
      },
      { title: '年份', dataIndex: 'year', key: 'year' },
      { title: '名称', dataIndex: 'name', key: 'name', align: 'center' },
      { title: '作者', dataIndex: 'author', key: 'author', align: 'center' },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime', align: 'center' },
      { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', align: 'center' },
      {
        title: '创建老师',
        dataIndex: 'creator',
        key: 'creator',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: '',
        render(text, record) {
          return (
            <div>
              <a
                href=""
                onClick={e => {
                  e.preventDefault();
                  that.showDetail(record);
                }}
              >
                删除
              </a>
              <Divider type="vertical" />
              <a
                href=""
                onClick={e => {
                  e.preventDefault();
                  that.showDetail(record);
                }}
              >
                编辑
              </a>
            </div>
          );
        },
      },
    ];
    return (
      <PageHeaderLayout title="">
        <Card>
          <Row>
            <Col offset={23} span={1}>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  this.showAddVisible(true);
                }}
              >
                +添加
              </Button>
            </Col>
          </Row>
          <Divider />
          <Table
            rowKey="id"
            dataSource={knowledgeData.list}
            columns={columns}
            loading={loading}
            pagination={{ pageSize, total: knowledgeData.pagination.total }}
            onChange={pagination => {
              this.handleSearch(pagination);
            }}
          />
        </Card>
        <Modal
          title="新建知识体系"
          visible={newAddVisible}
          maskClosable={false}
          onOk={this.addKnowledge}
          onCancel={this.showAddVisible.bind(this, false)}
        >
          <Row className={styles.Row}>
            <Col>选择类型：</Col>
          </Row>
          <Row className={styles.Row}>
            <Col>
              <CheckableTagGroup
                list={sourceTypes}
                checkedVal={sourceType}
                onChange={self.onChangeType}
              />
            </Col>
          </Row>
          <Row className={styles.Row}>
            <Col span={4}>选择年份：</Col>
            <Col span={20}>
              <InputNumber min={1977} max={currentYear} />
            </Col>
          </Row>
          <Row className={styles.Row}>
            <Col span={4}>名称：</Col>
            <Col span={20}>
              <Input />
            </Col>
          </Row>
          <Row className={styles.Row}>
            <Col span={4}>作者：</Col>
            <Col span={20}>
              <Input />
            </Col>
          </Row>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
export default SourceList;
