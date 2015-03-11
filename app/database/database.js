// Atts: id, password, levels [1..*], cards [1..*], highscore
var db_user = new PouchDB('ANAR_USER');
// Atts: id, name, numPieces, time, difficulty, imageName
// Functions: getPieces(), getCardsOnWin(), getPoints()
var db_level = new PouchDB('ANAR_LEVEL');
// Atts: id, name, image, description
var db_card = new PouchDB('ANAR_CARD');

function DBCreateDB() {
    // Buscamos todos los docs en la base de niveles. Si no hay los creamos.
    db_level.allDocs({}, function(err, response) {
        if (err)
            console.log(err);

        if (response.total_rows == 0)
            DBCreateLevels();
    });

    // Igual con las cartas
    db_card.allDocs({}, function(err, response) {
        if (err)
            console.log(err);

        if (response.total_rows == 0)
            DBCreateCards();
    });
}

/*
 * User module
 */

function DBregisterUser(id, password, callback) {

    var user = {
        _id: id,
        password: password,
        highscore: 0,
        levels: ["0"],
        cards: []
    };

    db_user.put(user).then(function(result) {
        user._rev = result.rev;
        callback(null, user);

    }).catch(function(err) {
        callback(err.status, null);
    });
}

function DBloginUser(id, password, callback) {
    db_user.get(id).then(function(doc) {
        if (doc.password == password)
            callback(null, doc);
        else
            callback(401, null);

    }).catch(function(err) {
        callback(err.status, null);
    });
}

function DBGetHighscores(callback) {
        db_user.allDocs({
            include_docs: true
        }, function(err, response) {
            if (response) {
                response.rows.sort(function(a, b) {
                    if (a.doc.highscore < b.doc.highscore) return 1;
                    else if (a.doc.highscore > b.doc.highscore) return -1;
                    else return 0;
                });
            }
            callback(err, response);
        });
    }


function DBUpdateUser(user, callback) {
    db_user.put(user).then(function(result) {
        callback(null, user);
    }).catch(function(err) {
        callback(err.status, null);
    });
}
    /*
     * End User module
     */



/*
 * Level module
 */

 function getArray(min, max) {
    var result = [];
    for (var i = min; i < max / 2; i++) {
        result.push(i.toString());
    }

    var reverse = result.reverse();

    return result.concat(reverse);
 }

function DBCreateLevels() {
    var level = {};

    for (var i = 0; i < 30; i++) {
        if (i < 10)
            level = {
                _id: i.toString(),
                name: 'Nivel ' + i,
                numPieces: 10,
                cards: getArray(0, 10),
                time: '120',
                difficulty: 'Fácil',
                imageName: 'icon-128.png',
                nextLevel: (i+1).toString()
            };
        else if (i < 20)
            level = {
                _id: i.toString(),
                name: 'Nivel ' + i,
                numPieces: 20,
                cards: getArray(0, 20),
                time: '60',
                difficulty: 'Intermedio',
                imageName: 'icon-128.png',
                nextLevel: (i+1).toString()
            };
        else
            level = {
                _id: i.toString(),
                name: 'Nivel ' + i,
                numPieces: 30,
                cards: getArray(0, 30),
                time: '30',
                difficulty: 'Difícil',
                imageName: 'icon-128.png',
                nextLevel: (i+1).toString()
            };

        db_level.put(level);
    }
}

/* Gets the user levels. */
function DBGetUserLevels(user, callback) {
    db_level.allDocs({
        include_docs: true,
        keys: user.levels
    }, function(err, response) {
        callback(err, response);
    });
}

// TODO get total levels by category
function DBGetLevels(callback) {
    db_level.allDocs({
        include_docs: true
    }, function(err, response) {
        callback(err, response);
    });
}

function DBUnlocklevel(user, level, callback) {
    user.levels.push(level.nextLevel);

    db_user.put(user).then(function(result) {
        callback(null, user);
    }).catch(function(err) {
        callback(err.status, null);
    });
}

/*
 * End Level module
 */

/*
 * Card module
 */

function DBCreateCards() {
    var card = {};

    for (var i = 0; i < 60; i++) {
        card = {
            _id: i.toString(),
            name: 'Carta ' + i,
            image: "images/icon-128.png",
            description: 'Lorem ipsum donor amet.'
        };

        db_card.put(card);
    }
}

function DBGetUserCards(user, callback) {
    db_card.allDocs({
        include_docs: true,
        keys: user.cards
    }, function(err, response) {
        callback(err, response);
    });
};

function DBGetLevelCards(level, callback) {
    db_card.allDocs({
        include_docs: true,
        keys: level.cards
    }, function(err, response) {
        callback(err, response);
    });
};

function DBUnlockCard(user, card, callback) {
    for (var i = 0; i < user.cards.length; ++i) {
        if (user.cards[i] == card._id) {
            callback(0, null);
            return;
        }
    }

    user.cards.push(card._id);

    db_user.put(user).then(function(result) {
        callback(null, user);
    }).catch(function(err) {
        callback(err.status, null);
    });
}

/*
 * End Card module
 */