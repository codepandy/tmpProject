import { message } from 'antd';
import { Apis } from '../../services/api';

const { commonApis: { queryDictionariy, queryProviceAndCity } } = Apis;
const { bSchoolApis: { insertSchool, updateSchool } } = Apis;
export default {
  namespace: 'editOrAddSchool',

  state: {
    writeSchoolName: '',
    writeOrganization: undefined,
    writeOrigin: undefined,
    writeAdminer: '',
    writeProvice: '',
    writeIphone: '',
    writeModel: undefined,

    organizationType: [],
    origin: [],
    city: [],
    schoolModel: [],

    visible: false,
    confirmLoadding: false,
  },
  effects: {
    /**
     *
     * @param {*} 字典表拉取基本信息列表（坎坷模式，地区）（添加的时候）
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
     * @param {*} 字典表拉取基本信息列表（坎坷模式，地区）（编辑的时候）
     */
    *fetchBschoolBasicDictionaries(_, { call, put }) {
      const addr = [];
      const [organization, origin, schoolModel, proviceAndCity] = yield [
        call(queryDictionariy, { dicId: 2 }),
        call(queryDictionariy, { dicId: 3 }),
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
        type: 'setState',
        payload: {
          organizationType: organization.data,
          origin: origin.data,
          schoolModel: schoolModel.data,
          city: addr,
          visible: true,
        },
      });
    },
    /**
     *
     * @param {编辑信息、回调拉取基本信息}   提交编辑基本信息
     */
    *submitEditSchoolInfo({ payload, callback }, { call, put }) {
      const {
        writeSchoolName,
        writeOrganization,
        writeOrigin,
        writeAdminer,
        writeProvice: [province, city],
        writeIphone,
        writeModel,
        id,
      } = payload;
      const xhr = {
        name: writeSchoolName,
        type: writeOrganization,
        origin: writeOrigin,
        adminName: writeAdminer,
        province,
        city,
        adminMobile: writeIphone,
        mode: writeModel,
      };
      if (id) {
        xhr.id = id;
      }
      if (!/^1[345789]\d{9}$/.test(writeIphone)) {
        message.warning('手机号码有误，请重填');
        return false;
      }
      yield put({
        type: 'setState',
        payload: {
          confirmLoadding: true,
        },
      });
      const response = yield call(payload.id ? updateSchool : insertSchool, xhr);
      yield put({
        type: 'setState',
        payload: {
          confirmLoadding: false,
        },
      });
      if (response) {
        if (response.code === 1) {
          yield put({
            type: 'setState',
            payload: {
              visible: false,
              confirmLoadding: false,
              writeSchoolName: '',
              writeOrganization: undefined,
              writeOrigin: undefined,
              writeAdminer: '',
              writeProvice: '',
              writeIphone: '',
              writeModel: undefined,
            },
          });
          message.success('编辑成功');
          if (callback) callback();
        } else {
          message.error('编辑失败');
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
  },
};
