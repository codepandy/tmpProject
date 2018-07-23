import { Apis } from '../../services/api';

const { coachApis: { queryTeacherClassRecord } } = Apis;
export default {
  namespace: 'coachCourseDetail',
  state: {
    recordList: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const { coachId } = payload;
      const response = yield call(queryTeacherClassRecord, { ...payload, teacherId: coachId });
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
