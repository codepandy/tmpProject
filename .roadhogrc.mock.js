import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';
import { getCoach, getAuthority, getSchool, postAuthority, getCourse } from './mock/mock-coach';
import { getAcount, getRole, getMenu, getUserMenu } from './mock/mock-account';
import { queryKnowledgeTarget } from './mock/mock-teachResearch';
import { getBschoolList, getBschoolLists } from './mock/bschool';
import { getBcStudentlList } from './mock/bcStudent';
// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  'GET /courseApi/listDictionarysById': getBschoolList, //字典接口

  // b端学校 (详情页面)
  'GET /api/bSchool': getBschoolLists.querySearchData,
  'GET /api/BschoolBasicInfo': getBschoolLists.basicInfo,
  'GET /api/BschoolTeacherList': getBschoolLists.teacherList,
  'GET /api/BschoolStudentList': getBschoolLists.studentList,

  'GET /api/bSchoolSearchData': getBschoolList,
  // c端学生

  'GET /api/CStudentBasicInfo': getBcStudentlList.basicInfo,

  'GET /api/CStudentPurchaseClass': getBcStudentlList.purchaseClass,
  'GET /api/CStudentConnectRecord': getBcStudentlList.connectRecord,
  'GET /api/CStudentActivityRecord': getBcStudentlList.activityRecord,

  'GET /api/CStudentCourseData': getBcStudentlList.courseData,

  'GET /api/bcStudent': getBcStudentlList.querySearchData,
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: '获取当前用户接口',
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    if (password === '888888' && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: '1',
      });
      return;
    }
    if (password === '123456' && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: '2',
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: '-1',
    });
  },
  'GET /api/login/login': {
    code: 0,
    data: {
      userInfo: {
        lastTime: '1529647410253',
        roleIds: '[1, 2]',
        name: '李鹏',
        mobile: '15801029678',
        userType: '1',
        token: 'a1538dbb83527d4260221cd7b6eec012',
      },
    },
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/coach': getCoach,
  'GET /api/authority': getAuthority,
  'POST /api/authority': postAuthority,
  'GET /api/communication': getAuthority,
  'GET /api/activity': getAuthority,
  'GET /api/school': getSchool,
  'GET /api/course': getCourse,
  'GET /api/user/listUser': getAcount,
  'POST /api/user/saveUser': (req, res) => {
    res.send({
      code: '0',
    });
    return;
  },
  'GET /api/role': getRole,
  'GET /api/menu': getMenu,
  'GET /api/userRole/getRoleMenu': getUserMenu,
  'GET /api/menus': [
    {
      name: '用户管理',
      icon: 'user',
      path: 'useradmin',
      authority: [1, 2],
      children: [
        {
          name: 'B端学校',
          path: 'b-school',
        },
        {
          name: 'B端教练',
          path: 'coach-to-B',
        },
        {
          name: 'B端教练详情',
          path: 'coach-detail',
          hideInMenu: true,
        },
        {
          name: '课程使用权限',
          path: 'coach-authority',
          hideInMenu: true,
        },
        {
          name: '沟通记录列表',
          path: 'coach-communications',
          hideInMenu: true,
        },
        {
          name: '活动参与列表',
          path: 'coach-activities',
          hideInMenu: true,
        },
        {
          name: '二维码设置',
          path: 'coach-qrcode',
          hideInMenu: true,
        },
        {
          name: 'B/C端学生',
          path: 'b-c-student',
          // hideInBreadcrumb: true,
          // hideInMenu: true,
        },
      ],
    },
    {
      name: '权限管理',
      icon: 'safety certificate',
      path: 'authority',
      children: [
        {
          name: '账号管理',
          path: 'account-list',
        },
        {
          name: '角色管理',
          path: 'role-list',
        },
        {
          name: '角色编辑',
          path: 'role-edit',
          hideInMenu: false,
        },
      ],
    },
  ],
  'GET /api/user/listMenus': [
    {
      name: '用户管理',
      icon: 'user',
      path: 'useradmin',
      authority: [1, 2],
      children: [
        {
          name: 'B端学校',
          path: 'b-school',
        },
        {
          name: 'B端教练',
          path: 'coach-to-B',
        },
        {
          name: 'B端教练详情',
          path: 'coach-detail',
          hideInMenu: true,
        },
        {
          name: '课程使用权限',
          path: 'coach-authority',
          hideInMenu: true,
        },
        {
          name: '沟通记录列表',
          path: 'coach-communications',
          hideInMenu: true,
        },
        {
          name: '活动参与列表',
          path: 'coach-activities',
          hideInMenu: true,
        },
        {
          name: '二维码设置',
          path: 'coach-qrcode',
          hideInMenu: true,
        },
        {
          name: 'B/C端学生',
          path: 'b-c-student',
          // hideInBreadcrumb: true,
          // hideInMenu: true,
        },
      ],
    },
    {
      name: '权限管理',
      icon: 'safety certificate',
      path: 'authority',
      children: [
        {
          name: '账号管理',
          path: 'account-list',
        },
        {
          name: '角色管理',
          path: 'role-list',
        },
        {
          name: '角色编辑',
          path: 'role-edit',
          hideInMenu: false,
        },
      ],
    },
  ],
  'GET /api/knowledgeSystem': {
    list: [
      {
        id: '10001',
        subject: '0',
        scope: '课内',
        department: '初中',
        firstLevel: 3,
        secondLevel: 4,
        thirdLevel: 5,
        forthLevel: 6,
        total: 18,
        lastUpdate: '2018-12-10 张老师',
        targetTree: [
          {
            title: '三角形',
            key: '1-0-0-1',
            type: '0',
            children: [{ title: '勾股定理', key: '1-0-0-1-1' }],
          },
          {
            title: '正方形',
            key: '1-0-0-2',
            type: '0',
            children: [{ title: '正弦函数', key: '1-0-0-2-3' }],
          },
        ],
      },
      {
        id: '10002',
        subject: '1',
        scope: '课内',
        department: '高中',
        firstLevel: 3,
        secondLevel: 4,
        thirdLevel: 5,
        forthLevel: 6,
        total: 18,
        lastUpdate: '2018-12-10 张老师',
        targetTree: [
          {
            title: '宇宙第二定律',
            key: '1-0-0-4',
            type: '1',
          },
          {
            title: '宇宙第三定律',
            key: '1-0-0-5',
            type: '1',
            children: [
              { title: '杠杆定律', key: '1-0-0-5-1' },
              { title: '加速度', key: '1-0-0-5-2' },
            ],
          },
        ],
      },
      {
        id: '10003',
        subject: '数学',
        scope: '课外',
        department: '初中',
        firstLevel: 3,
        secondLevel: 4,
        thirdLevel: 5,
        forthLevel: 6,
        total: 18,
        lastUpdate: '2018-12-10 刘老师',
      },
    ],
    pagination: {
      total: 20,
      pageSize: 10,
      current: 1,
    },
  },
  'GET /api/knowledgeTarget': queryKnowledgeTarget,
  'GET /api/delKnowledgeTarget': {
    status: 'ok',
  },
  'GET /api/saveKnowledgeTarget': {
    status: 'ok',
  },
  'GET /api/updateKnowledgeSystem': {
    status: 'ok',
  },
};

//const userAPI = 'http://10.9.5.34:8084/';

const loginURl = 'http://10.38.2.201:8084/login';
const userAPI = 'http://10.38.2.201:8200/api/';
const tsAPI = 'http://10.38.2.184:8085/';

export default (noProxy
  ? {
      'POST /login/(.*)': loginURl,
      'GET /api/(.*)': userAPI,
      'POST /api/(.*)': userAPI,
    }
  : delay(proxy, 1000));
