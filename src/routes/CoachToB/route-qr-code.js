import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Card, Divider, Row, Col, Input, DatePicker, Table, Form } from 'antd';
import QRCode from 'qrcode.react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { parseSearch } from '../../../src/utils/utils';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
@Form.create()
@connect(({ coachDetail, loading }) => ({
  coachDetail,
  loading: loading.models.coach,
}))
export default class QRCodeSet extends Component {
  constructor(props) {
    super(props);
    const { search } = this.props.location;
    const { coachId } = parseSearch(search);
    this.state = {
      qrCodeUrl: '',
      qrCodeVal: '',
      coachId,
    };
    this.columns = [
      {
        title: '课程名',
        dataIndex: 'courseName',
        width: 400,
      },
      {
        title: '成单量',
        dataIndex: 'courseOrder',
        width: 400,
      },
      {
        title: '目标设定',
        dataIndex: 'goal',
        render: () => {
          return '--';
        },
      },
    ];
  }
  componentDidMount = () => {
    this.searchCourseOrderList();
  };
  searchCourseOrderList = (flag = false) => {
    const { coachId } = this.state;
    if (flag) {
      this.props.form.validateFields((err, values) => {
        const { time } = values;
        if (time) {
          const [startTime, endTime] = time;
          if (!err) {
            return this.props.dispatch({
              type: 'coachDetail/fetchCourseByTeacherIdList',
              payload: {
                teacherId: coachId,
                startTime: moment(startTime).format('x'),
                endTime: moment(endTime).format('x'),
              },
            });
          }
        } else {
          this.props.dispatch({
            type: 'coachDetail/fetchCourseByTeacherIdList',
            payload: {
              teacherId: coachId,
              startTime: 0,
              endTime: moment().format('x'),
            },
          });
        }
      });
    } else {
      this.props.dispatch({
        type: 'coachDetail/fetchCourseByTeacherIdList',
        payload: {
          teacherId: coachId,
          startTime: 0,
          endTime: moment().format('x'),
        },
      });
    }
  };
  /**
   * render二维码
   */
  renderCode = () => {
    return (
      <Fragment>
        <Row gutter={16}>
          <Col span={8} style={{ paddingTop: 40 }}>
            <Input
              placeholder="请输入原始链接"
              onChange={e => {
                this.setState({ qrCodeUrl: e.target.value });
              }}
            />
          </Col>
          <Col span={8} style={{ paddingLeft: 40 }}>
            <QRCode level="M" size={100} value={this.state.qrCodeVal} />
          </Col>
          <Col span={8} style={{ textAlign: 'right', paddingTop: 40 }}>
            <Button
              type="primary"
              onClick={e => {
                e.preventDefault();
                this.setState({
                  qrCodeVal: this.state.qrCodeUrl,
                });
              }}
            >
              生成
            </Button>
          </Col>
        </Row>
        <Divider />
      </Fragment>
    );
  };
  /**
   * render过滤条件
   */
  renderFilter = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <FormItem>
          {getFieldDecorator('time', {})(
            <RangePicker
              // defaultValue={['','']}
              format="YYYY-MM-DD"
            />
          )}
        </FormItem>

        <Button
          type="primary"
          style={{ marginLeft: 15 }}
          onClick={() => {
            this.searchCourseOrderList(true);
          }}
        >
          查询
        </Button>
      </div>
    );
  };
  render() {
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
        title: '引流学生',
      },
    ];
    const { courseOrderByTeacherIdList } = this.props.coachDetail;
    return (
      <PageHeaderLayout title="" breadcrumbList={breadcrumb}>
        <Card>
          <div>
            {this.renderCode()}
            {this.renderFilter()}
            <div style={{ marginTop: 20 }}>
              <Table
                rowKey={record => record.courseId}
                dataSource={courseOrderByTeacherIdList}
                columns={this.columns}
                bordered
                scroll={{ y: 500 }}
                pagination={false}
              />
            </div>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
