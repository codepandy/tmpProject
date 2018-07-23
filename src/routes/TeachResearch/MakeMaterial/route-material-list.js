import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tabs, Radio, Button } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ExamQuestjionList from '../../../components/ExamQuestjionList';
import styles from './route-material-common.less';
import CheckableTagGroup from '../../../components/CheckableTagGroup';

const { TabPane } = Tabs;
const RadioGroup = Radio.Group;
const FilterType = {
  subject: 'subject',
  questionType: 'questionType',
  status: 'status',
  time: 'time',
};
const FilterData = {
  subjects: [{ value: '0', text: '数学' }, { value: '1', text: '物理' }],
  questionTypes: [
    { value: '-1', text: '全部' },
    { value: '0', text: '单选' },
    { value: '1', text: '多选' },
    { value: '2', text: '不定项' },
    { value: '3', text: '判断' },
    { value: '4', text: '填空' },
    { value: '5', text: '解答' },
    { value: '6', text: '作图' },
    { value: '7', text: '证明' },
  ],
  status: [
    { value: '-1', text: '全部' },
    { value: '0', text: '无标签' },
    { value: '1', text: '待校验' },
    { value: '2', text: '待审核' },
  ],
  time: [
    { value: '-1', text: '全部' },
    { value: '3', text: '最近三天' },
    { value: '7', text: '最近一周' },
    { value: '30', text: '最近一个月' },
    { value: '40', text: '更早' },
  ],
};
const data = [
  {
    index: 1,
    creater: {
      id: '1001',
      name: '张老师',
    },
    createTime: '2018.10.12 12:23:12',
    updater: {
      id: '1002',
      name: '刘老师',
    },
    updateTime: '2018.02.05 10:12:34',
    status: 0,
  },
  {
    index: 2,
    creater: {
      id: '1001',
      name: '张老师',
    },
    createTime: '2018.10.12 12:23:12',
    updater: {
      id: '1002',
      name: '刘老师',
    },
    updateTime: '2018.02.05 10:12:34',
    status: 1,
  },
  {
    index: 3,
    creater: {
      id: '1001',
      name: '马老师',
    },
    createTime: '2018.10.12 12:23:12',
    updater: {
      id: '1002',
      name: '王老师',
    },
    updateTime: '2018.02.05 10:12:34',
    status: 2,
  },
  {
    index: 4,
    creater: {
      id: '1001',
      name: '张老师',
    },
    createTime: '2018.10.12 12:23:12',
    updater: {
      id: '1002',
      name: '赵老师',
    },
    updateTime: '2018.02.05 10:12:34',
    status: 0,
  },
];
const source = { list: data, total: 100 };

@connect(({ teachResearch, authority, loading }) => ({
  teachResearch,
  authority,
  loading: loading.models.teachResearch,
}))
class MaterialList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onlySelfRadio: '0',
      filter: { subject: '0', questionType: '-1', status: '-1', time: '-1' },
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'authority/fetchRole',
      pageSize: this.state.pageSize,
    });
  }

  onChangeRadio = e => {
    this.setState({
      onlySelfRadio: e.target.value,
    });
  };

  onChangeFilter = (filterType, checked, item) => {
    if (!checked) return;
    if (filterType === FilterType.subject) {
      this.setState({
        filter: { ...this.state.filter, subject: item.value },
      });
    } else if (filterType === FilterType.questionType) {
      this.setState({
        filter: { ...this.state.filter, questionType: item.value },
      });
    } else if (filterType === FilterType.status) {
      this.setState({
        filter: { ...this.state.filter, status: item.value },
      });
    } else if (filterType === FilterType.time) {
      this.setState({
        filter: { ...this.state.filter, time: item.value },
      });
    }
  };

  render() {
    const { onlySelfRadio, filter } = this.state;
    return (
      <PageHeaderLayout title="">
        <Card>
          <Tabs defaultActiveKey="1">
            <TabPane tab="题目" key="1">
              <Card
                title="筛选"
                extra={<a href="#">新增</a>}
                style={{ border: '1px solid green' }}
                bodyStyle={{ borderTop: '1px solid green' }}
              >
                <Row className={styles.Row}>
                  <Col span={1}>学科：</Col>
                  <Col span={20}>
                    <CheckableTagGroup
                      list={FilterData.subjects}
                      checkedVal={filter.subject}
                      onChange={(checked, item) => {
                        this.onChangeFilter(FilterType.subject, checked, item);
                      }}
                    />
                  </Col>
                </Row>
                <Row className={styles.Row}>
                  <Col span={1}>题型：</Col>
                  <Col span={20}>
                    <CheckableTagGroup
                      list={FilterData.questionTypes}
                      checkedVal={filter.questionType}
                      onChange={(checked, item) => {
                        this.onChangeFilter(FilterType.questionType, checked, item);
                      }}
                    />
                  </Col>
                </Row>
                <Row className={styles.Row}>
                  <Col span={1}>状态：</Col>
                  <Col span={20}>
                    <CheckableTagGroup
                      list={FilterData.status}
                      checkedVal={filter.status}
                      onChange={(checked, item) => {
                        this.onChangeFilter(FilterType.status, checked, item);
                      }}
                    />
                  </Col>
                </Row>
                <Row className={styles.Row}>
                  <Col span={1}>时间：</Col>
                  <Col span={20}>
                    <CheckableTagGroup
                      list={FilterData.time}
                      checkedVal={filter.time}
                      onChange={(checked, item) => {
                        this.onChangeFilter(FilterType.time, checked, item);
                      }}
                    />
                  </Col>
                </Row>
                <Row className={styles.Row}>
                  <Col>
                    <RadioGroup value={onlySelfRadio} onChange={this.onChangeRadio}>
                      <Radio value="0">仅自己创建</Radio>
                      <Radio value="1">仅自己更新</Radio>
                    </RadioGroup>
                  </Col>
                </Row>
                <Row className={styles.Row} type="flex" justify="center">
                  <Col>
                    <Button size="small" type="primary" style={{ width: '200px' }}>
                      查询
                    </Button>
                  </Col>
                </Row>
              </Card>
              <ExamQuestjionList source={source} />
            </TabPane>
            <TabPane tab="知识内容" key="2">
              Content of Tab Pane 2
            </TabPane>
            <TabPane tab="视频" key="3">
              Content of Tab Pane 3
            </TabPane>
            <TabPane tab="讲义" key="4">
              Content of Tab Pane 3
            </TabPane>
            <TabPane tab="试卷" key="5">
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}
export default MaterialList;
