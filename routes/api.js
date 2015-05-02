/*
 * Serve JSON to our AngularJS client
 */

var cps = require('cps-api')
var crypto = require('crypto')

var conn = new cps.Connection('tcp://cloud-us-0.clusterpoint.com:9007', 'docs', 'luigibertaco@gmail.com', 'unsecurePass123', 'document', '//document/id', {account: 100091});

var net = require('net');

var HOST = '52.24.10.214';
var PORT = 3000;

// GET

exports.posts = function (req, res) {
  var posts = [];
  var search = new cps.SearchRequest('*',0,99999)
  conn.sendRequest(search, function(err, resp){
    if (err){
      return console.error(err)
    }else{
      if(resp.results){
        posts = resp.results.document
      }else{
        posts = []
      }
    }
    res.json({
      posts: posts
    });
  })
};

exports.post = function (req, res) {
  var search = new cps.SearchRequest(cps.Term(req.params.id, "id"))
  conn.sendRequest(search, function(err, resp){
    if (err) return console.error(err)
    if(resp.results){
      res.json({
        post: resp.results.document[0]
      });
    } else {
      res.json(false);
    }
  })
};

// POST

exports.addPost = function (req, res) {
  var client = new net.Socket();
  var json = { "request":"add","obj": req.body }
  client.connect(PORT, HOST, req, function() {
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
    client.write(JSON.stringify(json));
    res.json(req.body);
  });
};

// PUT

exports.editPost = function (req, res) {
  var client = new net.Socket();
  req.body.id = req.params.id;
  var json = { "request":"edit","obj": req.body }
  client.connect(PORT, HOST, req, function() {
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
    client.write(JSON.stringify(json));
    res.json(req.body);
  });
  // req.body.id = req.params.id;
  // var  upd = new cps.UpdateRequest(req.body)
  // conn.sendRequest(upd, function(err, resp){
  //   if (err)
  //     res.json(err)
  //   else
  //     res.json(req.body);
  // })
};

// DELETE

exports.deletePost = function (req, res) {
  var client = new net.Socket();
  req.body.id = req.params.id;
  var json = { "request":"delete","obj": req.body }
  client.connect(PORT, HOST, req, function() {
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
    client.write(JSON.stringify(json));
    res.json(true);
  });
  // req.body.id = req.params.id;
  // var  del = new cps.DeleteRequest(req.body)
  // conn.sendRequest(del, function(err, resp){
  //   if (err)
  //     res.json(err)
  //   else
  //     res.json(true)
  // })
};

exports.auth = function (req, res){
  var query = cps.Term(req.body.person, "person") + cps.Term(req.body.device, "door") + "~"+cps.Term("true", "taked")
  console.log(query)
  var search = new cps.SearchRequest(query,0,99999)
  conn.sendRequest(search, function(err, resp){
    if (err){
      return console.error(err)
    }else{
      if(resp.results){
        var client = new net.Socket();
        resp.results.document[0].taked = true;
        var json = { "request":"edit","obj": resp.results.document[0] }
        client.connect(PORT, HOST, req, function() {
          // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
          client.write(JSON.stringify(json));
        });
        res.json(true)
      }else{
        res.json(false)
      }
    }
  })
}
