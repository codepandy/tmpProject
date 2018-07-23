import { parse } from 'url';

export function getAcount(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;

  let dataSource = [
    {
      id: '10001',
      name: '张老师',
      mobile: '15801510223',
      department: '产品研发部',
      role: '管理员、录分员',
      status: '0',
      createTime: '2013-02-12',
      lastLoginTime: '2018-06-15',
    },
    {
      id: '10002',
      name: '王老师',
      mobile: '15801532123',
      department: '教学产品部',
      role: '主讲老师',
      status: '0',
      createTime: '2013-02-12',
      lastLoginTime: '2018-06-15',
    },
    {
      id: '10003',
      name: '刘老师',
      mobile: '15801532123',
      department: '教学产品部',
      role: '主讲老师',
      status: '0',
      createTime: '2013-02-12',
      lastLoginTime: '2018-06-15',
    },
    {
      id: '10004',
      name: '孙老师',
      mobile: '15801532123',
      department: '教学产品部',
      role: '主讲老师',
      status: '0',
      createTime: '2013-02-12',
      lastLoginTime: '2018-06-15',
    },
    {
      id: '10005',
      name: '钱老师',
      mobile: '15801532123',
      department: '教学产品部',
      role: '主讲老师',
      status: '1',
      createTime: '2013-02-12',
      lastLoginTime: '2018-06-15',
    },
    {
      id: '10006',
      name: '赵老师',
      mobile: '15801532123',
      department: '教学产品部',
      role: '主讲老师',
      createTime: '2013-02-12',
      lastLoginTime: '2018-06-15',
    },
    {
      id: '10007',
      name: '李老师',
      mobile: '15801532123',
      department: '教学产品部',
      role: '主讲老师',
      status: '1',
      createTime: '2013-02-12',
      lastLoginTime: '2018-06-15',
    },
    {
      id: '10008',
      name: '张老师',
      mobile: '15801510223',
      department: '产品研发部',
      role: '管理员、录分员',
      status: '0',
      createTime: '2013-02-12',
      lastLoginTime: '2018-06-15',
    },
    {
      id: '10009',
      name: '王老师',
      mobile: '15801532123',
      department: '教学产品部',
      role: '主讲老师',
      status: '0',
      createTime: '2013-02-12',
      lastLoginTime: '2018-06-15',
    },
    {
      id: '10010',
      name: '刘老师',
      mobile: '15801532123',
      department: '教学产品部',
      role: '主讲老师',
      status: '0',
      createTime: '2013-02-12',
      lastLoginTime: '2018-06-15',
    },
    {
      id: '10011',
      name: '孙老师',
      mobile: '15801532123',
      department: '教学产品部',
      role: '主讲老师',
      status: '0',
      createTime: '2013-02-12',
      lastLoginTime: '2018-06-15',
    },
    {
      id: '10012',
      name: '钱老师',
      mobile: '15801532123',
      department: '教学产品部',
      role: '主讲老师',
      status: '1',
      createTime: '2013-02-12',
      lastLoginTime: '2018-06-15',
    },
    {
      id: '10013',
      name: '赵老师',
      mobile: '15801532123',
      department: '教学产品部',
      role: '主讲老师',
      createTime: '2013-02-12',
      lastLoginTime: '2018-06-15',
    },
    {
      id: '10014',
      name: '李老师',
      mobile: '15801532123',
      department: '教学产品部',
      role: '主讲老师',
      status: '1',
      createTime: '2013-02-12',
      lastLoginTime: '2018-06-15',
    },
    {
      id: '10015',
      name: '张老师',
      mobile: '15801510223',
      department: '产品研发部',
      role: '管理员、录分员',
      status: '0',
      createTime: '2013-02-12',
      lastLoginTime: '2018-06-15',
    },
    {
      id: '10016',
      name: '王老师',
      mobile: '15801532123',
      department: '教学产品部',
      role: '主讲老师',
      status: '0',
      createTime: '2013-02-12',
      lastLoginTime: '2018-06-15',
    },
    {
      id: '10017',
      name: '刘老师',
      mobile: '15801532123',
      department: '教学产品部',
      role: '主讲老师',
      status: '0',
      createTime: '2013-02-12',
      lastLoginTime: '2018-06-15',
    },
    {
      id: '10018',
      name: '孙老师',
      mobile: '15801532123',
      department: '教学产品部',
      role: '主讲老师',
      status: '0',
      createTime: '2013-02-12',
      lastLoginTime: '2018-06-15',
    },
    {
      id: '10019',
      name: '钱老师',
      mobile: '15801532123',
      department: '教学产品部',
      role: '主讲老师',
      status: '1',
      createTime: '2013-02-12',
      lastLoginTime: '2018-06-15',
    },
    {
      id: '10020',
      name: '赵老师',
      mobile: '15801532123',
      department: '教学产品部',
      role: '主讲老师',
      createTime: '2013-02-12',
      lastLoginTime: '2018-06-15',
    },
    {
      id: '10021',
      name: '李老师',
      mobile: '15801532123',
      department: '教学产品部',
      role: '主讲老师',
      status: '1',
      createTime: '2013-02-12',
      lastLoginTime: '2018-06-15',
    },
  ];

  if (params.fuzzy) {
    dataSource = dataSource.filter(
      item => item.name.indexOf(params.fuzzy) !== -1 || item.mobile.indexOf(params.fuzzy) !== -1
    );
  }
  const total = dataSource.length;

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
    const startIndex = (params.current - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    dataSource = dataSource.slice(startIndex, endIndex);
  }

  const result = {
    list: dataSource,
    pagination: {
      total,
      pageSize,
      current: parseInt(params.current, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getRole(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;

  let dataSource = [
    {
      id: '10001',
      roleName: '管理员',
      permissions: [
        { id: '1000001', name: '用户管理' },
        { id: '1000002', name: 'B端机构' },
        { id: '1000003', name: 'B端教练' },
        { id: '1000004', name: 'C端用户' },
        { id: '1000005', name: '教研管理' },
        { id: '1000006', name: '知识体系' },
        { id: '1000007', name: '内容素材' },
        { id: '1000008', name: '内容管理' },
        { id: '1000009', name: '权限管理' },
      ],
    },
    {
      id: '10002',
      roleName: '教研员',
      permissions: [
        { id: '1000005', name: '教研管理' },
        { id: '1000006', name: '知识体系' },
        { id: '1000007', name: '内容素材' },
        { id: '1000008', name: '内容管理' },
        { id: '1000009', name: '权限管理' },
      ],
    },
    {
      id: '10003',
      roleName: '营销人员',
      permissions: [
        { id: '1000001', name: '用户管理' },
        { id: '1000002', name: 'B端机构' },
        { id: '1000003', name: 'B端教练' },
        { id: '1000004', name: 'C端用户' },
      ],
    },
    {
      id: '10004',
      roleName: '管理员',
      permissions: [
        { id: '1000001', name: '用户管理' },
        { id: '1000002', name: 'B端机构' },
        { id: '1000003', name: 'B端教练' },
        { id: '1000004', name: 'C端用户' },
        { id: '1000005', name: '教研管理' },
        { id: '1000006', name: '知识体系' },
        { id: '1000007', name: '内容素材' },
        { id: '1000008', name: '内容管理' },
        { id: '1000009', name: '权限管理' },
      ],
    },
    {
      id: '10005',
      roleName: '教研员',
      permissions: [
        { id: '1000005', name: '教研管理' },
        { id: '1000006', name: '知识体系' },
        { id: '1000007', name: '内容素材' },
        { id: '1000008', name: '内容管理' },
        { id: '1000009', name: '权限管理' },
      ],
    },
    {
      id: '10006',
      roleName: '营销人员',
      permissions: [
        { id: '1000001', name: '用户管理' },
        { id: '1000002', name: 'B端机构' },
        { id: '1000003', name: 'B端教练' },
        { id: '1000004', name: 'C端用户' },
      ],
    },
    {
      id: '10007',
      roleName: '管理员',
      permissions: [
        { id: '1000001', name: '用户管理' },
        { id: '1000002', name: 'B端机构' },
        { id: '1000003', name: 'B端教练' },
        { id: '1000004', name: 'C端用户' },
        { id: '1000005', name: '教研管理' },
        { id: '1000006', name: '知识体系' },
        { id: '1000007', name: '内容素材' },
        { id: '1000008', name: '内容管理' },
        { id: '1000009', name: '权限管理' },
      ],
    },
    {
      id: '10008',
      roleName: '教研员',
      permissions: [
        { id: '1000005', name: '教研管理' },
        { id: '1000006', name: '知识体系' },
        { id: '1000007', name: '内容素材' },
        { id: '1000008', name: '内容管理' },
        { id: '1000009', name: '权限管理' },
      ],
    },
    {
      id: '10009',
      roleName: '营销人员',
      permissions: [
        { id: '1000001', name: '用户管理' },
        { id: '1000002', name: 'B端机构' },
        { id: '1000003', name: 'B端教练' },
        { id: '1000004', name: 'C端用户' },
      ],
    },
    {
      id: '10010',
      roleName: '管理员',
      permissions: [
        { id: '1000001', name: '用户管理' },
        { id: '1000002', name: 'B端机构' },
        { id: '1000003', name: 'B端教练' },
        { id: '1000004', name: 'C端用户' },
        { id: '1000005', name: '教研管理' },
        { id: '1000006', name: '知识体系' },
        { id: '1000007', name: '内容素材' },
        { id: '1000008', name: '内容管理' },
        { id: '1000009', name: '权限管理' },
      ],
    },
    {
      id: '10011',
      roleName: '教研员',
      permissions: [
        { id: '1000005', name: '教研管理' },
        { id: '1000006', name: '知识体系' },
        { id: '1000007', name: '内容素材' },
        { id: '1000008', name: '内容管理' },
        { id: '1000009', name: '权限管理' },
      ],
    },
    {
      id: '10012',
      roleName: '营销人员',
      permissions: [
        { id: '1000001', name: '用户管理' },
        { id: '1000002', name: 'B端机构' },
        { id: '1000003', name: 'B端教练' },
        { id: '1000004', name: 'C端用户' },
      ],
    },
    {
      id: '10013',
      roleName: '管理员',
      permissions: [
        { id: '1000001', name: '用户管理' },
        { id: '1000002', name: 'B端机构' },
        { id: '1000003', name: 'B端教练' },
        { id: '1000004', name: 'C端用户' },
        { id: '1000005', name: '教研管理' },
        { id: '1000006', name: '知识体系' },
        { id: '1000007', name: '内容素材' },
        { id: '1000008', name: '内容管理' },
        { id: '1000009', name: '权限管理' },
      ],
    },
    {
      id: '10014',
      roleName: '教研员',
      permissions: [
        { id: '1000005', name: '教研管理' },
        { id: '1000006', name: '知识体系' },
        { id: '1000007', name: '内容素材' },
        { id: '1000008', name: '内容管理' },
        { id: '1000009', name: '权限管理' },
      ],
    },
    {
      id: '10015',
      roleName: '营销人员',
      permissions: [
        { id: '1000001', name: '用户管理' },
        { id: '1000002', name: 'B端机构' },
        { id: '1000003', name: 'B端教练' },
        { id: '1000004', name: 'C端用户' },
      ],
    },
    {
      id: '10016',
      roleName: '管理员',
      permissions: [
        { id: '1000001', name: '用户管理' },
        { id: '1000002', name: 'B端机构' },
        { id: '1000003', name: 'B端教练' },
        { id: '1000004', name: 'C端用户' },
        { id: '1000005', name: '教研管理' },
        { id: '1000006', name: '知识体系' },
        { id: '1000007', name: '内容素材' },
        { id: '1000008', name: '内容管理' },
        { id: '1000009', name: '权限管理' },
      ],
    },
    {
      id: '10017',
      roleName: '教研员',
      permissions: [
        { id: '1000005', name: '教研管理' },
        { id: '1000006', name: '知识体系' },
        { id: '1000007', name: '内容素材' },
        { id: '1000008', name: '内容管理' },
        { id: '1000009', name: '权限管理' },
      ],
    },
    {
      id: '10018',
      roleName: '营销人员',
      permissions: [
        { id: '1000001', name: '用户管理' },
        { id: '1000002', name: 'B端机构' },
        { id: '1000003', name: 'B端教练' },
        { id: '1000004', name: 'C端用户' },
      ],
    },
  ];
  if (params.fuzzy) {
    dataSource = dataSource.filter(item => item.roleName.indexOf(params.fuzzy) !== -1);
  }
  const total = dataSource.length;
  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
    const startIndex = (params.current - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    dataSource = dataSource.slice(startIndex, endIndex);
  }

  const result = {
    list: dataSource,
    pagination: {
      total,
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

export function getMenu(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;

  let dataSource = [
    {
      id: '10001',
      name: '用户管理',
      subMenu: [
        { id: '1000002', name: 'B端机构' },
        { id: '1000003', name: 'B端教练' },
        { id: '1000004', name: 'C端用户' },
      ],
    },
    {
      id: '10002',
      name: '教研管理',
      subMenu: [
        { id: '1000006', name: '知识体系' },
        { id: '1000007', name: '内容素材' },
        { id: '1000008', name: '内容管理' },
      ],
    },
    {
      id: '10003',
      name: '权限管理',
      subMenu: [
        { id: '1000009', name: '账号管理11' },
        { id: '1000010', name: '角色管理' },
        { id: '1000011', name: '权限设置' },
      ],
    },
  ];
  if (params.fuzzy) {
    dataSource = dataSource.filter(item => item.roleName.indexOf(params.fuzzy) !== -1);
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

export function getUserMenu(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const dataSource = ['1000002', '1000003', '1000011'];

  const result = {
    id: '10001',
    name: '张三',
    roleMenuIds: dataSource,
  };
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}
