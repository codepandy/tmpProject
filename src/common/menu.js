import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '用户管理',
    icon: 'user',
    path: 'useradmin',
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
      },
    ],
  },
  {
    name: '权限管理',
    icon: 'safety certificate',
    path: 'authority',
    authority: [1, 2],
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
        hideInMenu: true,
      },
    ],
  },
  {
    name: '教研管理',
    icon: 'file',
    path: 'teachResearch',
    children: [
      {
        name: '知识标签',
        path: 'knowledge-target',
      },
      {
        name: '知识体系',
        path: 'knowledge-list',
      },
      {
        name: '素材生产',
        path: 'make-material',
      },
      {
        name: '素材生产-新增',
        path: 'edit-material',
      },
      {
        name: '来源管理',
        path: 'source-list',
      },
      {
        name: '内容素材',
        path: 'a',
      },
      {
        name: '内容管理',
        path: 'b',
        children: [
          {
            name: '内容管理列表',
            path: 'c',
          },
          {
            name: '二级内容文件管理',
            path: 'd',
          },
        ],
      },
      {
        name: '内容关联',
        path: 'e',
      },
    ],
  },
  {
    name: '异常页',
    icon: 'warning',
    path: 'exception',
    hideInMenu: true,
    children: [
      {
        name: '403',
        path: '403',
      },
      {
        name: '404',
        path: '404',
      },
      {
        name: '500',
        path: '500',
      },
      {
        name: '触发异常',
        path: 'trigger',
        hideInMenu: true,
      },
    ],
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: '-1',
    children: [
      {
        name: '登录',
        path: 'login',
      },
      {
        name: '注册',
        path: 'register',
      },
      {
        name: '注册结果',
        path: 'register-result',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
