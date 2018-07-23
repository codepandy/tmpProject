import { message } from 'antd';
import { Apis } from '../../services/api';

const { commonApis: { queryAllCourseList, queryTeacherSimpleList } } = Apis;
const {
  bSchoolApis: { insertOrUpdateClass, deleteClass },
  coachApis: {
    queryTeacherContractBasicInfo,
    insertOrUpdateTeacherContract,
    insertOrUpdateTeacherCourse,
    deleteTeacherCourse,
    queryTeacherCourseByContractIdList,
  },
} = Apis;
export default {
  namespace: 'coachCourseOrder',
  state: {
    basicInfo: {
      contractType: [],
    },
    coachCourse: [],

    editCourseItem: {},
    setCourseClassList: [],
    allCourseList: [],
    teacherSimpleList: [],
  },
  effects: {
    /**
     * 教师合同-初始化  教师合同-初始化-课程班级列表 teacherId:11111,contractId:48
     */
    *queryTeacherContractBasicInfo({ payload, callback }, { call, put }) {
      const [basicInfo, coachCourse, allCourseList, teacherSimpleList] = yield [
        call(queryTeacherContractBasicInfo, { ...payload }),
        call(queryTeacherCourseByContractIdList, { ...payload }),
        call(queryAllCourseList),
        call(queryTeacherSimpleList, { ...payload }),
      ];
      if (basicInfo.code === 1) {
        yield put({
          type: 'setState',
          payload: {
            basicInfo: basicInfo.data,
            coachCourse: coachCourse.data,
            allCourseList: allCourseList.data,
            teacherSimpleList: teacherSimpleList.data,
          },
        });
        if (callback) callback(basicInfo.data);
      }
    },
    /**
     * 提交编辑信息
     */
    *submitEditInfo({ payload, callback }, { call }) {
      const response = yield call(insertOrUpdateTeacherContract, { ...payload });
      if (response.code === 1) {
        message.success('编辑成功');
        if (callback) callback(response.data);
      } else {
        message.error('编辑失败');
      }
    },

    /**
     *  提交编辑】、添加课程信息
     */
    *submitSignCourse({ payload, callback }, { call }) {
      const response = yield call(insertOrUpdateTeacherCourse, { ...payload });
      if (response.code === 1) {
        message.success('提交成功');
        if (callback) callback();
      } else if (response.code === 5) {
        message.error('已经添加过这门课程，请选择其他课程');
      } else {
        message.success('提交失败');
      }
    },
    *fetchBasicInfo({ payload }, { call, put }) {
      const basicInfo = yield call(queryTeacherContractBasicInfo, { ...payload });
      if (basicInfo.code === 1) {
        yield put({
          type: 'setState',
          payload: {
            basicInfo: basicInfo.data,
          },
        });
      }
    },
    /**
     *  拉取签约课程数据
     */
    *fetchSignClass({ payload }, { call, put }) {
      const response = yield call(queryTeacherCourseByContractIdList, { ...payload });
      if (response.code === 1) {
        yield put({
          type: 'setState',
          payload: {
            coachCourse: response.data,
          },
        });
      } else {
        message.success('请求失败');
      }
    },
    /**
     *
     */
    *delteCourse({ payload, callback }, { call }) {
      const response = yield call(deleteTeacherCourse, { ...payload });
      if (response.code === 1) {
        message.success('删除成功');
        if (callback) callback();
      } else {
        message.success('删除失败');
      }
    },
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
  },
  reducers: {
    setState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {};
    },
  },
};
