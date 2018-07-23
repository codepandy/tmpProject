import { Apis } from '../../services/api';

const { bSchoolApis: { queryBschoolSignRecord } } = Apis;
export default {
  namespace: 'signDetail',
  state: {
    recordList: {},
  },
  effects: {
    *fetchSignDetail({ payload }, { call, put }) {
      const response = yield call(queryBschoolSignRecord, {
        ...payload,
        schoolId: payload.schoolId,
      });
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
