// Atts: id, password, levels [1..*], cards [1..*], highscore
var db_user = new PouchDB('ANAR_USER');
// Atts: id, name, numPieces, time, difficulty
// Functions: getPieces(), getCardsOnWin(), getPoints()
var db_level = new PouchDB('ANAR_LEVEL');
// Atts: id, name, image, description
var db_card = new PouchDB('ANAR_CARD');

/*
 * User module
 */

function DBregisterUser(id, password, callback) {
  
  var user = {
    _id: id,
    password: password,
    highscore: 0,
    levels: [],
    cards: [] 
  };

  db_user.put(user).then(function (result) {
    callback(200);
  
  }).catch(function (err) {
    callback(err.status);
  });
}

function DBloginUser(id, password, callback) {
  db_user.get(id).then(function (doc) {
      if (doc.password == password)
        callback(200);
      else
        callback(401);
  
  }).catch(function (err) {
    callback(err.status);
  });
}

function DBgetUserHighscore(id, callback) {
  db_user.get(id).then(function (doc) {
    callback(doc.highscore);
  
  }).catch(function (err) {
    consol.log(err);
  });
}

function DBsetUserHighscore(id, new_highschore) {
  db_user.get(id).then(function (doc) {
    doc.highscore = new_highschore;
    db_user.put(doc);

  }).catch(function (err) {
    console.log(err);
  });
}

function DBaddScoreToUserHighscore(id, score) {
  db_user.get(id).then(function (doc) {
    doc.highscore += score;
    return db_user.put(doc);
  
  }).catch(function (err) {
    console.log(err);
  });
}

function DBaddUserLevel(id, lvl_id){
  db_user.get(id).then(function (doc) {
    doc.levels.push(lvl_id);
    doc.levels.sort(function(a, b){return a-b});

    return db_user.put(doc);
  
  }).catch(function (err) {
    console.log(err);
  });
}

function DBgetUserLevelsIds(id, callback) {
  db_user.get(id).then(function (doc) {
    callback(doc.levels);
  
  }).catch(function (err) {
    console.log(err);
  });
}

/*
 * End User module
 */

/*
 * Level module
 */

/*
 * End Level module
 */

/*
 * Card module
 */

/*
 * End Card module
 */
