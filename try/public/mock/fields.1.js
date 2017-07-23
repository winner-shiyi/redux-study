export const fields = [
    {
        "action":fn(),
        "label": "所属园区",
        "name": "gardenId",
        "required": true,
        "simple": true,
        "long": true,
        "type": "select",
        "valueName": "id",
        "displayName": "name",
        "page": {
            "data": [],
            "loading": false
        }
    },
    {
        "label": "角色权限",
        "name": "roleId",
        "required": true,
        "long": true,
        "simple": true,
        "type": "select",
        "state": {
            "data": [],
            "loading": false,
            "lastFetch": 0
        },
        "valueName": "id",
        "displayName": "name"
    },
    {
        "label": "姓名",
        "name": "name",
        "required": true,
        "long": true,
        "simple": true,
        "max": 20
    },
    {
        "label": "电话",
        "name": "phone",
        "required": true,
        "long": true,
        "simple": true,
        "phone": true
    },
    {
        "label": "账号",
        "name": "loginName",
        "required": true,
        "long": true,
        "simple": true,
        "max": 50
    },
    {
        "label": "默认初始密码",
        "name": "pwd",
        "long": true,
        "simple": true,
        "initialValue": "123456",
        "disabled": true
    }
]