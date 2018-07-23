import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Button } from 'antd';
import RecordList from 'components/BCStudent/record-list';
import { parseSearch } from '../../../../utils/utils';
// import SignAgainGive from 'components/BSchool/sign-again-give';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
@connect(({ signDetail, signAgainGive, loading }) => ({
  signDetail,
  signAgainGive,
  loading: loading.effects['signDetail/fetchSignDetail'],
}))
export default class SignDetail extends Component {
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
      type: 'signDetail/clear',
    });
  };
  showMore = () => {
    const { pageNo } = this.state;
    const { search } = this.props.location;
    const { schoolId } = parseSearch(search);
    this.setState({ pageNo: pageNo + 1 }, () => {
      this.props.dispatch({
        type: 'signDetail/fetchSignDetail',
        payload: {
          pageNo: this.state.pageNo,
          pageSize: this.state.pageSize,
          schoolId,
        },
      });
    });
  };
  /**
   * 跳转签约和赠课
   */
  gotoSignDetail = (contractId, signFlag) => {
    const { schoolId } = this.state;
    const url = `/useradmin/b-school/detail/sign-again-give?schoolId=${schoolId}&contractId=${contractId}&signFlag=${signFlag}`;
    this.props.dispatch(routerRedux.push(url));
  };
  /**
   * 跳转签约和赠课
   */
  signAgainGive = signFlag => {
    const { schoolId } = this.state;
    const url = `/useradmin/b-school/detail/sign-again-give?signFlag=${signFlag}&schoolId=${schoolId}`;
    this.props.dispatch(routerRedux.push(url));
  };
  renderSignTitle = () => {
    return (
      <div>
        <Row>
          <Col span={24}>
            <Button
              type="primary"
              style={{ marginRight: 25 }}
              onClick={this.signAgainGive.bind(null, 1)}
            >
              续约
            </Button>
            <Button
              type="primary"
              style={{ marginRight: 25 }}
              onClick={this.signAgainGive.bind(null, 2)}
            >
              赠课
            </Button>
          </Col>
        </Row>
        <Row style={{ marginTop: 25 }}>
          <Col span={4}>
            <h3>历史签约数据</h3>
          </Col>
        </Row>
      </div>
    );
  };
  render() {
    const { recordList } = this.props.signDetail;
    // const {
    //   signAgainGiveTitle,
    //   signAgainGiveShowSign,
    //   signAgainGiveVisible,
    // } = this.props.signAgainGive;
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
        title: '更多历史签约',
      },
    ];
    return (
      <PageHeaderLayout title="" breadcrumbList={breadcrumb}>
        <Fragment>
          <RecordList
            title={this.renderSignTitle()}
            showMore={{
              content: '点击查看更多历史签约',
              isHref: false,
              showMoreMethod: this.showMore,
            }}
            clickGotoDetail={this.gotoSignDetail}
            flagType={1}
            recordList={recordList}
            loading={this.props.loading}
          />
          {/* {signAgainGiveVisible ? (
          <SignAgainGive title={signAgainGiveTitle} showSign={signAgainGiveShowSign} />
        ) : null} */}
        </Fragment>
      </PageHeaderLayout>
    );
  }
}
