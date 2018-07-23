import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Input, Button, Modal, Radio, Checkbox, Tag, Divider, Tree } from 'antd';
import uuidv1 from 'uuid/v1';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import CheckableTagGroup from '../../../components/CheckableTagGroup';
import styles from './route-material-common.less';

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { TreeNode } = Tree;
const questionTypes = [
  { value: '0', text: '单选' },
  { value: '1', text: '多选' },
  { value: '2', text: '不定项' },
  { value: '3', text: '判断' },
  { value: '4', text: '填空' },
  { value: '5', text: '解答' },
  { value: '6', text: '作图' },
  { value: '7', text: '证明' },
];
const HardLevels = [
  { text: '1级', value: '1', uuid: uuidv1() },
  { text: '2级', value: '2', uuid: uuidv1() },
  { text: '3级', value: '3', uuid: uuidv1() },
  { text: '4级', value: '4', uuid: uuidv1() },
  { text: '5级', value: '5', uuid: uuidv1() },
  { text: '6级', value: '6', uuid: uuidv1() },
  { text: '7级', value: '7', uuid: uuidv1() },
  { text: '8级', value: '8', uuid: uuidv1() },
  { text: '9级', value: '9', uuid: uuidv1() },
  { text: '10级', value: '10', uuid: uuidv1() },
];
const LayerData = [
  { label: '高考', value: '1' },
  { label: '自招', value: '2' },
  { label: '竞赛', value: '3' },
];
const ThinkingMethods = [
  { label: '思想方法1', value: '1' },
  { label: '思想方法2', value: '2' },
  { label: '思想方法3', value: '3' },
];
const showOptions = ['0', '1', '2'];
const showAnswer = ['7'];
const OptionLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const EditStatus = { addMain: '0', addTarget: '1', verify: '2', audit: '3', edit: '4' };
const EditMainStatus = [EditStatus.addMain, EditStatus.edit];
@connect(({ teachResearch, loading }) => ({
  teachResearch,
  loading: loading.models.teachResearch,
}))
class MaterialList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editStatus: EditStatus.addMain,
      questionType: '0',
      answers: [],
      fillTopicAnswer: [{ uuid: uuidv1(), value: '' }],
      optionsData: [
        {
          index: uuidv1(),
          value: '',
        },
        {
          index: uuidv1(),
          value: '',
        },
        {
          index: uuidv1(),
          value: '',
        },
        {
          index: uuidv1(),
          value: '',
        },
      ],
      analyzeData: [{ uuid: uuidv1(), value: '' }],
      detailedAnnotationData: [{ uuid: uuidv1(), value: '' }],
      defaultCheckedNodes: [],
      targetModalVisible: false,
      targetPaths: [],
      showTargetList: false,
    };
  }

  onChangeType = (checked, item) => {
    this.setState({
      questionType: item.value,
      answers: [],
    });
  };

  onAddOptions = () => {
    const { optionsData } = this.state;
    const len = optionsData.length;
    if (len === 10) {
      Modal.warning({
        title: '选项最多10个！',
        content: '选项最多只能添加10个！',
      });
      return;
    }
    optionsData.push({ index: uuidv1(), value: '' });
    this.setState({
      optionsData,
    });
  };

  onDelOption = index => {
    const { optionsData } = this.state;
    const len = optionsData.length;
    if (len === 2) {
      Modal.warning({
        title: '选项最少2个！',
        content: '选项最少需要2个，不能继续删除！',
      });
      return;
    }
    for (let i = 0; i < len; i += 1) {
      if (optionsData[i].index === index) {
        optionsData.splice(i, 1);
        break;
      }
    }
    this.setState({
      optionsData,
    });
  };

  onSetAnswer = item => {
    const { questionType } = this.state;
    let answer = [];
    if (questionType === questionTypes[0].value || questionType === questionTypes[3].value) {
      answer.push(item.target.value);
    } else if (questionType === questionTypes[1].value || questionType === questionTypes[2].value) {
      answer = [...item];
    }

    this.setState({
      answers: answer,
    });
  };

  onChangeOption = (e, index) => {
    const { optionsData } = this.state;
    const options = optionsData.filter(item => item.index === index);
    options[0].value = e.target.value;
    this.setState({
      optionsData,
    });
  };

  onAddFillTopicAnswer = () => {
    const { fillTopicAnswer } = this.state;
    fillTopicAnswer.push({ uuid: uuidv1(), value: '' });
    this.setState({
      fillTopicAnswer,
    });
  };

  onChangeFillTopicAnswer = (e, uuid) => {
    const { fillTopicAnswer } = this.state;
    const answer = fillTopicAnswer.filter(item => item.uuid === uuid);
    answer[0].value = e.target.value;
    this.setState({
      fillTopicAnswer,
    });
  };

  onDelFillTopicAnswer = uuid => {
    const { fillTopicAnswer } = this.state;
    const len = fillTopicAnswer.length;
    if (len === 1) {
      Modal.warning({
        title: '至少一个答案！',
        content: '填空题至少一个填空！',
      });
      return;
    }
    for (let i = 0; i < len; i += 1) {
      if (uuid === fillTopicAnswer[i].uuid) {
        fillTopicAnswer.splice(i, 1);
        break;
      }
    }
    this.setState({
      fillTopicAnswer,
    });
  };

  onAddAnalyze = () => {
    const { analyzeData } = this.state;
    analyzeData.push({ uuid: uuidv1(), value: '' });
    this.setState({
      analyzeData,
    });
  };

  onAddDetailedAnnotation = () => {
    const { detailedAnnotationData } = this.state;
    detailedAnnotationData.push({ uuid: uuidv1(), value: '' });
    this.setState({
      detailedAnnotationData,
    });
  };
  onChangeLayer = () => {};
  onChangeThinkingMethod = () => {};

  onShowTargetModal = visible => {
    this.setState({
      targetModalVisible: visible,
    });
  };

  onSetTarget = () => {
    this.setState({
      showTargetList: true,
      targetModalVisible: false,
    });
  };

  onGetTargetTree = () => {
    this.props.dispatch({
      type: 'teachResearch/getTargetTree',
      payload: { targetType: '0' },
    });
    this.setState({
      targetModalVisible: true,
    });
  };

  onCheckNode = (checkedKeys, e) => {
    const { checkedNodes } = e;
    const leafNodes = checkedNodes.filter(item => !item.props.children);
    const paths = [];
    leafNodes.forEach(item => {
      const { teachResearch: { subjectTreeData } } = this.props;
      const pathNodes = [];
      this.getNodePathText(item.key, subjectTreeData, pathNodes);
      paths.push(pathNodes);
    });
    this.setState({
      targetPaths: paths,
    });
  };

  onSaveMain = () => {
    const { answers } = this.state;
    this.props.dispatch({
      type: '',
      payload: { answers },
    });
  };

  getNodePathText = (id, source, pathNodes = []) => {
    for (let i = 0, l = source.length; i < l; i += 1) {
      if (i === 0) {
        const node = source.filter(item => item.key === id);
        if (node.length > 0) {
          pathNodes.push(node[0].title);
          return true;
        }
      }

      if (source[i].children && source[i].children.length > 0) {
        pathNodes.push(source[i].title);
        if (this.getNodePathText(id, source[i].children, pathNodes)) {
          return true;
        }
      }
    }
  };

  render() {
    const self = this;
    const {
      questionType,
      optionsData,
      fillTopicAnswer,
      analyzeData,
      detailedAnnotationData,
      editStatus,
      defaultCheckedNodes,
      targetModalVisible,
      targetPaths,
      showTargetList,
    } = this.state;
    const { teachResearch: { subjectTreeData, loading } } = this.props;
    const createAnswer = () => {
      if (questionType === questionTypes[0].value) {
        return (
          <RadioGroup onChange={self.onSetAnswer} disabled={!EditMainStatus.includes(editStatus)}>
            {optionsData.map((item, index) => {
              return (
                <Radio key={item.index} value={index}>
                  {OptionLabels[index]}
                </Radio>
              );
            })}
          </RadioGroup>
        );
      } else if (
        questionType === questionTypes[1].value ||
        questionType === questionTypes[2].value
      ) {
        return optionsData.map((item, index) => {
          return (
            <Checkbox
              key={item.index}
              value={index}
              disabled={!EditMainStatus.includes(editStatus)}
            >
              {OptionLabels[index]}
            </Checkbox>
          );
        });
      } else if (questionType === questionTypes[3].value) {
        return (
          <RadioGroup onChange={self.onSetAnswer} disabled={!EditMainStatus.includes(editStatus)}>
            <Radio value="0">是</Radio>
            <Radio value="1">否</Radio>
          </RadioGroup>
        );
      } else if (questionType === questionTypes[4].value) {
        const result = fillTopicAnswer.map(item => {
          return (
            <Fragment>
              <Col key={item.uuid} span={3}>
                <Input
                  disabled={!EditMainStatus.includes(editStatus)}
                  size="small"
                  value={item.value}
                  onChange={e => {
                    self.onChangeFillTopicAnswer(e, item.uuid);
                  }}
                />
              </Col>
              <Col span={1}>
                <Button
                  disabled={!EditMainStatus.includes(editStatus)}
                  size="small"
                  type="primary"
                  onClick={() => {
                    self.onDelFillTopicAnswer(item.uuid);
                  }}
                >
                  删除
                </Button>
              </Col>
            </Fragment>
          );
        });
        result.unshift(
          <Col span={1}>
            <Button
              type="primary"
              size="small"
              disabled={!EditMainStatus.includes(editStatus)}
              onClick={self.onAddFillTopicAnswer}
            >
              增加
            </Button>
          </Col>
        );
        return result;
      } else if (
        questionType === questionTypes[5].value ||
        questionType === questionTypes[6].value
      ) {
        return <Input disabled={!EditMainStatus.includes(editStatus)} />;
      }
    };
    const loop = data =>
      data.map(item => {
        if (item.children && item.children.length) {
          return (
            <TreeNode key={item.key} title={item.title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={item.title} />;
      });
    return (
      <PageHeaderLayout title="">
        <Card title="题目标签" loading={loading}>
          <Row className={styles.Row}>
            <Col span={1}>题型：</Col>
            <Col span={20}>
              <CheckableTagGroup
                list={questionTypes}
                checkedVal={questionType}
                onChange={self.onChangeType}
              />
            </Col>
          </Row>
          <Row className={styles.Row}>
            题干：
            <TextArea disabled={!EditMainStatus.includes(editStatus)} rows={4} />
          </Row>
          <div style={{ display: showOptions.includes(questionType) ? 'block' : 'none' }}>
            <Row className={styles.Row}>选项：</Row>
            {optionsData.map((item, index) => {
              return (
                <Row
                  key={`option_${OptionLabels[index]}`}
                  className={styles.Row}
                  type="flex"
                  align="middle"
                >
                  <Col span={1}>{OptionLabels[index]}：</Col>
                  <Col span={21}>
                    <TextArea
                      disabled={!EditMainStatus.includes(editStatus)}
                      rows={2}
                      value={item.value}
                      onChange={e => {
                        self.onChangeOption(e, item.index);
                      }}
                    />
                  </Col>
                  <Col offset={1} span={1}>
                    <Button
                      disabled={!EditMainStatus.includes(editStatus)}
                      type="primary"
                      size="small"
                      onClick={() => {
                        self.onDelOption(item.index);
                      }}
                    >
                      删除
                    </Button>
                  </Col>
                </Row>
              );
            })}
            <Row className={styles.Row}>
              <Col>
                <Button
                  disabled={!EditMainStatus.includes(editStatus)}
                  type="primary"
                  size="small"
                  onClick={this.onAddOptions}
                >
                  +新增选项
                </Button>
              </Col>
            </Row>
          </div>
          <div style={{ display: showAnswer.includes(questionType) ? 'none' : 'block' }}>
            <Row className={styles.Row}>
              <Col span={1}>答案：</Col>
              <Col>{createAnswer()}</Col>
            </Row>
          </div>
          <Row className={styles.Row}>
            <Col>分析：</Col>
          </Row>
          {analyzeData.map(item => {
            return (
              <Row className={styles.Row} key={item.uuid}>
                <Col>
                  <TextArea key={item.uuid} value={item.value} />
                </Col>
              </Row>
            );
          })}
          <Row className={styles.Row}>
            <Col>
              <Button type="primary" size="small" onClick={self.onAddAnalyze}>
                +新增分析
              </Button>
            </Col>
          </Row>

          <Row className={styles.Row}>
            <Col>详解：</Col>
          </Row>
          {detailedAnnotationData.map(item => {
            return (
              <Row className={styles.Row} key={item.uuid}>
                <Col>
                  <TextArea key={item.uuid} value={item.value} />
                </Col>
              </Row>
            );
          })}
          <Row className={styles.Row}>
            <Col>
              <Button type="primary" size="small" onClick={self.onAddDetailedAnnotation}>
                +新增详解
              </Button>
            </Col>
          </Row>
          <Row className={styles.Row}>
            <Col offset={22} span={1}>
              <Button size="small">预览</Button>
            </Col>
            <Col span={1}>
              <Button type="primary" size="small" onClick={self.onSaveMain}>
                保存
              </Button>
            </Col>
          </Row>
          <div style={{ display: editStatus === EditStatus.addTarget ? 'block' : 'block' }}>
            <Row className={styles.Row}>
              <Col>题目标签</Col>
            </Row>
            <Row className={styles.Row}>
              <Col span={1}>学科：</Col>
              <Col span={4}>
                <RadioGroup>
                  <Radio value="0">数学</Radio>
                  <Radio value="1">物理</Radio>
                </RadioGroup>
              </Col>
            </Row>
            <Row className={styles.Row}>
              <Col span={1}>范围：</Col>
              <Col span={4}>
                <RadioGroup>
                  <Radio value="0">课内</Radio>
                  <Radio value="1">课外</Radio>
                </RadioGroup>
              </Col>
            </Row>
            <Row className={styles.Row}>
              <Col span={1}>学部：</Col>
              <Col span={4}>
                <RadioGroup>
                  <Radio value="0">初中</Radio>
                  <Radio value="1">高中</Radio>
                </RadioGroup>
              </Col>
            </Row>
            <Row className={styles.Row}>
              <Col span={1}>来源：</Col>
              <Col span={4}>
                <RadioGroup>
                  <Radio value="0">数学</Radio>
                  <Radio value="1">物理</Radio>
                </RadioGroup>
              </Col>
            </Row>
            <Row className={styles.Row}>
              <Col span={1}>难度：</Col>
              <Col span={20}>
                <RadioGroup>
                  {HardLevels.map(item => {
                    return (
                      <Radio key={item.uuid} value={item.value}>
                        {item.text}
                      </Radio>
                    );
                  })}
                </RadioGroup>
              </Col>
            </Row>
            <Row className={styles.Row}>
              <Col span={1}>层次：</Col>
              <Col span={4}>
                <CheckboxGroup options={LayerData} onChange={self.onChangeLayer} />
              </Col>
            </Row>
            <Row className={styles.Row}>
              <Col span={2}>思想方法：</Col>
              <Col span={8}>
                <CheckboxGroup options={ThinkingMethods} onChange={self.onChangeThinkingMethod} />
              </Col>
            </Row>
            <Row className={styles.Row}>
              <Col span={2}>知识点标签：</Col>
              <Col span={8}>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    self.onGetTargetTree();
                  }}
                >
                  +新增知识点
                </Button>
              </Col>
            </Row>
            <Row className={styles.Row}>
              <Col>
                {showTargetList &&
                  targetPaths.map(item => {
                    return (
                      <Tag
                        key={item.key}
                        style={{
                          display: 'block',
                          marginTop: '10px',
                        }}
                        color="blue"
                      >
                        {item.join('>')}
                      </Tag>
                    );
                  })}
              </Col>
            </Row>
          </div>
          <div style={{ display: editStatus === EditStatus.verify ? 'block' : 'none' }}>
            <Row className={styles.Row}>
              <Col span={2}>校验通过：</Col>
              <Col span={4}>
                <RadioGroup onChange={this.onChange} value={this.state.value}>
                  <Radio value="1">是</Radio>
                  <Radio value="2">否</Radio>
                </RadioGroup>
              </Col>
            </Row>
            <Row className={styles.Row}>
              <Col offset={23} span={1}>
                <Button type="primary" size="small">
                  保存
                </Button>
              </Col>
            </Row>
          </div>
          <div style={{ display: editStatus === EditStatus.audit ? 'block' : 'none' }}>
            <Row className={styles.Row}>
              <Col span={2}>审核通过：</Col>
              <Col span={4}>
                <RadioGroup onChange={this.onChange} value={this.state.value}>
                  <Radio value="1">是</Radio>
                  <Radio value="2">否</Radio>
                </RadioGroup>
              </Col>
            </Row>
            <Row className={styles.Row}>
              <Col offset={23} span={1}>
                <Button type="primary" size="small">
                  保存
                </Button>
              </Col>
            </Row>
          </div>
        </Card>
        <Modal
          maskClosable={false}
          title="选择知识标签"
          width="700px"
          visible={targetModalVisible}
          onOk={self.onSetTarget}
          onCancel={() => {
            self.onShowTargetModal(false);
          }}
        >
          <Row>
            <Col span={11}>
              <Tree
                autoExpandParent
                checkable
                defaultCheckedKeys={defaultCheckedNodes}
                onCheck={self.onCheckNode}
              >
                {loop(subjectTreeData)}
              </Tree>
              <Divider type="vertical" />
            </Col>
            <Col span={1}>
              <Divider type="vertical" style={{ height: '100%', minHeight: '300px' }} />
            </Col>
            <Col span={12}>
              {targetPaths.map(item => {
                return (
                  <Tag key={item.key} style={{ display: 'block', marginTop: '10px' }} color="blue">
                    {item.join('>')}
                  </Tag>
                );
              })}
            </Col>
          </Row>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
export default MaterialList;
