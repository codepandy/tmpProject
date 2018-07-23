// import { queryStudentConnectRecord } from '../../services/api';
import { Apis } from '../../services/api';

const { cStudentApis: { queryStudentConnectRecord } } = Apis;
export default {
  namespace: 'coachConnectDetail',
  state: {
    recordList: {},
  },
  effects: {
    *fetchConnectRecord({ payload, callback }, { call, put }) {
      const { coachId: userId } = payload;
      const response = yield call(queryStudentConnectRecord, { ...payload, userId });
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
