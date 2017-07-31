import addr from '../../../public/mock/addr2.json'
export const fields = [
    {
      'label': '商家名称',
      'name': 'shopName',
      'required': true,
      // 'type': 'select',
      'dataSource': ['rrrr', 'dddd'],
      // 'data': [['1', '发货商家1'], ['2', '发货商家2']],
    },
    {
      'label': '联系人',
      'name': 'userName',
      'required': true,
      'max': 20,
    },
    {
      'label': '联系电话',
      'name': 'phone',
      'required': true,
      'phone': true,
    },
    {
      'label': '用车时间',
      'name': 'drivingTime',
      'required': false,
      'type': 'datetime',
      // 'max': 50, todo 时间需要怎么限制
    },
    {
      'label': '发货地区',
      'required': true,
      'name': 'region',
      'type': 'Cascader',
      'data': addr,
      'changeOnSelect': 'true', // 每选择一项就会马上改变
    },
    {
      'label': '详细地址',
      'name': 'addressDetail',
      'required': true,
      'type': 'textarea',
      'max': 50,
    },
]
