const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Khởi tạo express app
const app = express();

// Thiết lập kết nối tới MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/DHT', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Lỗi kết nối tới MongoDB:'));
db.once('open', function() {
  console.log('Đã kết nối tới MongoDB!');
});

// Tạo schema cho bản ghi nhiệt độ và độ ẩm
const temperatureSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  timestamp: { type: Date, default: Date.now }
});

// Tạo model cho bản ghi nhiệt độ và độ ẩm
const Temperature = mongoose.model('Temperature', temperatureSchema);

// Sử dụng body-parser middleware để xử lý dữ liệu POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Định nghĩa route để lưu trữ bản ghi nhiệt độ và độ ẩm
app.post('/temperature', function(req, res) {
  const temperature = new Temperature(req.body);
  temperature.save(function(err) {
    if (err) return res.status(500).send(err);
    res.status(200).send('Đã lưu trữ nhiệt độ và độ ẩm!');
  });
});

// Định nghĩa route để lấy tất cả bản ghi nhiệt độ và độ ẩm
app.get('/', function(req, res) {
  res.send(req.query)
  console.log(req.query)
});

// Bắt đầu lắng nghe các yêu cầu từ ESP8266
app.listen(80, function() {
  console.log('Server đã bắt đầu lắng nghe trên cổng 80!');
});
