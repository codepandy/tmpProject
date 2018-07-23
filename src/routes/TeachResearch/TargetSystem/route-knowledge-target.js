import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button, Tree, Modal, Input, Tabs } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './route-knowledge-target.less';

const { confirm } = Modal;
const { TreeNode } = Tree;
const { TabPane } = Tabs;
const KnowledgeType = {
  math: 1,
  physicMiddleSchool: 2,
  physicHighSchool: 3,
};
const EditType = {
  add: 'add',
  addLabel: '新增知识点',
  edit: 'edit',
  editLabel: '编辑知识点',
};
const DisplayVal = {
  show: 'block',
  hidden: 'none',
};
@connect(({ teachResearch, loading }) => ({
  teachResearch,
  loading: loading.models.teachResearch,
}))
class KnowledgeTarget extends Component {
  state = {
    editNodeVisible: false,
    eidtNodeTitle: EditType.addLabel,
    editType: EditType.add,
    newNodeIndex: 0,
    checkMathNode: {},
    checkPhysicMiddleNode: {},
    checkPhysicHightNode: {},
    editNode: {},
    newNode: {},
    selectedNodes: [],
    mathTreeData: [],
    physicMiddleSchool: [],
    physicHighSchool: [],
    checkTab: KnowledgeType.math,
    requiredError: DisplayVal.hidden,
    selectedKeys: [],
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'teachResearch/fetchTarget',
    });
    this.props.dispatch({
      type: 'teachResearch/fetchTreeData',
      payload: {
        hierarchyId: KnowledgeType.math,
      },
    });
  }
  componentWillReceiveProps(nextProps) {
    const {
      mathTreeData,
      physicMiddleSchool,
      physicHighSchool,
      checkTab,
    } = nextProps.teachResearch;
    this.setState({
      mathTreeData,
      physicMiddleSchool,
      physicHighSchool,
      checkTab,
    });
  }

  onDrop = (info, knowledgeType) => {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    this.props.dispatch({
      type: 'teachResearch/moveMainPoint',
      payload: {
        hierarchyId: knowledgeType,
        id: dragKey,
        parentId: dropKey,
      },
    });
  };
  onEditNode = type => {
    const checkNode = this.getCheckedNode();
    if (type === EditType.edit && !checkNode.key) {
      this.warning('无任何选中知识点！', '请先选择要编辑的知识点，然后再进行编辑。');
      return;
    }
    this.setState({
      editType: type,
      eidtNodeTitle: type === EditType.add ? EditType.addLabel : EditType.editLabel,
      editNodeVisible: true,
      editNode: type === EditType.edit ? { ...checkNode } : { title: '' },
    });
  };
  onCancelEditModal = () => {
    this.setState({
      editNodeVisible: false,
    });
  };
  onCheckNode = checkedKeys => {
    this.setState({
      selectedNodes: checkedKeys.checked,
    });
  };
  onSelectNode = (selectedKeys, e) => {
    const { checkTab } = this.state;
    const lastIndex = e.selected && e.selectedNodes.length - 1;
    const lastItem = e.selected && e.selectedNodes[lastIndex];
    const checkNode = { key: lastItem.key, ...lastItem.props };
    if (checkTab === KnowledgeType.math) {
      this.setState({
        checkMathNode: e.selected ? checkNode : {},
      });
    } else if (checkTab === KnowledgeType.physicMiddleSchool) {
      this.setState({
        checkPhysicMiddleNode: e.selected ? checkNode : {},
      });
    } else if (checkTab === KnowledgeType.physicHighSchool) {
      this.setState({
        checkPhysicHightNode: e.selected ? checkNode : {},
      });
    }
    this.setState({
      selectedKeys,
    });
  };

  onChangeTab = key => {
    const { dispatch } = this.props;
    const { mathTreeData, physicMiddleSchool, physicHighSchool } = this.state;
    if (
      (key === KnowledgeType.math && mathTreeData.length > 0) ||
      (key === KnowledgeType.physicMiddleSchool && physicMiddleSchool.length > 0) ||
      (key === KnowledgeType.physicHighSchool && physicHighSchool.length > 0)
    ) {
      this.setState({
        checkTab: key,
      });
      return;
    }
    this.setState({
      checkMathNode: {},
      checkPhysicMiddleNode: {},
      checkPhysicHightNode: {},
      selectedKeys: [],
    });
    dispatch({
      type: 'teachResearch/fetchTreeData',
      payload: {
        hierarchyId: +key,
      },
    });
  };

  onChangeNode = e => {
    const { editType, newNodeIndex } = this.state;
    const val = e.target.value;

    if (editType === EditType.add) {
      this.setState({
        newNodeIndex: newNodeIndex + 1,
        newNode: {
          point: {
            id: `newNode${newNodeIndex}`,
            name: val,
          },
        },
        editNode: { title: val },
      });
    } else {
      this.setState({
        editNode: { title: val },
      });
    }
  };

  onSaveNode = () => {
    const {
      checkTab,
      editNode,
      newNode,
      editType,
      checkMathNode,
      checkPhysicMiddleNode,
      checkPhysicHightNode,
    } = this.state;
    if (!editNode.title || editNode.title.length === 0) {
      this.setState({ requiredError: DisplayVal.show });
      return;
    }
    const payload = {
      hierarchyId: checkTab,
      name: editType === EditType.add ? newNode.point.name : editNode.title,
    };
    const checkNode = this.getCheckedNode();
    if (editType === EditType.add && checkNode) {
      payload.parentId = checkNode.key || '';
    } else {
      payload.id = checkNode.key;
    }
    this.props.dispatch({
      type: 'teachResearch/addMainPoint',
      payload,
      editType,
    });
    if (checkTab === KnowledgeType.math) {
      this.setState({
        checkMathNode: { ...checkMathNode, title: editNode.title },
      });
    } else if (checkTab === KnowledgeType.physicMiddleSchool) {
      this.setState({
        checkPhysicMiddleNode: { ...checkPhysicMiddleNode, title: editNode.title },
      });
    } else if (checkTab === KnowledgeType.physicHighSchool) {
      this.setState({
        checkPhysicHightNode: { ...checkPhysicHightNode, title: editNode.title },
      });
    }
    this.setState({
      editNodeVisible: false,
    });
  };

  getCheckedNode = () => {
    const { checkMathNode, checkPhysicHightNode, checkPhysicMiddleNode, checkTab } = this.state;
    return checkTab === KnowledgeType.math
      ? checkMathNode
      : checkTab === KnowledgeType.physicMiddleSchool
        ? checkPhysicMiddleNode
        : checkPhysicHightNode;
  };

  getNodeByKey = (key, data) => {
    for (let i = 0, l = data.length; i < l; i += 1) {
      if (i === 0) {
        const nodeItem = data.filter(item => item.point.id.toString() === key.toString());
        if (nodeItem.length > 0) {
          return nodeItem[0];
        }
      }
      const item = data[i];
      if (item.subPoint) {
        const nodeItem = this.getNodeByKey(key, item.subPoint);
        if (nodeItem) {
          return nodeItem;
        }
      }
    }
  };

  showDeleteConfirm = () => {
    const self = this;
    const { selectedNodes, checkTab } = this.state;
    if (selectedNodes.length === 0) {
      self.warning('无任何可删除的节点。', '请选择需要删除的节点。');
      return;
    }
    confirm({
      title: '确定要删除选中节点吗?',
      content: '删除后数据不可恢复！',
      okType: 'danger',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        self.props.dispatch({
          type: 'teachResearch/deleteNodes',
          payload: selectedNodes,
          checkTab,
        });
      },
    });
  };
  warning = (title, content) => {
    Modal.warning({
      title,
      content,
      okText: '确认',
    });
  };

  render() {
    const self = this;
    const {
      mathTreeData,
      physicMiddleSchool,
      physicHighSchool,
      checkTab,
      editNode,
      requiredError,
      selectedKeys,
    } = this.state;
    const { loading, teachResearch: { targets } } = this.props;
    const loop = data =>
      data.map(item => {
        if (item.subPoint && item.subPoint.length) {
          return (
            <TreeNode key={item.point.id} title={item.point.name}>
              {loop(item.subPoint)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.point.id} title={item.point.name} />;
      });
    const operations = (
      <div>
        <Button
          size="small"
          type="primary"
          onClick={() => {
            self.onEditNode(EditType.add);
          }}
        >
          添加
        </Button>&nbsp;
        <Button
          size="small"
          type="primary"
          onClick={() => {
            self.onEditNode(EditType.edit);
          }}
        >
          编辑
        </Button>
      </div>
    );
    return (
      <PageHeaderLayout title="">
        <Card loading={loading}>
          <Tabs
            activeKey={checkTab.toString()}
            tabBarExtraContent={operations}
            onChange={self.onChangeTab}
            loading={loading}
          >
            {targets.map(item => {
              return (
                <TabPane tab={item.name} key={item.id}>
                  <Tree
                    autoExpandParent
                    checkable
                    draggable
                    checkStrictly
                    onCheck={self.onCheckNode}
                    onSelect={self.onSelectNode}
                    onDrop={info => {
                      this.onDrop(info, item.id);
                    }}
                    selectedKeys={selectedKeys}
                  >
                    {loop(
                      item.id === KnowledgeType.math
                        ? mathTreeData
                        : item.id === KnowledgeType.physicMiddleSchool
                          ? physicMiddleSchool
                          : physicHighSchool
                    )}
                  </Tree>
                </TabPane>
              );
            })}
          </Tabs>
        </Card>
        <Modal
          maskClosable={false}
          title={this.state.eidtNodeTitle}
          visible={this.state.editNodeVisible}
          onOk={this.onSaveNode}
          onCancel={this.onCancelEditModal}
        >
          <Input addonBefore="标签名" value={editNode.title} onChange={this.onChangeNode} />
          <span className={styles.required} style={{ display: requiredError }}>
            名称不能为空
          </span>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
export default KnowledgeTarget;
