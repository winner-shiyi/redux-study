const Transformer = {
  transform: function(array) {
    if (Array.isArray(array)) {
      array = array.map(function(item) {
        if (item.children) {
          item.children = Transformer.transform(item.children);
        }

        // swap label and value field
        let tmp = item.label;
        item.label = item.value;
        item.value = tmp;
        return item;
      });

      return array;
    }
  },
  test: function() {
    const array = [
      {
        label: 'label1',
        value: 'value1',
        children: [
          {
            label: 'c-label1',
            value: 'c-value1',
            children: [],
          },
        ],
      },
    ];

    console.log(JSON.stringify(Transformer.transform(array)));
  },
  parse: function() {
    let addrArray = require('./public/mock/addr.json');
    let fs = require('fs');
    let path = require('path');

    fs.writeFile(path.join(__dirname, 'output.json'), JSON.stringify(Transformer.transform(addrArray)), function(err) {
      if (err) throw err;
      console.log('Output file has been successfully written');
    });

    return Transformer.transform(addrArray);
  }
};

let result = Transformer.parse();
module.exports = Transformer;