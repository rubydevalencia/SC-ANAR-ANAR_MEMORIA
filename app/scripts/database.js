var db = new PouchDB('ANAR');

/*
 * User module
 */

function registerUser(id, password) {
  
  var user = {
    _id: id,
    password: password
  };

  db.put(user, function callback(err, result) {
    if (!err) {
      console.log('Successfully added a user');
    }
  });
}

function DBloginUser(id, password, callback) {
  db.get(id).then(function (doc) {
      if (doc.password == password)
        callback(200);
      else
        callback(401);
  }).catch(function (err) {
    callback(err.status);
  });
}