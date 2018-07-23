import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    // schoolId: 1,
    // schoolName: `学校名称${i}`,
    // schoolType: '学校（高中）',
    // schoolOrigin: '合作',
    // schoolModel: '集体观看',
    // schoolAdmin: '小尖子',
    // shoolIphone: '130000000001',
    // schoolEnterTime: '2018.05.18',
    // schoolHistory: '2',
    // schoolCurrent: '是',
    // schoolExpireTime: '2019.10.01',
    // schoolCurrentTeacher: 5,
    // schoolCurrentStudent: 10,
    // schoolRecentlyConnect: '2019.10.01',
    schoolId: `学校名称${i}`,
    schoolName: '湘南海岸-1',
    schoolType: '学校 (高中)',
    schoolOrigin: '合作',
    schoolModel: '单独观看',
    schoolAdmin: '小尖子',
    shoolIphone: '1300000000',
    schoolEnterTime: 1529492451000,
    schoolHistory: 2,
    schoolCurrent: 1,
    schoolExpireTime: 1529492451000,
    schoolCurrentTeacher: 5,
    schoolCurrentStudent: 10,
    schoolRecentlyConnect: 1529492451000,
  });
}

function getBschool(req, res, u) {
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

const tableListTeacher = [];
for (let i = 0; i < 16; i += 1) {
  tableListTeacher.push({
    key: i,
    teacherId: i,
    teacherName: 'xxx',
    gradeSubject: '高一数学',
    connect: '18334774476',
    idCard: '1426777212314412412',
    permissions: '高一数学竞赛课程',
    remarks: '固定联系人',
  });
}
const tableListStudent = [];
for (let i = 0; i < 16; i += 1) {
  tableListStudent.push({
    key: i,
    grade: 1,
    sort: '2018',
    firstPrize: '2人',
    secondPrize: '2人',
    thirdPrize: '2人',
    selfPeople: 20,
    school: '清华',
    remarks: '北大',
  });
}
function getTeacherList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;

  let dataSource = [...tableListTeacher];

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

function getStudentList(req, res, u) {
  {
    let url = u;
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url; // eslint-disable-line
    }
    const params = parse(url, true).query;

    let dataSource = [...tableListStudent];

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
}
export const getBschoolLists = {
  querySearchData: getBschool,
  basicInfo: (req, res) => {
    res.json({
      message: '',
      code: 1,
      data: {
        schoolId: 1,
        schoolName: '北京终',
        shcoolType: '北京-机构·',
        shcoolTypeKey: 1,
        schoolOrigin: '北京',
        schoolOriginKey: 1,
        enterTime: 1578934123123,
        schoolProvice: '山西',
        schoolProviceKey: 1,
        schoolCity: '临汾',
        schoolCityKey: 1,
        schoolAdmin: '家士兵',
        connectIphone: '150636897654',
        lookCourseModel: '集体观看',
        lookCourseModelKey: 1,
      },
    });
  },
  teacherList: getTeacherList,
  studentList: getStudentList,
};

export const getBschoolList = (req, res) => {
  res.json({
    provices: {
      message: '',
      code: 1,
      data: [
        {
          resultKey: 1,
          resultValue: '北京',
        },
        {
          resultKey: 2,
          resultValue: '山东',
        },
        {
          resultKey: 3,
          resultValue: '天津',
        },
      ],
    },
    city: {
      code: '1',
      message: '成功！',
      data: [
        {
          resultKey: 1,
          resultValue: '山西',
          children: [
            {
              resultKey: 1,
              resultValue: '临汾',
            },
          ],
        },
        {
          resultKey: 2,
          resultValue: '河北',
          children: [
            {
              resultKey: 12,
              resultValue: '邯郸',
            },
          ],
        },
      ],
    },
    organization: {
      message: '',
      code: 1,
      data: [
        {
          resultKey: 1,
          resultValue: '全部',
        },
        {
          resultKey: 2,
          resultValue: '学校—高中',
        },
        {
          resultKey: 3,
          resultValue: '学校—初中',
        },
        {
          resultKey: 4,
          resultValue: '机构',
        },
      ],
    },
    origin: {
      message: '',
      code: 1,
      data: [
        {
          resultKey: 1,
          resultValue: '渠道来源1',
        },
        {
          resultKey: 2,
          resultValue: '渠道来源2',
        },
        {
          resultKey: 3,
          resultValue: '渠道来源3',
        },
      ],
    },
    competitionGrade: {
      message: '',
      code: 1,
      data: [
        {
          resultKey: 1,
          resultValue: 'A',
        },
        {
          resultKey: 2,
          resultValue: 'B',
        },
        {
          resultKey: 3,
          resultValue: 'C',
        },
      ],
    },
    selfGrade: {
      message: '',
      code: 1,
      data: [
        {
          resultKey: 1,
          resultValue: 'A',
        },
        {
          resultKey: 2,
          resultValue: 'B',
        },
        {
          resultKey: 3,
          resultValue: 'C',
        },
      ],
    },
    examGrade: {
      message: '',
      code: 1,
      data: [
        {
          resultKey: 1,
          resultValue: 'A',
        },
        {
          resultKey: 2,
          resultValue: 'B',
        },
        {
          resultKey: 3,
          resultValue: 'C',
        },
      ],
    },
    signCeremony: {
      message: '',
      code: 1,
      data: [
        {
          resultKey: 1,
          resultValue: '当前没签约',
        },
        {
          resultKey: 2,
          resultValue: '当前签约',
        },
      ],
    },
    schoolLists: {
      message: '',
      code: 1,
      data: [
        {
          schoolId: 1,
          schoolName: '学校名称',
          schoolType: '学校（高中）',
          schoolOrigin: '合作',
          schoolModel: '集体观看',
          schoolAdmin: '小尖子',
          shoolIphone: '130000000001',
          schoolEnterTime: '2018.05.18',
          schoolHistory: '2',
          schoolCurrent: '是',
          schoolExpireTime: '2019.10.01',
          schoolCurrentTeacher: 5,
          schoolCurrentStudent: 10,
          schoolRecentlyConnect: '2019.10.01',
        },
      ],
    },
  });
};

export default { getBschoolLists, getBschoolList };
