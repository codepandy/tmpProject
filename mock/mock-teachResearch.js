import { parse } from 'url';

export function queryKnowledgeTarget(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;

  let dataSource = [
    {
      title: '三角形',
      key: '1-0-0-1',
      type: '0',
      children: [
        {
          title: '勾股定理',
          key: '1-0-0-1-1',
          children: [
            { title: '直角三角形', key: '1-0-0-1-1-1' },
            { title: '三角形直角', key: '1-0-0-1-1-2' },
          ],
        },
        { title: '三角函数', key: '1-0-0-1-2' },
        { title: '正弦函数', key: '1-0-0-1-3' },
      ],
    },
    {
      title: '正方形',
      key: '1-0-0-2',
      type: '0',
      children: [
        { title: '勾股定理', key: '1-0-0-2-1' },
        { title: '三角函数', key: '1-0-0-2-2' },
        { title: '正弦函数', key: '1-0-0-2-3' },
      ],
    },
    {
      title: '梯形',
      key: '1-0-0-3-0',
      type: '0',
      children: [{ title: '多边形', key: '1-0-0-3-1-2' }, { title: '梯形2', key: '1-0-0-1-3-3' }],
    },
    {
      title: '宇宙第一定律',
      key: '1-0-0-3',
      type: '1',
    },
    {
      title: '宇宙第二定律',
      key: '1-0-0-4',
      type: '1',
    },
    {
      title: '宇宙第三定律',
      key: '1-0-0-5',
      type: '1',
      children: [{ title: '杠杆定律', key: '1-0-0-5-1' }, { title: '加速度', key: '1-0-0-5-2' }],
    },
    {
      title: '爱因斯坦相对论',
      key: '1-0-0-6',
      type: '2',
    },
    {
      title: '狭义相对论',
      key: '1-0-0-7',
      type: '2',
      children: [{ title: '杠杆定律', key: '1-0-0-7-1' }, { title: '加速度', key: '1-0-0-7-2' }],
    },
  ];

  if (params.targetType) {
    dataSource = dataSource.filter(data => data.type === params.targetType);
  }

  const result = dataSource;

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function sourceList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;

  const dataSource = [
    {
      id: 1,
      sourceType: {
        id: 1,
        name: '试卷',
      },
      year: 2017,
      name: '第三届爱尖子杯',
      author: {
        id: 1,
        name: '刘老师',
      },
      createTime: '2017-12-12',
      updateTime: '2017-12-12',
      creator: {
        id: 1,
        name: '马老师',
      },
    },
    {
      id: 2,
      sourceType: {
        id: 2,
        name: '书籍',
      },
      year: 2017,
      name: '第三届爱尖子杯',
      author: {
        id: 1,
        name: '刘老师',
      },
      createTime: '2017-12-12',
      updateTime: '2017-12-12',
      creator: {
        id: 1,
        name: '马老师',
      },
    },
  ];

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }
  const result = {
    data: dataSource,
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
