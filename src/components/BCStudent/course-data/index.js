import React, { Component } from 'react';
import { Row, Col, Card, Select, Form, Table } from 'antd';
import { Chart, Axis, Tooltip, Geom } from 'bizcharts';
// import { TimelineChart } from 'components/Charts';
import { connect } from 'dva';
import Trend from 'components/Trend';
import Blank from 'components/Blank';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 8,
};
const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 4 },
    sm: { span: 4 },
  },
};
@Form.create()
// loading 是 dva-loading 这个 dva 的插件内置的 model
@connect(({ bcAllDetail, loading }) => ({
  bcAllDetail,
  loading: loading.effects['bcAllDetail/fetchCourseByStudentList'],
}))
export default class StudentDetail extends Component {
  componentDidMount() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  /**
   * 下拉框改变的时候重新拉取数据
   */
  fetchCourseByStudentList = (file, value) => {
    const { form, dispatch } = this.props;
    let params = { studentId: this.props.studentId };
    form.validateFields((err, values) => {
      if (!err) {
        params = Object.assign(params, { ...values }, { [file]: value });
        dispatch({
          type: 'bcAllDetail/fetchCourseByStudentList',
          payload: params,
        });
      }
    });
  };
  /**
   * render教师列表
   */
  renderTeacher = () => {
    const { studentCourseItems: { data: studentCourseItem } } = this.props.bcAllDetail;
    return (
      <div style={{ margin: '0px 0px 20px 0px' }}>
        <a style={{ cursor: 'default' }}>主讲老师：{studentCourseItem.majorTeacherName}</a>
        &nbsp;&nbsp;<a style={{ cursor: 'default' }}>教练：{studentCourseItem.otherTeacherName}</a>
      </div>
    );
  };
  /**
   * render过滤筛选条件
   */
  renderFilter = () => {
    const { getFieldDecorator } = this.props.form;
    const { courseTypeAndStatusList, courseByStudentIdList } = this.props.bcAllDetail;
    return (
      <div>
        <Row>
          <Col span={4}>
            <FormItem label="" {...formItemLayout}>
              {getFieldDecorator('typeAndStatus', {
                initialValue: courseTypeAndStatusList.length ? courseTypeAndStatusList[0].id : '',
              })(
                <Select
                  style={{ width: '150px' }}
                  placeholder="已开课正价课"
                  onChange={value => {
                    this.fetchCourseByStudentList('typeAndStatus', value);
                  }}
                >
                  {courseTypeAndStatusList.map(item => {
                    return (
                      <Option value={item.id} key={item.id}>
                        {item.value}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem label="" {...formItemLayout}>
              {getFieldDecorator('courseId', {
                initialValue: courseByStudentIdList.length ? courseByStudentIdList[0].id : '',
              })(
                <Select
                  placeholder="省级竞赛班 春季班"
                  className={styles.marginLeft}
                  style={{ width: '200px', marginLeft: 40 }}
                  onChange={value => {
                    this.fetchCourseByStudentList('courseId', value);
                  }}
                >
                  {courseByStudentIdList.map(item => {
                    return (
                      <Option value={item.id} key={item.id}>
                        {item.value}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
      </div>
    );
  };
  /**
   * render三个块
   */
  renderDataTable = () => {
    const { studentCourseItems: { data: studentCourseItem } } = this.props.bcAllDetail;
    return (
      <div>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <Card title="出勤">
              <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                <Trend flag="up" style={{ marginRight: 16 }}>
                  <span className={styles.trendText}>
                    {studentCourseItem.attend
                      ? `${parseInt(studentCourseItem.attend * 100, 10)}%`
                      : 0}
                  </span>
                </Trend>
                <Trend flag="down">
                  全国平均
                  <span className={styles.trendText}>
                    {studentCourseItem.attendAverage
                      ? `${parseInt(studentCourseItem.attendAverage * 100, 10)}%`
                      : 0}
                  </span>
                </Trend>
              </div>
            </Card>
          </Col>
          <Col {...topColResponsiveProps}>
            <Card title="上课平均时长">
              <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                <Trend flag="up" style={{ marginRight: 16 }}>
                  <span className={styles.trendText}>{studentCourseItem.courseTime}min</span>
                </Trend>
                <Trend>
                  全国平均
                  <span className={styles.trendText}>{studentCourseItem.courseTimeAverage}mim</span>
                </Trend>
              </div>
            </Card>
          </Col>
          <Col {...topColResponsiveProps}>
            <Card title="课后作业">
              <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                <Trend flag="up" style={{ marginRight: 16 }}>
                  <span className={styles.trendText}>
                    {studentCourseItem.homework
                      ? `${parseInt(studentCourseItem.homework * 100, 10)}%`
                      : 0}
                  </span>
                </Trend>
                <Trend>
                  全国平均
                  <span className={styles.trendText}>
                    {studentCourseItem.homeworkAverage
                      ? `${parseInt(studentCourseItem.homeworkAverage * 100, 10)}%`
                      : 0}
                  </span>
                </Trend>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };
  /**
   * render图表
   */
  renderChart = () => {
    const { loading } = this.props;
    const { studentCourseItems: { data: studentCourseItem } } = this.props.bcAllDetail;
    const cols = {
      x: { min: 0 },
      y1: { range: [0, 1] },
    };
    const columns = [];
    const dataSource = [];
    const dataItem = { key: 1 };
    studentCourseItem.taskList.forEach(item => {
      columns.push({
        title: item.x,
        dataIndex: item.x,
        render: value => {
          return value ? '已提交' : '未提交';
        },
      });
      Object.defineProperty(dataItem, item.x, { value: item.y1 });
    });
    dataSource.push(dataItem);
    return (
      <div>
        <Card
          loading={loading}
          className={styles.offlineCard}
          bordered
          bodyStyle={{ padding: '0 0 32px 0' }}
          style={{ marginTop: 32 }}
          title={<h5>直播出勤/时长</h5>}
        >
          <Chart height={400} data={studentCourseItem.liveList} scale={cols} forceFit animate>
            <Axis name="x" />
            <Axis name="y1" />
            <Tooltip crosshairs={{ type: 'y' }} />
            <Geom type="line" position="x*y1" size={2} />
            <Geom
              type="point"
              position="x*y1"
              size={4}
              shape="circle"
              style={{ stroke: '#fff', lineWidth: 1 }}
            />
          </Chart>
        </Card>
        <Card
          loading={loading}
          className={styles.offlineCard}
          bordered
          title={<h5>回放时长</h5>}
          bodyStyle={{ padding: '0 0 32px 0' }}
          style={{ marginTop: 32 }}
        >
          <Chart height={400} data={studentCourseItem.playbackList} scale={cols} forceFit>
            <Axis name="x" />
            <Axis name="y1" />
            <Tooltip crosshairs={{ type: 'y' }} />
            <Geom type="line" position="x*y1" size={2} />
            <Geom
              type="point"
              position="x*y1"
              size={4}
              shape="circle"
              style={{ stroke: '#fff', lineWidth: 1 }}
            />
          </Chart>
        </Card>
        <Card
          loading={loading}
          className={styles.offlineCard}
          bordered
          title={<h5>作业数据</h5>}
          bodyStyle={{ padding: '0 0 32px 0' }}
          style={{ marginTop: 32 }}
        >
          <Table
            bordered
            pagination={false}
            columns={columns}
            scroll={{ x: 800 }}
            dataSource={dataSource}
          />
        </Card>
        <Card
          loading={loading}
          className={styles.offlineCard}
          bordered
          title={<h5>考试数据</h5>}
          bodyStyle={{ padding: '0 0 32px 0' }}
          style={{ marginTop: 32 }}
        >
          <Chart height={400} data={studentCourseItem.examList} scale={cols} forceFit>
            <Axis name="x" />
            <Axis name="y1" />
            <Tooltip crosshairs={{ type: 'y' }} />
            <Geom type="line" position="x*y1" size={2} />
            <Geom
              type="point"
              position="x*y1"
              size={4}
              shape="circle"
              style={{ stroke: '#fff', lineWidth: 1 }}
            />
          </Chart>
        </Card>
      </div>
    );
  };
  render() {
    const { studentCourseItems: { code } } = this.props.bcAllDetail;
    return (
      <Card title="课程数据">
        {this.renderFilter()}
        {code !== 1 ? (
          <Blank msg="暂无数据" />
        ) : (
          <Card loading={this.props.loading} bordered={false}>
            {this.renderTeacher()}
            {this.renderDataTable()}
            {this.renderChart()}
          </Card>
        )}
      </Card>
    );
  }
}
