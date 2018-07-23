import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Row, Col, Select, Input, Button, Card } from 'antd';
import SubmitAddSchoolInfo from 'components/BSchool/submit-add-school-info';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const { Option } = Select;
const topColResponsiveProps = {
  xs: 12, // <576px
  sm: 6, // ≥576px
  md: 5, // ≥768px
  lg: 4, // ≥992px
  xl: 3, // ≥1200px
  style: { marginBottom: 24 },
};
@connect(({ bschool, editOrAddSchool }) => ({
  bschool,
  editOrAddSchool,
}))
export default class BSchool extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.columns = [
      {
        title: 'ID',
        dataIndex: 'schoolId',
        key: 'schoolId',
      },
      {
        title: '名称',
        dataIndex: 'schoolName',
        key: 'schoolName',
      },
      {
        title: '类型',
        dataIndex: 'schoolType',
        key: 'schoolType',
      },
      {
        title: '渠道来源',
        dataIndex: 'schoolOrigin',
        key: 'schoolOrigin',
        render: schoolOrigin => {
          return schoolOrigin || '--';
        },
      },
      {
        title: '看课模式',
        dataIndex: 'schoolModel',
        key: 'schoolModel',
        render: schoolModel => {
          return schoolModel || '--';
        },
      },
      {
        title: '管理员',
        dataIndex: 'schoolAdmin',
        key: 'schoolAdmin',
      },
      {
        title: '手机号',
        dataIndex: 'shoolIphone',
        key: 'shoolIphone',
      },
      {
        title: '入驻时间',
        dataIndex: 'schoolEnterTime',
        key: 'schoolEnterTime',
        render: schoolEnterTime => {
          return schoolEnterTime > 0 ? moment(schoolEnterTime).format('YYYY-MM-DD') : '--';
        },
      },
      {
        title: '历史签约',
        dataIndex: 'schoolHistory',
        key: 'schoolHistory',
        render: schoolHistory => {
          return schoolHistory || '--';
        },
      },
      {
        title: '当前签约',
        dataIndex: 'schoolCurrent',
        key: 'schoolCurrent',
        render: schoolCurrent => {
          return schoolCurrent ? '是' : '否';
        },
      },
      {
        title: '到期时间',
        dataIndex: 'schoolExpireTime',
        key: 'schoolExpireTime',
        render: schoolExpireTime => {
          return schoolExpireTime > 0 ? moment(schoolExpireTime).format('YYYY-MM-DD') : '--';
        },
      },
      {
        title: '当前教练数',
        dataIndex: 'schoolCurrentTeacher',
        key: 'schoolCurrentTeacher',
        render: schoolCurrentTeacher => {
          return schoolCurrentTeacher || '--';
        },
      },
      {
        title: '在读学生数',
        dataIndex: 'schoolCurrentStudent',
        key: 'schoolCurrentStudent',
        render: schoolCurrentStudent => {
          return schoolCurrentStudent || '--';
        },
      },
      {
        title: '最近联系',
        dataIndex: 'schoolRecentlyConnect',
        key: 'schoolRecentlyConnect',
        render: schoolRecentlyConnect => {
          return schoolRecentlyConnect > 0
            ? moment(schoolRecentlyConnect).format('YYYY-MM-DD')
            : '--';
        },
      },
      {
        title: '操作',
        dataIndex: 'count11',
        key: 'count11',
        render: (opetation, record) => {
          return <a onClick={this.jumpSchoolDetail.bind(null, record.schoolId)}>详情</a>;
        },
      },
    ];
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'bschool/fetchBschoolBasicDictionaries',
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'bschool/clear',
    });
  }

  /**
   * 添加学校拉取基础字典列表数据
   */
  showAddSchool = () => {
    this.props.dispatch({
      type: 'editOrAddSchool/fetchBasicDictionaries',
    });
  };
  /**
   * 提交添加学校信息
   */
  submitAddSchoolInfo = async value => {
    await this.props.dispatch({
      type: 'bschool/setState',
      payload: {
        confirmLoadding: true,
      },
    });
    await this.props.dispatch({
      type: 'editOrAddSchool/submitEditSchoolInfo',
      payload: { ...value },
    });
    await this.props.dispatch({
      type: 'bschool/setState',
      payload: {
        confirmLoadding: false,
        addSchoolVisible: false,
      },
    });
  };
  /**
   * 表格分页查询
   */
  changeTablePagination = pagination => {
    const params = {
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.props.dispatch({
      type: 'bschool/fetch',
      payload: params,
    });
  };
  /**
   * 详情页跳转
   */
  jumpSchoolDetail = schoolId => {
    this.props.dispatch(
      routerRedux.push(`/useradmin/b-school/all-detail/${schoolId}?schoolId=${schoolId}`)
    );
  };
  /**
   * 查询按钮查询表格数据
   */
  searchSchoolList = () => {
    this.props.dispatch({
      type: 'bschool/searchSchoolInfoList',
    });
  };
  /**
   * render渲染筛选条件
   */
  renderFilterList = () => {
    const {
      bschool: {
        provices,
        organization,
        origin,
        examGrade,
        competitionGrade,
        selfGrade,
        signCeremony,
        confirmSearchStudentInfo,
      },
    } = this.props;
    return (
      <div>
        <Row gutter={12} style={{ marginTop: 20 }}>
          <Col {...topColResponsiveProps}>
            <Select
              placeholder="请选择省份"
              style={{ width: '100%' }}
              defaultValue={null}
              onChange={value => {
                this.props.dispatch({
                  type: 'bschool/setState',
                  payload: { selectSchoolName: value },
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
              defaultValue={null}
              style={{ width: '100%' }}
              onChange={value => {
                this.props.dispatch({
                  type: 'bschool/setState',
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
                this.props.dispatch({ type: 'bschool/setState', payload: { selectOrigin: value } });
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
              placeholder="竞赛等级"
              defaultValue={null}
              style={{ width: '100%' }}
              onChange={value => {
                this.props.dispatch({
                  type: 'bschool/setState',
                  payload: { selectCompetitionGrade: value },
                });
              }}
            >
              <Option value={null} key={-1}>
                竞赛等级
              </Option>
              {competitionGrade.map(item => {
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
              placeholder="自招等级"
              defaultValue={null}
              style={{ width: '100%' }}
              onChange={value => {
                this.props.dispatch({
                  type: 'bschool/setState',
                  payload: { selectSelfGrade: value },
                });
              }}
            >
              <Option value={null} key={-1}>
                自招等级
              </Option>
              {selfGrade.map(item => {
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
              placeholder="高考等级"
              defaultValue={null}
              style={{ width: '100%' }}
              onChange={value => {
                this.props.dispatch({
                  type: 'bschool/setState',
                  payload: { selectExamGrade: value },
                });
              }}
            >
              <Option value={null} key={-1}>
                高考等级
              </Option>
              {examGrade.map(item => {
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
              placeholder="请选择是否签约"
              style={{ width: '100%' }}
              defaultValue={null}
              onChange={value => {
                this.props.dispatch({
                  type: 'bschool/setState',
                  payload: { selectSignCeremony: value },
                });
              }}
            >
              <Option value={null} key={-1}>
                签约状态
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
            <Row gutter={2}>
              <Col span={13}>
                <Input
                  placeholder="名称 / ID"
                  onChange={e => {
                    this.props.dispatch({
                      type: 'bschool/setState',
                      payload: { writeStudentInfo: e.target.value },
                    });
                  }}
                />
              </Col>
              <Col span={11} style={{ textAlign: 'right' }}>
                <Button
                  type="primary"
                  onClick={this.searchSchoolList}
                  loading={confirmSearchStudentInfo}
                >
                  查询
                </Button>
              </Col>
            </Row>
          </Col>
          <Col xl={1} lg={2} md={2} sm={3} xs={6} style={{ textAlign: 'right' }}>
            <Button onClick={this.showAddSchool} type="primary">
              添加
            </Button>
          </Col>
        </Row>
      </div>
    );
  };
  /**
   * render函数
   */
  render() {
    const { bschool: { querySearchData, organization, origin, city } } = this.props;
    const { visible } = this.props.editOrAddSchool;
    const { schoolHomeCount } = this.props.bschool;
    return (
      <PageHeaderLayout title="">
        <Fragment>
          <Card title={this.renderFilterList()}>
            <div>
              共计入驻 {schoolHomeCount.totalNum} 家 当前签约{schoolHomeCount.contractNum}家
            </div>
            <div>
              <StandardTable
                rowKey={record => record.schoolId}
                isRowSelection={false}
                selectedRows={[]}
                loading={this.props.bschool.loadding}
                data={querySearchData}
                columns={this.columns}
                onSelectRow={() => {}}
                bordered
                onChange={this.changeTablePagination}
              />
            </div>
            <div>
              {visible ? (
                <SubmitAddSchoolInfo
                  editState={false}
                  organizationType={organization}
                  origin={origin}
                  city={city}
                  submitAddSchoolInfo={this.submitAddSchoolInfo}
                />
              ) : null}
            </div>
          </Card>
        </Fragment>
      </PageHeaderLayout>
    );
  }
}
