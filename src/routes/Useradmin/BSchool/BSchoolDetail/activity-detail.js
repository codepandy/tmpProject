import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import RecordList from 'components/BCStudent/record-list';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import { parseSearch } from '../../../../utils/utils';
@connect(({ activityDetail, loading }) => ({
  activityDetail,
  loading: loading.effects['activityDetail/fetchActivityRecord'],
}))
export default class ActivityDetail extends Component {
  constructor(props) {
    super(props);
    const { search } = this.props.location;
    const { schoolId } = parseSearch(search);
    this.state = {
      pageSize: 3,
      pageNo: 0,
      schoolId,
    };
  }
  componentDidMount = () => {
    this.showMore();
  };
  componentWillUnmount = () => {
    this.props.dispatch({
      type: 'activityDetail/clear',
    });
  };
  showMore = () => {
    const { pageNo, schoolId } = this.state;
    this.setState({ pageNo: pageNo + 1 }, () => {
      this.props.dispatch({
        type: 'activityDetail/fetchActivityRecord',
        payload: {
          pageNo: this.state.pageNo,
          pageSize: this.state.pageSize,
          schoolId,
        },
      });
    });
  };
  render() {
    const { recordList } = this.props.activityDetail;
    const breadcrumb = [
      {
        title: '首页',
        href: '/useradmin/b-school/info',
      },
      {
        title: '用户管理',
        href: '/useradmin/b-school/info',
      },
      {
        title: 'B端学校',
        href: '/useradmin/b-school/info',
      },
      {
        title: '详情',
        href: `/useradmin/b-school/all-detail/1?schoolId=${this.state.schoolId}`,
      },
      {
        title: '更多历史活动',
      },
    ];
    return (
      <PageHeaderLayout title="" breadcrumbList={breadcrumb}>
        <Fragment>
          <RecordList
            title="历史活动记录"
            showNum={3}
            showMore={{
              content: '点击查看更多历史活动记录',
              showMoreMethod: this.showMore,
            }}
            flagType={2}
            recordList={recordList}
            loading={this.props.loading}
          />
        </Fragment>
      </PageHeaderLayout>
    );
  }
}
