import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Button } from 'antd';
import RecordList from 'components/BCStudent/record-list';
import AddCommunication from './route-add-communication';

import { parseSearch } from '../../utils/utils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
@connect(({ coachConnectDetail, newAddConnect, loading }) => ({
  coachConnectDetail,
  newAddConnect,
  loading: loading.effects['coachConnectDetail/fetch'],
}))
export default class CommunicationList extends Component {
  constructor(props) {
    super(props);
    const { search } = this.props.location;
    const { coachId } = parseSearch(search);
    this.state = {
      pageSize: 3,
      pageNo: 0,
      coachId,
      communicationModalVisible: false,
    };
  }
  componentDidMount = () => {
    this.showMore();
  };
  componentWillUnmount = () => {
    this.props.dispatch({
      type: 'coachConnectDetail/clear',
    });
  };
  showMore = () => {
    const { pageNo } = this.state;
    this.setState({ pageNo: pageNo + 1 }, () => {
      this.props.dispatch({
        type: 'coachConnectDetail/fetchConnectRecord',
        payload: {
          pageNo: this.state.pageNo,
          pageSize: this.state.pageSize,
          coachId: this.state.coachId,
        },
      });
    });
  };
  addConnectRecordVisible = visible => {
    const payLoad = {
      connectRecordVisible: visible,
    };
    if (!visible) {
      payLoad.writeConnectRecord = '';
    }
    this.props.dispatch({
      type: 'newAddConnect/setState',
      payload: payLoad,
    });
  };
  render() {
    const connectTitle = (
      <div>
        <Row>
          <Col span={24}>
            <Button
              type="primary"
              style={{ marginRight: 25 }}
              onClick={(flag = true) => {
                this.setState({
                  communicationModalVisible: !!flag,
                });
              }}
            >
              新增沟通
            </Button>
          </Col>
        </Row>
        <Row style={{ marginTop: 25 }}>
          <Col span={4}>
            <h3>历史沟通记录</h3>
          </Col>
        </Row>
      </div>
    );
    const { recordList } = this.props.coachConnectDetail;
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
        title: '更多历史沟通',
      },
    ];
    return (
      <PageHeaderLayout title="" breadcrumbList={breadcrumb}>
        <Fragment>
          <RecordList
            title={connectTitle}
            showMore={{
              content: '点击查看更多历史沟通',
              showMoreMethod: this.showMore,
            }}
            recordList={recordList}
            flagType={2}
            loading={this.props.loading}
          />
          <AddCommunication
            modalVisible={this.state.communicationModalVisible}
            coachId={this.state.coachId}
            onCancelVisible={() => {
              this.setState({
                communicationModalVisible: false,
              });
            }}
            onChangeVisible={flag => {
              // const {pageNo,pageSize,coachId} = this.state;
              this.props.dispatch({
                type: 'coachConnectDetail/fetchConnectRecord',
                payload: {
                  pageNo: 1,
                  pageSize: 3,
                  coachId: this.state.coachId,
                },
                callback: () => {
                  this.setState({
                    communicationModalVisible: !!flag,
                  });
                },
              });
            }}
          />
        </Fragment>
      </PageHeaderLayout>
    );
  }
}

// import React, { Component } from 'react';
// import { connect } from 'dva';
// import { Button } from 'antd';
// import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import styles from './route-coach-detail.less';
// import HistoryRecordList from '../../components/HistoryRecordList/index';
// import AddCommunication from './route-add-communication';

// @connect(({ coach, loading }) => ({
//   coach,
//   loading: loading.models.coach,
// }))
// export default class CommunicationList extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       communicationModalVisible: false,
//     };
//   }

//   handleModalVisible = flag => {
//     this.setState({
//       communicationModalVisible: flag,
//     });
//   };
//   render() {
//     const { coach: { communicationData } } = this.props;
//     const { communicationModalVisible } = this.state;
//     return (
//       <PageHeaderLayout title="">
//         <HistoryRecordList
//           key="communicationList"
//           title="沟通记录"
//           data={communicationData.list || []}
//           showMore
//           moreLabel="暂无更多沟通记录"
//         >
//           <div className={styles.buttonContainer}>
//             <Button
//               type="primary"
//               onClick={e => {
//                 e.preventDefault();
//                 this.handleModalVisible(true);
//               }}
//             >
//               新增沟通记录
//             </Button>
//           </div>
//         </HistoryRecordList>
//         <AddCommunication
//           modalVisible={communicationModalVisible}
//           onChangeVisible={flag => {
//             this.handleModalVisible(flag);
//           }}
//         />
//       </PageHeaderLayout>
//     );
//   }
// }
