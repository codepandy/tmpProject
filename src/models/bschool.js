import { message } from 'antd';
import { Apis } from '../services/api';
import { delay } from '../../src/utils/utils';

const { commonApis: { queryDictionariy } } = Apis;
const { bSchoolApis: { queryBschool, querySchoolHomeCount } } = Apis;
export default {
  namespace: 'bschool', // 我们所有的 dispatch 都是通过这个namespace定位过来的。 所以当请求不通，要注意。
  state: {
    querySearchData: [],

    provices: [],
    organization: [],
    origin: [],
    competitionGrade: [],
    selfGrade: [],
    examGrade: [],
    signCeremony: [],

    addSchoolVisible: false,

    selectSchoolName: null,
    selectOrganization: null,
    selectOrigin: null,
    selectCompetitionGrade: null,
    selectSelfGrade: null,
    selectExamGrade: null,
    selectSignCeremony: null,
    writeStudentInfo: '',

    confirmLoadding: false,

    confirmSearchStudentInfo: false, // 查询按钮的loadding效果
    loadding: true, // 查询表格的展示数据

    city: [],

    schoolHomeCount: {
      totalNum: 0,
      contractNum: 0,
    },
  },
  effects: {
    /**
     *
     * @param {*} 拉取表格数据
     */
    *fetch({ payload }, { call, put, select }) {
      yield put({ type: 'setState', payload: { loadding: true } });
      const {
        selectSchoolName,
        selectOrganization,
        selectOrigin,
        selectCompetitionGrade,
        selectSelfGrade,
        selectExamGrade,
        selectSignCeremony,
        writeStudentInfo,
      } = yield select(state => state.bschool);
      const xhr = {
        ...payload,
        schoolProvince: selectSchoolName ? selectSchoolName * 1 : null,
        schoolType: selectOrganization ? selectOrganization * 1 : null,
        schoolOrigin: selectOrigin ? selectOrigin * 1 : null,
        schoolContest: selectCompetitionGrade ? selectCompetitionGrade * 1 : null,
        schoolIndependent: selectSelfGrade ? selectSelfGrade * 1 : null,
        schoolGaokao: selectExamGrade ? selectExamGrade * 1 : null,
        schoolContract: selectSignCeremony === null ? null : selectSignCeremony * 1,
        keyword: writeStudentInfo,
      };
      const responseTbale = yield call(queryBschool, xhr);
      yield put({
        type: 'setState',
        payload: {
          loadding: false,
          confirmSearchStudentInfo: false,
        },
      });
      if (responseTbale) {
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
      }
    },
    /**
     *
     * @param {*} 拉取学校信息（字典表筛选条件列表）
     */
    *fetchBschoolBasicDictionaries(_, { call, put }) {
      const [
        provices,
        organization,
        origin,
        competitionGrade,
        selfGrade,
        examGrade,
        schoolHomeCount,
      ] = yield [
        call(queryDictionariy, { dicId: 1 }),
        call(queryDictionariy, { dicId: 2 }),
        call(queryDictionariy, { dicId: 3 }),
        call(queryDictionariy, { dicId: 4 }),
        call(queryDictionariy, { dicId: 5 }),
        call(queryDictionariy, { dicId: 6 }),
        call(querySchoolHomeCount),
      ];
      let provicesData = [];
      let organizationData = [];
      let originData = [];
      let competitionGradeData = [];
      let selfGradeData = [];
      let examGradeData = [];
      let schoolHomeCountData = [];
      if (provices && provices.code === 1) {
        provicesData = provices.data;
      }
      if (organization && organization.code === 1) {
        organizationData = organization.data;
      }
      if (origin && origin.code === 1) {
        originData = origin.data;
      }
      if (competitionGrade && competitionGrade.code === 1) {
        competitionGradeData = competitionGrade.data;
      }
      if (selfGrade && selfGrade.code === 1) {
        selfGradeData = selfGrade.data;
      }
      if (examGrade && examGrade.code === 1) {
        examGradeData = examGrade.data;
      }
      if (schoolHomeCount && schoolHomeCount.code === 1) {
        schoolHomeCountData = schoolHomeCount.data;
      }
      yield put({
        type: 'setState',
        payload: {
          provices: provicesData,
          organization: organizationData,
          origin: originData,
          competitionGrade: competitionGradeData,
          selfGrade: selfGradeData,
          examGrade: examGradeData,
          signCeremony: [
            { resultValue: '当前签约', resultKey: 1 },
            { resultValue: '当前没签约', resultKey: 0 },
          ],
          schoolHomeCount: schoolHomeCountData,
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
     * @param {*} _ 查询按钮拉取表格数据
     */
    *searchSchoolInfoList(_, { call, put }) {
      yield put({
        type: 'setState',
        payload: { confirmSearchStudentInfo: true },
      });
      yield call(delay, 200);
      yield put({
        type: 'fetch',
        payload: {
          pageNo: 1,
          pageSize: 2,
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
    clear() {
      return {
        querySearchData: [],
        provices: [],
        organization: [],
        origin: [],
        competitionGrade: [],
        selfGrade: [],
        examGrade: [],
        signCeremony: [],

        selectSchoolName: null,
        selectOrganization: null,
        selectOrigin: null,
        selectCompetitionGrade: null,
        selectSelfGrade: null,
        selectExamGrade: null,
        selectSignCeremony: null,
        writeStudentInfo: '',
        loadding: true,

        schoolHomeCount: {
          totalNum: 0,
          contractNum: 0,
        },
      };
    },
  },
};
