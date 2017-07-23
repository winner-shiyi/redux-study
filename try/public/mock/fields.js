export const fields = {
    "send":[
        {
            "label": "商家名称",
            "name": "gardenId",
            "required": true,
            "simple": true,
            "long": true,
            "type": "AutoComplete",
            "valueName": "id",
            "displayName": "name",
            "state": {
                "data": [],
                "loading": false,
                "lastFetch": 0
            },
            "valueName": "id",
            "displayName": "name"
        },
        {
            "label": "联系人",
            "name": "name",
            "required": true,
            "long": true,
            "simple": true,
            "max": 20
        },
        {
            "label": "联系电话",
            "name": "phone",
            "required": true,
            "long": true,
            "simple": true,
            "phone": true
        },
        {
            "label": "用车时间",
            "name": "loginName",
            "required": true,
            "type":"date",
            "long": true,
            "simple": true,
            "max": 50
        },
        {
            "label": "发货地区",
            "required": true,
            "name": "pwd",
            "type":"Cascader",
            "data":[{
                value: 'zhejiang',
                label: 'Zhejiang',
                children: [{
                    value: 'hangzhou',
                    label: 'Hangzhou',
                    children: [{
                    value: 'xihu',
                    label: 'West Lake',
                    }],
                }],
                }, {
                value: 'jiangsu',
                label: 'Jiangsu',
                children: [{
                    value: 'nanjing',
                    label: 'Nanjing',
                    children: [{
                    value: 'zhonghuamen',
                    label: 'Zhong Hua Men',
                    }],
                }],
            }],
            "changeOnSelect":"true", // 每选择一项就会马上改变
            "long": true,
            "simple": true,
        },
        {
            "label": "详细地址",
            "name": "streetAdress",
            "required": true,
            "type":"textarea",
            "long": true,
            "simple": true,
            "max": 50
        }
    ],
    "get":[]
}