import { routerRedux } from 'dva/router';
import { getAccountLogin } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: true,
    currentUser: {},
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(getAccountLogin, payload);
      if (response && response.code === 0) {
        const { userInfo } = response.data;
        yield put({
          type: 'changeLoginStatus',
          payload: { status: true, ...userInfo },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/authority/account-list'));
      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: { status: false, currentAuthority: '-1', roleIds: '[]', token: '' },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
    *logout(_, { put, select }) {
      sessionStorage.clear();
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: '-1',
            roleIds: '[]',
            token: '',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.roleIds);
      sessionStorage.setItem('authority_token_key', payload.token);
      return {
        ...state,
        currentUser: { ...payload },
        status: payload.status,
        type: 'account',
      };
    },
  },
};
