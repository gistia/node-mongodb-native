var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');

var script = [
  'CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT);',
  'CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path);',
];

function add(name, type, path) {
  script.push('INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES (\'' +
    name + '\', \'' +
    type + '\', \'' +
    path + '\');');
};

function parse(file) {
  var source = path.join('..', 'public', 'api', file);
  var html = fs.readFileSync(source, 'utf8');
  var $ = cheerio.load(html);

  var className = $('header h2').text().trim();
  add(className, 'Class', 'api/' + className + '.html');

  var iter = function(col, callback) {
    for (var i = 0; i < col.length; i++) {
      callback(col[i]);
    }
  };

  var itemName = className;
  var types = $('.item[data-name=' + itemName + '] ul.typedefs li');
  var methods = $('.item[data-name=' + itemName + '] ul.methods li');
  var events = $('.item[data-name=' + itemName + '] ul.events li');

  var parse = function(type, item) {
    var name = item.attribs['data-name'];
    var path = 'api/' + $('a', item)[0].attribs['href'];
    return add(name, type, path);
  }

  iter(types,   function(item) { parse('Type',   item) });
  iter(methods, function(item) { parse('Method', item) });
  iter(events,  function(item) { parse('Event',  item) });
};

var apiPath = path.join('..', 'public', 'api');
fs.readdirSync(apiPath).forEach(function(file) {
  if (file[0] !== file[0].toUpperCase()) {
    return;
  }
  parse(file);
});

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('node-mongodb-native.docset/Contents/Resources/docSet.dsidx');

db.serialize(function() {
  script.forEach(function(line) { db.run(line); });
});

db.close();
