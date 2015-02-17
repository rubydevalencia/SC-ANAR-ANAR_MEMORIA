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
    callback(err.status);
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
    callback(db_user.put(doc));
  
  }).catch(function (err) {
    console.log(err);
  });
}

function DBaddUserLevel(id, lvl_id){
  db_user.get(id).then(function (doc) {
    doc.levels.push(lvl_id);
    doc.levels.sort(function(a, b){return a-b});

    callback(db_user.put(doc));
  
  }).catch(function (err) {
    callback(err.status);
  });
}

function DBgetUserLevelsIds(id, callback) {
  db_user.get(id).then(function (doc) {
    callback(doc.levels);
  
  }).catch(function (err) {
    callback(err.status);
  });
}

function DBaddUserCard(id, card_id, callback){
  db_user.get(id).then(function (doc) {
    doc.levels.push(card_id);
    doc.levels.sort();
    callback(db_user.put(doc));
  
  }).catch(function (err) {
    callback(err.status);
  });
}

function DBgetUserCardsIds(id, callback) {
  db_user.get(id).then(function (doc) {
    callback(doc.cards);
  
  }).catch(function (err) {
    callback(err.status);
  });
}

/*
 * End User module
 */

/*
 * Level module
 */

function DGgetLevel(id) {
  db_level.get(id).then(function (doc) {
    callback(doc);
  
  }).catch(function (err) {
    callback(err.status);
  });
}

// Have to assign the proper start and end keys, depends on the lvl in the DB
function DBgetLevelsByDifficulty(difficulty) {
  if (difficulty == 'easy') {
    result = db_level.allDocs({startkey : 'easy1', endkey : 'easy10', include_docs: true});
  } else if (difficulty == 'medium') {
    result = db_level.allDocs({startkey : 'medium1', endkey : 'medium10', include_docs: true});
  } else if (difficulty == 'hard') {
    result = db_level.allDocs({startkey : 'hard1', endkey : 'hard10', include_docs: true});
  };

  return result;
}

/*
 * End Level module
 */

/*
 * Card module
 */

/*
 * End Card module
 */
