import React, { PureComponent, Fragment } from 'react';
import { Card, Timeline } from 'antd';
import styles from './index.less';

export default class HistoryRecordList extends PureComponent {
  static defaultProps = {
    editHandler: () => {},
    showMoreHandler: () => {},
    title: '',
    isExtra: false,
    extraLabel: '编辑',
    maxCount: 0,
    showMore: false,
    moreLabel: '点击查看更多历史',
    data: [
      {
        id: '0001',
        signInfo: '签约：2017-12-23 xx学校 返点：123',
        courseName: '初一数学(课程名) 有效期：2018-01-02',
        overDue: '未过期',
        color: 'green',
      },
      {
        id: '0002',
        signInfo: '签约：2017-12-23 xx学校 231',
        courseName: '初一数学(课程名) 有效期：2018-01-02',
        overDue: '已过期',
        color: 'red',
      },
      {
        id: '0003',
        signInfo: '签约：2017-12-23 xx学校 432',
        courseName: '初一数学(课程名) 有效期：2018-01-02',
        overDue: '已过期',
        color: 'red',
      },
    ],
  };

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const {
      title,
      isExtra,
      showMore,
      editHandler,
      showMoreHandler,
      extraLabel,
      moreLabel,
      data,
      children,
    } = this.props;
    const newData = data.result;
    return (
      <Fragment>
        <Card
          title={title}
          extra={
            isExtra ? (
              <a
                href=""
                onClick={e => {
                  e.preventDefault();
                  if (editHandler) editHandler();
                }}
              >
                {extraLabel}
              </a>
            ) : null
          }
        >
          {children}
          <Timeline>
            {(newData || []).map(item => {
              return (
                <Timeline.Item key={item.id} color={item.color}>
                  <span>{item.signInfo}</span>
                  <div>
                    {item.courseName}
                    <span className={styles.marginLeft} style={{ color: item.color }}>
                      {item.overDue}
                    </span>
                  </div>
                </Timeline.Item>
              );
            })}

            {showMore && (
              <Timeline.Item key="showMore" color="green">
                <a
                  href=""
                  onClick={e => {
                    e.preventDefault();
                    if (showMoreHandler) showMoreHandler();
                  }}
                >
                  {moreLabel}
                </a>
              </Timeline.Item>
            )}
          </Timeline>
        </Card>
      </Fragment>
    );
  }
}
