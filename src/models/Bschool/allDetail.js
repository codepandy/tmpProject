import { message } from 'antd';
import { Apis } from '../../services/api';

const {
  bSchoolApis: {
    queryBschoolConnectRecord,
    queryBschoolSignRecord,
    queryBschoolActivityRecord,
    queryBschoolTeacherList,
    updateBschoolTeacherList,
    queryTeacherInSchool,
    insertSchoolTeacher,
    queryBschoolStudentList,
  },
} = Apis;
export default {
  namespace: 'allDetail',
  state: {
    editStudentSituationVisible: false, // 编辑学生情况

    purchaseClass: {},
    connectRecord: {},
    activityRecord: {},

    teacherList: {},
    teacherTableLoadding: true,
    editTeacherRemarksVisible: false, // 编辑备注信息
    editTeacherRemarks: '',

    teacherAccount: '', // 输入的教练账号
    addTeacherInfo: {
      data: [],
    },
    addTeacherAccountVisible: false,

    studentList: {},
    studentTableLoadding: true,

    connectRecordVisible: false,
    writeConnectRecord: '', // 沟通记录
    connectConfirmLoading: false,
  },

  effects: {
    /**
     *
     * @param {schoolId} 拉取页面 签约数据、沟通记录、活动记录、教练列表、学生列表
     */
    *fetch({ payload }, { call, put }) {
      const { schoolId } = payload;
      const [purchaseClass, connectRecord, activityRecord, studentList, teacherList] = yield [
        call(queryBschoolSignRecord, { schoolId }),
        call(queryBschoolConnectRecord, { schoolId }),
        call(queryBschoolActivityRecord, { schoolId }),
        call(queryBschoolStudentList, { schoolId }),
        call(queryBschoolTeacherList, { schoolId }),
      ];
      let purchaseClassData = {};
      let connectRecordData = {};
      let activityRecordData = {};
      let studentListData = {};
      let teacherListData = {};
      if (purchaseClass && purchaseClass.code === 1) {
        purchaseClassData = purchaseClass.data;
      }
      if (connectRecord && connectRecord.code === 1) {
        connectRecordData = connectRecord.data;
      }
      if (activityRecord && activityRecord.code === 1) {
        activityRecordData = activityRecord.data;
      }
      if (studentList && studentList.code === 1) {
        studentListData = studentList.data;
      }
      if (teacherList && teacherList.code === 1) {
        teacherListData = teacherList.data;
      }
      yield put({
        type: 'setState',
        payload: {
          purchaseClass: purchaseClassData,
          connectRecord: connectRecordData,
          activityRecord: activityRecordData,
          studentList: studentListData,
          teacherList: teacherListData,
          teacherTableLoadding: false,

          studentTableLoadding: false,
        },
      });
    },
    /**
     *
     * @param {schoolId} 拉取页面沟通记录
     */
    *fetchConnectRecord({ payload }, { call, put }) {
      const connectRecord = yield call(queryBschoolConnectRecord, { ...payload });
      if (connectRecord && connectRecord.code === 1) {
        yield put({
          type: 'setState',
          payload: {
            connectRecord: connectRecord.data,
          },
        });
      }
    },
    /**
     *
     * @param {schoolId} 拉取页面教练列表
     */
    *fetchTeacherList({ payload }, { call, put }) {
      const teacherList = yield call(queryBschoolTeacherList, { ...payload });
      if (teacherList && teacherList.code === 1) {
        yield put({
          type: 'setState',
          payload: {
            teacherList: teacherList.data,
          },
        });
      }
    },
    *fetchStudentList({ payload, callback }, { call, put }) {
      const { schoolId } = payload;
      const studentList = yield call(queryBschoolStudentList, { schoolId });
      if (studentList && studentList.code === 1) {
        yield put({
          type: 'setState',
          payload: {
            studentList: studentList.data,
          },
        });
      }
      if (callback) callback();
    },

    /**
     *
     * @param {teacherId,schoolId,回调拉取教练列表} 确认编辑提交（编辑教练备注信息）
     */
    *submitEditTeacherRemarks({ payload, callback }, { call, put, select }) {
      const { editTeacherRemarks } = yield select(state => state.allDetail);
      const xhr = { ...payload, remark: editTeacherRemarks };
      const response = yield call(updateBschoolTeacherList, xhr);
      if (response && response.code === 1) {
        yield put({
          type: 'setState',
          payload: {
            editTeacherRemarksVisible: false,
            editTeacherRemarks: '',
          },
        });
        message.success('备注成功');
        if (callback) callback();
      } else {
        message.error('备注失败');
      }
    },
    /**
     *
     * @param {*} 学校详情页面 - 教练列表 - 判断教练是否存在
     */
    *searchTeacherInSchool({ payload }, { call, put }) {
      const { schoolId, teacherAccount: teacherMobile } = payload;
      const response = yield call(queryTeacherInSchool, { schoolId, teacherMobile });
      let addTeacherInfo = {};
      if (!teacherMobile) {
        return message.warning('账号为空');
      }
      if (response) {
        if (response.code === 1) {
          addTeacherInfo = {
            code: 1,
            msg: '有账号不再机构下',
            data: [response.data],
          };
        } else if (response.code === 2) {
          addTeacherInfo = {
            code: 2,
            msg: '无该账号信息',
            data: [],
          };
        } else if (response.code === 3) {
          addTeacherInfo = {
            code: 3,
            msg: '该教练已在该机构下！',
            data: [response.data],
          };
        }
        yield put({
          type: 'setState',
          payload: {
            addTeacherInfo,
          },
        });
      }
    },
    /**
     *
     * @param {*} 提交教练账号
     */
    *submitTeacherAccount({ payload, callback }, { call, put, select }) {
      const { teacherAccount } = yield select(state => state.allDetail);
      if (!teacherAccount) {
        return message.warning('账号为空');
      }
      const response = yield call(insertSchoolTeacher, {
        schoolId: payload.schoolId,
        teacherMobile: teacherAccount,
      });
      if (response && response.code === 1) {
        message.success('添加成功');
        yield put({
          type: 'setState',
          payload: {
            addTeacherAccountVisible: false,
            teacherAccount: '',
          },
        });
      } else {
        message.error('添加失败');
      }
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
    clear() {
      return {
        editStudentSituationVisible: false, // 编辑学生情况

        purchaseClass: {},
        connectRecord: {},
        activityRecord: {},

        teacherList: {},
        teacherTableLoadding: true,
        editTeacherRemarksVisible: false, // 编辑备注信息
        editTeacherRemarks: '',

        teacherAccount: '', // 输入的教练账号
        addTeacherInfo: {
          data: [],
        },
        addTeacherAccountVisible: false,

        studentList: {},
        studentTableLoadding: true,

        connectRecordVisible: false,
        writeConnectRecord: '', // 沟通记录
        connectConfirmLoading: false,
      };
    },
  },
};

// writeSchoolName: '',
// writeOrganization: 1,
// writeOrigin: 1,
// writeAdminer: '',
// writeProvice: 1,
// writeIphone: '',
// writeModel: '',
