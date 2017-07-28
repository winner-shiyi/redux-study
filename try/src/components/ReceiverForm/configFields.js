import addr from '../../../public/mock/addr.json'
export const fields = [{
    'label': '商家名称',
    'name': 'gardenId',
    'required': true,
    // 'simple': true,
    // 'long': true,
  },
  {
    'label': '联系人',
    'name': 'name',
    'required': true,
    // 'long': true,
    // 'simple': true,
    'max': 20
  },
  {
    'label': '联系电话',
    'name': 'phone',
    'required': true,
    // 'long': true,
    // 'simple': true,
    'phone': true
  },
  {
    'label': '送达时间',
    'name': 'loginName',
    'required': true,
    'type': 'dateRange',
    // 'long': true,
    // 'simple': true,
    'max': 50
  },
  {
    'label': '收货地区',
    'required': true,
    'name': 'pwd',
    'type': 'Cascader',
    'data': addr,
    'changeOnSelect': 'true', // 每选择一项就会马上改变
    // 'long': true,
    // 'simple': true,
  },
  {
    'label': '详细地址',
    'name': 'streetAdress',
    'required': true,
    'type': 'textarea',
    // 'long': true,
    // 'simple': true,
    'max': 50
  },
]
