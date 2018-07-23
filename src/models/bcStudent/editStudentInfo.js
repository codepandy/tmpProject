import { message } from 'antd';
import { Apis } from '../../services/api';

const {
  commonApis: { queryDictionariy, queryProviceAndCity, queryListOnlyAllSchool },
  cStudentApis: { queryStudentBasic, updateStudentBasicInfo },
} = Apis;
export default {
  namespace: 'editStudentInfo',

  state: {
    writeStudentName: '',
    writeRegisterTime: '',
    writeTrialAccount: '',
    writeStudentConnect: '',

    writeProvice: '',
    writeRealSchoolName: '',
    writeSchoolName: '',

    highestAward: '',
    selfConfess: '',
    graduateForPlace: '',

    basicInfoEditVisible: false, //  学生基本信息编辑
    editStudentConfirmLoading: false, // 学生基本信息弹窗提交表单

    basicInfo: {},
    city: [],
    allSchoolList: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const { studentId } = payload;
      const studentBasicInfo = yield call(queryStudentBasic, { id: studentId });
      if (studentBasicInfo.code === 1) {
        const { data } = studentBasicInfo;
        yield put({
          type: 'setState',
          payload: {
            basicInfo: data,
            writeStudentName: data.name || '',
            writeRegisterTime: data.registerTime || 0,
            writeTrialAccount: data.tryFlag || 0,
            writeStudentConnect: data.mobile || '',
            writeProvice: data.studentProvinceeKey
              ? [data.studentProvinceeKey, data.studentCityKey]
              : [],
            writeRealSchoolName: data.realSchoolId || '',
            highestAward: data.highestAward || '',
            selfConfess: data.independentEnrolment || '',
            graduateForPlace: data.graduating || '',
            writeSchoolName: data.schoolId
              ? [data.schoolId, data.schoolTypeKey, data.schoolContractKey]
              : [],
          },
        });
      }
    },
    /**
     *
     * @param {*} 提交编辑学生基本信息
     */
    *submitStudentInfo({ payload, callback }, { put, call, select }) {
      const { studentId } = payload;
      const {
        writeStudentName,
        writeTrialAccount,
        writeStudentConnect,
        writeProvice,
        writeRealSchoolName,
        writeSchoolName,
        highestAward,
        selfConfess,
        graduateForPlace,
      } = yield select(state => state.editStudentInfo);
      yield put({
        type: 'setState',
        payload: {
          editStudentConfirmLoading: true,
        },
      });
      const [province, city] = writeProvice;
      const [schoolId, ,] = writeSchoolName;
      const xhr = {
        name: writeStudentName,
        mobile: writeStudentConnect,
        id: studentId,
        schoolId,
        realSchoolId: writeRealSchoolName,
        tryFlag: writeTrialAccount,
        highestAward,
        independentEnrolment: selfConfess,
        graduating: graduateForPlace,
        province,
        city,
      };
      const response = yield call(updateStudentBasicInfo, xhr);
      yield put({
        type: 'setState',
        payload: {
          editStudentConfirmLoading: false,
        },
      });
      if (response.code === 1) {
        message.success('提交成功');
        if (callback) callback();
        yield put({
          type: 'setState',
          payload: {
            basicInfoEditVisible: false,
          },
        });
      } else {
        message.error('提交失败');
      }
    },
    /**
     *
     * @param {d} 编辑弹窗里面的字典表拉取
     */
    *fetchBasicDictionaries(_, { call, put }) {
      const addr = [];
      yield put({
        type: 'setState',
        payload: {
          visible: true,
        },
      });
      const [schoolModel, proviceAndCity] = yield [
        call(queryDictionariy, { dicId: 43 }),
        call(queryProviceAndCity),
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
        type: 'setState', // 获取看课模式
        payload: {
          schoolModel: schoolModel.data,
          city: addr,
        },
      });
    },
    /**
     *
     * @param {d} 拉取全部的地区和全部的学校
     */
    *queryEditStudentInfo(_, { call, put }) {
      // 编辑用户信息弹窗条件列表
      const addr = [];
      yield put({
        type: 'setState',
        payload: {
          basicInfoEditVisible: true,
        },
      });
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
        type: 'setState', // 获取看课模式
        payload: {
          city: addr,
          allSchoolList: allSchoolList.data,
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
        writeStudentName: '',
        writeRegisterTime: '',
        writeTrialAccount: '',
        writeStudentConnect: '',

        writeProvice: '',
        writeRealSchoolName: '',
        writeSchoolName: '',

        highestAward: '',
        selfConfess: '',
        graduateForPlace: '',

        basicInfoEditVisible: false, //  学生基本信息编辑
        editStudentConfirmLoading: false, // 学生基本信息弹窗提交表单

        basicInfo: {},
        city: [],
        allSchoolList: [],
      };
    },
  },
};
