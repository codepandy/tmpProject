import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Row, Col, Select, Input, Button, Card, message } from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const { Option } = Select;
const topColResponsiveProps = {
  xs: 12, // <576px
  sm: 6, // ≥576px
  md: 4, // ≥768px
  lg: 4, // ≥992px
  xl: 4, // ≥1200px
  style: { marginBottom: 24 },
};
// loading 是 dva-loading 这个 dva 的插件内置的 model
@connect(({ bcStudent, editSchool, loading }) => ({
  bcStudent,
  editSchool,
  loading: loading.effects['bcStudent/fetch'],
}))
export default class BCstudent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.columns = [
      {
        title: 'ID',
        dataIndex: 'studentId',
        key: 'studentId',
        width: 80,
      },
      {
        title: '学生名',
        dataIndex: 'studentName',
        key: 'studentName',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        width: 110,
      },
      {
        title: '就读学校',
        dataIndex: 'attendSchool',
        key: 'attendSchool',
      },
      {
        title: '所属学校/机构',
        dataIndex: 'belongSchool',
        key: 'belongSchool',
      },
      {
        title: '注册时间',
        dataIndex: 'registerTime',
        key: 'registerTime',
        width: 110,
        render: registerTime => {
          return moment(registerTime).format('YYYY-MM-DD');
        },
      },
      {
        title: '试用账号',
        dataIndex: 'tryFlag',
        key: 'tryFlag',
        render: tryFlag => {
          return tryFlag ? '是' : '否';
        },
      },
      {
        title: '渠道来源',
        dataIndex: 'studentOrigin',
        key: 'studentOrigin',
        render: studentOrigin => {
          return studentOrigin || '--';
        },
      },
      {
        title: '最高获奖',
        dataIndex: 'highestAward',
        key: 'highestAward',
        render: highestAward => {
          return highestAward || '--';
        },
      },
      {
        title: '自招',
        dataIndex: 'selfRecruit',
        key: 'selfRecruit',
        render: selfRecruit => {
          return selfRecruit || '--';
        },
      },
      {
        title: '毕业去向',
        dataIndex: 'graduatePlace',
        key: 'graduatePlace',
        render: graduatePlace => {
          return graduatePlace || '--';
        },
      },
      {
        title: '课程数',
        dataIndex: 'coursesNumber',
        key: 'coursesNumber',
        render: graduatePlace => {
          return graduatePlace >= 0 ? graduatePlace : 0;
        },
      },
      {
        title: '历史完课率',
        dataIndex: 'historyOverPercent',
        key: 'historyOverPercent',
        width: 60,
        render: historyOverPercent => {
          return historyOverPercent >= 0 ? `${parseInt(historyOverPercent * 100, 10)}%` : `${0}%`;
        },
      },
      {
        title: '是否在读',
        dataIndex: 'currentReading',
        key: 'currentReading',
        render: currentReading => {
          return currentReading ? '是' : '否';
        },
      },
      {
        title: '完课率',
        dataIndex: 'nowOverPercent',
        key: 'nowOverPercent',
        width: 60,
        render: nowOverPercent => {
          return nowOverPercent >= 0 ? `${parseInt(nowOverPercent * 100, 10)}%` : `${0}%`;
        },
      },
      {
        title: '最新登录时间',
        dataIndex: 'latestLoginTime',
        key: 'latestLoginTime',
        width: 110,
        render: latestLoginTime => {
          return moment(latestLoginTime).format('YYYY-MM-DD');
        },
      },
      {
        title: '状态',
        dataIndex: 'studentStatus',
        key: 'studentStatus',
        render: studentStatus => {
          return !studentStatus ? '启用' : '禁用';
        },
      },
      {
        title: '操作',
        dataIndex: 'count11',
        key: 'count11',
        width: 80,
        render: (opetation, record) => {
          const arr = [];
          arr.push(
            <p key={1}>
              <a
                onClick={this.forbidOrOpenStudent.bind(
                  null,
                  record.studentId,
                  record.studentStatus
                )}
              >
                {!record.studentStatus ? '禁用' : '启用'}
              </a>
            </p>
          );
          arr.push(
            <p key={2}>
              <a
                onClick={this.jumpStudentDetail.bind(null, record.studentId, record.studentStatus)}
              >
                详情
              </a>
            </p>
          );
          return arr;
        },
      },
    ];
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'bcStudent/fetchCstudentBasicDictionaries',
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'bcStudent/clear',
    });
  }
  forbidOrOpenStudent = (studentId, status) => {
    this.props.dispatch({
      type: 'bcStudent/forbidOrOpenStudent',
      payload: {
        id: studentId,
        status: Number(!status),
      },
      callback: () => {
        this.props.dispatch({
          type: 'bcStudent/searchStudentInfoList',
          payload: { forbid: 1 },
        });
      },
    });
  };

  /**
   * 跳转到学生详情页面
   */
  jumpStudentDetail = (studentId, studentStatus) => {
    if (studentStatus) {
      return message.warning('该学生处于禁用状态');
    }
    this.props.dispatch(routerRedux.push(`/useradmin/b-c-student-detail/1?studentId=${studentId}`));
  };

  /**
   * 查询按钮 查询表格数据
   */
  searchStudentInfoList = () => {
    this.props.dispatch({
      type: 'bcStudent/searchStudentInfoList',
      payload: {
        forbid: 0,
      },
    });
  };

  /**
   * 分页查询表格数据
   */
  changeTablePagination = pagination => {
    const params = {
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.props.dispatch({
      type: 'bcStudent/fetch',
      payload: params,
    });
  };

  /**
   * 渲染筛选条件
   */
  renderBStudentTitle = () => {
    const {
      bcStudent: { provices, organization, origin, signCeremony, confirmSearchStudentInfo },
    } = this.props;
    return (
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col {...topColResponsiveProps}>
          <Select
            placeholder="请选择省份"
            style={{ width: '100%' }}
            defaultValue={null}
            onChange={value => {
              this.props.dispatch({
                type: 'bcStudent/setState',
                payload: { selectProvices: value },
              });
            }}
          >
            <Option value={null} key={1}>
              省份
            </Option>
            {provices.map(item => {
              return (
                <Option value={item.resultKey} key={item.resultKey}>
                  {item.resultValue}
                </Option>
              );
            })}
          </Select>
        </Col>
        <Col {...topColResponsiveProps}>
          <Select
            placeholder="全部"
            style={{ width: '100%' }}
            defaultValue={null}
            onChange={value => {
              this.props.dispatch({
                type: 'bcStudent/setState',
                payload: { selectOrganization: value },
              });
            }}
          >
            <Option value={null} key={1}>
              机构类型
            </Option>
            {organization.map(item => {
              return (
                <Option value={item.resultKey} key={item.resultKey}>
                  {item.resultValue}
                </Option>
              );
            })}
          </Select>
        </Col>
        <Col {...topColResponsiveProps}>
          <Select
            placeholder="渠道来源"
            defaultValue={null}
            style={{ width: '100%' }}
            onChange={value => {
              this.props.dispatch({ type: 'bcStudent/setState', payload: { selectOrigin: value } });
            }}
          >
            <Option value={null} key={1}>
              渠道来源
            </Option>
            {origin.map(item => {
              return (
                <Option value={item.resultKey} key={item.resultKey}>
                  {item.resultValue}
                </Option>
              );
            })}
          </Select>
        </Col>
        <Col {...topColResponsiveProps}>
          <Select
            placeholder="请选择是否在读"
            style={{ width: '100%' }}
            defaultValue={null}
            onChange={value => {
              this.props.dispatch({
                type: 'bcStudent/setState',
                payload: { selectSignCeremony: value },
              });
            }}
          >
            <Option value={null} key={-1}>
              在读状态
            </Option>
            {signCeremony.map(item => {
              return (
                <Option value={item.resultKey} key={item.resultKey}>
                  {item.resultValue}
                </Option>
              );
            })}
          </Select>
        </Col>
        <Col {...topColResponsiveProps}>
          <Row>
            <Col span={24}>
              <Input
                placeholder="所属学校/机构/姓名/手机号"
                onChange={e => {
                  this.props.dispatch({
                    type: 'bcStudent/setState',
                    payload: { writeStudentInfo: e.target.value },
                  });
                }}
              />
            </Col>
          </Row>
        </Col>
        <Col {...topColResponsiveProps}>
          <Row>
            <Col span={24}>
              <Button
                type="primary"
                onClick={this.searchStudentInfoList}
                loading={confirmSearchStudentInfo}
              >
                查询
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };
  render() {
    const { bcStudent: { querySearchData, studentHomeCount } } = this.props;
    return (
      <PageHeaderLayout title="">
        <Fragment>
          <Card title={this.renderBStudentTitle()}>
            <p>
              共计学生 {studentHomeCount ? studentHomeCount.totalNum : 0} 人 在读{studentHomeCount
                ? studentHomeCount.contractNum
                : 0}人
            </p>
            <div>
              <StandardTable
                rowKey={record => record.studentId}
                isRowSelection={false}
                selectedRows={[]}
                loading={this.props.bcStudent.loading}
                data={querySearchData}
                columns={this.columns}
                onSelectRow={() => {}}
                onChange={this.changeTablePagination}
                bordered
              />
            </div>
          </Card>
        </Fragment>
      </PageHeaderLayout>
    );
  }
}
