// Atts: id, password, levels [1..*], cards [1..*], highscore
var db_user = new PouchDB('ANAR_USER');
// Atts: id, name, numPieces, time, difficulty
// Functions: getPieces(), getCardsOnWin(), getPoints()
var db_level = new PouchDB('ANAR_LEVEL2', function(err, result) {
    if (!err) {
        console.log('Database \'' + dbName + '\' opened');  // Happens when I first create 'Test'
    } else {
        console.log('Database \'' + dbName + '\' failed to open');  // Happens when I try to re-create 'Test'
    }
});
// Atts: id, name, image, description
var db_card = new PouchDB('ANAR_CARD');

/*PouchDB.destroy('ANAR_LEVEL', function(err, info) { 
    console.log(err);
});*/

function destroy() {
        /*PouchDB.destroy('ANAR_CARD').then(function () {
          console.log('after destroy()');
        }).catch(function (err) {
          console.log('destroy err=' + err);
        });*/
      }

/*
 * User module
 */

function DBregisterUser(id, password, callback) {
  
  var user = {
    _id: id,
    password: password,
    highscore: 0,
    levels: ["1"],
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
    // Atts: id, name, numPieces, time, difficulty
    function DBCreateLevels() {
        var level = {};

        for (var i = 0; i < 30; i++) {
            if (i < 10)
                level = {_id : i.toString(), name : 'Nivel ' + i, numPieces : 10, time : '120', difficulty : 'easy'};
            else if (i < 20) 
                level = {_id : i.toString(), name : 'Nivel ' + i, numPieces : 20, time : '60', difficulty : 'medium'};
            else
                level = {_id : i.toString(), name : 'Nivel ' + i, numPieces : 30, time : '30', difficulty : 'hard'};

            db_level.put(level);
        }
    }

    /* Gets the user levels. */
    function DBGetLevelsByUser(user_id, callback) {
        db_user.get(user_id, function (err, user) {
            if (err)
                return callback(err, null);

            db.allDocs({keys: user.levels}, function(err, response) {
                callback(err, response);
            });
        });
    }

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
