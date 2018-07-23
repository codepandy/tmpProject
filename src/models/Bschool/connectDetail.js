import { message } from 'antd';
import { Apis } from '../../services/api';
import { delay } from '../../../src/utils/utils';

const { bSchoolApis: { queryBschoolConnectRecord } } = Apis;
export default {
  namespace: 'connectDetail',
  state: {
    recordList: {},

    connectRecordVisible: false,
    writeConnectRecord: '', // 沟通记录
    connectConfirmLoading: false,
  },
  effects: {
    /**
     *
     * @param {*} 拉取沟通记录表
     */
    *fetchConnectRecord({ payload }, { call, put }) {
      const response = yield call(queryBschoolConnectRecord, { ...payload });
      if (response.code === 1) {
        if (payload.pageNo === 1) {
          yield put({
            type: 'setState',
            payload: { recordList: response.data },
          });
        } else {
          yield put({
            type: 'recordMore',
            payload: response.data,
          });
        }
      }
    },
    /**
     *
     * @param {*} 提交沟通记录
     */
    *submitConnectRecord(_, { call, put, select }) {
      const { writeConnectRecord } = yield select(state => state.connectDetail);
      if (!writeConnectRecord) {
        return message.warning('请输入字符');
      }
      if (writeConnectRecord.length > 300) {
        return message.warning('您最多可输入300个字符');
      }
      yield put({
        type: 'setState',
        payload: {
          connectConfirmLoading: true,
        },
      });
      yield call(delay, 1000);
      yield put({
        type: 'setState',
        payload: {
          connectRecordVisible: false,
          connectConfirmLoading: false,
          writeConnectRecord: '',
        },
      });
      message.success('后台提供添加沟通记录的接口');
    },
  },
  reducers: {
    setState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    recordMore(state, { payload }) {
      const result = [...state.recordList.result, ...payload.result];
      const pagination = { ...payload.pagination };
      return {
        ...state,
        recordList: {
          result,
          pagination,
        },
      };
    },
    clear() {
      return {
        recordList: {},
      };
    },
  },
};
