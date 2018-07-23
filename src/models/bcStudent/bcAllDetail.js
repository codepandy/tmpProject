// import { message } from 'antd';
import { Apis } from '../../services/api';
// import { delay } from '../../../src/utils/utils';

const {
  commonApis: { queryCourseTypeAndStatusList },
  cStudentApis: {
    queryStudentConnectRecord,
    queryStudentStatCourseNum,
    queryStudentListContract,
    queryStudentActivityRecord,
    querySelectCStudentCourseData,
    queryStatStudentCourseItemForStudentList,
    queryCourseByStudentIdList,
  },
} = Apis;
export default {
  namespace: 'bcAllDetail',
  state: {
    connectRecordVisible: false,
    connectConfirmLoading: false,
    writeConnectRecord: '', // 沟通记录

    connectRecord: {}, // 沟通记录
    activityRecord: {}, // 活动记录

    courseData: {}, // 课程数据（直播出勤/时长）

    studentBasicInfo: {},

    purchaseClass: {}, // 购课记录
    statCourseNum: {
      totalCourseNum: 0,
      underLineCourseNum: 0,
    },

    courseTypeAndStatusList: [],
    courseByStudentIdList: [],
    studentCourseItems: {},
  },
  effects: {
    /**
     *
     * @param {d} 首次页面信息全部拉取
     */
    *fetchAllInfo({ payload }, { call, put }) {
      const { studentId } = payload;
      const [
        connectRecord,
        activityRecord,
        statCourseNum,
        purchaseClass,
        courseTypeAndStatusList,
        courseByStudentIdList,
      ] = yield [
        call(queryStudentConnectRecord, { userId: studentId }),
        call(queryStudentActivityRecord, { userId: studentId }),
        call(queryStudentStatCourseNum, { studentId }),
        call(queryStudentListContract, { studentId }),
        call(queryCourseTypeAndStatusList),
        call(queryCourseByStudentIdList, { studentId }),
      ];
      yield put({
        type: 'setState',
        payload: {
          connectRecord: connectRecord.data,
          activityRecord: activityRecord.data,
          statCourseNum: statCourseNum.data,
          purchaseClass: purchaseClass.data,
          courseTypeAndStatusList: courseTypeAndStatusList.data,
          courseByStudentIdList: courseByStudentIdList.data,
        },
      });
      let courseId = 0;
      let typeAndStatus = 0;
      if (typeof courseByStudentIdList === 'object' && courseByStudentIdList.code === 1) {
        if (typeof courseByStudentIdList.data === 'object' && courseByStudentIdList.data.length) {
          courseId = courseByStudentIdList.data[0].id;
        }
      }
      if (typeof courseTypeAndStatusList === 'object' && courseTypeAndStatusList.code === 1) {
        if (
          typeof courseTypeAndStatusList.data === 'object' &&
          courseTypeAndStatusList.data.length
        ) {
          typeAndStatus = courseTypeAndStatusList.data[0].id;
        }
      }
      yield put({
        type: 'fetchCourseByStudentList',
        payload: {
          courseId,
          studentId,
          typeAndStatus,
        },
      });
    },

    *fetchCourseByStudentList({ payload, callback }, { call, put }) {
      const studentCourseItems = yield call(queryStatStudentCourseItemForStudentList, {
        ...payload,
      });
      if (studentCourseItems) {
        yield put({
          type: 'setState',
          payload: {
            studentCourseItems,
          },
        });
        if (studentCourseItems.code === 1) {
          if (callback) callback();
        }
      }
    },
    /**
     *
     * @param {*} 新增沟通以后重新拉取沟通列表
     */
    *fetchCommunication({ payload, callback }, { call, put }) {
      const connectRecord = yield call(queryStudentConnectRecord, { userId: payload.userId });
      yield put({
        type: 'setState',
        payload: {
          connectRecord: connectRecord.data,
        },
      });
      if (callback) callback();
    },
    *fetch(_, { call, put }) {
      const [purchaseClass, connectRecord, activityRecord, courseData] = yield [
        // call(querySelectCStudentPurchaseClass),
        // call(querySelectCStudentConnectRecord),
        // call(querySelectCStudentActivityRecord),
        call(querySelectCStudentCourseData),
      ]; //     // 拉取购课记录
      yield put({
        type: 'setState',
        payload: {
          purchaseClass: purchaseClass.data,
          connectRecord: connectRecord.data,
          activityRecord: activityRecord.data,
          courseData: courseData.data,
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
      return {};
    },
  },
};
