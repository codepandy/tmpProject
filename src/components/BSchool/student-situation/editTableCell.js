import React from 'react';
import { connect } from 'dva';
import { Table, InputNumber, Popconfirm, Form, Select, Row, Col, Button, Divider } from 'antd';

const { Option } = Select;

let flagKey = 0;

const FormItem = Form.Item;
const EditableContext = React.createContext();
const PaddingTop = {
  paddingTop: 2,
};
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, ...restProps }) => {
  return (
    <EditableContext.Consumer>
      {form => {
        const { getFieldDecorator } = form;
        return (
          <td {...restProps}>
            {editing ? (
              typeof record[dataIndex] === 'object' ? (
                record[dataIndex].map(item => {
                  flagKey += 1;
                  return (
                    <div key={flagKey}>
                      <FormItem style={{ margin: 0 }}>
                        {getFieldDecorator(item.dataIndex, {
                          rules: [
                            {
                              required: true,
                              message: `请输入${item.title}!`,
                            },
                          ],
                          initialValue: item.value,
                        })(
                          (() => {
                            return <InputNumber style={{ width: '100%' }} />;
                          })()
                        )}
                      </FormItem>
                    </div>
                  );
                })
              ) : (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `请输入${title}!`,
                      },
                    ],
                    initialValue: record[dataIndex],
                  })(
                    (() => {
                      return <InputNumber style={{ width: '100%' }} />;
                    })()
                  )}
                </FormItem>
              )
            ) : (
              restProps.children
            )}
          </td>
        );
      }}
    </EditableContext.Consumer>
  );
};

@connect(({ editBschoolStudent }) => ({
  editBschoolStudent,
}))
export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editingKey: '',
    };
    this.columns = [
      {
        title: '类别',
        dataIndex: 'schoolYear',
        width: '9%',
        editable: true,
        render: schoolYear => {
          return `${schoolYear}年`;
        },
      },
      {
        title: '国家一、二、三等奖',
        dataIndex: 'countryPrize',
        width: '9%',
        editable: true,
        render: (countryPrize, record) => {
          return (
            <span>
              {record.countryFirstPrize}人/{record.countrySecondPrize}人/{record.countryThirdPrize}人
            </span>
          );
        },
      },
      {
        title: '国家集训队',
        dataIndex: 'countryTeam',
        width: '9%',
        editable: true,
        render: countryTeam => {
          return `${countryTeam}人`;
        },
      },
      {
        title: '省一、二、三等奖',
        dataIndex: 'provincePrize',
        width: '9%',
        editable: true,
        render: (provincePrize, record) => {
          return (
            <span>
              {record.provinceFirstPrize}人/{record.provinceSecondPrize}人/{
                record.provinceThirdPrize
              }人
            </span>
          );
        },
      },
      {
        title: '省集训队',
        dataIndex: 'provinceTeam',
        width: '9%',
        editable: true,
        render: provinceTeam => {
          return `${provinceTeam}人`;
        },
      },
      {
        title: '亚物奥赛金、银、铜',
        dataIndex: 'asia',
        width: '9%',
        editable: true,
        render: (asia, record) => {
          return (
            <span>
              {record.asiaGold}人/{record.asiaSilver}人/{record.asiaBronze}人
            </span>
          );
        },
      },
      {
        title: '国家奥赛金、银、铜',
        dataIndex: 'country',
        width: '9%',
        editable: true,
        render: (country, record) => {
          return (
            <span>
              {record.countryGold}人/{record.countrySilver}人/{record.countryBronze}人
            </span>
          );
        },
      },
      {
        title: '自招人数',
        dataIndex: 'recruitNum',
        width: '9%',
        editable: true,
      },
      {
        title: '清华',
        dataIndex: 'tsinghua',
        width: '9%',
        editable: true,
      },
      {
        title: '北大',
        dataIndex: 'peking',
        width: '9%',
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '10%',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        onClick={() => this.saveOnlyRow(form, record.schoolItemId)}
                        style={{ marginRight: 8 }}
                      >
                        提交
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm title="确认取消本次操作?" onConfirm={() => this.cancel(record.key)}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <Row>
                  <a onClick={() => this.edit(record.schoolItemId)}>编辑</a>
                  <a
                    onClick={() => {
                      this.deleteStudentItem(record.schoolItemId);
                    }}
                    style={{ marginLeft: 5 }}
                  >
                    删除
                  </a>
                </Row>
              )}
            </div>
          );
        },
      },
    ];
  }
  isEditing = record => {
    return record.schoolItemId === this.state.editingKey;
  };
  edit = schoolItemId => {
    this.setState({ editingKey: schoolItemId });
  };
  saveOnlyRow(form, key) {
    const { editBschoolStudentList } = this.props.editBschoolStudent;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...editBschoolStudentList];
      const index = newData.findIndex(item => key === item.schoolItemId);
      if (index > -1) {
        const item = newData[index];
        item.countryPrize = [
          {
            title: '一等奖',
            dataIndex: 'countryFirstPrize',
            value: row.countryFirstPrize,
          },
          {
            title: '二等奖',
            dataIndex: 'countrySecondPrize',
            value: row.countrySecondPrize,
          },
          {
            title: '三等奖',
            dataIndex: 'countryThirdPrize',
            value: row.countryThirdPrize,
          },
        ];
        item.provincePrize = [
          {
            title: '省一等奖',
            dataIndex: 'provinceFirstPrize',
            value: row.provinceFirstPrize,
          },
          {
            title: '省二等奖',
            dataIndex: 'provinceSecondPrize',
            value: row.provinceSecondPrize,
          },
          {
            title: '省三等奖',
            dataIndex: 'provinceThirdPrize',
            value: row.provinceThirdPrize,
          },
        ];
        item.asia = [
          {
            title: '亚物奥赛金牌',
            dataIndex: 'asiaGold',
            value: row.asiaGold,
          },
          {
            title: '亚物奥赛银牌',
            dataIndex: 'asiaSilver',
            value: row.asiaSilver,
          },
          {
            title: '亚物奥赛铜牌',
            dataIndex: 'asiaBronze',
            value: row.asiaBronze,
          },
        ];
        item.country = [
          {
            title: '国家奥赛金牌',
            dataIndex: 'countryGold',
            value: row.countryGold,
          },
          {
            title: '国家奥赛银牌',
            dataIndex: 'countrySilver',
            value: row.countrySilver,
          },
          {
            title: '国家奥赛铜牌',
            dataIndex: 'countryBronze',
            value: row.countryBronze,
          },
        ];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.props.dispatch({
          type: 'editBschoolStudent/setStatEditBschool',
          payload: {
            editBschoolStudentList: newData,
          },
          callback: () => {
            this.props.dispatch({
              type: 'editBschoolStudent/submitEditStudentInFo',
              payload: {
                editBschoolStudentItem: { ...row, schoolItemId: item.schoolItemId },
              },
            });
          },
        });
        this.setState({ editingKey: '' });
      } else {
        newData.push(editBschoolStudentList);
        this.props.dispatch({
          type: 'editBschoolStudent/setState',
          payload: {
            editBschoolStudentList: newData,
          },
        });
        this.setState({ editingKey: '' });
      }
    });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };
  /**
   * 删除学生情况每行
   */
  deleteStudentItem = schoolItemId => {
    this.props.dispatch({
      type: 'editBschoolStudent/deleteStudentItem',
      payload: {
        schoolItemId,
      },
    });
  };
  /**
   * 编辑学员情况点击添加
   */
  clickAddstudentRecord = () => {
    this.props.dispatch({
      type: 'editBschoolStudent/addBschoolStudent',
    });
  };
  /**
   * 提交编辑学员情况等级
   */
  submitSchoolStudentRank = () => {
    this.props.dispatch({
      type: 'editBschoolStudent/submitSchoolStudentRank',
    });
  };
  /**
   * render等级列表选项
   */
  renderRankList = () => {
    const {
      contestLevel,
      recruitLevel,
      gaokaoLevel,
      schoolContestLevelKey,
      schoolGaokaoLevelKey,
      schoolRecruitLevelKey,
    } = this.props.editBschoolStudent;
    return (
      <div>
        <Row gutter={16} style={{ paddingBottom: 30 }}>
          <Col span={7}>
            <Row>
              <Col span={6} style={PaddingTop}>
                竞赛等级：
              </Col>
              <Col span={18}>
                <Select
                  value={schoolContestLevelKey}
                  style={{ width: 200 }}
                  onChange={value => {
                    this.props.dispatch({
                      type: 'editBschoolStudent/setState',
                      payload: { schoolContestLevelKey: value },
                    });
                  }}
                >
                  <Option value={0} key={0}>
                    空
                  </Option>
                  {contestLevel.map(item => {
                    return (
                      <Option value={item.resultKey} key={item.resultKey}>
                        {item.resultValue}
                      </Option>
                    );
                  })}
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span={7}>
            <Row>
              <Col span={6} style={PaddingTop}>
                自招等级：
              </Col>
              <Col span={18}>
                <Select
                  value={schoolRecruitLevelKey}
                  style={{ width: 200 }}
                  onChange={value => {
                    this.props.dispatch({
                      type: 'editBschoolStudent/setState',
                      payload: { schoolRecruitLevelKey: value },
                    });
                  }}
                >
                  <Option value={0} key={0}>
                    空
                  </Option>
                  {recruitLevel.map(item => {
                    return (
                      <Option value={item.resultKey} key={item.resultKey}>
                        {item.resultValue}
                      </Option>
                    );
                  })}
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span={7}>
            <Row>
              <Col span={6} style={PaddingTop}>
                高考等级：
              </Col>
              <Col span={18}>
                <Select
                  value={schoolGaokaoLevelKey}
                  style={{ width: 200 }}
                  onChange={value => {
                    this.props.dispatch({
                      type: 'editBschoolStudent/setState',
                      payload: { schoolGaokaoLevelKey: value },
                    });
                  }}
                >
                  <Option value={0} key={0}>
                    空
                  </Option>
                  {gaokaoLevel.map(item => {
                    return (
                      <Option value={item.resultKey} key={item.resultKey}>
                        {item.resultValue}
                      </Option>
                    );
                  })}
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span={3}>
            <Row>
              <Col span={24}>
                <Button type="primary" onClick={this.submitSchoolStudentRank}>
                  提交
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider />
      </div>
    );
  };

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    const { editBschoolStudentList } = this.props.editBschoolStudent;
    return (
      <div>
        {this.renderRankList()}
        <Table
          components={components}
          rowKey={record => record.schoolItemId}
          bordered
          scroll={{ y: 350 }}
          dataSource={editBschoolStudentList}
          columns={columns}
          rowClassName="editable-row"
          pagination={false}
          footer={() => (
            <div style={{ textAlign: 'center' }}>
              <a onClick={this.clickAddstudentRecord}>
                <Button type="primary">添加</Button>{' '}
              </a>
            </div>
          )}
        />
      </div>
    );
  }
}
