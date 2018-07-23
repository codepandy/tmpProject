import { message } from 'antd';
import { Apis } from '../../services/api';

const {
  commonApis: { queryDictionariy },
  cStudentApis: { queryStudent, updateStudentStatus, queryStatStudentHomeCount },
} = Apis;
export default {
  namespace: 'bcStudent', // 我们所有的 dispatch 都是通过这个namespace定位过来的。 所以当请求不通，要注意。
  state: {
    querySearchData: [],

    provices: [],
    organization: [],
    origin: [],
    signCeremony: [],

    confirmSearchStudentInfo: false, // 查询按钮的loadding效果

    selectProvices: null,
    selectOrganization: null,
    selectOrigin: null,
    selectSignCeremony: null,
    writeStudentInfo: '',

    loading: true,
    studentHomeCount: {
      totalNum: 0,
      contractNum: 0,
    },
  },
  effects: {
    /**
     *
     * @param {*} 字典拉取（省份、机构、来源、是否在读）
     */
    *fetchCstudentBasicDictionaries(_, { call, put }) {
      const [provices, organization, origin, studentHomeCount] = yield [
        call(queryDictionariy, { dicId: 1 }),
        call(queryDictionariy, { dicId: 2 }),
        call(queryDictionariy, { dicId: 44 }),
        call(queryStatStudentHomeCount),
      ];
      yield put({
        type: 'setState',
        payload: {
          provices: provices.data,
          organization: organization.data,
          origin: origin.data,
          signCeremony: [
            { resultValue: '当前在读', resultKey: 1 },
            { resultValue: '当前非在读', resultKey: 0 },
          ],
          studentHomeCount: studentHomeCount.data,
        },
      });
      yield put({
        type: 'fetch',
        payload: {
          pageNo: 1,
          pageSize: 10,
        },
      });
    },
    /**
     *
     * @param {d} 拉取表格数据（学生列表）
     */
    *fetch({ payload }, { call, put, select }) {
      yield put({ type: 'setState', payload: { loading: true } });
      const {
        selectOrganization,
        selectOrigin,
        selectProvices,
        selectSignCeremony,
        writeStudentInfo,
      } = yield select(state => state.bcStudent);
      const xhr = {
        ...payload,
        schoolType: selectOrganization ? selectOrganization * 1 : null,
        studentOrigin: selectOrigin ? selectOrigin * 1 : null,
        schoolProvince: selectProvices ? selectProvices * 1 : null,
        studentReadingFlag: selectSignCeremony === null ? null : +selectSignCeremony,
        keyword: writeStudentInfo,
      };
      const responseTbale = yield call(queryStudent, xhr);
      yield put({
        type: 'setState',
        payload: {
          loading: false,
          confirmSearchStudentInfo: false,
        },
      });
      if (responseTbale.code === 1) {
        yield put({
          type: 'setState',
          payload: {
            querySearchData: responseTbale.data,
          },
        });
      } else {
        return message.error(responseTbale.message);
      }
    },
    /**
     *
     * @param {*} 查询按钮 查询表格数据
     */
    *searchStudentInfoList({ payload }, { put }) {
      const { forbid } = payload;
      if (!forbid) {
        yield put({
          type: 'setState',
          payload: { confirmSearchStudentInfo: true },
        });
      }
      // yield call(delay, 200);
      yield put({
        type: 'fetch',
        payload: {
          pageNo: 1,
          pageSize: 10,
        },
      });
    },
    *forbidOrOpenStudent({ payload, callback }, { call }) {
      const response = yield call(updateStudentStatus, { ...payload });
      if (response.code === 1) {
        message.success('请求成功');
        if (callback) callback();
      } else {
        message.error('请求失败');
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
    clear() {
      return {
        querySearchData: [],

        provices: [],
        organization: [],
        origin: [],
        signCeremony: [],

        selectProvices: null,
        selectOrganization: null,
        selectOrigin: null,
        selectSignCeremony: null,
        writeStudentInfo: '',
        loading: true,

        studentHomeCount: {
          totalNum: 0,
          contractNum: 0,
        },
      };
    },
  },
};
