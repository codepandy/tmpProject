import { stringify } from 'qs';
import request from '../utils/request';

export const Apis = {
  commonApis: {
    queryDictionariy: async params => {
      //  共同字典请求
      return request(`/api/courseApi/listDictionarysById?${stringify(params)}`);
    },
    queryProviceAndCity: async () => {
      // 获取省市联动
      return request(`/api/courseApi/proviceAndCity`);
    },
    queryListAllSchool: async () => {
      // 获取所有学校，类型，签约，三级联动
      return request(`/api/courseApi/listAllSchool`);
    },
    queryListOnlyAllSchool: async () => {
      // 获取所有只有学校选项的下拉框
      return request(`/api/courseApi/listOnlySchool`);
    },
    queryAllCourseList: async () => {
      // 获取所有的合同可签订的课程列表
      return request(`/api/courseApi/listAllCourse`);
    },
    querychoolTeacherSimpleList: async params => {
      // 查询学校的老师列表
      return request(`/api/courseApi/listSchoolTeacherSimpleBySchoolId?${stringify(params)}`);
    },
    queryCourseAndContractAndClassList: async params => {
      // 查询老师的 课程、合同、班级 三级联动
      return request(`/api/courseApi/listCourseAndContractAndClass?${stringify(params)}`);
    },
    queryTeacherSimpleList: async params => {
      return request(`/api/courseApi/listSchoolTeacherSimpleByTeacherId?${stringify(params)}`);
    },
    queryCourseTypeAndStatusList: async () => {
      // 课程类型列表   (b端教练(教练详情 - )(c端学生)
      return request(`/api/courseApi/listCourseTypeAndStatus`);
    },
  },
  bSchoolApis: {
    queryBschool: async params => {
      // b端学校(详情页面)
      return request(`/api/courseApi/listStatSchoolHome`, {
        method: 'POST',
        body: params,
      });
    },
    insertSchool: async params => {
      // b段学校（添加学校）
      return request(`/api/courseApi/insertSchool`, {
        method: 'POST',
        body: params,
      });
    },
    updateSchool: async params => {
      return request(`/api/courseApi/updateSchool`, {
        // b段学校（编辑学校/机构）
        method: 'POST',
        body: params,
      });
    },
    querySchoolHomeCount: async () => {
      //  b端学校人数和总人数
      return request(`/api/courseApi/getStatSchoolHomeCount`);
    },
    queryBschoolBasicInfo: async params => {
      //  b端学校基本信息
      return request(`/api/courseApi/getSchoolBasicInfo?${stringify(params)}`);
    },
    queryBschoolConnectRecord: async params => {
      //  b端学校沟通记录
      return request(`/api/courseApi/listDialogBySchoolId?${stringify(params)}`);
    },
    insertSchoolDialog: async params => {
      //  b端学校添加日志（提交新增沟通记录）
      return request(`/api/courseApi/insertSchoolDialog`, {
        method: 'POST',
        body: params,
      });
    },
    queryBschoolSignRecord: async params => {
      //  b端学校签约数据
      return request(`/api/courseApi/listContractBySchoolId?${stringify(params)}`);
    },
    querySchoolContractBasicInfo: async params => {
      //  b端学校签约数据(合同信息)
      return request(`/api/courseApi/getSchoolContractBasicInfo?${stringify(params)}`);
    },
    querySchoolContractSchoolCourse: async params => {
      //  b端学校签约数据(课程数据)
      return request(`/api/courseApi/listSchoolCourseByContractId?${stringify(params)}`);
    },
    insertOrUpdateContract: params => {
      //  b端学校签约数据(合同信息)学校详情页面 - 合同编辑 - 基本合同信息信息提交
      return request(`/api/courseApi/insertOrUpdateContract`, {
        method: 'POST',
        body: params,
      });
    },
    insertOrUpdateSchoolCourse: params => {
      //  b端学校签约数据 学校详情页面 - 合同编辑 - 添加修改课程
      return request(`/api/courseApi/insertOrUpdateSchoolCourse`, {
        method: 'POST',
        body: params,
      });
    },
    deleteSchoolCourse: params => {
      //  b端学校签约数据 学校详情页面 - 合同编辑 - 删除课程
      return request(`/api/courseApi/deleteSchoolCourse`, {
        method: 'POST',
        body: params,
      });
    },
    insertOrUpdateClass: params => {
      //  b端学校签约数据 学校详情页面 - 保存班级设置
      return request(`/api/courseApi/insertOrUpdateClass`, {
        method: 'POST',
        body: params,
      });
    },
    deleteClass: params => {
      //  b端学校签约数据 学校详情页面 - 删除班级
      return request(`/api/courseApi/deleteClass`, {
        method: 'POST',
        body: params,
      });
    },
    queryBschoolActivityRecord: params => {
      //  b端学校活动记录
      return request(`/api/courseApi/listActivityBySchoolId?${stringify(params)}`);
    },
    queryBschoolTeacherList: params => {
      //  b端学校 教师列表
      return request(`/api/courseApi/getSchoolTeacherBySchoolId?${stringify(params)}`);
    },
    updateBschoolTeacherList: params => {
      //  b端学校 教师列表(编辑备注信息提交)
      return request(`/api/courseApi/updateSchoolTeacher`, {
        method: 'POST',
        body: params,
      });
    },
    queryTeacherInSchool: params => {
      //  b端学校 教师列表  学校详情页面 - 教练列表 - 判断教练是否存在 code=1 code=2没有教练信息  code=3这个学校已经添加了这个教练
      return request(`/api/courseApi/checkSchoolAddTeacher?${stringify(params)}`);
    },
    insertSchoolTeacher: params => {
      // 学校详情页面 - 教练列表 - 添加教练 （POST提交）
      return request(`/api/courseApi/insertSchoolTeacher`, {
        method: 'POST',
        body: params,
      });
    },
    queryBschoolStudentList: params => {
      //  b端学校 学生列表
      return request(`/api/courseApi/getSchoolStudentBySchoolId?${stringify(params)}`);
    },
    submitSchoolStudentRank: params => {
      //  b端学校 学生列表  学校详情页面 - 学员情况 - 编辑学员等级
      return request(`/api/courseApi/updateSchoolStudent`, {
        method: 'POST',
        body: params,
      });
    },
    insertOrUpdateSchoolStudentItem: params => {
      //  b端学校 学生列表  学校详情页面 - 学员情况 - 相信信息修改
      return request(`/api/courseApi/insertOrUpdateSchoolStudentItem`, {
        method: 'POST',
        body: params,
      });
    },
    deleteSchoolStudentItem: params => {
      //  b端学校 学生列表  学校详情页面 - 学员情况 - 相信信息删除
      return request(`/api/courseApi/deleteSchoolStudentItem`, {
        method: 'POST',
        body: params,
      });
    },
  },
  coachApis: {
    queryCoach(params) {
      //  b端学校 学生列表
      return request(`/api/courseApi/listStatTeacherHome`, {
        method: 'POST',
        body: params,
      });
    },
    updateTeacher: params => {
      //  b端学校 添加教练
      return request(`/api/courseApi/updateTeacher`, {
        method: 'POST',
        body: params,
      });
    },
    updateTeacherStatus(params) {
      // b端教练 启用禁用
      return request(`/api/courseApi/updateTeacherStatus`, {
        method: 'POST',
        body: params,
      });
    },
    queryStatTeacherHomeCount: () => {
      return request(`/api/courseApi/getStatTeacherHomeCount`);
    },
    queryTeacherBasicInfo: params => {
      return request(`/api/courseApi/getTeacherBasicInfo?${stringify(params)}`);
    },
    insertUserDialog: params => {
      // b端教练、c端学生（沟通记录）
      return request(`/api/courseApi/insertUserDialog`, {
        method: 'POST',
        body: params,
      });
    },
    queryTeacherClassRecord: params => {
      // b端教练(课程使用权限)
      return request(`/api/courseApi/listContractByTeacherId?${stringify(params)}`);
    },
    queryTeacherContractBasicInfo: params => {
      // b端教练(教师合同-初始化)
      return request(`/api/courseApi/getTeacherContractBasicInfo?${stringify(params)}`);
    },
    insertOrUpdateTeacherContract: params => {
      return request(`/api/courseApi/insertOrUpdateTeacherContract`, {
        method: 'POST',
        body: params,
      });
    },
    insertOrUpdateTeacherCourse(params) {
      // b端教练(教师合同-初始化-课程信息更新)
      return request(`/api/courseApi/insertOrUpdateTeacherCourse`, {
        method: 'POST',
        body: params,
      });
    },
    deleteTeacherCourse: params => {
      // b端教练(教师合同-删除课程)
      return request(`/api/courseApi/deleteTeacherCourse`, {
        method: 'POST',
        body: params,
      });
    },
    queryTeacherCourseByContractIdList(params) {
      // b端教练(教师合同-初始化-课程班级列表)
      return request(`/api/courseApi/listTeacherCourseByContractId?${stringify(params)}`);
    },
    queryCourseByTeacherIdList: params => {
      // b端教练( 拉取老师二维码报课成单量)
      return request(`/api/courseApi/listCourseByTeacherId?${stringify(params)}`);
    },
    queryCourseAndClassList: params => {
      // b端教练(教练详情 - 课程班级联动初始化)
      return request(`/api/courseApi/listCourseAndClass?${stringify(params)}`);
    },
    queryStatStudentCourseItemList(params) {
      // b端教练(教练详情 - 课程班级联动初始化)
      return request(`/api/courseApi/listStatStudentCourseItemForTeacher?${stringify(params)}`);
    },
    queryStatTeacherStudentCount: params => {
      // 教练详情 - 学生列表 - 在读学员与历史学员统计
      return request(`/api/courseApi/getStatTeacherStudentCount?${stringify(params)}`);
    },
  },
  cStudentApis: {
    queryStudent: params => {
      //  c端学生 (详情页面)
      return request(`/api/courseApi/listStatStudentHome`, {
        method: 'POST',
        body: params,
      });
    },
    updateStudentStatus: params => {
      //  c端学生 (启用禁用)
      return request(`/api/courseApi/updateStudentStatus`, {
        method: 'POST',
        body: params,
      });
    },
    queryStatStudentHomeCount: () => {
      // c段学生人数和总人数
      return request(`/api/courseApi/getStatStudentHomeCount`);
    },
    queryStudentBasic: params => {
      // c段学生基本信息
      return request(`/api/courseApi/getStudentBasicInfo?${stringify(params)}`);
    },
    updateStudentBasicInfo: params => {
      // c端学生编辑基本信息提交
      return request(`/api/courseApi/updateStudent`, {
        method: 'POST',
        body: params,
      });
    },
    queryStudentConnectRecord: params => {
      // c段学生沟通记录
      return request(`/api/courseApi/listDialogByUserId?${stringify(params)}`);
    },
    queryStudentStatCourseNum: params => {
      // c端学生购课记录（总数统计）
      return request(`/api/courseApi/getStatCourseNumByStudentId?${stringify(params)}`);
    },
    queryStudentListContract: params => {
      // c段学生购课记录(分条信息)
      return request(`/api/courseApi/listContractByStudentId?${stringify(params)}`);
    },
    queryStudentActivityRecord: params => {
      // c段学生活动记录
      return request(`/api/courseApi/listActivityByUserId?${stringify(params)}`);
    },
    querySelectCStudentCourseData: () => {
      // c段学生课程数据
      return request('/api/CStudentCourseData');
    },
    queryCourseByStudentIdList: params => {
      // c段学生课程数据
      return request(`/api/courseApi/listCourseByStudentId?${stringify(params)}`);
    },
    queryStatStudentCourseItemForStudentList(params) {
      // c段学生详情 - 统计信息
      return request(`/api/courseApi/listStatStudentCourseItemForStudent?${stringify(params)}`);
    },
  },
};
export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function getAccountLogin(params) {
  return request(`/login/webLogin`, {
    method: 'POST',
    body: params,
  });
}

export async function queryMenus() {
  return request('/api/user/listMenus');
}

export async function queryUserMenu(params) {
  return request(`/api/userRole/getRoleMenu?${stringify(params)}`);
}

export async function queryAuthority(params) {
  return request(`/api/authority?${stringify(params)}`);
}

export async function updateAuthority(params) {
  return request(`/api/authority`, {
    method: 'POST',
    body: params,
  });
}

export async function queryAccount(params) {
  return request(`/api/user/listUser?${stringify(params)}`);
}

export async function updateAccount(params) {
  return request(`/api/user/saveUser?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function updateUserStatus(params) {
  return request(`/api/user/updateUserStatus?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function queryDepartment() {
  return request(`/api/user/getDepartment`);
}

export async function queryRole(params) {
  return request(`/api/userRole/listRole?${stringify(params)}`);
}

export async function saveRole(params) {
  return request(`/api/userRole/saveRole?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function deleteRole(params) {
  return request(`/api/userRole/deleteRole?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function listMainHierarchy() {
  return request(`/library/mainHierarchy/listMainHierarchy`);
}

export async function queryKnowledgeSystem(params) {
  return request(`/library/hierarchy/listHierarchy?${stringify(params)}`);
}

export async function queryKnowledgeTarget(params) {
  return request(`/library/mainHierarchy/getPointTree?${stringify(params)}`);
}

export async function deleteNodes(params) {
  return request(`/library/delKnowledgeTarget?${stringify(params)}`);
}

export async function saveKnowledgeTarget(params) {
  return request(`/library/saveKnowledgeTarget?${stringify(params)}`);
}

export async function updateTreeNode(params) {
  return request(`/library/hierarchy/setPoint?${stringify(params)}`);
}

export async function addMainPoint(params) {
  return request(`/library/mainHierarchy/addMainPoint?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function editMainPointName(params) {
  return request(`/library/mainHierarchy/editMainPointName?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function moveMainPoint(params) {
  return request(`/library/mainHierarchy/moveMainPoint?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function addHierarchy(params) {
  return request(`/library/hierarchy/addHierarchy?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function queryHierarchyTree(params) {
  return request(`/library/hierarchy/getPointTree?${stringify(params)}`);
}

export async function queryHierarchyTreeUse(params) {
  return request(`/library/hierarchy/getPointTreeUse?${stringify(params)}`);
}

export async function getTagItemByNameBatch(params) {
  return request(`/library/tag/getTagItemByNameBatch?${stringify(params)}`);
}

export async function getSource(params) {
  return request(`/library/sourceList?${stringify(params)}`);
}

export async function getSourceList(params) {
  return request(`/library/sourceList?${stringify(params)}`);
}
