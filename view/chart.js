import * as echarts from 'echarts';

var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom);
var option;

async function getData() {
  const database = client.db("sensordata");
  const dht22 = database.collection("dht22");
  const result = await dht22.find({}).sort({_id: -1}).limit(1).toArray()
  return result;
}
let result = await getData()
console.log(result[0])

let data1 = [];
let data2 = [];
data1.push(result[0].nhietdo);
data2.push(result[0].doam);

option = {
  title: {
    text: 'Dynamic Data & Time Axis'
  },
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      params = params[0];
      return (
        result.date +
        ' : ' +
        result.nhietdo
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
      data: data1
    }
  ]
};
setInterval(function () {
  for (var i = 0; i < 5; i++) {
    data1.shift();
    data1.push(result[0].nhietdo);
  }
  myChart.setOption({
    series: [
      {
        data: data1
      }
    ]
  });
}, 1000);

option && myChart.setOption(option);
