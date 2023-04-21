const { MongoClient } = require('mongodb');
const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url);

var dom = document.getElementById('chart-container');
var myChart = echarts.init(dom, null, {
  renderer: 'canvas',
  useDirtyRect: false
});
var app = {};

var option;

let sensordht = [];
async function getData() {
  const database = client.db("sensordata");
  const dht22 = database.collection("dht22");
  const result = await dht22.find({}).sort({_id: -1}).limit(1).toArray()
  return result;
}
let result = await getData();
for (var i = 0; i < 1000; i++) {
    sensordht.push(result[0].nhietdo);
}
let valuetemp = result[0].nhietdo;

option = {
  title: {
    text: 'Dynamic Data & Time Axis'
  },
  tooltip: {
    trigger: 'axis',
    formatter: function () {
      return (
          result[0].date +
          ' : ' +
          valuetemp
      );
    },
    axisPointer: {
      animation: false
    }
  },
  xAxis: {
    type: 'time',
    splitLine: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%'],
    splitLine: {
      show: false
    }
  },
  series: [
    {
      name: 'Temperature',
      type: 'line',
      showSymbol: false,
      data: sensordht
    }
  ]
};
setInterval(function () {
  for (var i = 0; i < 5; i++) {
    sensordht.shift();
    sensordht.push(result[0].nhietdo);
  }
  myChart.setOption({
    series: [
      {
        data: sensordht
      }
    ]
  });
}, 1000);

if (option && typeof option === 'object') {
  myChart.setOption(option);
}

window.addEventListener('resize', myChart.resize);
