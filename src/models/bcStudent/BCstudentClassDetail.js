import { Apis } from '../../services/api';

const { cStudentApis: { queryStudentListContract } } = Apis;
export default {
  namespace: 'BCstudentClassDetail',
  state: {
    recordList: {},
  },
  effects: {
    *fetchclassDetail({ payload }, { call, put }) {
      const { studentId } = payload;
      const response = yield call(queryStudentListContract, { ...payload, studentId });
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
