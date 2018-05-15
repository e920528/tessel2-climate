# tessel2-climate

## 簡介
本專案是利用tessel2與官方的climate module實作，並利用node.js與express.js寫一個web server把數據顯示到網頁上

## 系統架構
```JavaScript
// tessel
var tessel = require('tessel');

//require climate module
var climatelib = require('climate-si7020');
//plug climate module in portA
var climate = climatelib.use(tessel.port['A']);
```
引入tessel模組與官方climate module於portA
```JavaScript
//http
var http = require('http');

// Require two other core Node.js modules
var fs = require('fs');
var url = require('url');

//Use express
var express = require('express');
var app = express();
```
引入webserver所需模組與express.js
```JavaScript
//use ejs
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//set views path
app.set('views',__dirname + '/views');
// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.render('index.ejs',{T:viewTemperature, H:viewHumidity});
});
```
為了能將後端variable傳到前端網頁顯示，本專案使用`res.render()`方法與`ejs`格式來實現</br>
有別於`res.sendFile()`只能傳送固定的靜態網頁，`res.render()`可以傳送一個網頁模板(存於`/views`資料夾中的`ejs`檔案)</br>
並傳入變數到該模板中以抽換其中某些內容，本專案利用此方法來傳送溫度與濕度資料到前端網頁顯示

```JavaScript
 Temperature:<%if (T>30){%> <span id="temperature" style="color:red"><%=T%>℃</span>
                  <%}else if(H<15){%> <span id="temperature" style="color:blue"><%=T%>℃</span>
                  <%}%>
```
```JavaScript
Humidity: <%if (H>85){%> <span id="humidity" style="color:aqua"><%=H%></span>
                <%}else if(H<30){%> <span id="humidity" style="color:brown"><%=H%></span>
                <%}%> 
```
利用`ejs`格式的另外一個功能，在模板中加入簡單的邏輯判斷，以根據不同資料使用不同的樣式
```HTML
<meta http-equiv="refresh" content="10" />
```
定期(每10秒)刷新網頁以更新顯示溫度與濕度數值
