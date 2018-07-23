const RESPONSE_STATUS = {
  ok: 0,
  error: 1,
};

const AUTHORITY_TOKEN = 'authority_token_key';

const TARGET_TYPE = {
  subject: { id: 1, name: '学科' },
  department: { id: 2, name: '学部' },
  scope: { id: 3, name: '范围' },
  hard: { id: 4, name: '难度' },
  source: { id: 5, name: '来源' },
  mainPoint: { id: 6, name: '主知识点' },
  point: { id: 7, name: '知识点' },
  textTarget: { id: 8, name: '文本标签' },
  layer: { id: 9, name: '层次' },
  thoughtway: { id: 10, name: '思想方法' },
};

const SUBJECTS = { Math: { id: 1, name: '数学' }, physics: { id: 2, name: '物理' } };

const SCOPE = { InClass: { id: 3, name: '课内' }, outOfClass: { id: 4, name: '课外' } };

const DEPARTMENTS = { junior: { id: 5, name: '初中' }, highSchool: { id: 6, name: '高中' } };

export { RESPONSE_STATUS, AUTHORITY_TOKEN, TARGET_TYPE, SUBJECTS, SCOPE, DEPARTMENTS };
