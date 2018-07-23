import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Button, Tree, Modal } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const { TreeNode } = Tree;
@connect(({ teachResearch, loading }) => ({
  teachResearch,
  loading: loading.models.teachResearch,
}))
class KnowledgeSystemEdit extends Component {
  state = {
    selectNodeVisible: false,
    checkedNodes: [],
  };

  componentDidMount() {
    const { match: { params } } = this.props;
    this.props.dispatch({
      type: 'teachResearch/getKnowledgeDetailData',
      payload: params,
    });
  }

  onSaveSelectedTree = () => {
    const { checkedNodes } = this.state;
    const { teachResearch: { currentKnowledgeDetail } } = this.props;
    this.props.dispatch({
      type: 'teachResearch/updateTreeNode',
      payload: { hierarchyId: currentKnowledgeDetail.info.id, idListStr: checkedNodes.join(',') },
    });
    this.setState({ selectNodeVisible: false });
  };
  onCheckNode = checkedKeys => {
    this.setState({
      checkedNodes: checkedKeys,
    });
  };
  showKnowledgeTreeModal = visible => {
    this.setState({
      selectNodeVisible: visible,
    });
  };

  render() {
    const { teachResearch: { currentKnowledgeDetail, subjectTreeData }, loading } = this.props;
    const { selectNodeVisible } = this.state;
    const loop = data =>
      (data || []).map(item => {
        if (item.subPoint && item.subPoint.length) {
          return (
            <TreeNode key={item.point.mainPointId} title={item.point.name}>
              {loop(item.subPoint)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.point.mainPointId} title={item.point.name} />;
      });
    return (
      <PageHeaderLayout title="">
        <Card loading={loading}>
          <Row>
            <Col span={2}>
              {`${currentKnowledgeDetail.info.subject}>${currentKnowledgeDetail.info.scope}`}
              {currentKnowledgeDetail.info.department ? '>' : ''}
            </Col>
            <Col span={3}>
              创建：{currentKnowledgeDetail.info.createTime}{' '}
              {currentKnowledgeDetail.info.createUserName}
            </Col>
            <Col span={3}>
              更新：{currentKnowledgeDetail.info.updateTime}{' '}
              {currentKnowledgeDetail.info.updateUserName}
            </Col>
            <Col offset={15} span={1}>
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  this.showKnowledgeTreeModal(true);
                }}
              >
                知识标签
              </Button>
            </Col>
          </Row>
          <Tree autoExpandParent>{loop(currentKnowledgeDetail.node)}</Tree>
        </Card>
        <Modal
          maskClosable={false}
          title="选择知识标签"
          visible={selectNodeVisible}
          onOk={this.onSaveSelectedTree}
          onCancel={this.showKnowledgeTreeModal.bind(this, false)}
        >
          <Tree
            autoExpandParent
            checkable
            defaultCheckedKeys={currentKnowledgeDetail.idList}
            onCheck={this.onCheckNode}
          >
            {loop(subjectTreeData)}
          </Tree>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
export default KnowledgeSystemEdit;
