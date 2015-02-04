var db = new PouchDB('ANAR');

/*
 * User module
 */

function DBregisterUser(id, password, callback) {
  
  var user = {
    _id: id,
    password: password
    // TTODO add rest
  };

  db.put(user).then(function (result) {
    callback(200);
  }).catch(function (err) {
    callback(err.status);
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