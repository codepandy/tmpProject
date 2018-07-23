import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

const dynamicWrapper = (app, models, component) => {
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const menuData = getFlatMenuData(getMenuData());
  const routerData = {};
  const allRouter = {
    userPower: {
      administration: {
        '/': {
          component: dynamicWrapper(app, ['user', 'login', 'global'], () =>
            import('../layouts/BasicLayout')
          ),
        },
        '/user/login': {
          component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
        },
        '/user': {
          component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
        },
        '/user/register': {
          component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
        },
        '/user/register-result': {
          component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
        },
      },
    },
    userAdmin: {
      bSchool: {
        '/useradmin/b-school': {
          component: dynamicWrapper(app, ['bschool'], () =>
            import('../routes/Useradmin/BSchool/index')
          ),
        },
        '/useradmin/b-school/info': {
          component: dynamicWrapper(
            app,
            ['bschool', 'Bschool/bschoolBasicInfo', 'Bschool/editOrAddSchool'],
            () => import('../routes/Useradmin/BSchool/b-school')
          ),
        },
        '/useradmin/b-school/detail': {
          name: '详情',
          component: dynamicWrapper(app, ['Bschool/bschoolBasicInfo'], () =>
            import('../routes/Useradmin/BSchool/BSchoolDetail/router-index')
          ),
        },
        '/useradmin/b-school/all-detail/:schoolId': {
          component: dynamicWrapper(
            app,
            [
              'Bschool/bschoolBasicInfo',
              'Bschool/allDetail',
              'Bschool/newAddConnect',
              'Bschool/signAgainGive',
              // 'Bschool/editOrAddSchool',
              'Bschool/editBschoolStudent',
            ],
            () => import('../routes/Useradmin/BSchool/BSchoolDetail/basic-info')
          ),
        },
        '/useradmin/b-school/detail/sign-detail/:schoolId': {
          name: '历史签约数据',
          component: dynamicWrapper(app, ['Bschool/signDetail'], () =>
            import('../routes/Useradmin/BSchool/BSchoolDetail/sign-detail')
          ),
        },
        '/useradmin/b-school/detail/connect-detail/:schoolId': {
          name: '历史沟通记录',
          component: dynamicWrapper(app, ['Bschool/connectDetail', 'Bschool/newAddConnect'], () =>
            import('../routes/Useradmin/BSchool/BSchoolDetail/connect-detail')
          ),
        },
        '/useradmin/b-school/detail/activity-detail/:schoolId': {
          name: '历史活动记录',
          component: dynamicWrapper(app, ['Bschool/activityDetail'], () =>
            import('../routes/Useradmin/BSchool/BSchoolDetail/activity-detail')
          ),
        },
        '/useradmin/b-school/detail/sign-again-give': {
          name: '签约/增课',
          component: dynamicWrapper(app, ['Bschool/signAgainGive'], () =>
            import('../routes/Useradmin/BSchool/BSchoolDetail/sign-again-give')
          ),
        },
      },
      coach: {
        '/useradmin/coach-to-B': {
          component: dynamicWrapper(app, ['coach'], () =>
            import('../routes/CoachToB/route-coach-list')
          ),
        },
        '/useradmin/coach-detail': {
          component: dynamicWrapper(app, ['coachDetail'], () =>
            import('../routes/CoachToB/route-coach-detail')
          ),
        },
        '/useradmin/coach-authority': {
          component: dynamicWrapper(app, ['Coach/coachCourseDetail'], () =>
            import('../routes/CoachToB/route-authority-list')
          ),
        },
        '/useradmin/coach-communications': {
          component: dynamicWrapper(
            app,
            ['Coach/coachConnectDetail', 'Bschool/newAddConnect'],
            () => import('../routes/CoachToB/route-communication-list')
          ),
        },
        '/useradmin/coach-activities': {
          component: dynamicWrapper(
            app,
            ['Coach/coachActivityDetail', 'Bschool/newAddConnect'],
            () => import('../routes/CoachToB/route-activity-list')
          ),
        },
        '/useradmin/coach-qrcode': {
          component: dynamicWrapper(app, ['coachDetail'], () =>
            import('../routes/CoachToB/route-qr-code')
          ),
        },
        '/useradmin/coach-course-order': {
          component: dynamicWrapper(app, ['Coach/coachCourseOrder'], () =>
            import('../routes/CoachToB/route-course-order')
          ),
        },
      },
      cStudent: {
        '/useradmin/b-c-student': {
          component: dynamicWrapper(app, ['bcStudent/bcStudent'], () =>
            import('../routes/Useradmin/BCStudent/b-c-student')
          ),
        },
        '/useradmin/b-c-student-detail/:schoolId': {
          component: dynamicWrapper(
            app,
            ['bcStudent/bcAllDetail', 'bcStudent/editStudentInfo'],
            () => import('../routes/Useradmin/BCStudent/basic-info')
          ),
        },
        '/useradmin/b-c-student-activity-detail': {
          component: dynamicWrapper(app, ['bcStudent/BCstudentActivityDetail'], () =>
            import('../routes/Useradmin/BCStudent/activity-detail')
          ),
        },
        '/useradmin/b-c-student-class-detail': {
          component: dynamicWrapper(app, ['bcStudent/BCstudentClassDetail'], () =>
            import('../routes/Useradmin/BCStudent/class-detail')
          ),
        },
        '/useradmin/b-c-student-connect-detail': {
          component: dynamicWrapper(app, ['bcStudent/BCstudentConnectDetail'], () =>
            import('../routes/Useradmin/BCStudent/connect-detail')
          ),
        },
      },
    },
    authority: {
      account: {
        '/authority/account-list': {
          component: dynamicWrapper(app, ['authority'], () =>
            import('../routes/Authority/route-account-list')
          ),
        },
      },
      role: {
        '/authority/role-list': {
          component: dynamicWrapper(app, ['authority'], () =>
            import('../routes/Authority/route-role-list')
          ),
        },
        '/authority/role-edit': {
          component: dynamicWrapper(app, ['authority'], () =>
            import('../routes/Authority/route-role-edit')
          ),
        },
      },
    },
    teachResearch: {
      targetSystem: {
        '/teachResearch/targetSystem/knowledge-target': {
          component: dynamicWrapper(app, ['teachResearch'], () =>
            import('../routes/TeachResearch/TargetSystem/route-knowledge-target')
          ),
        },
      },
      material: {
        '/teachResearch/make-material': {
          component: dynamicWrapper(app, ['teachResearch'], () =>
            import('../routes/TeachResearch/MakeMaterial/route-material-list')
          ),
        },
        '/teachResearch/edit-material': {
          component: dynamicWrapper(app, ['teachResearch'], () =>
            import('../routes/TeachResearch/MakeMaterial/route-material-edit')
          ),
        },
      },
      knowledge: {
        '/teachResearch/knowledge-list': {
          component: dynamicWrapper(app, ['teachResearch'], () =>
            import('../routes/TeachResearch/KnowledgeSystem/route-knowledge-system-list')
          ),
        },
        '/teachResearch/knowledge-list-edit/:id': {
          component: dynamicWrapper(app, ['teachResearch'], () =>
            import('../routes/TeachResearch/KnowledgeSystem/route-knowledge-system-edit')
          ),
        },
      },
    },
    exception: {
      code: {
        '/result/success': {
          component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
        },
        '/result/fail': {
          component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
        },
        '/exception/403': {
          component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
        },
        '/exception/404': {
          component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
        },
        '/exception/500': {
          component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
        },
        '/exception/trigger': {
          component: dynamicWrapper(app, ['error'], () =>
            import('../routes/Exception/triggerException')
          ),
        },
      },
    },
  };
  Object.keys(allRouter).forEach(item => {
    Object.keys(allRouter[item]).forEach(citem => {
      Object.keys(allRouter[item][citem]).forEach(path => {
        const pathRegexp = pathToRegexp(path);
        const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
        let menuItem = {};
        // If menuKey is not empty
        if (menuKey) {
          menuItem = menuData[menuKey];
        }
        let router = allRouter[item][citem][path];
        router = {
          ...router,
          name: router.name || menuItem.name,
          authority: router.authority || menuItem.authority,
          hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
        };
        routerData[path] = router;
      });
    });
  });
  return routerData;
};
