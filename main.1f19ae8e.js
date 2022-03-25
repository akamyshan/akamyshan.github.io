// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"main.js":[function(require,module,exports) {
'use strict';

(function main() {
  var BALL_RADIUS = 20;
  var BALL_SPEED = 5; 
  
  // Размеры игрового поля
  var X_MIN_PLAY_AREA = window.innerWidth * 0.1;
  var X_MAX_PLAY_AREA = window.innerWidth * 0.9;
  var Y_MIN_PLAY_AREA = window.innerHeight * 0.1;
  var Y_MAX_PLAY_AREA = window.innerHeight * 0.9;
  
  var TIMER = 60;
  var timer = TIMER;
  var score = 0;
  var canvasElement = document.getElementById('canvas');
  var ball = canvasElement.getContext('2d');
  var playArea = canvasElement.getContext('2d');
  var platform = canvasElement.getContext('2d');
  var tableau = canvasElement.getContext('2d');
  var start = canvasElement.getContext('2d');
  var end = canvasElement.getContext('2d'); // Platform

  var xPlatform = window.innerWidth / 2; // Middle of the platform

  var yPlatform = Y_MAX_PLAY_AREA;
  var HALF_PLATFORM = 50;
  var ArrowLeftPressed = false;
  var ArrowRightPressed = false;
  var SpacePressed = false; // Ball

  var x = xPlatform;
  var y = yPlatform - BALL_RADIUS;
  var Vx = BALL_SPEED;
  var Vy = BALL_SPEED; // Timer

  var startTimer = false;

  var runTimer = function runTimer() {
    if (startTimer) {
      setTimeout(function run() {
        timer -= 1;

        if (timer === 0) {
          clearInterval();
          startTimer = false;
        } else {
          setTimeout(run, 1000);
        }
      }, 1000);
    }
  }; // Слушаем клавиатуру


  function keyDownHandler(event) {
    if (event.code === 'ArrowLeft') {
      ArrowLeftPressed = true;
    } else if (event.code === 'ArrowRight') {
      ArrowRightPressed = true;
    } else if (event.code === 'Space') {
      SpacePressed = true;
    }
  }

  function keyUpHandler(event) {
    if (event.code === 'ArrowLeft') {
      ArrowLeftPressed = false;
    } else if (event.code === 'ArrowRight') {
      ArrowRightPressed = false;
    }
  }

  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler, false);

  var drawScene = function drawScene() {
    canvasElement.width = window.innerWidth - 5;
    canvasElement.height = window.innerHeight - 5; // Отрисовка игрового поля

    playArea.beginPath();
    playArea.strokeStyle = 'black';
    playArea.strokeRect(X_MIN_PLAY_AREA, Y_MIN_PLAY_AREA, X_MAX_PLAY_AREA - X_MIN_PLAY_AREA, Y_MAX_PLAY_AREA - Y_MIN_PLAY_AREA);
    playArea.closePath(); // Отрисовка платформы

    platform.beginPath();
    platform.fillStyle = 'brown';
    platform.fillRect(xPlatform - HALF_PLATFORM, yPlatform, 2 * HALF_PLATFORM, 10);
    platform.closePath(); // Отрисовка игрового мячика

    ball.beginPath();
    ball.arc(x, y, BALL_RADIUS, 0, 2 * Math.PI);
    ball.fillStyle = 'green';
    ball.fill();
    ball.stroke();
    ball.closePath(); // Отрисовка таймера счетчика очков

    tableau.beginPath();
    tableau.font = '24px serif';
    tableau.fillText("TIMER: ".concat(timer, " sec"), 100, 50);
    tableau.strokeText("SCORE: ".concat(score), 100, 75);
    tableau.closePath();
  };

  var prepareNextScene = function prepareNextScene() {
    console.log("Vx = ".concat(Vx, ", Vy = ").concat(Vy, ", score = ").concat(score)); // Двигаем платформой

    if (ArrowLeftPressed && xPlatform > X_MIN_PLAY_AREA + HALF_PLATFORM) {
      xPlatform -= 15; // 5
    } else if (ArrowRightPressed && xPlatform < X_MAX_PLAY_AREA - HALF_PLATFORM) {
      xPlatform += 15;
    } // Движение мяча с платформой


    if (y === yPlatform - BALL_RADIUS && SpacePressed === false) {
      x = xPlatform; // y = yPlatform - BALL_RADIUS;
    } 
    
    // Запускаем мяч по нажатию на пробел
    if (SpacePressed) {
      x += Vx;
      y -= Vy;
    } 
    
    // Столкновение сo стенками
    if (x < X_MIN_PLAY_AREA + BALL_RADIUS || x > X_MAX_PLAY_AREA - BALL_RADIUS) {
      Vx = -Vx;
    }

    if (y < Y_MIN_PLAY_AREA + BALL_RADIUS) {
      Vy = -Vy;
    } else if (y > Y_MAX_PLAY_AREA - BALL_RADIUS) {
      Vy = -Vy;
      
      // Отскок от платформы
      if (x > xPlatform - HALF_PLATFORM && x < xPlatform + HALF_PLATFORM) {
        score += 1;
        Vx = (Math.random() < 0.5 ? -1 : 1) * Vx; // Рандомная смена направления движения мяча при отскоке от платформы
        //Vy += 1; // Увеличение скорости мяча при отскоке от платформы
      } else {
        score -= 1;
        SpacePressed = false;
        xPlatform = window.innerWidth / 2;
        x = xPlatform;
        y = yPlatform - BALL_RADIUS;
      }
    }
  }; 

  // Финальный экран
  var endScreen = function endScreen() {
    canvasElement.width = window.innerWidth - 5;
    canvasElement.height = window.innerHeight - 5;
    end.beginPath();
    start.fillStyle = 'blue';
    start.font = '48px serif';
    start.fillText("\u0412\u0430\u0448\u0438 \u043E\u0447\u043A\u0438 \u0437\u0430 \u0438\u0433\u0440\u0443 - ".concat(score), window.innerWidth / 2 - 220, window.innerHeight / 2 + 12);
    start.font = '32px serif';
    start.fillText('Нажмите F5, чтобы начать сначала', window.innerWidth / 2 - 220, window.innerHeight / 2 + 75);
    start.closePath();
  }; 

  // Game over
  var gameOver = function gameOver() {
    canvasElement.width = window.innerWidth - 5;
    canvasElement.height = window.innerHeight - 5;
    end.beginPath();
    start.fillStyle = 'red';
    start.font = '72px serif';
    start.fillText('Game over', window.innerWidth / 2 - 159, window.innerHeight / 2 + 12);
    start.font = '32px serif';
    start.fillText('Нажмите F5, чтобы начать сначала', window.innerWidth / 2 - 220, window.innerHeight / 2 + 75);
    start.closePath();
  };

  var drawSceneAndPrepareNextScene = function drawSceneAndPrepareNextScene() {
    if (startTimer) {
      if (score < 0) {
        gameOver();
      } else {
        drawScene();
        prepareNextScene();
        window.requestAnimationFrame(drawSceneAndPrepareNextScene);
      }
    } else {
      endScreen();
    }
  }; // Начальный экран


  var startScreen = function startScreen() {
    // Отрисовка кнопки Начать игру
    canvasElement.width = window.innerWidth - 5;
    canvasElement.height = window.innerHeight - 5;
    start.beginPath();
    start.fillStyle = 'blue';
    start.strokeStyle = 'blue';
    start.strokeRect(window.innerWidth / 2 - 150, window.innerHeight / 2 - 25, 300, 50);
    start.font = '48px serif';
    start.fillText('Начать игру', window.innerWidth / 2 - 125, window.innerHeight / 2 + 12);
    start.closePath(); // Отрабатываем нажатие на кнопку Начать Игру

    document.addEventListener('click', function (event) {
      if (event.clientX > window.innerWidth / 2 - 150 && event.clientX < window.innerWidth / 2 + 150 && event.clientY > window.innerHeight / 2 - 25 && event.clientY < window.innerHeight / 2 + 25) {
        SpacePressed = false;
        timer = TIMER;
        startTimer = true;
        runTimer();
        drawSceneAndPrepareNextScene();
      }
    });
  };

  document.addEventListener('DOMcontentLoaded', startScreen());
})();
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59548" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map