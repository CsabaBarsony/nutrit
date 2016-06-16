'use strict'

const http         = require('http'),
      fs           = require('fs'),
      path         = require('path'),
      contentTypes = require('./utils/content-types'),
      sysInfo      = require('./utils/sys-info'),
      env          = process.env;
	  
var mysql = require('mysql');
var urlParser = require('url');
var db;

if(!env.NODE_IP) {
	db = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'paleoketo'
	});
}
else {
	db = mysql.createConnection({
		host: '127.7.69.130',
		user: 'adminQKzlKgB',
		password: 'Z4e96cERn3P2',
		database: 'nutrit'
	});
} 

db.connect();

let server = http.createServer(function (req, res) {
  let url = req.url;
  if (url == '/') {
    url += 'index.html';
  }

  // IMPORTANT: Your application HAS to respond to GET /health with status 200
  //            for OpenShift health monitoring

  if (url == '/health') {
    res.writeHead(200);
    res.end();
  } else if (url.indexOf('/info/') == 0) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.end(JSON.stringify(sysInfo[url.slice(6)]()));
  }
  else if(/getfoods/.test(url)) {
	  var captures = url.match(/\?id=([^&]*)/);
	  var id = '';
	  if(captures && captures.length > 1) id = captures[1];
	  
	  if(id) {
			  db.query('select * from nutrients where food_group_id = \'' + id + '\'', function(err, rows) {
				  res.setHeader('Content-Type', 'application/json');
					res.setHeader('Cache-Control', 'no-cache, no-store');
				if(!err) {
					res.end(JSON.stringify(rows));
				}
				else {
					res.end('mysql error');
				}
			});
	  }	
  }
  else if(/postfood/.test(url)) {
	  var queryData = urlParser.parse(url, true).query;
	  
	  db.query('UPDATE `nutrients` SET' +
		'  `name` = \'' 					+ queryData.name +
		'\', `description` = \'' 			+ queryData.description +
		'\', `category` = \'' 				+ queryData.category +
		'\', `paleo` = \'' 					+ queryData.paleo +
		'\', `keto` = \'' 					+ queryData.keto +
		'\', `enabled` = \'' 				+ (queryData.enabled ? 1 : 0) +
		'\' WHERE `nutrients`.`id` = ' 		+ queryData.id +
		';', function(err) {
		if(err) {
			console.log(err);
			res.end('mysql error');
		}
		else {
			res.end(JSON.stringify());
		}
	});
  }
  else {
    fs.readFile('./public' + url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end();
      } else {
        let ext = path.extname(url).slice(1);
        res.setHeader('Content-Type', contentTypes[ext]);
        if (ext === 'html') {
          res.setHeader('Cache-Control', 'no-cache, no-store');
        }
        res.end(data);
      }
    });
  }
});

server.listen(env.NODE_PORT || 3001, env.NODE_IP || 'localhost', function () {
  console.log(`Application worker ${process.pid} started...`);
});
