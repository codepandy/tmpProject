import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { Apis, updateAuthority } from '../services/api';

const { commonApis: { queryDictionariy, queryProviceAndCity, queryListOnlyAllSchool } } = Apis;
const {
  coachApis: { queryCoach, updateTeacher, queryStatTeacherHomeCount, updateTeacherStatus },
} = Apis;
export default {
  namespace: 'coach',
  state: {
    provices: [],
    organization: [],
    origin: [],
    signCeremony: [],
    teacherHomeCount: {
      totalNum: 0,
      contractNum: 0,
    },

    selectProvice: '',
    selectOrganization: '',
    selectOrigin: '',
    selectSignCeremony: '',
    writeMobile: '',

    tags: [],
    querySearchData: {
      list: [],
      pagination: {},
    },
    authorityData: {
      list: [],
      pagination: {},
    },
    currentData: {
      list: [],
      pagination: {},
    },
    communicationData: {
      list: [],
      pagination: {},
    },
    activityData: {
      list: [],
      pagination: {},
    },
    schoolData: {
      list: [],
      pagination: {},
    },
    qrCodeData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    /**
     *
     * @param {*} _  详情页面字典
     */
    *fetchDictionariy(_, { call, put }) {
      const [provices, organization, origin, teacherHomeCount] = yield [
        call(queryDictionariy, { dicId: 1 }),
        call(queryDictionariy, { dicId: 2 }),
        call(queryDictionariy, { dicId: 3 }),
        // call(queryDictionariy, { dicId: 7 }),
        call(queryStatTeacherHomeCount),
      ];
      let provicesData = [];
      let organizationData = [];
      let originData = [];
      let teacherHomeCountData = [];
      if (provices && provices.code === 1) {
        provicesData = provices.data;
      }
      if (organization && organization.code === 1) {
        organizationData = organization.data;
      }
      if (origin && origin.code === 1) {
        originData = origin.data;
      }
      if (teacherHomeCount && teacherHomeCount.code === 1) {
        teacherHomeCountData = teacherHomeCount.data;
      }
      yield put({
        type: 'setState',
        payload: {
          provices: provicesData,
          organization: organizationData,
          origin: originData,
          signCeremony: [
            { resultValue: '当前签约', resultKey: 1 },
            { resultValue: '当前没签约', resultKey: 0 },
          ],
          teacherHomeCount: teacherHomeCountData,
        },
      });
      yield put({
        type: 'queryCoach',
        payload: {
          pageNo: 1,
          pageSize: 10,
          schoolType: null,
          schoolOrigin: null,
          schoolProvince: null,
          schoolContract: null,
          keyword: '',
        },
      });
    },

    /**
     *
     * @param {*} ——b端教练 （大表格）
     */
    *queryCoach({ payload }, { call, put }) {
      const xhr = {
        ...payload,
      };
      const responseTbale = yield call(queryCoach, xhr);
      if (responseTbale && responseTbale.code === 1) {
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
     * @param {*} 提交教练信息
     */
    *submitCoachInfo({ payload, callback }, { call, put }) {
      yield put({
        type: 'setState',
        payload,
      });
      const {
        coachName,
        identity,
        province: [province, city],
        attendSchool: [schoolId],
        phoneNumber,
        coachID,
      } = payload;
      const xhr = {
        id: coachID,
        schoolId,
        name: coachName,
        identity,
        province,
        city,
        mobile: phoneNumber,
      };
      const response = yield call(updateTeacher, xhr);
      if (response.code === 1) {
        message.success('添加成功');
        yield put({
          type: 'queryCoach',
          payload: {
            pageNo: 1,
            pageSize: 10,
          },
        });
        if (callback) callback();
      } else {
        return message.success('添加失败');
      }
    },
    *forbidOrEnableCoach({ payload, callback }, { call }) {
      const response = yield call(updateTeacherStatus, payload);
      if (response.code === 1) {
        message.success('设置成功');
        if (callback) callback();
      } else {
        message.error('设置失败');
      }
    },
    /**
     *  添加按钮添加教练信息(地区和所属学校列表拉取)
     */
    *addCoachInfo(_, { call, put }) {
      const addr = [];
      const [proviceAndCity, allSchoolList] = yield [
        call(queryProviceAndCity),
        call(queryListOnlyAllSchool),
      ];
      if (proviceAndCity.code === 1) {
        proviceAndCity.data.forEach(item => {
          const cityList = [];
          item.citys.forEach(citem => {
            cityList.push({
              value: citem.resultKey,
              label: citem.resultValue,
            });
          });
          addr.push({
            value: item.resultKey,
            label: item.resultValue,
            children: cityList,
          });
        });
      }
      yield put({
        type: 'setState',
        payload: {
          city: addr,
          allSchoolList: allSchoolList.data,
        },
      });
    },

    /**
     *
     * @param {*} 跳转到详情页面
     */
    *goToDetail({ payload }, { put }) {
      yield put(routerRedux.push(`/useradmin/coach-detail?coachId=${payload.id}`));
    },

    *updateAuthority({ payload, callback }, { call, put }) {
      const response = yield call(updateAuthority, payload);
      yield put({
        type: 'updateAuthority',
        payload: response,
      });
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
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveAuthority(state, action) {
      return {
        ...state,
        authorityData: action.payload,
      };
    },
    saveCommunications(state, action) {
      return {
        ...state,
        communicationData: action.payload,
      };
    },
    saveActivities(state, action) {
      return {
        ...state,
        activityData: action.payload,
      };
    },
    updateAuthority(state, action) {
      return {
        ...state,
        updateAuthorityResult: action.payload,
      };
    },
    saveSchools(state, action) {
      return {
        ...state,
        schoolData: action.payload,
      };
    },
    saveQRCode(state, action) {
      return {
        ...state,
        qrCodeData: action.payload,
      };
    },
    viewDetailData(state, action) {
      return {
        ...state,
        currentData: action.payload,
      };
    },
    saveTags(state, action) {
      return {
        ...state,
        tags: action.payload,
      };
    },
  },
};
