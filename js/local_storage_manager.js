window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};

function LocalStorageManager() {
  this.bestScoreKey     = "bestScore-";
  this.gameStateKey     = "gameState-";

  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;
  // Migrate old best score to 4x4 mode
  if (this.storage.getItem("bestScore")) {
    let old_score = this.storage.getItem("bestScore");
    let new_score = this.getBestScore();
    if (old_score > new_score) {
      this.storage.setItem(this.bestScoreKey + "4x4", old_score);
    }
    this.storage.removeItem("bestScore");
  }
}

LocalStorageManager.prototype.localStorageSupported = function () {
  var testKey = "test";

  try {
    var storage = window.localStorage;
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

// Best score getters/setters
LocalStorageManager.prototype.getBestScore = function (size_x, size_y) {
  return this.storage.getItem(this.bestScoreKey + size_x + "x" + size_y) || 0;
};

LocalStorageManager.prototype.setBestScore = function (score, size_x, size_y) {
  this.storage.setItem(this.bestScoreKey + size_x + "x" + size_y, score);
};

// Game state getters/setters and clearing
LocalStorageManager.prototype.getGameState = function (size_x, size_y) {
  console.log("getting game state for " + size_x + "x" + size_y);
  var stateJSON = this.storage.getItem(this.gameStateKey + size_x + "x" + size_y);
  return stateJSON ? JSON.parse(stateJSON) : null;
};

LocalStorageManager.prototype.getGameStateNoSize = function () {
  console.log("setting game state for `any`");
  var stateJSON = this.storage.getItem(this.gameStateKey + "any");
  return stateJSON ? JSON.parse(stateJSON) : null;
};

LocalStorageManager.prototype.setGameState = function (gameState, size_x, size_y) {
  console.log("setting game state for " + size_x + "x" + size_y);
  this.storage.setItem(this.gameStateKey + size_x + "x" + size_y, JSON.stringify(gameState));
  this.storage.setItem(this.gameStateKey + "any", JSON.stringify(gameState));
};

LocalStorageManager.prototype.clearGameState = function (size_x, size_y) {
  console.log("clearing game state for " + size_x + "x" + size_y);
  this.storage.removeItem(this.gameStateKey + size_x + "x" + size_y);
  this.storage.removeItem(this.gameStateKey + "any");
};
