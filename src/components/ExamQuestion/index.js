import React from 'react';
import { Button, Row, Col, Divider } from 'antd';
import styles from './index.less';

const Status = ['无标签', '待校验', '待审核'];
const ExamQuestion = ({ data }) => {
  return (
    <div className={styles.container}>
      <Row>
        <Col span={1}>{data.index}</Col>
        <Col>题的内容</Col>
      </Row>
      <Divider />
      <Row>
        <Col span={22}>
          创建：{data.createTime} {data.creater.name} 更新：{data.updateTime} {data.updater.name}
        </Col>
        <Col span={1}>{Status[data.status]}</Col>
        <Col span={1}>
          <Button type="primary" size="small">
            编辑
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ExamQuestion;
