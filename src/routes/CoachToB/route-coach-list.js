import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Button, Upload, message } from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './route-coach-list.less';
import RouteCoachAdd from './route-coach-add';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ coach, loading }) => ({
  coach,
  loading: loading.models.coach,
}))
@Form.create()
export default class RoteCoachList extends PureComponent {
  state = {
    modalVisible: false,
    formValues: {},
    pageSize: 10,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'coach/fetchDictionariy',
    });
  }
  columnHeaders = {
    id: 'ID',
    name: '姓名',
    mobile: '手机号',
    organization: '所属学校/机构',
    schoolType: '类型',
    userType: '行政身份',
    isSigned: '学校是否签约',
    createTime: '注册时间',
    takedLessons: '历史带课',
    takingLessons: '当前带课',
    rebates: '返点',
    endTime: '到期时间',
    readingStudents: '在读学生数',
    lastLoginTime: '最新登录时间',
    status: '状态',
    op: '操作',
  };
  columns = [
    {
      title: this.columnHeaders.id,
      dataIndex: 'teacherId',
    },
    {
      title: this.columnHeaders.name,
      dataIndex: 'teacherName',
    },
    {
      title: this.columnHeaders.mobile,
      dataIndex: 'mobile',
      align: 'center',
    },
    {
      title: this.columnHeaders.organization,
      dataIndex: 'schoolName',
    },
    {
      title: this.columnHeaders.schoolType,
      dataIndex: 'schoolType',
      render: schoolType => {
        return schoolType || '--';
      },
    },
    {
      title: this.columnHeaders.userType,
      dataIndex: 'identity',
      render: identity => {
        return identity || '--';
      },
    },
    {
      title: this.columnHeaders.isSigned,
      dataIndex: 'signFlag',
      align: 'center',
      render(signFlag) {
        return signFlag ? '是' : '否';
      },
    },
    {
      title: this.columnHeaders.createTime,
      dataIndex: 'registerTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: this.columnHeaders.takedLessons,
      dataIndex: 'historyNum',
      render: historyNum => historyNum || '--',
    },
    {
      title: this.columnHeaders.takingLessons,
      dataIndex: 'nowFlag',
      render: nowFlag => {
        return nowFlag ? '是' : '否';
      },
    },
    {
      title: this.columnHeaders.rebates,
      dataIndex: 'rebate',
      render: rebate => rebate || '--',
    },
    {
      title: this.columnHeaders.endTime,
      dataIndex: 'endTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: this.columnHeaders.readingStudents,
      dataIndex: 'studentNum',
      render: studentNum => studentNum || '--',
    },
    {
      title: this.columnHeaders.lastLoginTime,
      dataIndex: 'latestLoginTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: this.columnHeaders.status,
      dataIndex: 'teacherStatus',
      render(teacherStatus) {
        return !teacherStatus ? '启用' : '禁用';
      },
    },
    {
      title: '操作',
      render: (val, record) => (
        <Fragment>
          <p>
            <a
              href=""
              onClick={e => {
                e.preventDefault();
                this.forbidOrEnableCoach(record.teacherId, record.teacherStatus);
              }}
            >
              {!record.teacherStatus ? '禁用' : '启用'}
            </a>
          </p>
          <p>
            <a
              href=""
              onClick={e => {
                e.preventDefault();
                this.handleViewDetail(record.teacherId, record.teacherStatus);
              }}
            >
              详情
            </a>
          </p>
        </Fragment>
      ),
    },
  ];
  forbidOrEnableCoach = (teacherId, teacherStatus) => {
    const {
      formValues: {
        selectOrganization,
        selectOrigin,
        selectProvice,
        selectSignCeremony,
        writeMobile,
      },
    } = this.state;
    const params = {
      pageNo: 1,
      pageSize: this.state.pageSize,
      schoolType: selectOrganization !== null ? selectOrganization : null,
      schoolOrigin: selectOrigin !== null ? selectOrigin : null,
      schoolProvince: selectProvice !== null ? selectProvice : null,
      schoolContract: selectSignCeremony !== null ? selectSignCeremony : null,
      keyword: writeMobile,
    };
    this.props.dispatch({
      type: 'coach/forbidOrEnableCoach',
      payload: {
        id: teacherId,
        status: Number(!teacherStatus),
      },
      callback: () => {
        this.props.dispatch({
          type: 'coach/queryCoach',
          payload: params,
        });
      },
    });
  };
  /**
   * 表格分页请求
   */
  paginationStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const {
      formValues: {
        selectOrganization,
        selectOrigin,
        selectProvice,
        selectSignCeremony,
        writeMobile,
      },
    } = this.state;
    const params = {
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
      schoolType: selectOrganization !== null ? selectOrganization : null,
      schoolOrigin: selectOrigin !== null ? selectOrigin : null,
      schoolProvince: selectProvice !== null ? selectProvice : null,
      schoolContract: selectSignCeremony !== null ? selectSignCeremony : null,
      keyword: writeMobile,
    };
    dispatch({
      type: 'coach/queryCoach',
      payload: params,
    });
  };

  /**
   * 查询按钮表格请求
   */
  searchCoach = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });
      const {
        selectOrganization,
        selectOrigin,
        selectProvice,
        selectSignCeremony,
        writeMobile,
      } = values;
      dispatch({
        type: 'coach/queryCoach',
        payload: {
          pageSize: this.state.pageSize,
          pageNo: 1,
          schoolType: selectOrganization !== null ? selectOrganization : null,
          schoolOrigin: selectOrigin !== null ? selectOrigin : null,
          schoolProvince: selectProvice !== null ? selectProvice : null,
          schoolContract: selectSignCeremony !== null ? selectSignCeremony : null,
          keyword: writeMobile,
        },
      });
    });
  };

  /**
   * 添加按钮添加教练信息(地区和所属学校列表拉取)
   */
  handleModalVisible = flag => {
    this.props.dispatch({
      type: 'coach/addCoachInfo',
    });
    this.setState({
      modalVisible: !!flag,
    });
  };

  /**
   * 跳转b端教练详情页面（id=>教练的id）
   */
  handleViewDetail = (id, teacherStatus) => {
    if (teacherStatus) {
      return message.warning('该教练已被禁用');
    }
    this.props.dispatch({
      type: 'coach/goToDetail',
      payload: { id },
    });
  };

  /**
   * 提交编辑教练信息
   */
  submitCoachInfo = values => {
    this.props.dispatch({
      type: 'coach/submitCoachInfo',
      payload: { ...values },
      callback: () => {
        this.setState({
          modalVisible: false,
        });
      },
    });
  };

  /**
   * 教练表格筛选条件
   */
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const { provices, organization, origin, signCeremony } = this.props.coach;
    const topColResponsiveProps = {
      xs: 12, // <576px
      sm: 6, // ≥576px
      md: 6, // ≥768px
      lg: 4, // ≥992px
      xl: 4, // ≥1200px
    };
    return (
      <Form onSubmit={this.searchCoach}>
        <Row gutter={{ md: 8, lg: 12, xl: 18 }} style={{ marginTop: 20 }}>
          <Col {...topColResponsiveProps}>
            <FormItem>
              {getFieldDecorator('selectProvice', { initialValue: null })(
                <Select
                  placeholder="请选择省份"
                  style={{ width: '100%' }}
                  onChange={value => {
                    this.props.dispatch({
                      type: 'coach/setState',
                      payload: { selectProvice: value },
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
              )}
            </FormItem>
          </Col>
          <Col xs={12} sm={6} md={6} lg={3} xl={3}>
            <FormItem label="">
              {getFieldDecorator('selectOrganization', { initialValue: null })(
                <Select
                  placeholder="机构类型"
                  style={{ width: '100%' }}
                  onChange={value => {
                    this.props.dispatch({
                      type: 'coach/setState',
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
              )}
            </FormItem>
          </Col>
          <Col xs={12} sm={6} md={6} lg={3} xl={3}>
            <FormItem label="">
              {getFieldDecorator('selectOrigin', { initialValue: null })(
                <Select
                  placeholder="渠道来源"
                  style={{ width: '100%' }}
                  onChange={value => {
                    this.props.dispatch({
                      type: 'coach/setState',
                      payload: { selectOrigin: value },
                    });
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
              )}
            </FormItem>
          </Col>
          <Col xs={12} sm={6} md={6} lg={3} xl={3}>
            <FormItem label="">
              {getFieldDecorator('selectSignCeremony', { initialValue: null })(
                <Select
                  placeholder="是否签约"
                  style={{ width: '100%' }}
                  onChange={value => {
                    this.props.dispatch({
                      type: 'coach/setState',
                      payload: { selectSignCeremony: value },
                    });
                  }}
                >
                  <Option value={null} key={1}>
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
              )}
            </FormItem>
          </Col>
          <Col {...topColResponsiveProps}>
            <FormItem label="">
              {getFieldDecorator('writeMobile')(
                <Input
                  placeholder="所属学校/机构/姓名/手机号"
                  onChange={e => {
                    this.props.dispatch({
                      type: 'coach/setState',
                      payload: { writeMobile: e.target.value },
                    });
                  }}
                />
              )}
            </FormItem>
          </Col>
          <Col xs={4} sm={4} md={4} lg={2} xl={2}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" onClick={this.searchCoach}>
                查询
              </Button>
            </span>
          </Col>
          <Col xs={12} sm={6} md={6} lg={5} xl={5} style={{ textAlign: 'right' }}>
            <Row>
              <Col span={12}>
                <span className={styles.submitButtons}>
                  <Upload accept=".xlsx" action="">
                    <Button type="primary" htmlType="submit">
                      批量设置
                    </Button>
                  </Upload>
                </span>
              </Col>
              <Col span={12}>
                <span className={styles.submitButtons}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={this.handleModalVisible.bind(null, true)}
                  >
                    添加
                  </Button>
                </span>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    const that = this;
    const {
      coach: { querySearchData, city, allSchoolList, teacherHomeCount },
      loading,
    } = that.props;
    const { modalVisible } = this.state;

    return (
      <PageHeaderLayout title="">
        <Card title={that.renderSimpleForm()}>
          <div>
            <div>
              共计教练{teacherHomeCount.totalNum}人,当前带课{teacherHomeCount.contractNum}人
            </div>
            <StandardTable
              rowKey={record => record.teacherId}
              isRowSelection={false}
              selectedRows={[]}
              columns={this.columns}
              data={querySearchData}
              loading={loading}
              bordered
              onChange={that.paginationStandardTableChange}
            />
          </div>
        </Card>
        <RouteCoachAdd
          title="教练添加"
          city={city}
          allSchoolList={allSchoolList}
          modalVisible={modalVisible}
          submitCoachInfo={that.submitCoachInfo}
          onChangeVisible={() => {
            that.handleModalVisible(false);
          }}
        />
      </PageHeaderLayout>
    );
  }
}
