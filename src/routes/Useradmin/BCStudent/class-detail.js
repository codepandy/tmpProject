import React, { Component } from 'react';
import { connect } from 'dva';
import RecordList from 'components/BCStudent/record-list';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { parseSearch } from '../../../utils/utils';

@connect(({ BCstudentClassDetail, loading }) => ({
  BCstudentClassDetail,
  loading: loading.effects['BCstudentClassDetail/fetchclassDetail'],
}))
export default class activityDetail extends Component {
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
      type: 'BCstudentClassDetail/clear',
    });
  };
  showMore = () => {
    const { pageNo, studentId } = this.state;
    this.setState({ pageNo: pageNo + 1 }, () => {
      this.props.dispatch({
        type: 'BCstudentClassDetail/fetchclassDetail',
        payload: {
          pageNo: this.state.pageNo,
          pageSize: this.state.pageSize,
          studentId,
        },
      });
    });
  };
  render() {
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
        title: '更多购课记录',
      },
    ];
    const { recordList } = this.props.BCstudentClassDetail;
    return (
      <PageHeaderLayout title="" breadcrumbList={breadcrumb}>
        <RecordList
          title="历史购课记录"
          showMore={{
            content: '点击查看更多历史签约',
            showMoreMethod: this.showMore,
          }}
          flagType={1}
          recordList={recordList}
          loading={this.props.loading}
        />
      </PageHeaderLayout>
    );
  }
}
