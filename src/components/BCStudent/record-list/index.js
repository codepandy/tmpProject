import React, { PureComponent, Fragment } from 'react';
import { Card, Timeline } from 'antd';
import moment from 'moment';
import Blank from 'components/Blank';
import styles from './index.less';

let keyFlag = 0;
export default class RecordList extends PureComponent {
  static defaultProps = {
    title: '',
    contentOmission: false,
    clickGotoDetail: () => {},
    recordList: { pagination: { current: 1, total: 1 }, result: [] },
  };
  renderShowMore = () => {
    const { recordList: { pagination }, showMore } = this.props;
    if (pagination && pagination.current && pagination.total) {
      if (pagination.current * pagination.pageSize >= pagination.total) {
        return <a style={{ cursor: 'not-allowed' }}>暂无更多数据</a>;
      } else {
        return <a onClick={showMore.showMoreMethod}>{showMore.content}</a>;
      }
    }
  };
  renderRecordFrame = () => {
    const { recordList: { result }, flagType, clickGotoDetail, contentOmission } = this.props;
    let recordData = [];
    if (typeof result === 'object' && result.length) {
      recordData = result;
    }
    if (!recordData.length) {
      let msg = '暂无数据';
      if (flagType === 1) {
        msg = '暂无签约记录';
      } else if (flagType === 3) {
        msg = '暂无参与任何活动';
      } else if (flagType === 2) {
        msg = '暂无沟通记录';
      }
      return <Blank msg={msg} />;
    }
    // const fragmentW = document.createDocumentFragment();
    const FragmentItem = (
      <div className={this.props.height}>
        <Timeline>
          {recordData.map(item => {
            keyFlag += 1;
            return (
              <Timeline.Item color={item.color} key={keyFlag}>
                <div style={{ marginBottom: 15 }}>
                  {(() => {
                    if (flagType === 1) {
                      return (
                        <p>
                          <span>签约：</span>
                          <span>{moment(item.contractSignTime).format('YYYY-MM-DD')}</span>
                          <span className={styles.marginLeft}>{item.contractType}</span>
                          <span className={styles.marginLeft}>
                            {item.contractSchoolRebate !== undefined
                              ? `返点机构：${item.contractSchoolRebate}`
                              : null}
                          </span>
                          <span className={styles.marginLeft}>
                            {item.contractTeacherRebate !== undefined
                              ? `返点教练：${item.contractTeacherRebate}`
                              : null}
                          </span>
                        </p>
                      );
                    } else if (flagType === 2 || flagType === 3) {
                      return (
                        <p>
                          <span>时间：</span>
                          <span>{moment(item.createTime || item.time).format('YYYY-MM-DD')}</span>
                          <span className={styles.marginLeft}>
                            {flagType === 2 ? '记录人：' : ''}
                          </span>
                          <span className={styles.marginLeft}>{item.createName || item.title}</span>
                        </p>
                      );
                    }
                  })()}
                </div>
                <Card>
                  {(() => {
                    if (flagType === 1) {
                      if (!item.contractCourseList.length) {
                        return <p style={{ textAlign: 'center' }}>暂无数据</p>;
                      }
                      return (
                        <div
                          onClick={() => {
                            clickGotoDetail(item.contractId, item.contractSignFlag);
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          {item.contractCourseList.map(ditem => {
                            return (
                              <p key={ditem.courseId}>
                                <span style={{ marginRight: 10 }}>{ditem.courseName}</span>
                                <span className={styles.marginLeft}>
                                  有效期：{moment(ditem.courseStartTime).format('YYYY-MM-DD')}~{moment(
                                    ditem.courseEndTime
                                  ).format('YYYY-MM-DD')}
                                </span>
                                <span className={styles.marginLeft}>
                                  {ditem.courseClassNum !== undefined
                                    ? `班级：${ditem.courseClassNum}`
                                    : null}
                                </span>
                                <span className={styles.marginLeft}>
                                  {ditem.courseStudentNumLimit !== undefined
                                    ? `学生上限：${ditem.courseStudentNumLimit}`
                                    : null}
                                </span>
                                <span className={styles.marginLeft}>
                                  {ditem.courseSignState ? (
                                    <span style={{ color: 'red' }}>已到期</span>
                                  ) : (
                                    <span style={{ color: '#04a970' }}>未到期</span>
                                  )}
                                </span>
                              </p>
                            );
                          })}
                        </div>
                      );
                    } else {
                      let contentRel = item.content;
                      if (flagType === 2 && contentOmission && item.content.length > 120) {
                        contentRel = `${item.content.substring(0, 120)}...`;
                      }
                      return (
                        <p
                          className={styles.text_overflow}
                          dangerouslySetInnerHTML={{ __html: contentRel }}
                        />
                      );
                    }
                  })()}
                </Card>
              </Timeline.Item>
            );
          })}
          <Timeline.Item color="green">{this.renderShowMore()}</Timeline.Item>
        </Timeline>
      </div>
    );
    return FragmentItem;
    // fragmentW.appendChild(FragmentItem);
    // document.querySelector('#wrap_fragment').appendChild(Fragment);
  };
  render() {
    const { title } = this.props;
    return (
      <Fragment>
        <Card title={title} loading={this.props.loading}>
          <div id="wrap_fragment">{this.renderRecordFrame()}</div>
        </Card>
      </Fragment>
    );
  }
}
