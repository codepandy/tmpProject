import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Card } from 'antd';
import styles from './index.less';

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
export default class CommunteRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  jumpConnectDetail = () => {
    if (this.props.showMore) {
      alert('加载数据');
    } else {
      this.props.dispatch(
        routerRedux.push({
          pathname: '/useradmin/b-school/detail/connect-detail',
        })
      );
    }
  };
  render() {
    return (
      <Fragment>
        <Row gutter={36}>
          <Col span={24}>
            {this.props.title}
            <Row style={{ marginLeft: 15 }}>
              <Col span={24}>
                <Row style={{ marginTop: 30 }}>
                  <Col span={24}>
                    <div className={styles.item_sign}>
                      <div>
                        <p>时间：2017.01.01 记录人:XXX</p>
                        <Card style={{ width: '100%' }}>
                          <p>初一数学(课程名)</p>
                          <p>初一数学(课程名)</p>
                          <p>初一数学(课程名)</p>
                        </Card>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row style={{ marginTop: 30 }}>
                  <Col span={24}>
                    <div className={styles.item_sign}>
                      <div>
                        <p>时间：2017.01.01 机构签约 返点机构XX 返点教练XX </p>
                        <Card style={{ width: '100%' }}>
                          <p>初一数学(课程名)</p>
                          <p>初一数学(课程名)</p>
                          <p>初一数学(课程名) 有</p>
                        </Card>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row style={{ marginTop: 30 }}>
                  <Col span={24}>
                    <div className={styles.item_sign}>
                      <div>
                        <p>签约时间：2017.01.01 机构签约 返点机构XX 返点教练XX </p>
                        <Card style={{ width: '100%' }}>
                          <p>
                            初一数学(课程名) 有效期：2017.01.01-2018.01.01 班级:5(6) 学生上限:100
                            未到期初一数学(课程名) 有效期：2017.01.01-2018.01.01 班级:5(5)
                            学生上限:100 已到期 初一数学(课程名) 有效期：2017.01.01-2018.01.01
                            班级:5(5) 学生上限:100 已到期
                          </p>
                        </Card>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row style={{ marginTop: 30 }}>
                  <Col span={24}>
                    <div className={styles.item_sign}>
                      <div>
                        <a onClick={this.jumpConnectDetail}>点击可查看更多沟通记录</a>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
