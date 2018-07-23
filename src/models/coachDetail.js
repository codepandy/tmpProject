// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { Apis } from '../services/api';
import { delay } from '../../src/utils/utils';

const { cStudentApis: { queryStudentConnectRecord, queryStudentActivityRecord } } = Apis;
const {
  commonApis: {
    queryProviceAndCity,
    queryListAllSchool,
    queryCourseAndContractAndClassList,
    queryCourseTypeAndStatusList,
  },
  coachApis: {
    queryTeacherBasicInfo,
    insertUserDialog,
    queryTeacherClassRecord,
    queryCourseByTeacherIdList,
    queryStatStudentCourseItemList,
    updateTeacher,
    queryStatTeacherStudentCount,
  },
} = Apis;
export default {
  namespace: 'coachDetail',
  state: {
    currentData: {
      list: [],
      pagination: {},
    },
    currentCoach: {},

    city: [],
    allSchoolList: [],

    courseTypeAndStatusList: [],
    courseAndClassList: [],
    selectCourseAndClassList: [],

    selectCourseTypeAndStatu: 10,

    studentCourseItemList: [],

    courseOrderByTeacherIdList: [], // 通过teacherid的课程订单量

    writeConnectRecord: '',

    confirmLoading: false,
    teacherStudentCount: {
      nowNum: 0,
      historyNum: 0,
    },
  },

  effects: {
    /**
     *
     * @param {*} // b端教练、c端学生（新增沟通记录）
     */
    *updateCommunication({ payload, callback }, { call, put }) {
      yield put({
        type: 'setState',
        payload: {
          confirmLoading: true,
        },
      });
      const response = yield call(insertUserDialog, payload);
      yield call(delay, 200);
      yield put({
        type: 'setState',
        payload: {
          confirmLoading: false,
        },
      });
      if (response && response.code === 1) {
        message.success(`提交成功`);
        if (callback) callback();
      } else {
        message.error(`提交失败`);
      }
    },
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
    *submitCoachInfo({ payload, callback }, { call }) {
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
        if (callback) callback();
      } else {
        return message.success('添加失败');
      }
    },
    /**
     *
     * @param {*} 添加教练信息
     */
    *addCoachInfo(_, { call, put }) {
      const addr = [];
      const [proviceAndCity, allSchoolList] = yield [
        call(queryProviceAndCity),
        call(queryListAllSchool),
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
     * @param {*} 拉取b端教练 基本信息、沟通记录、学生列表、活动参与
     */
    *fetchTeacherBasicInfo({ payload }, { call, put }) {
      const { coachId } = payload;
      const [currentCoach, classRecord, connectRecord, activityRecord] = yield [
        call(queryTeacherBasicInfo, { id: coachId }), // 11111
        call(queryTeacherClassRecord, { teacherId: coachId }), // 11111
        call(queryStudentConnectRecord, { userId: coachId }),
        call(queryStudentActivityRecord, { userId: coachId }),
      ];
      let currentCoachData = {};
      let classRecordData = {};
      let connectRecordData = {};
      let activityRecordDate = {};
      if (currentCoach && currentCoach.code === 1) {
        currentCoachData = currentCoach.data;
      }
      if (classRecord && classRecord.code === 1) {
        classRecordData = classRecord.data;
      }
      if (connectRecord && connectRecord.code === 1) {
        connectRecordData = connectRecord.data;
      }
      if (activityRecord && activityRecord.code === 1) {
        activityRecordDate = activityRecord.data;
      }
      yield put({
        type: 'setState',
        payload: {
          currentCoach: currentCoachData,
          classRecord: classRecordData,
          connectRecord: connectRecordData,
          activityRecord: activityRecordDate,
        },
      });
      const [courseTypeAndStatusList, courseAndClassList, teacherStudentCount] = yield [
        call(queryCourseTypeAndStatusList),
        call(queryCourseAndContractAndClassList, { teacherId: coachId }),
        call(queryStatTeacherStudentCount, { teacherId: coachId }),
      ];
      const classList = [];
      const selectClass = [];
      if (courseAndClassList && courseAndClassList.code === 1) {
        courseAndClassList.data.forEach((item, index) => {
          if (index === 0) {
            selectClass.push(item.id);
          }
          const children = [];
          item.children.forEach((citem, cindex) => {
            if (index === 0 && cindex === 0) {
              selectClass.push(citem.id);
            }
            const childrens = [];
            citem.children.forEach((sitem, sindex) => {
              if (index === 0 && sindex === 0 && cindex === 0) {
                selectClass.push(sitem.id);
              }
              childrens.push({
                label: sitem.value,
                value: sitem.id,
              });
            });
            children.push({
              label: citem.value,
              value: citem.id,
              children: childrens,
            });
          });
          classList.push({
            label: item.value,
            value: item.id,
            children,
          });
        });
      }
      let courseTypeAndStatusListData = [];
      let selectCourseTypeAndStatuCode = null;
      if (courseTypeAndStatusList && courseTypeAndStatusList.code === 1) {
        courseTypeAndStatusListData = courseTypeAndStatusList.data;
        if (
          typeof courseTypeAndStatusList.data === 'object' &&
          courseTypeAndStatusList.data.length
        ) {
          selectCourseTypeAndStatuCode = courseTypeAndStatusList.data[0].id;
        }
      }
      let teacherStudentCountData = {};
      if (teacherStudentCount && teacherStudentCount.code === 1) {
        teacherStudentCountData = teacherStudentCount.data;
      }
      yield put({
        type: 'setState',
        payload: {
          courseTypeAndStatusList: courseTypeAndStatusListData,
          selectCourseTypeAndStatu: selectCourseTypeAndStatuCode,
          courseAndClassList: classList,
          selectCourseAndClassList: selectClass,
          teacherStudentCount: teacherStudentCountData,
        },
      });
      yield put({
        type: 'fetchStatStudentCourseItemList',
        payload: {
          selectCourseAndClassList: selectClass,
          selectCourseTypeAndStatu: selectCourseTypeAndStatuCode,
        },
      });
    },

    /**
     *
     * @param {*} 根据查询列出学员信息
     */
    *fetchStatStudentCourseItemList({ payload }, { call, put }) {
      const { selectCourseAndClassList, selectCourseTypeAndStatu } = payload;
      const [typeAndStatus, contractId, classId] = selectCourseAndClassList;
      const [studentCourseItemList] = yield [
        call(queryStatStudentCourseItemList, {
          courseId: selectCourseTypeAndStatu,
          classId: classId || null,
          typeAndStatus: typeAndStatus || null,
          contractId: contractId || null,
        }),
      ];
      yield put({
        type: 'setState',
        payload: {
          studentCourseItemList: studentCourseItemList.data,
          selectCourseAndClassList,
          selectCourseTypeAndStatu,
        },
      });
    },

    /**
     * fetch 拉取老师二维码报课成单量
     */
    *fetchCourseByTeacherIdList({ payload }, { call, put }) {
      const response = yield call(queryCourseByTeacherIdList, { ...payload });
      if (response.code === 1) {
        yield put({
          type: 'setState',
          payload: {
            courseOrderByTeacherIdList: response.data,
          },
        });
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
  },
};
