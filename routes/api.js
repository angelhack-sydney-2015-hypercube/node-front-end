/*
 * Serve JSON to our AngularJS client
 */

 var cps = require('cps-api')
 var crypto = require('crypto')

 var conn = new cps.Connection('tcp://cloud-us-0.clusterpoint.com:9007', 'docs', 'luigibertaco@gmail.com', 'unsecurePass123', 'document', '//document/id', {account: 100091});

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
  req.body.id = crypto.randomBytes(20).toString('hex');
  var insert_req = new cps.InsertRequest(req.body);
  conn.sendRequest(insert_req, function (err, list_resp) {
    if (err) return console.error(err); // Handle error
    res.json(req.body);
  });
};

// PUT

exports.editPost = function (req, res) {
  req.body.id = req.params.id;
  var  upd = new cps.UpdateRequest(req.body)
  conn.sendRequest(upd, function(err, resp){
    if (err)
      res.json(err)
    else
      res.json(req.body);
  })
};

// DELETE

exports.deletePost = function (req, res) {
  req.body.id = req.params.id;
  var  del = new cps.DeleteRequest(req.body)
  conn.sendRequest(del, function(err, resp){
    if (err)
      res.json(err)
    else
      res.json(true)
  })
};
