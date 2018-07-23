import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Modal, Table } from 'antd';
import styles from './index.less';
import EditableTable from './editTableCell';

@connect(({ allDetail, loading, editBschoolStudent }) => ({
  allDetail,
  loading: loading.models.list,
  editBschoolStudent,
}))
export default class TeacherList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  /**
   * 点击编辑按钮，编辑学员情况
   */
  editStudentSituationVisible = visible => {
    const { studentList } = this.props.allDetail;
    this.props.dispatch({
      type: 'editBschoolStudent/getEditStudentlist',
      payload: {
        studentList,
        editStudentSituationVisible: visible,
      },
    });
  };
  cancelStudentSituationVisible = visible => {
    if (!visible) {
      this.props.dispatch({
        type: 'allDetail/fetchStudentList',
        payload: { schoolId: this.props.schoolId },
        callback: () => {
          this.props.dispatch({
            type: 'editBschoolStudent/setState',
            payload: {
              editStudentSituationVisible: visible,
            },
          });
        },
      });
    }
  };
  /**
   * render学生情况的card题目
   */
  renderStudentSituation = () => {
    const { studentList } = this.props.allDetail;
    return (
      <div>
        <Row>
          <Col span={24}>学员情况</Col>
        </Row>
        <Row style={{ marginLeft: 10, marginTop: 15, fontSize: 14 }}>
          <Col span={24}>
            <a>在读学员：{studentList.schoolNowNum ? studentList.schoolNowNum : 0}人</a>{' '}
            <a style={{ marginLeft: 15 }}>
              历史学员人数：{studentList.schoolHistoryNum ? studentList.schoolHistoryNum : 0}人
            </a>
          </Col>
        </Row>
      </div>
    );
  };
  render() {
    const { studentTableLoadding, studentList } = this.props.allDetail;
    const { editStudentSituationVisible } = this.props.editBschoolStudent;
    const columns = [
      {
        title: '等级',
        dataIndex: 'grade',
        key: 'grade',
        children: [
          {
            title: '类别',
            dataIndex: 'schoolYear',
            key: 'schoolYear',
            width: '10%',
            render: schoolYear => {
              return `${schoolYear}年`;
            },
          },
        ],
      },
      {
        title: `${studentList.schoolContestLevel ? studentList.schoolContestLevel : '--'}`,
        dataIndex: 'A',
        key: 'A',
        children: [
          {
            title: '国家一、二、三等奖',
            dataIndex: 'countryFirstPrize',
            key: 'countryFirstPrize',
            width: '10%',
            render: (countryFirstPrize, record) => {
              return `${record.countryFirstPrize}人/${record.countrySecondPrize}人/${
                record.countryThirdPrize
              }人`;
            },
          },
          {
            title: '国家集训队',
            dataIndex: 'countryBronze',
            key: 'countryBronze',
            width: '10%',
            render: countryBronze => {
              return `${countryBronze}人`;
            },
          },
          {
            title: '省一、二、三等奖',
            dataIndex: 'provinceFirstPrize',
            key: 'provinceFirstPrize',
            width: '10%',
            render: (provinceFirstPrize, record) => {
              return `${record.provinceFirstPrize}人/${record.provinceSecondPrize}人/${
                record.provinceThirdPrize
              }人`;
            },
          },
          {
            title: '省集训队',
            dataIndex: 'provinceTeam',
            key: 'provinceTeam',
            width: '10%',
            render: provinceTeam => {
              return `${provinceTeam}人`;
            },
          },
          {
            title: '亚物奥赛金、银、铜',
            dataIndex: 'asiaBronze',
            key: 'asiaBronze',
            width: '10%',
            render: (asiaBronze, record) => {
              return `${record.asiaGold}人、${record.asiaSilver}人、${record.asiaBronze}人`;
            },
          },
          {
            title: '国家奥赛金、银、铜',
            dataIndex: 'countryGold',
            key: 'countryGold',
            width: '10%',
            render: (countryGold, record) => {
              return `${record.countryGold}人、${record.countrySilver}人、${
                record.countryBronze
              }人`;
            },
          },
        ],
      },
      {
        title: `${studentList.schoolGaokaoLevel ? studentList.schoolGaokaoLevel : '--'}`,
        dataIndex: 'B',
        key: 'B',
        children: [
          {
            title: '自招人数',
            dataIndex: 'recruitNum',
            key: 'recruitNum',
            width: '10%',
          },
        ],
      },
      {
        title: `${studentList.schoolRecruitLevel ? studentList.schoolRecruitLevel : '--'}`,
        dataIndex: 'C',
        key: 'C',
        children: [
          {
            title: '清华',
            dataIndex: 'tsinghua',
            key: 'tsinghua',
            width: '10%',
          },
          {
            title: '北大',
            dataIndex: 'peking',
            key: 'peking',
            width: '10%',
          },
        ],
      },
    ];
    return (
      <Fragment>
        <Card title={this.renderStudentSituation()}>
          <Row gutter={36}>
            <Col span={24}>
              <Row>
                <Col span={24}>
                  <Table
                    rowKey={record => record.schoolItemId}
                    bordered
                    columns={columns}
                    loading={studentTableLoadding}
                    dataSource={studentList.list}
                    pagination={false}
                    scroll={{ y: 500 }}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <a
                    className={styles.item_title}
                    onClick={this.editStudentSituationVisible.bind(null, true)}
                  >
                    编辑
                  </a>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        <div>
          <Modal
            title="编辑学员情况"
            okText="提交"
            footer={null}
            maskClosable
            visible={editStudentSituationVisible}
            onCancel={this.cancelStudentSituationVisible.bind(null, false)}
            width={1110}
          >
            <EditableTable />
          </Modal>
        </div>
      </Fragment>
    );
  }
}
