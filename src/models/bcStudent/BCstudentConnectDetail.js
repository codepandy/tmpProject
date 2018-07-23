import { Apis } from '../../services/api';

const { cStudentApis: { queryStudentConnectRecord } } = Apis;
export default {
  namespace: 'BCstudentConnectDetail',
  state: {
    recordList: {},
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryStudentConnectRecord, { ...payload });
      if (response.code === 1) {
        if (payload.pageNo === 1) {
          yield put({
            type: 'setState',
            payload: { recordList: response.data },
          });
        } else {
          yield put({
            type: 'recordMore',
            payload: response.data,
          });
        }
      }
      if (callback) callback();
    },
  },
  reducers: {
    setState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    recordMore(state, { payload }) {
      const result = [...state.recordList.result, ...payload.result];
      const pagination = { ...payload.pagination };
      return {
        ...state,
        recordList: {
          result,
          pagination,
        },
      };
    },
    clear() {
      return {
        recordList: {},
      };
    },
  },
};
