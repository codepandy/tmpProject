import { routerRedux } from 'dva/router';
import {
  listMainHierarchy,
  queryKnowledgeSystem,
  queryKnowledgeTarget,
  deleteNodes,
  updateTreeNode,
  addMainPoint,
  editMainPointName,
  moveMainPoint,
  getTagItemByNameBatch,
  getSourceList,
  addHierarchy,
  queryHierarchyTree,
  queryHierarchyTreeUse,
} from '../services/api';

const KnowledgeType = {
  math: 1,
  physicMiddleSchool: 2,
  physicHighSchool: 3,
};
const EditType = {
  add: 'add',
  edit: 'edit',
};
export default {
  namespace: 'teachResearch',
  state: {
    targets: [],
    knowledgeData: {
      list: [],
      pagination: {},
    },
    currentKnowledgeDetail: {
      info: {
        subject: '',
        department: '',
        createTime: '',
        createUserName: '',
        updateTime: '',
        updateUserName: '',
        targetTree: [],
      },
      node: [],
    },
    mathTreeData: [],
    physicMiddleSchool: [],
    physicHighSchool: [],
    subjectTreeData: [],
    checkTab: KnowledgeType.math,
    targetTypeList: [],
    sourceData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchTarget(_, { call, put }) {
      const response = yield call(listMainHierarchy);
      if (response.code === 0) {
        yield put({
          type: 'saveTargets',
          payload: response.data,
        });
      }
    },
    *fetchKnowledgeList(payload, { call, put }) {
      const response = yield call(queryKnowledgeSystem, payload);
      if (response.code === 0) {
        const { list, total } = response.data;
        yield put({
          type: 'saveKnowledgeList',
          payload: { list, pagination: { total } },
        });
      }
    },
    *fetchTreeData({ payload }, { call, put }) {
      const response = yield call(queryKnowledgeTarget, payload);
      if (response.code === 0) {
        yield put({
          type: 'saveKnowledgeTarget',
          payload: response.data.node,
          targetType: payload.hierarchyId,
        });
      }
    },
    *getTagItemByNameBatch({ payload }, { call, put }) {
      const response = yield call(getTagItemByNameBatch, payload);
      if (response.code === 0) {
        yield put({
          type: 'saveTargetTypeList',
          payload: response.data,
        });
      }
    },
    *addMainPoint({ payload, editType }, { call, put }) {
      let response;
      if (editType === EditType.add) {
        response = yield call(addMainPoint, payload);
      } else {
        response = yield call(editMainPointName, payload);
      }

      if (response.code === 0) {
        response = yield call(queryKnowledgeTarget, { hierarchyId: payload.hierarchyId });
        if (response.code === 0) {
          yield put({
            type: 'saveKnowledgeTarget',
            payload: response.data.node,
            targetType: payload.hierarchyId,
          });
        }
      }
    },
    *moveMainPoint({ payload }, { call, put }) {
      let response = yield call(moveMainPoint, payload);
      if (response.code === 0) {
        response = yield call(queryKnowledgeTarget, { hierarchyId: payload.hierarchyId });
        if (response.code === 0) {
          yield put({
            type: 'saveKnowledgeTarget',
            payload: response.data.node,
            targetType: payload.hierarchyId,
          });
        }
      }
    },
    *fetchSourceList({ payload }, { call, put }) {
      const response = yield call(getSourceList, payload);
      if (response.code === 0) {
        yield put({
          type: 'saveSourceList',
          payload: response.data,
        });
      }
    },
    *deleteNodes({ payload, checkTab }, { call, put }) {
      const result = yield call(deleteNodes, payload);
      if (result.status === 'ok') {
        const response = yield call(queryKnowledgeTarget, { targetType: checkTab });
        yield put({
          type: 'saveKnowledgeTarget',
          payload: response,
          targetType: checkTab,
        });
      }
    },
    *viewKnowledgeDetail({ payload }, { put }) {
      yield put(routerRedux.push(`/teachResearch/knowledge-list-edit/${payload.id}`));
    },
    *getKnowledgeDetailData({ payload }, { call, put }) {
      const response = yield call(queryHierarchyTree, { hierarchyId: payload.id });
      if (response.code === 0) {
        const res = yield call(queryHierarchyTreeUse, { hierarchyId: payload.id });
        yield put({
          type: 'saveKnowledgeDetail',
          payload: { currentKnowledgeDetail: res.data, treeData: response.data.node },
        });
      }
    },
    *updateTreeNode({ payload }, { call, put }) {
      const result = yield call(updateTreeNode, payload);
      if (result.code === 0) {
        const response = yield call(queryHierarchyTreeUse, { hierarchyId: payload.hierarchyId });
        if (response.code === 0) {
          yield put({
            type: 'getKnowledgeDetail',
            payload: response.data,
          });
        }
      }
    },
    *getTargetTree({ payload }, { call, put }) {
      const response = yield call(queryKnowledgeTarget, payload);
      yield put({
        type: 'saveTargetTree',
        payload: response,
      });
    },
    *addHierarchy({ payload }, { call, put }) {
      let response = yield call(addHierarchy, payload);
      if (response.code === 0) {
        response = yield call(queryKnowledgeSystem, payload);
        if (response.code === 0) {
          const { list, total } = response.data;
          yield put({
            type: 'saveKnowledgeList',
            payload: { list, pagination: { total } },
          });
        }
      }
    },
  },

  reducers: {
    saveTargets(state, action) {
      return {
        ...state,
        targets: action.payload,
      };
    },
    saveKnowledgeList(state, action) {
      return {
        ...state,
        knowledgeData: action.payload,
      };
    },
    saveKnowledgeDetail(state, action) {
      const { currentKnowledgeDetail, treeData } = action.payload;
      return {
        ...state,
        currentKnowledgeDetail,
        subjectTreeData: treeData,
      };
    },
    saveKnowledgeTarget(state, action) {
      switch (action.targetType) {
        case KnowledgeType.math:
          return {
            ...state,
            mathTreeData: action.payload,
            checkTab: KnowledgeType.math,
          };
        case KnowledgeType.physicMiddleSchool:
          return {
            ...state,
            physicMiddleSchool: action.payload,
            checkTab: KnowledgeType.physicMiddleSchool,
          };
        case KnowledgeType.physicHighSchool:
          return {
            ...state,
            physicHighSchool: action.payload,
            checkTab: KnowledgeType.physicHighSchool,
          };
        default:
          return {
            ...state,
            mathTreeData: action.payload,
            checkTab: KnowledgeType.math,
          };
      }
    },
    getKnowledgeDetail(state, action) {
      return {
        ...state,
        currentKnowledgeDetail: action.payload,
      };
    },
    saveTargetTree(state, action) {
      return {
        ...state,
        subjectTreeData: action.payload,
      };
    },
    saveSourceList(state, action) {
      return {
        ...state,
        sourceData: action.payload,
      };
    },
    saveTargetTypeList(state, action) {
      return {
        ...state,
        targetTypeList: action.payload,
      };
    },
  },
};
