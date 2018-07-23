import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    // studentName: `高思教育 ${i}`,
    // studentIphone: 130000000001,
    // attendSchool: '学校（高中）',
    // belongTOSchool: '合作',
    // // signTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),,
    // trialAccount: 1,
    // studentOrigin: '活动',
    // highestAward: '省一',
    // selfRecruit: '/',

    // graduatePlace: '清华',
    // coursesNumber: 12,
    // historyCourses: 12,

    // currentReading: '是',
    // compeleteCoursesRate: '15%',
    // latestLoginTime: '2018.05.18',
    // studentStatus: '禁用',
    studentId: i,
    studentName: '小爱同学',
    mobile: '135678993211',
    attendSchool: '人大附中',
    belongSchool: '北京四中',
    registerTime: 1529475466000,
    tryFlag: 0,
    studentOrigin: '活动',
    highestAward: '省一',
    selfRecruit: '',
    graduatePlace: '清华',
    coursesNumber: 5,
    historyOverPercent: 0.4,
    currentReading: 1,
    nowOverPercent: 0.2,
    latestLoginTime: 1529475466000,
    studentStatus: 0,
  });
}

function getCoach(req, res, u) {
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

export const getBcStudentlList = {
  querySearchData: getCoach,
  basicInfo: (req, res) => {
    res.json({
      code: '1',
      message: '成功！',
      data: {
        studentName: '1234',
        contactMode: '18045008979',
        signTime: 18045008979,
        trialAccount: 0,
        studentOrigin: '学校-结构',
        provice: '山西',
        city: '临汾市',
        attendSchool: '北京一中',

        schoolProvice: '山西一中',
        schoolOrganization: '学校高中',
        signCeremony: 1,
        highestAward: '省一',
        selfRecruit: '/',
        graduatePlace: '清华',
      },
    });
  },
  connectRecord: (req, res) => {
    res.json({
      code: '1',
      message: '成功！',
      data: {
        result: [
          {
            time: 199450089792,
            peopleName: '家属',
            detail: 'sdfasdfadsfasdfafasfdsadfadsfadsfasdfsafdasdf',
          },
          {
            time: 199450089791,
            peopleName: '家属',
            detail: 'sdfasdfadsfasdfafasfdsadfadsfadsfasdfsafdasdf',
          },
          {
            time: 199450089793,
            peopleName: '家属',
            detail: 'sdfasdfadsfasdfafasfdsadfadsfadsfasdfsafdasdf',
          },
          {
            time: 199450089794,
            peopleName: '家属',
            detail: 'sdfasdfadsfasdfafasfdsadfadsfadsfasdfsafdasdf',
          },
        ],
      },
    });
  },
  purchaseClass: (req, res) => {
    res.json({
      code: '1',
      message: '成功！',
      data: {
        total: 101,
        part: 33,
        result: [
          {
            time: '2017-12-231 ',
            school: '爱尖子杯夏令营',
            class: '线上课程',
            detail: [
              {
                subjectId: 1,
                subjectName: '初一数学',
                startTime: 18045008979,
                endTime: 19945008979,
                expire: 1,
              },
              {
                subjectId: 2,
                subjectName: '初一数学',
                startTime: 18045008979,
                endTime: 19945008979,
                expire: 1,
              },
            ],
          },
          {
            time: '2017-12-2311 ',
            school: '爱尖子杯夏令营',
            class: '线上课程',
            detail: [
              {
                subjectId: 1,
                subjectName: '初一数学',
                startTime: 18045008979,
                endTime: 19945008979,
                expire: 1,
              },
              {
                subjectId: 2,
                subjectName: '初一数学',
                startTime: 18045008979,
                endTime: 19945008979,
                expire: 1,
              },
            ],
          },
          {
            time: '2017-12-2311',
            school: '爱尖子杯夏令营',
            class: '线上课程',
            detail: [
              {
                subjectId: 1,
                subjectName: '初一数学',
                startTime: 18045008979,
                endTime: 19945008979,
                expire: 1,
              },
              {
                subjectId: 2,
                subjectName: '初一数学',
                startTime: 18045008979,
                endTime: 19945008979,
                expire: 1,
              },
            ],
          },
          {
            time: '2017-12-23121 ',
            school: '爱尖子杯夏令营',
            class: '线上课程',
            detail: [
              {
                subjectId: 1,
                subjectName: '初一数学',
                startTime: 18045008979,
                endTime: 19945008979,
                expire: 1,
              },
              {
                subjectId: 2,
                subjectName: '初一数学',
                startTime: 18045008979,
                endTime: 19945008979,
                expire: 1,
              },
            ],
          },
        ],
      },
    });
  },
  activityRecord: (req, res) => {
    res.json({
      code: '1',
      message: '成功！',
      data: {
        result: [
          {
            time: 199450089792,
            peopleName: '家属',
            detail: 'sdfasdfadsfasdfafasfdsadfadsfadsfasdfsafdasdf',
          },
          {
            time: 199450089791,
            peopleName: '家属',
            detail: 'sdfasdfadsfasdfafasfdsadfadsfadsfasdfsafdasdf',
          },
          {
            time: 199450089793,
            peopleName: '家属',
            detail: 'sdfasdfadsfasdfafasfdsadfadsfadsfasdfsafdasdf',
          },
          {
            time: 199450089794,
            peopleName: '家属',
            detail: 'sdfasdfadsfasdfafasfdsadfadsfadsfasdfsafdasdf',
          },
        ],
      },
    });
  },
  courseData: (req, res) => {
    res.json({
      code: '1',
      message: '成功！',
      data: {
        teacherName: '刘老师',
        coachName: '刘教练',
        result: [
          {
            time: 199450089792,
            peopleName: '家属',
            detail: 'sdfasdfadsfasdfafasfdsadfadsfadsfasdfsafdasdf',
          },
          {
            time: 199450089791,
            peopleName: '家属',
            detail: 'sdfasdfadsfasdfafasfdsadfadsfadsfasdfsafdasdf',
          },
          {
            time: 199450089793,
            peopleName: '家属',
            detail: 'sdfasdfadsfasdfafasfdsadfadsfadsfasdfsafdasdf',
          },
          {
            time: 199450089794,
            peopleName: '家属',
            detail: 'sdfasdfadsfasdfafasfdsadfadsfadsfasdfsafdasdf',
          },
        ],
      },
    });
  },
};
export default { getBcStudentlList };
