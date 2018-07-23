import { message } from 'antd';
import { Apis } from '../../services/api';
import { delay } from '../../../src/utils/utils';

const { commonApis: { queryDictionariy } } = Apis;
const {
  bSchoolApis: {
    submitSchoolStudentRank,
    insertOrUpdateSchoolStudentItem,
    deleteSchoolStudentItem,
  },
} = Apis;
let SCHOOL_ITEM_NUM = -1;

export default {
  namespace: 'editBschoolStudent',
  state: {
    editStudentSituationVisible: false, // 编辑学生情况

    editBschoolStudentList: [],

    schoolContestLevelKey: '',
    schoolGaokaoLevelKey: '',
    schoolRecruitLevelKey: '',

    rankID: 1,

    contestLevel: [],
    recruitLevel: [],
    gaokaoLevel: [],
  },
  effects: {
    *sumitEditStudentInfo(_, { call, put }) {
      yield call(delay, 1000);

      yield put({
        type: 'setState',
        payload: {
          editStudentSituationVisible: false,
        },
      });
      message.success('后台接口');
    },
    /**
     *
     * @param  编辑弹窗的表格的数据列表
     */
    *getEditStudentlist({ payload }, { put }) {
      const {
        schoolContestLevelKey,
        schoolGaokaoLevelKey,
        schoolRecruitLevelKey,
        list,
        id,
      } = payload.studentList;
      const editBschoolStudentList = [];
      list.forEach(item => {
        editBschoolStudentList.push({
          schoolItemId: item.schoolItemId,
          schoolYear: item.schoolYear,
          countryFirstPrize: item.countryFirstPrize,
          countrySecondPrize: item.countrySecondPrize,
          countryThirdPrize: item.countryThirdPrize,
          countryPrize: [
            {
              title: '一等奖',
              dataIndex: 'countryFirstPrize',
              value: item.countryFirstPrize,
            },
            {
              title: '二等奖',
              dataIndex: 'countrySecondPrize',
              value: item.countrySecondPrize,
            },
            {
              title: '三等奖',
              dataIndex: 'countryThirdPrize',
              value: item.countryThirdPrize,
            },
          ],
          countryTeam: item.countryTeam,

          provincePrize: [
            {
              title: '省一等奖',
              dataIndex: 'provinceFirstPrize',
              value: item.provinceFirstPrize,
            },
            {
              title: '省二等奖',
              dataIndex: 'provinceSecondPrize',
              value: item.provinceSecondPrize,
            },
            {
              title: '省三等奖',
              dataIndex: 'provinceThirdPrize',
              value: item.provinceThirdPrize,
            },
          ],
          provinceFirstPrize: item.provinceFirstPrize,
          provinceSecondPrize: item.provinceSecondPrize,
          provinceThirdPrize: item.provinceThirdPrize,
          provinceTeam: item.provinceTeam,

          asia: [
            {
              title: '亚物奥赛金牌',
              dataIndex: 'asiaGold',
              value: item.asiaGold,
            },
            {
              title: '亚物奥赛银牌',
              dataIndex: 'asiaSilver',
              value: item.asiaSilver,
            },
            {
              title: '亚物奥赛铜牌',
              dataIndex: 'asiaBronze',
              value: item.asiaBronze,
            },
          ],
          asiaGold: item.asiaGold,
          asiaSilver: item.asiaSilver,
          asiaBronze: item.asiaBronze,

          country: [
            {
              title: '国家奥赛金牌',
              dataIndex: 'countryGold',
              value: item.countryGold,
            },
            {
              title: '国家奥赛银牌',
              dataIndex: 'countrySilver',
              value: item.countrySilver,
            },
            {
              title: '国家奥赛铜牌',
              dataIndex: 'countryBronze',
              value: item.countryBronze,
            },
          ],
          countryGold: item.countryGold,
          countrySilver: item.countrySilver,
          countryBronze: item.countryBronze,
          recruitNum: item.recruitNum,
          tsinghua: item.tsinghua,
          peking: item.peking,
        });
      });
      yield put({
        type: 'setState',
        payload: {
          editStudentSituationVisible: payload.editStudentSituationVisible,
          schoolContestLevelKey,
          schoolGaokaoLevelKey,
          schoolRecruitLevelKey,
          editBschoolStudentList,
          rankID: id,
        },
      });
      yield put({
        type: 'queryDictionariy',
      });
    },
    /**
     *
     *  字典表维护列表
     */
    *queryDictionariy(_, { call, put }) {
      const [contestLevel, recruitLevel, gaokaoLevel] = yield [
        call(queryDictionariy, { dicId: 4 }),
        call(queryDictionariy, { dicId: 5 }),
        call(queryDictionariy, { dicId: 6 }),
      ];
      yield put({
        type: 'setState',
        payload: {
          contestLevel: contestLevel.data,
          recruitLevel: recruitLevel.data,
          gaokaoLevel: gaokaoLevel.data,
        },
      });
    },
    /**
     * 添加编辑学员情况
     */
    *addBschoolStudent(_, { put, select }) {
      let { editBschoolStudentList } = yield select(state => state.editBschoolStudent);
      SCHOOL_ITEM_NUM -= 1;
      const itemStudent = {
        schoolItemId: SCHOOL_ITEM_NUM,
        schoolYear: 0,
        countryFirstPrize: 0,
        countrySecondPrize: 0,
        countryThirdPrize: 0,
        countryPrize: [
          {
            title: '一等奖',
            dataIndex: 'countryFirstPrize',
            value: 0,
          },
          {
            title: '二等奖',
            dataIndex: 'countrySecondPrize',
            value: 0,
          },
          {
            title: '三等奖',
            dataIndex: 'countryThirdPrize',
            value: 0,
          },
        ],
        countryTeam: 0,

        provincePrize: [
          {
            title: '省一等奖',
            dataIndex: 'provinceFirstPrize',
            value: 0,
          },
          {
            title: '省二等奖',
            dataIndex: 'provinceSecondPrize',
            value: 0,
          },
          {
            title: '省三等奖',
            dataIndex: 'provinceThirdPrize',
            value: 0,
          },
        ],
        provinceFirstPrize: 0,
        provinceSecondPrize: 0,
        provinceThirdPrize: 0,
        provinceTeam: 0,

        asia: [
          {
            title: '亚物奥赛金牌',
            dataIndex: 'asiaGold',
            value: 0,
          },
          {
            title: '亚物奥赛银牌',
            dataIndex: 'asiaSilver',
            value: 0,
          },
          {
            title: '亚物奥赛铜牌',
            dataIndex: 'asiaBronze',
            value: 0,
          },
        ],
        asiaGold: 0,
        asiaSilver: 0,
        asiaBronze: 0,

        country: [
          {
            title: '国家奥赛金牌',
            dataIndex: 'countryGold',
            value: 0,
          },
          {
            title: '国家奥赛银牌',
            dataIndex: 'countrySilver',
            value: 0,
          },
          {
            title: '国家奥赛铜牌',
            dataIndex: 'countryBronze',
            value: 0,
          },
        ],
        countryGold: 0,
        countrySilver: 0,
        countryBronze: 0,
        recruitNum: 0,
        tsinghua: 0,
        peking: 0,
      };
      editBschoolStudentList = [...editBschoolStudentList, itemStudent];
      yield put({
        type: 'setState',
        payload: {
          editBschoolStudentList,
        },
      });
      message.success('已成功添加一行');
    },
    /**
     * 提交编辑学员情况等级
     */
    *submitSchoolStudentRank(_, { call, select }) {
      const {
        schoolGaokaoLevelKey,
        schoolContestLevelKey,
        schoolRecruitLevelKey,
        rankID,
      } = yield select(state => state.editBschoolStudent);
      const response = yield call(submitSchoolStudentRank, {
        id: rankID,
        gaokaoLevel: schoolGaokaoLevelKey,
        contestLevel: schoolContestLevelKey,
        recruitLevel: schoolRecruitLevelKey,
      });
      if (response.code === 1) {
        message.success('提交成功');
      } else {
        message.success('提交失败');
      }
    },
    /**
     * 提交编辑学员（每行提交）
     */
    *submitEditStudentInFo({ payload, callback }, { call, select, put }) {
      const { rankID } = yield select(state => state.editBschoolStudent);
      const { editBschoolStudentItem } = payload;
      const xhr = {
        id: rankID,
        ...editBschoolStudentItem,
      };
      const response = yield call(insertOrUpdateSchoolStudentItem, xhr);
      if (response.code === 1) {
        const { editBschoolStudentList } = yield select(state => state.editBschoolStudent);
        const index = editBschoolStudentList.findIndex(
          item => editBschoolStudentItem.schoolItemId === item.schoolItemId
        );
        editBschoolStudentList[index].schoolItemId = response.data;
        yield put({
          type: 'setState',
          payload: { editBschoolStudentList },
        });
        message.success('提交成功');
      } else {
        message.success('提交失败');
      }
      if (callback) callback();
      yield call(delay, 200);
    },
    *setStatEditBschool({ payload, callback }, { put }) {
      yield put({
        type: 'setState',
        payload: {
          ...payload,
        },
      });
      if (callback) callback();
    },

    /**
     * 删除编辑学员（每行删除）
     */
    *deleteStudentItem({ payload, callback }, { call, select, put }) {
      const { schoolItemId } = payload;
      const { editBschoolStudentList } = yield select(state => state.editBschoolStudent);
      const index = editBschoolStudentList.findIndex(item => schoolItemId === item.schoolItemId);
      editBschoolStudentList.splice(index, 1);
      if (schoolItemId >= 0) {
        const xhr = {
          ...payload,
        };
        const response = yield call(deleteSchoolStudentItem, xhr);
        if (callback) callback();
        if (response.code === 1) {
          message.success('删除成功');
        } else {
          message.error('删除失败');
        }
      } else {
        message.success('删除成功');
      }
      yield put({
        type: 'setState',
        payload: { editBschoolStudentList },
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
