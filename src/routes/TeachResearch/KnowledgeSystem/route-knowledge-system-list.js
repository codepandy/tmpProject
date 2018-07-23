import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Button, Table, Divider, Modal } from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './route-knowledge-system-list.less';
import { TARGET_TYPE, SUBJECTS, SCOPE } from '../../../common/constant';

@connect(({ teachResearch, loading }) => ({
  teachResearch,
  loading: loading.models.teachResearch,
}))
class KnowledgeSystemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      newAddVisible: false,
      subject: 0,
      department: 0,
      scope: 0,
    };
  }

  componentDidMount() {
    this.onSearch({
      pageSize: this.state.pageSize,
      current: 1,
    });

    this.props.dispatch({
      type: 'teachResearch/getTagItemByNameBatch',
      payload: { nameListStr: '学科,范围,学部' },
    });
  }

  componentWillReceiveProps(nextProps) {
    const { teachResearch: { targetTypeList } } = nextProps;
    if (targetTypeList && targetTypeList.length > 0) {
      this.setState({
        subject: targetTypeList[0].itemList[0].id,
        scope: targetTypeList[1].itemList[0].id,
        department: targetTypeList[2].itemList[0].id,
      });
    }
  }
  onSearch = pagination => {
    this.props.dispatch({
      type: 'teachResearch/fetchKnowledgeList',
      payload: {
        ...pagination,
      },
    });
  };

  showDetail = record => {
    this.props.dispatch({
      type: 'teachResearch/viewKnowledgeDetail',
      payload: record,
    });
  };

  addKnowledge = () => {
    const { subject, scope, department } = this.state;

    this.props.dispatch({
      type: 'teachResearch/addHierarchy',
      payload: {
        subjectId: subject,
        scopeId: scope,
        departmentId:
          subject === SUBJECTS.Math.id && scope === SCOPE.outOfClass.id ? '' : department,
      },
    });
    this.setState({
      newAddVisible: false,
    });
  };

  showAddVisible = visible => {
    this.setState({
      newAddVisible: visible,
    });
  };

  render() {
    const that = this;
    const { pageSize, newAddVisible, subject, scope, department } = this.state;
    const { teachResearch: { knowledgeData, targetTypeList }, loading } = this.props;
    const columns = [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      {
        title: '学科',
        dataIndex: 'subject',
        key: 'subjectId',
      },
      { title: '范围', dataIndex: 'scope', key: 'scopeId' },
      { title: '学部', dataIndex: 'department', key: 'departmentId', align: 'center' },
      {
        title: '一级知识点',
        dataIndex: 'pointNumber',
        key: 'firstLevel',
        align: 'center',
        render(text) {
          const levelNumObj = JSON.parse(text);
          return levelNumObj[1] || 0;
        },
      },
      {
        title: '二级知识点',
        dataIndex: 'pointNumber',
        key: 'secondLevel',
        align: 'center',
        render(text) {
          const levelNumObj = JSON.parse(text);
          return levelNumObj[2] || 0;
        },
      },
      {
        title: '三级知识点',
        dataIndex: 'pointNumber',
        key: 'thirdLevel',
        align: 'center',
        render(text) {
          const levelNumObj = JSON.parse(text);
          return levelNumObj[3] || 0;
        },
      },
      {
        title: '四级知识点',
        dataIndex: 'pointNumber',
        key: 'forthLevel',
        align: 'center',
        render(text) {
          const levelNumObj = JSON.parse(text);
          return levelNumObj[4] || 0;
        },
      },
      {
        title: '题目总数',
        dataIndex: 'total',
        key: 'total',
        align: 'center',
      },
      {
        title: '最新编辑',
        dataIndex: 'updateTime',
        key: 'updateTime',
        align: 'center',
        render(text) {
          return moment(text).format('YYYY-MM-DD');
        },
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
                详情
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
              this.onSearch(pagination);
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
          {(targetTypeList || []).map(
            item =>
              item.type.id === TARGET_TYPE.department.id && subject === 1 && scope === 4 ? null : (
                <Fragment key={item.type.id}>
                  <Row className={styles.row}>
                    <Col>
                      {item.type.name}：<span className={styles.redColor}>*</span>
                    </Col>
                  </Row>
                  <Row className={styles.row}>
                    {item.itemList.map(tag => (
                      <Col span={4} key={tag.id}>
                        <Button
                          type={
                            (item.type.id === TARGET_TYPE.subject.id
                            ? subject === tag.id
                            : item.type.id === TARGET_TYPE.scope.id
                              ? scope === tag.id
                              : department === tag.id)
                              ? 'primary'
                              : ''
                          }
                          onClick={e => {
                            e.preventDefault();
                            if (item.type.id === TARGET_TYPE.subject.id) {
                              this.setState({
                                subject: tag.id,
                              });
                            } else if (item.type.id === TARGET_TYPE.scope.id) {
                              this.setState({
                                scope: tag.id,
                              });
                            } else if (item.type.id === TARGET_TYPE.department.id) {
                              this.setState({
                                department: tag.id,
                              });
                            }
                          }}
                        >
                          {tag.name}
                        </Button>
                      </Col>
                    ))}
                  </Row>
                </Fragment>
              )
          )}
        </Modal>
      </PageHeaderLayout>
    );
  }
}
export default KnowledgeSystemList;
