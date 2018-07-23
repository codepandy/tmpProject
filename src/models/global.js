import { queryNotices, queryMenus } from '../services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    menus: [
      {
        createTime: null,
        updateTime: null,
        id: 1,
        name: '用户管理',
        mark: null,
        parentId: 0,
        path: 'useradmin',
        hideInMenu: 0,
        children: [
          {
            createTime: null,
            updateTime: null,
            id: 2,
            name: 'B端学校',
            mark: null,
            parentId: 1,
            path: 'b-school',
            hideInMenu: 0,
          },
          {
            createTime: null,
            updateTime: null,
            id: 3,
            name: 'B端教练',
            mark: null,
            parentId: 1,
            path: 'coach-to-B',
            hideInMenu: 0,
          },
          {
            createTime: null,
            updateTime: null,
            id: 4,
            name: 'B端/C端学生',
            mark: null,
            parentId: 1,
            path: 'coach-detail',
            hideInMenu: 0,
          },
        ],
      },
      {
        createTime: null,
        updateTime: null,
        id: 5,
        name: '权限管理',
        mark: null,
        parentId: 0,
        path: 'authority',
        hideInMenu: 0,
        children: [
          {
            createTime: null,
            updateTime: null,
            id: 6,
            name: '账号管理',
            mark: null,
            parentId: 5,
            path: 'account-list',
            hideInMenu: 0,
            children: null,
          },
          {
            createTime: null,
            updateTime: null,
            id: 7,
            name: '角色管理',
            mark: null,
            parentId: 5,
            path: 'role-list',
            hideInMenu: 0,
          },
          {
            createTime: null,
            updateTime: null,
            id: 8,
            name: '角色编辑',
            mark: null,
            parentId: 5,
            path: 'role-edit',
            hideInMenu: 1,
          },
        ],
      },
    ],
  },

  effects: {
    *fetchNotices(_, { call, put }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *fetchMenus(_, { call, put }) {
      const response = yield call(queryMenus);
      if (response && response.code === 0) {
        yield put({
          type: 'saveMenus',
          payload: response.data,
        });
      }
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    saveMenus(state, { payload }) {
      return {
        ...state,
        //menus: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
