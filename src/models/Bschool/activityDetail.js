import { Apis } from '../../services/api';

const { bSchoolApis: { queryBschoolActivityRecord } } = Apis;
export default {
  namespace: 'activityDetail',
  state: {
    recordList: {},
  },
  effects: {
    *fetchActivityRecord({ payload }, { call, put }) {
      const response = yield call(queryBschoolActivityRecord, { ...payload });
      if (response && response.code === 1) {
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
