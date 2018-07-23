import { message } from 'antd';
import { Apis } from '../../services/api';

const { bSchoolApis: { insertSchoolDialog } } = Apis;
export default {
  namespace: 'newAddConnect',

  state: {
    connectRecordVisible: false,
    writeConnectRecord: '', // 沟通记录
    confirmLoading: false,
  },

  effects: {
    /**
     *
     * @param {*} _ 学校添加日志(提交沟通记录)
     */
    *submitConnectRecord({ payload, callback }, { call, put, select }) {
      const { writeConnectRecord } = yield select(state => state.newAddConnect);
      if (!writeConnectRecord) {
        return message.warning('请输入字符');
      }
      if (writeConnectRecord.length > 300) {
        return message.warning('您最多可输入300个字符');
      }
      yield put({
        type: 'setState',
        payload: {
          confirmLoading: true,
        },
      });
      const xhr = { ...payload };
      const response = yield call(insertSchoolDialog, xhr);
      yield put({
        type: 'setState',
        payload: {
          confirmLoading: false,
        },
      });
      if (response) {
        if (response.code === 1) {
          yield put({
            type: 'setState',
            payload: {
              connectRecordVisible: false,
              writeConnectRecord: '',
            },
          });
          message.success(`提交成功`);
          if (callback) callback();
        } else {
          message.error('提交失败');
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
      return {
        connectRecordVisible: false,
        writeConnectRecord: '', // 沟通记录
      };
    },
  },
};
