import { Apis } from '../../services/api';

const { bSchoolApis: { queryBschoolBasicInfo } } = Apis;
export default {
  namespace: 'bschoolBasicInfo',

  state: {
    basicInfoEditVisible: false,
    confirmLoadding: false,

    basicInfos: {},
  },
  effects: {
    *getSchoolBasicInfo({ payload }, { call, put }) {
      const response = yield call(queryBschoolBasicInfo, { ...payload });
      yield put({
        type: 'setState',
        payload: {
          basicInfos: response,
        },
      });
    },
  },

  reducers: {
    setState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
