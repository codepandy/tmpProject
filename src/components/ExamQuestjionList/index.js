import React, { Fragment } from 'react';
import { Row, Col, Pagination } from 'antd';
import ExamQuestion from '../ExamQuestion';
import styles from './index.less';

const ExamQuestionList = ({ source, onChangePage }) => {
  const { list = [], currentPage = 0, pageSize = 10, total } = source;
  return (
    <Fragment>
      {list.map(item => {
        return <ExamQuestion key={item.index} data={item} />;
      })}
      <Row justify="end" type="flex" className={styles.pager}>
        <Col>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={(page, pSize) => {
              if (onChangePage) onChangePage(page, pSize);
            }}
          />
        </Col>
      </Row>
    </Fragment>
  );
};

export default ExamQuestionList;
