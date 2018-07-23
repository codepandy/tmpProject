import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import RecordList from 'components/BCStudent/record-list';
import { parseSearch } from '../../utils/utils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
@connect(({ coachActivityDetail, loading }) => ({
  coachActivityDetail,
  loading: loading.effects['coachActivityDetail/fetchActivityRecord'],
}))
export default class ActivityList extends Component {
  constructor(props) {
    super(props);
    const { search } = this.props.location;
    const { coachId } = parseSearch(search);
    this.state = {
      pageSize: 3,
      pageNo: 0,
      coachId,
    };
  }
  componentDidMount = () => {
    this.showMore();
  };
  componentWillUnmount = () => {
    this.props.dispatch({
      type: 'coachActivityDetail/clear',
    });
  };
  showMore = () => {
    const { pageNo, coachId } = this.state;
    this.setState({ pageNo: pageNo + 1 }, () => {
      this.props.dispatch({
        type: 'coachActivityDetail/fetchActivityRecord',
        payload: {
          pageNo: this.state.pageNo,
          pageSize: this.state.pageSize,
          coachId,
        },
      });
    });
  };
  render() {
    const { recordList } = this.props.coachActivityDetail;
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
        title: '更多活动沟通',
      },
    ];
    return (
      <PageHeaderLayout title="" breadcrumbList={breadcrumb}>
        <Fragment>
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
        </Fragment>
      </PageHeaderLayout>
    );
  }
}

// import React, { Component } from 'react';
// import { connect } from 'dva';
// import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import HistoryRecordList from '../../components/HistoryRecordList/index';

// @connect(({ coach, loading }) => ({
//   coach,
//   loading: loading.models.coach,
// }))
// export default class ActivityList extends Component {
//   render() {
//     const { coach: { activityData } } = this.props;
//     return (
//       <PageHeaderLayout title="">
//         <HistoryRecordList
//           key="activityList"
//           title="活动参与"
//           data={activityData.list || []}
//           showMore
//           moreLabel="暂无更多活动记录"
//         />
//       </PageHeaderLayout>
//     );
//   }
// }
