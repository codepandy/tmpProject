import { message } from 'antd';
import { Apis } from '../../services/api';

const { commonApis: { queryAllCourseList, querychoolTeacherSimpleList } } = Apis;
const {
  bSchoolApis: {
    querySchoolContractBasicInfo,
    querySchoolContractSchoolCourse,
    insertOrUpdateContract,
    insertOrUpdateSchoolCourse,
    deleteSchoolCourse,
    insertOrUpdateClass,
    deleteClass,
  },
} = Apis;
export default {
  namespace: 'signAgainGive',

  state: {
    signAgainGiveVisible: false,

    signAgainGiveTitle: '',
    signAgainGiveShowSign: false, // 是否展示签约数据

    writeSignCode: '',
    writeSignTime: '',
    writeSignBackOrganization: '',
    writeSingBackTeacherA: '',
    writeSingBackTeacherB: '',
    writeSingBackTeacherC: '',

    confirmLoadding: false,

    basicInfo: {},
    schoolCourse: [],

    editLoading: true,
    allCourseList: [],
    editCourseItem: {},
    setCourseClassList: [],
    teacherSimpleList: [],

    classCurrentCourseId: 0,
  },

  effects: {
    /**
     *
     * @param 学校合约基本信息
     */
    *querySchoolContractBasicInfo({ payload }, { call, put }) {
      const { contractId, schoolId } = payload;
      const schoolCourse = {};
      if (contractId) {
        schoolCourse.contractId = contractId;
      }
      // schoolCourse.contractId = 1;
      const [basicInfo, schoolCourses, allCourseList, teacherSimpleList] = yield [
        call(querySchoolContractBasicInfo, { ...payload }),
        call(querySchoolContractSchoolCourse, { ...schoolCourse }),
        call(queryAllCourseList),
        call(querychoolTeacherSimpleList, { schoolId }),
      ];
      if (basicInfo.code === 1) {
        yield put({
          type: 'setState',
          payload: {
            basicInfo: basicInfo.data,
            schoolCourse: schoolCourses.data,
            allCourseList: allCourseList.data,
            editLoading: false,
            teacherSimpleList: teacherSimpleList.data,
          },
        });
      }
      yield put({
        type: 'fetchSignClass',
        payload: {
          contractId,
        },
      });
    },
    /**
     *
     * @param 拉取签约课程数据
     */
    *fetchSignClass({ payload }, { call, put }) {
      const response = yield call(querySchoolContractSchoolCourse, { ...payload });
      if (response.code === 1) {
        yield put({
          type: 'setState',
          payload: {
            schoolCourse: response.data,
          },
        });
      } else {
        message.success('请求失败');
      }
    },
    /**
     *
     * @param 提交合同编辑信息
     */
    *submitEditInfo({ payload, callback }, { call }) {
      const response = yield call(insertOrUpdateContract, { ...payload });
      if (response.code === 1) {
        message.success('提交成功');
        if (callback) callback(response.data);
      } else {
        message.success('提交失败');
      }
    },
    /**
     *
     * @param 提交编辑】、添加课程信息
     */
    *submitSignCourse({ payload, callback }, { call }) {
      const response = yield call(insertOrUpdateSchoolCourse, { ...payload });
      if (response.code === 1) {
        message.success('提交成功');
        if (callback) callback();
      } else if (response.code === 5) {
        message.error('已经添加过这门课程，请选择其他课程');
      } else {
        message.success('提交失败');
      }
    },
    /**
     *
     * @param 删除课程
     */
    *delteCourse({ payload, callback }, { call }) {
      const response = yield call(deleteSchoolCourse, { ...payload });
      if (response.code === 1) {
        message.success('删除成功');
        if (callback) callback();
      } else {
        message.success('删除失败');
      }
    },
    /**
     *
     * @param 删除班级
     */
    *delteCourseClass({ payload, callback }, { call }) {
      const { classId } = payload;
      if (classId > 0) {
        const response = yield call(deleteClass, { ...payload });
        if (response.code === 1) {
          message.success('删除成功');
          if (callback) callback();
        } else {
          message.success('删除失败');
        }
      }
    },
    /**
     *
     * @param  提交班级设定信息
     */
    *submitClassSetInfo({ payload, callback }, { call }) {
      if (payload.some(item => !item.className)) {
        return message.error('新增记录班级名称设定不可为空');
      }
      const response = yield call(insertOrUpdateClass, { classList: payload });
      if (response.code === 1) {
        message.success('提交成功');
        if (callback) callback();
      } else {
        message.error('提交失败');
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
        signAgainGiveVisible: false,

        signAgainGiveTitle: '',
        signAgainGiveShowSign: false, // 是否展示签约数据

        writeSignCode: '',
        writeSignTime: '',
        writeSignBackOrganization: '',
        writeSingBackTeacherA: '',
        writeSingBackTeacherB: '',
        writeSingBackTeacherC: '',

        confirmLoadding: false,

        basicInfo: {},
        schoolCourse: [],

        editLoading: true,
        allCourseList: [],
        editCourseItem: {},
        setCourseClassList: [],
        teacherSimpleList: [],

        classCurrentCourseId: 0,
      };
    },
  },
};
