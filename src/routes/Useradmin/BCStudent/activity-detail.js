import React, { Component } from 'react';
import { connect } from 'dva';
import RecordList from 'components/BCStudent/record-list';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { parseSearch } from '../../../utils/utils';
@connect(({ BCstudentActivityDetail, loading }) => ({
  BCstudentActivityDetail,
  loading: loading.effects['BCstudentActivityDetail/fetchActivityRecord'],
}))
export default class BCstudentActivityDetail extends Component {
  constructor(props) {
    super(props);
    const { search } = this.props.location;
    const { studentId } = parseSearch(search);
    this.state = {
      pageSize: 3,
      pageNo: 0,
      studentId,
    };
  }
  componentDidMount = () => {
    this.showMore();
  };
  componentWillUnmount = () => {
    this.props.dispatch({
      type: 'BCstudentActivityDetail/clear',
    });
  };
  showMore = () => {
    const { pageNo, studentId } = this.state;
    this.setState({ pageNo: pageNo + 1 }, () => {
      this.props.dispatch({
        type: 'BCstudentActivityDetail/fetchActivityRecord',
        payload: {
          pageNo: this.state.pageNo,
          pageSize: this.state.pageSize,
          studentId,
        },
      });
    });
  };
  render() {
    const { recordList } = this.props.BCstudentActivityDetail;
    const breadcrumb = [
      {
        title: '首页',
        href: '/useradmin/b-c-student',
      },
      {
        title: '用户管理',
        href: '/useradmin/b-c-student',
      },
      {
        title: 'B-C端学生',
        href: '/useradmin/b-c-student',
      },
      {
        title: '详情',
        href: `/useradmin/b-c-student-detail/3?studentId=${this.state.studentId}`,
      },
      {
        title: '更多活动记录',
      },
    ];
    return (
      <PageHeaderLayout title="" breadcrumbList={breadcrumb}>
        <RecordList
          title="历史活动记录"
          showMore={{
            content: '点击查看更多历史签约',
            showMoreMethod: this.showMore,
          }}
          flagType={2}
          recordList={recordList}
          loading={this.props.loading}
        />
      </PageHeaderLayout>
    );
  }
}
