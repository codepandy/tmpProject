import { Apis } from '../../services/api';

const { cStudentApis: { queryStudentActivityRecord } } = Apis;
export default {
  namespace: 'BCstudentActivityDetail',
  state: {
    recordList: {},
  },
  effects: {
    *fetchActivityRecord({ payload }, { call, put }) {
      const { studentId } = payload;
      const response = yield call(queryStudentActivityRecord, { ...payload, userId: studentId });
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
