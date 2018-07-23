import { routerRedux } from 'dva/router';
import {
  queryAccount,
  queryRole,
  queryMenus,
  queryUserMenu,
  updateAccount,
  queryDepartment,
  updateUserStatus,
  saveRole,
  deleteRole,
} from '../services/api';

const opType = { add: '0', edit: '1' };
export default {
  namespace: 'authority',
  state: {
    accountData: {
      list: [],
      pagination: {},
    },
    roleData: {
      list: [],
      pagination: {},
    },
    menuData: [],
    userRole: {
      id: '',
      name: '',
      roleMenuIds: [],
    },
    oldUserRole: {
      id: '',
      name: '',
      roleMenuIds: [],
    },
    departments: [],
  },

  effects: {
    *fetchAcount({ payload }, { call, put }) {
      const response = yield call(queryAccount, payload);
      if (response.code === 0) {
        yield put({
          type: 'saveAcounts',
          payload: response.data,
        });
      }
    },
    *fetchDepartment(_, { call, put }) {
      const response = yield call(queryDepartment);
      if (response.code === 0) {
        yield put({
          type: 'saveDepartments',
          payload: response.data,
        });
      }
    },
    *editAcount({ payload }, { select, call, put }) {
      let response = yield call(updateAccount, payload);

      if (response.code === 0) {
        const pagination = yield select(state => state.authority.accountData.pagination);
        response = yield call(queryAccount, {
          fuzzy: '',
          ...pagination,
        });
        if (response.code === 0) {
          yield put({
            type: 'saveAcounts',
            payload: response.data,
          });
        }
      }
    },
    *updateUserStatus({ payload }, { select, call, put }) {
      let response = yield call(updateUserStatus, payload);

      if (response.code === 0) {
        const pagination = yield select(state => state.authority.accountData.pagination);
        response = yield call(queryAccount, {
          fuzzy: '',
          ...pagination,
        });
        if (response.code === 0) {
          yield put({
            type: 'saveAcounts',
            payload: response.data,
          });
        }
      }
    },
    *fetchRole({ payload }, { call, put }) {
      const response = yield call(queryRole, payload);
      if (response.code === 0) {
        yield put({
          type: 'saveRoles',
          payload: response.data,
        });
      }
    },
    *addRole({ payload }, { call, put }) {
      if (payload.editType === opType.edit) {
        yield put(routerRedux.push('/authority/role-edit'));
        const response = yield call(queryUserMenu, { roleId: payload.roleId });
        if (response.code === 0) {
          yield put({
            type: 'saveUserMenus',
            payload: response.data,
          });
        }
      } else {
        yield put(routerRedux.push('/authority/role-edit'));
      }
    },
    *editRoleName({ payload }, { put }) {
      yield put({
        type: 'saveRoleName',
        payload,
      });
    },
    *saveUserRole({ payload }, { call, put }) {
      const userRole = { ...payload, roleMenuIds: payload.roleMenuIds.join(',') };
      let response = yield call(saveRole, userRole);
      if (response.code === 0) {
        response = yield call(queryRole, { name: '' });
        if (response.code === 0) {
          yield put({
            type: 'saveRoles',
            payload: response.data,
          });
        }
        yield put(routerRedux.push('/authority/role-list'));
      }
    },
    *deleteRole({ payload }, { call, put }) {
      let response = yield call(deleteRole, { roleId: payload.roleId });
      if (response.code === 0) {
        response = yield call(queryRole, { name: payload.name });
        if (response.code === 0) {
          yield put({
            type: 'saveRoles',
            payload: response.data,
          });
        }
      }
    },
    *refreshRoleDetail(_, { put }) {
      yield put({
        type: 'saveRefreshRoleDetail',
      });
    },
    *fetchMenuList({ payload }, { call, put }) {
      const response = yield call(queryMenus, payload);
      if (response.code === 0) {
        yield put({
          type: 'saveMenus',
          payload: response.data,
        });
      }
    },

    *setUserMenu({ payload }, { put }) {
      yield put({
        type: 'setUserMenus',
        payload,
      });
    },
  },

  reducers: {
    saveAcounts(state, action) {
      return {
        ...state,
        accountData: action.payload,
      };
    },
    saveRoles(state, action) {
      return {
        ...state,
        roleData: action.payload,
      };
    },
    saveMenus(state, action) {
      return {
        ...state,
        menuData: action.payload,
      };
    },
    saveUserMenus(state, action) {
      return {
        ...state,
        userRole: action.payload,
        oldUserRole: JSON.parse(JSON.stringify(action.payload)),
      };
    },
    setUserMenus(state, action) {
      const { payload } = action;
      const { roleMenuIds } = state.userRole;

      if (payload.checked) {
        roleMenuIds.push(payload.id);
        if (payload.isParent) {
          (payload.subMenu || []).forEach(item => {
            roleMenuIds.push(item.id);
          });
        }
      } else {
        let index = roleMenuIds.findIndex(item => item === payload.id);
        if (index !== -1) roleMenuIds.splice(index, 1);
        if (payload.isParent) {
          (payload.subMenu || []).forEach(subMenu => {
            index = roleMenuIds.findIndex(item => item === subMenu.id);
            if (index !== -1) roleMenuIds.splice(index, 1);
          });
        }
      }

      return {
        ...state,
      };
    },
    saveRoleName(state, action) {
      const { userRole } = state;
      userRole.name = action.payload;
      return {
        ...state,
      };
    },
    saveRefreshRoleDetail(state) {
      const { userRole, oldUserRole } = state;
      userRole.roleMenuIds = JSON.parse(JSON.stringify(oldUserRole.roleMenuIds));
      return {
        ...state,
      };
    },
    saveDepartments(state, action) {
      return {
        ...state,
        departments: action.payload,
      };
    },
  },
};
