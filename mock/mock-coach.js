import { parse } from 'url';

const names = [
  '张三丰',
  '刘一鸣',
  '唐三',
  '鸣人',
  '徐毅成',
  '周杰伦',
  '五月天',
  '史泰龙',
  '宁次',
  '我爱罗',
];

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,

    href: 'https://ant.design',
    avatar: [
      'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
      'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
    ][i % 2],
    id: `${i}`.padStart(6, '0'),
    title: `一个任务名称 ${i}`,
    owner: '曲丽丽',
    description:
      '也许很容易让人想用舍入来完成这个任务，但是这样做会导致你的随机数处于一个不均匀的分布，这可能不符合你的需求',

    updatedAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    createdAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    progress: Math.ceil(Math.random() * 100),
    name: names[Math.floor(Math.random() * 10)],
    mobile: '15801215124',
    organization: '湘南海岸-1',
    schoolType: '学校(高中)',
    userType: '行政身份',
    isSigned: Math.floor(Math.random() * 1),
    createTime: new Date(`2016-07-${Math.floor(i / 2) + 1}`),
    takedLessons: Math.floor(Math.random() * (300 - 1) + 1),
    takingLessons: Math.floor(Math.random() * (300 - 1) + 1),
    rebates: 23,
    endTime: new Date(`2027-07-${Math.floor(i / 2) + 1}`),
    readingStudents: 1 + Math.floor(Math.random() * 100),
    lastLoginTime: new Date(`2018-05-${Math.floor(i / 2) + 1}`),
    status: Math.floor(Math.random() * 1),
    op: '操作',
  });
}

export function getCoach(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;

  let dataSource = [...tableListDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.fuzzySearch) {
    dataSource = dataSource.filter(data => data.name === params.fuzzySearch);
  }
  if (params.id) {
    dataSource = dataSource.filter(data => data.id === params.id);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getSchool(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;

  let dataSource = [
    { Id: '1', displayName: '北京四中' },
    { Id: '2', displayName: '北京五中' },
    { Id: '3', displayName: '北京六中' },
  ];

  if (params.id) {
    dataSource = dataSource.filter(data => data.id === params.id);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}
export function getAuthority(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;

  let dataSource = [
    {
      id: '0001',
      signInfo: '签约：2017-12-23 xx学校 返点：123',
      courseName: '初一数学(课程名) 有效期：2018-01-02',
      overDue: '未过期',
      color: 'green',
    },
    {
      id: '0002',
      signInfo: '签约：2017-12-23 xx学校 231',
      courseName: '初二数学(课程名) 有效期：2018-01-02',
      overDue: '已过期',
      color: 'red',
    },
    {
      id: '0003',
      signInfo: '签约：2017-12-23 xx学校 432',
      courseName: '初三数学(课程名) 有效期：2018-01-02',
      overDue: '已过期',
      color: 'red',
    },
    {
      id: '0004',
      signInfo: '签约：2017-12-23 xx学校 返点：123',
      courseName: '初一数学(课程名) 有效期：2018-01-02',
      overDue: '未过期',
      color: 'green',
    },
    {
      id: '0005',
      signInfo: '签约：2017-12-23 xx学校 231',
      courseName: '初二数学(课程名) 有效期：2018-01-02',
      overDue: '已过期',
      color: 'red',
    },
    {
      id: '0006',
      signInfo: '签约：2017-12-23 xx学校 432',
      courseName: '初三数学(课程名) 有效期：2018-01-02',
      overDue: '已过期',
      color: 'red',
    },
    {
      id: '0007',
      signInfo: '签约：2017-12-23 xx学校 返点：123',
      courseName: '初一数学(课程名) 有效期：2018-01-02',
      overDue: '未过期',
      color: 'green',
    },
    {
      id: '0008',
      signInfo: '签约：2017-12-23 xx学校 231',
      courseName: '初二数学(课程名) 有效期：2018-01-02',
      overDue: '已过期',
      color: 'red',
    },
    {
      id: '0009',
      signInfo: '签约：2017-12-23 xx学校 432',
      courseName: '初三数学(课程名) 有效期：2018-01-02',
      overDue: '已过期',
      color: 'red',
    },
    {
      id: '0010',
      signInfo: '签约：2017-12-23 xx学校 返点：123',
      courseName: '初一数学(课程名) 有效期：2018-01-02',
      overDue: '未过期',
      color: 'green',
    },
    {
      id: '0011',
      signInfo: '签约：2017-12-23 xx学校 231',
      courseName: '初二数学(课程名) 有效期：2018-01-02',
      overDue: '已过期',
      color: 'red',
    },
    {
      id: '0012',
      signInfo: '签约：2017-12-23 xx学校 432',
      courseName: '初三数学(课程名) 有效期：2018-01-02',
      overDue: '已过期',
      color: 'red',
    },
  ];
  if (params.fuzzySearch) {
    dataSource = dataSource.filter(data => data.name === params.fuzzySearch);
  }
  if (params.id) {
    dataSource = dataSource.filter(data => data.id === params.id);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  if (params.maxCount) {
    dataSource = dataSource.slice(0, params.maxCount);
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function postAuthority(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, no, description } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => no.indexOf(item.no) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: i,
        href: 'https://ant.design',
        avatar: [
          'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
          'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
        ][i % 2],
        no: `TradeCode ${i}`,
        title: `一个任务名称 ${i}`,
        owner: '曲丽丽',
        description,
        callNo: Math.floor(Math.random() * 1000),
        status: Math.floor(Math.random() * 10) % 2,
        updatedAt: new Date(),
        createdAt: new Date(),
        progress: Math.ceil(Math.random() * 100),
      });
      break;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getCourse(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;

  const dataSource = [
    {
      id: '10001',
      courseName: '初一数学',
      orders: 14,
      goal: 23,
    },
    {
      id: '10002',
      courseName: '初一物理',
      orders: 6,
      goal: 12,
    },
    {
      id: '10003',
      courseName: '初一化学',
      orders: 14,
      goal: 23,
    },
    {
      id: '10004',
      courseName: '初一生物',
      orders: 8,
      goal: 12,
    },
  ];

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getCoach,
  getSchool,
  getAuthority,
  postAuthority,
  getCourse,
};
