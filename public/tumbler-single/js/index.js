(function() {
  var MAX_VELOCITY, Shape;

  MAX_VELOCITY = 20.0;

  Shape = (function() {
    function Shape(options) {
      var bodyDef, fixtureDef, r, t, u;
      this.customerfill = options.fill
      this.initializeDimensions_();
      fixtureDef = new Box2D.Dynamics.b2FixtureDef();
      fixtureDef.density = 1.0;
      fixtureDef.friction = 2.0;
      fixtureDef.restitution = 0.3;
      this.initializeFixture_(fixtureDef);
      bodyDef = new Box2D.Dynamics.b2BodyDef();
      bodyDef.type = options.type || Box2D.Dynamics.b2Body.b2_dynamicBody;
      t = Math.random() * Math.PI * 2;
      u = Math.random() + Math.random();
      r = 3 * (u > 1 ? 2 - u : u);
      bodyDef.position.x = Config.WORLD_HALF_WIDTH + r * Math.cos(t);
      bodyDef.position.y = Config.WORLD_HALF_WIDTH + r * Math.sin(t);
      // 通过pad生成
      if(options.fill) {
        bodyDef.position.x = Config.WORLD_HALF_WIDTH;
        bodyDef.position.y = Config.WORLD_HALF_WIDTH;
      }
      this.body_ = options.world.CreateBody(bodyDef);
      this.body_.CreateFixture(fixtureDef);
      this.body_.SetUserData(this);
      if (SoundManager.isSupported) {
        this.initializeSound_();
      }
      if (options.type) {
        setTimeout(()=>{
          window.making = false;
          this.changeType_();
        }, 1000)
      }
      this.initializeColor_();
      this.initializeSVGElement_(options.svg);
    }

    Shape.prototype.changeType_ = function () {
      this.body_.SetType(Box2D.Dynamics.b2Body.b2_dynamicBody)
    };

    Shape.prototype.initializeColor_ = function() {
      return this.color_ = this.customerfill || Utilities.randomColor();
    };

    Shape.prototype.initializeDimensions_ = function() {
      throw "This method must be defined by subclasses!";
    };

    Shape.prototype.initializeSVGElement_ = function() {
      throw "This method must be defined by subclasses!";
    };

    Shape.prototype.initializeSound_ = function() {
      var context, scale;
      context = SoundManager.getContext();
      this.gainNode_ = context.createGain();
      this.pannerNode_ = context.createPanner();
      this.pannerNode_.panningModel = "equalpower";
      this.pannerNode_.setPosition(0, 0, 0);
      scale = (this.area_ - Config.MIN_SHAPE_AREA) / (Config.MAX_SHAPE_AREA - Config.MIN_SHAPE_AREA);
      scale = Math.round(scale * 11).toString();
      return this.soundName_ = "glock-" + scale;
    };

    Shape.prototype.playSound = function(relVelocity) {
      var buffer, gain, position, x;
      buffer = SoundManager.getBuffer(this.soundName_);
      if (!buffer) {
        return;
      }
      if (this.source_) {
        this.source_.stop(0);
      }
      gain = relVelocity / MAX_VELOCITY;
      gain = Math.max(Math.min(gain * gain, 1), 0);
      this.gainNode_.gain.value = gain;
      position = this.body_.GetPosition();
      x = position.x - Config.WORLD_HALF_WIDTH / Config.WORLD_HALF_WIDTH;
      this.pannerNode_.setPosition(x, 0, 0);
      this.source_ = SoundManager.createBufferSource();
      this.source_.buffer = buffer;
      this.source_.connect(this.pannerNode_);
      this.pannerNode_.connect(this.gainNode_);
      SoundManager.connectToDestination(this.gainNode_);
      return this.source_.start(0);
    };

    return Shape;

  })();

  window.Shape = Shape;

}).call(this);

(function() {
  var Ball, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Ball = (function(_super) {
    __extends(Ball, _super);

    function Ball() {
      _ref = Ball.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Ball.prototype.draw = function() {
      var position, x, y;
      position = this.body_.GetPosition();
      x = position.x * Config.SCALE;
      y = position.y * Config.SCALE;
      if (this.opacity <= 1) {
        this.opacity += 0.01
      }
      this.svgShape_.setAttribute("fill-opacity", this.opacity);
      return this.svgShape_.setAttribute("transform", "translate(" + x + ", " + y + ")");
    };

    Ball.prototype.initializeDimensions_ = function() {
      this.radius_ = Utilities.rand(Config.MIN_BALL_RADIUS, Config.MAX_BALL_RADIUS);
      return this.area_ = this.radius_ * this.radius_ * Math.PI;
    };

    Ball.prototype.initializeSVGElement_ = function(svgParent) {
      this.opacity = 0.1
      this.svgShape_ = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      this.svgShape_.setAttribute("r", this.radius_ * Config.SCALE);
      this.svgShape_.setAttribute("fill-opacity", this.opacity);
      this.svgShape_.style.fill = this.color_;
      return svgParent.appendChild(this.svgShape_);
    };

    Ball.prototype.initializeFixture_ = function(fixtureDef) {
      return fixtureDef.shape = new Box2D.Collision.Shapes.b2CircleShape(this.radius_);
    };

    return Ball;

  })(Shape);

  window.Ball = Ball;

}).call(this);

(function() {
  var Box, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Box = (function(_super) {
    __extends(Box, _super);

    function Box() {
      _ref = Box.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Box.prototype.draw = function() {
      var position, r, x, y;
      position = this.body_.GetPosition();
      x = position.x * Config.SCALE;
      y = position.y * Config.SCALE;
      r = this.body_.GetAngle() * 180 / Math.PI;
      if (this.opacity <= 1) {
        this.opacity += 0.01
      }
      this.svgShape_.setAttribute("fill-opacity", this.opacity);
      return this.svgShape_.setAttribute("transform", "translate(" + x + ", " + y + ") rotate(" + r + ")");
    };

    Box.prototype.initializeDimensions_ = function() {
      this.width_ = Utilities.rand(Config.MIN_BOX_DIMENSION, Config.MAX_BOX_DIMENSION);
      this.height_ = Utilities.rand(Config.MIN_BOX_DIMENSION, Config.MAX_BOX_DIMENSION);
      return this.area_ = this.width_ * this.height_;
    };

    Box.prototype.initializeSVGElement_ = function(svgParent) {
      this.opacity = 0.1;
      this.svgShape_ = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      this.svgShape_.setAttribute("width", this.width_ * Config.SCALE * 2);
      this.svgShape_.setAttribute("height", this.height_ * Config.SCALE * 2);
      this.svgShape_.setAttribute("x", -this.width_ * Config.SCALE);
      this.svgShape_.setAttribute("y", -this.height_ * Config.SCALE);
      this.svgShape_.setAttribute("fill-opacity", this.opacity);
      this.svgShape_.style.fill = this.color_;
      return svgParent.appendChild(this.svgShape_);
    };

    Box.prototype.initializeFixture_ = function(fixtureDef) {
      fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
      return fixtureDef.shape.SetAsBox(this.width_, this.height_);
    };

    return Box;

  })(Shape);

  window.Box = Box;

}).call(this);

(function() {
  var Loader,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Loader = (function() {
    function Loader() {
      this.showProgress_ = __bind(this.showProgress_, this);
      this.closeLoader_ = __bind(this.closeLoader_, this);
      var closeLink;
      this.canvas_ = document.querySelector("#loading-canvas");
      closeLink = document.querySelector(".loading-splash a");
      closeLink.addEventListener("click", this.closeLoader_);
      this.initializeShapes_();
      this.initalizeSounds_();
    }

    Loader.prototype.closeLoader_ = function(evt) {
      evt.preventDefault();
      document.body.classList.remove("loading");
      return setTimeout((function() {
        var splash;
        splash = document.querySelector(".loading-splash");
        splash.parentNode.removeChild(splash);
        var washingMachine = window.washingMachine = new WashingMachine();
        return washingMachine;
      }), 500);
    };

    // 开始加载页面的图形
    Loader.prototype.initializeShapes_ = function() {
      var angleStep, animation, currentAngle, d, numSections, shape, x, y;
      numSections = 36;
      currentAngle = angleStep = (Math.PI * 2) / numSections;
      this.group_ = document.createElementNS("http://www.w3.org/2000/svg", "g");
      while (currentAngle < (Math.PI * 2)) {
        d = 45;
        x = 50 + (d * Math.cos(currentAngle));
        y = 50 + (d * Math.sin(currentAngle));
        shape = this.generateRandomShape_(x, y);
        this.group_.appendChild(shape);
        currentAngle += angleStep;
      }
      animation = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
      animation.setAttribute("attributeName", "transform");
      animation.setAttribute("type", "rotate");
      animation.setAttribute("from", "0 " + 50 + " " + 50);
      animation.setAttribute("to", "360 " + 50 + " " + 50);
      animation.setAttribute("dur", "300s");
      animation.setAttribute("repeatCount", "indefinite");
      this.group_.appendChild(animation);
      return this.canvas_.appendChild(this.group_);
    };

    Loader.prototype.generateRandomShape_ = function(x, y) {
      var animation, from, h, r, shape, to, type, w;
      type = Math.round(Math.random()) ? "circle" : "rect";
      shape = document.createElementNS("http://www.w3.org/2000/svg", type);
      if (type === "circle") {
        r = Utilities.rand(1, 2);
        shape.setAttribute("r", r);
        shape.setAttribute("cx", x + (-r / 2));
        shape.setAttribute("cy", y + (-r / 2));
      } else if (type === "rect") {
        w = Utilities.rand(1, 3);
        h = Utilities.rand(1, 3);
        shape.setAttribute("width", w);
        shape.setAttribute("height", h);
        shape.setAttribute("x", x + (-w / 2));
        shape.setAttribute("y", y + (-h / 2));
        from = Math.round(Math.random()) ? 360 : 0;
        to = 360 - from;
        animation = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
        animation.setAttribute("attributeName", "transform");
        animation.setAttribute("type", "rotate");
        animation.setAttribute("from", "" + from + " " + x + " " + y);
        animation.setAttribute("to", "" + to + " " + x + " " + y);
        animation.setAttribute("dur", "" + (Utilities.rand(15, 30)) + "s");
        animation.setAttribute("repeatCount", "indefinite");
        shape.appendChild(animation);
      }
      r = Utilities.rand(0, 360);
      shape.style.fill = Utilities.randomColor();
      shape.classList.add("hidden");
      return shape;
    };

    Loader.prototype.initalizeSounds_ = function() {
      SoundManager.initialize();
      if (SoundManager.isSupported) {
        SoundManager.load();
      }
      return this.showProgress_();
    };

    Loader.prototype.showProgress_ = function() {
      var allShapes, el, loadedShapes, progress, shownProgress;
      if (SoundManager.isSupported) {
        progress = SoundManager.getLoadedProgress();
      } else {
        progress = 1;
      }
      allShapes = this.group_.querySelectorAll("rect, circle");
      loadedShapes = this.group_.querySelectorAll("rect:not(.hidden),      circle:not(.hidden)");
      shownProgress = loadedShapes.length / allShapes.length;
      if (shownProgress < progress) {
        el = this.group_.querySelector("rect.hidden, circle.hidden");
        el.classList.remove("hidden");
      }
      if (shownProgress < 1) {
        return setTimeout(this.showProgress_, 30);
      } else {
        return this.finishedLoading_();
      }
    };

    Loader.prototype.finishedLoading_ = function() {
      var ul;
      ul = document.body.querySelector(".loading-splash ol");
      return ul.classList.remove("hidden");
    };

    return Loader;

  })();

  window.Loader = Loader;

}).call(this);

(function() {
  var SoundManager;

  SoundManager = {
    initialize: function() {
      this.patchWindow_();
      this.isSupported = Modernizr.webaudio;
      this.context_ = new AudioContext();
      this.masterGainNode_ = this.context_.createGain();
      this.masterGainNode_.gain.value = 1;
      this.compressorNode_ = this.context_.createDynamicsCompressor();
      this.convolverNode_ = this.context_.createConvolver();
      this.buffers_ = {};
      return this.loadingProgress_ = 0;
    },
    load: function() {
      var audioType, soundName, sounds, _i, _len, _ref, _results;
      audioType = Modernizr.audio.ogg ? "ogg" : (Modernizr.audio.mp3 ? "mp3" : "wav");
      sounds = {
        "convolver": "dining-living-true-stereo." + audioType,
        "glock-0": "glockenspiel/" + audioType + "/f7." + audioType,
        "glock-1": "glockenspiel/" + audioType + "/e7." + audioType,
        "glock-2": "glockenspiel/" + audioType + "/d7." + audioType,
        "glock-3": "glockenspiel/" + audioType + "/c7." + audioType,
        "glock-4": "glockenspiel/" + audioType + "/b6." + audioType,
        "glock-5": "glockenspiel/" + audioType + "/a6." + audioType,
        "glock-6": "glockenspiel/" + audioType + "/g6." + audioType,
        "glock-7": "glockenspiel/" + audioType + "/f6." + audioType,
        "glock-8": "glockenspiel/" + audioType + "/e6." + audioType,
        "glock-9": "glockenspiel/" + audioType + "/d6." + audioType,
        "glock-10": "glockenspiel/" + audioType + "/c6." + audioType
      };
      this.buffers_ = {};
      this.buffersToLoad_ = Object.keys(sounds);
      _ref = this.buffersToLoad_;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        soundName = _ref[_i];
        _results.push(this.loadSound_(soundName, '/tumbler-single/sounds/' + sounds[soundName]));
      }
      return _results;
    },
    getContext: function() {
      return this.context_;
    },
    mute: function(doit) {
      return this.masterGainNode_.gain.value = doit ? 0 : 1;
    },
    getLoadedProgress: function() {
      if (this.isSupported) {
        return this.loadingProgress_;
      } else {
        return 1;
      }
    },
    createBufferSource: function() {
      var source;
      source = this.context_.createBufferSource();
      source.playbackRate.value = Utilities.range(Config.MIN_AUDIO_PLAYBACK_RATE, Config.MAX_AUDIO_PLAYBACK_RATE, Config.SIMULATION_RATE);
      return source;
    },
    connectToDestination: function(node) {
      if (this.convolverNode_.buffer) {
        node.connect(this.convolverNode_);
        node = this.convolverNode_;
      } else {
        return;
      }
      node.connect(this.masterGainNode_);
      this.masterGainNode_.connect(this.compressorNode_);
      return this.compressorNode_.connect(this.context_.destination);
    },
    getBuffer: function(soundName) {
      return this.buffers_[soundName];
    },
    patchWindow_: function() {
      var objPatches, objectName, oldMethod, patches, standardMethod, _i, _len, _ref, _results;
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      patches = {
        "AudioContext": {
          "createGain": "createGainNode"
        },
        "AudioBufferSourceNode": {
          "start": "noteOn",
          "off": "noteOff"
        }
      };
      _ref = Object.keys(patches);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        objectName = _ref[_i];
        objPatches = patches[objectName];
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = Object.keys(objPatches);
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            standardMethod = _ref1[_j];
            oldMethod = objPatches[standardMethod];
            if (!window[objectName][standardMethod]) {
              _results1.push(window[objectName][standardMethod] = window[objectName][oldMethod]);
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        })());
      }
      return _results;
    },
    loadSound_: function(name, file) {
      var request,
        _this = this;
      request = new XMLHttpRequest();
      request.open('GET', file, true);
      request.responseType = 'arraybuffer';
      request.onload = function() {
        return _this.context_.decodeAudioData(request.response, function(buffer) {
          return _this.saveBuffer_(name, buffer);
        });
      };
      return request.send();
    },
    saveBuffer_: function(name, buffer) {
      this.buffers_[name] = buffer;
      if (name === "convolver") {
        this.convolverNode_.buffer = buffer;
      }
      return this.loadingProgress_ = Object.keys(this.buffers_).length / this.buffersToLoad_.length;
    }
  };

  window.SoundManager = SoundManager;

}).call(this);

(function() {
  window.Utilities = {
    range: function(min, max, scale) {
      return (scale * (max - min)) + min;
    },
    rand: function(min, max) {
      return (Math.random() * (max - min)) + min;
    },
    randomColor: function() {
      var allColors;
      allColors = Config.COLOR || ["#f0dfb9", "#e8b997", "#3f4e63", "#679fab", "#7badbf", "#b0c6d1"];
      return allColors[Math.floor(Math.random() * allColors.length)];
    }
  };

}).call(this);

(function() {
  var WashingMachine,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  WashingMachine = (function() {
    function WashingMachine(options) {
      this.requestFrame_ = __bind(this.requestFrame_, this);
      this.onContactStart_ = __bind(this.onContactStart_, this);
      this.svg_ = document.querySelector("#main-canvas");
      this.initializeWorld_();
      this.initializeDrum_();
      this.initializeShapes_();
      this.requestFrame_();
    }

    WashingMachine.prototype.makeShape = function(shapeConfig) {
      if (window.making) {
        return;
      } else {
        window.making = true;
      }
      if (shapeConfig.type === 'circle') {
        this.shapes_.push(new Ball({
          world: this.world_,
          svg: this.svg_,
          type: Box2D.Dynamics.b2Body.b2_kinematicBody,
          fill: shapeConfig.fill
        }));
      } else {
        this.shapes_.push(new Box({
          world: this.world_,
          svg: this.svg_,
          type: Box2D.Dynamics.b2Body.b2_kinematicBody,
          fill: shapeConfig.fill
        }));
      }
    }

    WashingMachine.prototype.initializeWorld_ = function() {
      var contactListener, gravity;
      gravity = new Box2D.Common.Math.b2Vec2(0, 9);
      this.world_ = new Box2D.Dynamics.b2World(gravity, true);
      if (SoundManager.isSupported) {
        contactListener = new Box2D.Dynamics.b2ContactListener();
        contactListener.BeginContact = this.onContactStart_;
        return this.world_.SetContactListener(contactListener);
      }
    };

    WashingMachine.prototype.initializeDrum_ = function() {
      var r, angleStep, currentAngle, drumBody, drumBodyDef, fixtureDef, initialPosition, sectionWidth, _results;
      drumBodyDef = new Box2D.Dynamics.b2BodyDef();
      drumBodyDef.type = Box2D.Dynamics.b2Body.b2_kinematicBody;
      drumBodyDef.position.x = Config.WORLD_HALF_WIDTH;
      drumBodyDef.position.y = Config.WORLD_HALF_WIDTH;
      drumBody = this.world_.CreateBody(drumBodyDef);
      drumBody.SetAngularVelocity(Config.DRUM_ANGULAR_VELOCITY);
      this.drumBody = drumBody;
      fixtureDef = new Box2D.Dynamics.b2FixtureDef();
      fixtureDef.density = 1.0;
      fixtureDef.friction = 1.0;
      fixtureDef.restitution = 0.3;
      fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
      currentAngle = 0;
      r = Config.WORLD_HALF_WIDTH - 1;
      // r = Config.WORLD_HALF_WIDTH;
      angleStep = (Math.PI * 2) / Config.NUM_DRUM_SECTIONS;
      sectionWidth = r * Math.sin(angleStep);
      _results = [];
      while (currentAngle < (Math.PI * 2)) {
        initialPosition = new Box2D.Common.Math.b2Vec2(r * Math.cos(currentAngle), r * Math.sin(currentAngle));
        fixtureDef.shape.SetAsOrientedBox(0.1, sectionWidth / 2, initialPosition, currentAngle);
        drumBody.CreateFixture(fixtureDef);
        _results.push(currentAngle += angleStep);
      }

      // 右
      // this.setWall_(0.4, 20, Config.WORLD_WIDTH - 0.2 + 2, Config.WORLD_HALF_WIDTH);
      // 左
      // this.setWall_(0.4, 20, 0.2 - 2, Config.WORLD_HALF_WIDTH);
      // 底
      // this.setWall_(20, 0.4, Config.WORLD_HALF_WIDTH, Config.WORLD_WIDTH - 0.2);

      return _results;
    };

    // 设置墙
    WashingMachine.prototype.setWall_ = function(width, height, x, y) {
      // 上下左右都设置墙体
      var fixDef = new Box2D.Dynamics.b2FixtureDef();
      fixDef.density = 1.0;//密度
      fixDef.friction = 0.5;//摩擦
      fixDef.restitution = 0.2;//弹性
      fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();//矩形
      fixDef.shape.SetAsBox(width, height);//宽高           
      //创建一个矩形地板刚体
      var bodyDef = new Box2D.Dynamics.b2BodyDef();                 
      bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;//静态的
      bodyDef.position.x = x;    //X轴
      bodyDef.position.y = y;    //Y轴     
      //世界中添加一个刚体
      this.world_.CreateBody(bodyDef).CreateFixture(fixDef);
    };
    WashingMachine.prototype.initializeShapes_ = function() {
      var i, _i, _ref, _results;
      this.shapes_ = [];
      _results = [];
      for (i = _i = 1, _ref = Config.NUM_EACH_SHAPE; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        this.shapes_.push(new Ball({
          world: this.world_,
          svg: this.svg_
        }));
        _results.push(this.shapes_.push(new Box({
          world: this.world_,
          svg: this.svg_
        })));
      }
      return _results;
    };

    WashingMachine.prototype.onContactStart_ = function(contact) {
      var aVel, bVel, bodyA, bodyB, relVelocity, userDataA, userDataB, worldManifold;
      if (!contact.IsTouching()) {
        return;
      }
      worldManifold = new Box2D.Collision.b2WorldManifold();
      contact.GetWorldManifold(worldManifold);
      bodyA = contact.GetFixtureA().GetBody();
      userDataA = bodyA.GetUserData();
      bodyB = contact.GetFixtureB().GetBody();
      userDataB = bodyB.GetUserData();
      aVel = bodyA.GetLinearVelocityFromWorldPoint(worldManifold.m_points[0]);
      bVel = bodyB.GetLinearVelocityFromWorldPoint(worldManifold.m_points[0]);
      aVel.Subtract(bVel);
      relVelocity = aVel.Length();
      if (userDataA) {
        userDataA.playSound(relVelocity);
      }
      if (userDataB) {
        return userDataB.playSound(relVelocity);
      }
    };

    WashingMachine.prototype.requestFrame_ = function() {
      var shape, stepSize, _i, _len, _ref;
      stepSize = Utilities.range(Config.MIN_STEP_SIZE, Config.MAX_STEP_SIZE, Config.SIMULATION_RATE);
      this.world_.Step(stepSize, 5, 5);
      _ref = this.shapes_;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        shape = _ref[_i];
        shape.draw();
      }
      this.world_.ClearForces();
      return requestAnimationFrame(this.requestFrame_);
    };

    return WashingMachine;

  })();

  window.WashingMachine = WashingMachine;

}).call(this);

(function() {
  (function() {
    var browserRaf, canceled, targetTime, vendor, w, _i, _len, _ref;
    w = window;
    _ref = ['ms', 'moz', 'webkit', 'o'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      vendor = _ref[_i];
      if (w.requestAnimationFrame) {
        break;
      }
      w.requestAnimationFrame = w["" + vendor + "RequestAnimationFrame"];
      w.cancelAnimationFrame = w["" + vendor + "CancelAnimationFrame"] || w["" + vendor + "CancelRequestAnimationFrame"];
    }
    if (w.requestAnimationFrame) {
      if (w.cancelAnimationFrame) {
        return;
      }
      browserRaf = w.requestAnimationFrame;
      canceled = {};
      w.requestAnimationFrame = function(callback) {
        var id;
        return id = browserRaf(function(time) {
          if (id in canceled) {
            return delete canceled[id];
          } else {
            return callback(time);
          }
        });
      };
      return w.cancelAnimationFrame = function(id) {
        return canceled[id] = true;
      };
    } else {
      targetTime = 0;
      w.requestAnimationFrame = function(callback) {
        var currentTime;
        targetTime = Math.max(targetTime + 16, currentTime = +(new Date));
        return w.setTimeout((function() {
          return callback(+(new Date));
        }), targetTime - currentTime);
      };
      return w.cancelAnimationFrame = function(id) {
        return clearTimeout(id);
      };
    }
  })();

  window.addEventListener('DOMContentLoaded', function() {
    var muteButton;
    var mouseX;
    var mouseY;
    var V_RATE = 0.2;
    var MAX_RATE = Config.MAX_RATE;
    var MIN_RATE = Config.MIN_RATE;
    var DEAFULT_RATE = Config.DEAFULT_RATE;
    var timer = null;
    var rate = Config.SIMULATION_RATE
    new Loader();
    document.querySelector('#rate').addEventListener('change', function(evt) {
      return Config.SIMULATION_RATE = parseFloat(evt.target.value);
    });
    // 增加kinect 根据人数定义速度
    var socket = io.connect('/');
    socket.on('addShape', function(shapeConfig) {
      if (window.washingMachine) {
        var shapes = window.washingMachine.shapes_
        if (shapes.length >= window.Config.MAX_NUM) {
          window.washingMachine.svg_.removeChild(shapes[0].svgShape_)
          window.washingMachine.world_.DestroyBody(shapes[0].body_)
          window.washingMachine.shapes_.shift()
        }
        window.washingMachine.makeShape(shapeConfig)
      }
    })
    socket.on('bodyFrame', _.throttle(function(bodyFrame) {
      // 遍历所有骨骼数据
      var body = null;
      var headPosition = {
        x: 0,
        y: 0
      }
      var leftPosition = {
        x: 0,
        y: 0
      };
      var rightPosition = {
        x: 0,
        y: 0
      };
      var handleState = 1; // 手势 0:不能识别 1:未检测到 2:手掌 3:握拳 4:剪刀手
      var length = bodyFrame.bodies.length
      for (var i = 0; i < length; i++) {
        var a = bodyFrame.bodies[i];
        if (a.tracked) {
          body = a;
          break;
        }
      }
      //捕捉到存在的人体 onlyOne
      if (body) {
        clearTimeout(timer)
        for (var jointType in body.joints) {
          var joint = body.joints[jointType];
          if (jointType == 7 || jointType == 11 || jointType == 3) {
            // 100 * 100 画布
            var pos_x = joint.depthX * 100;
            var pos_y = joint.depthY * 100;
            if (jointType == 7) {
              // 记录左手位置
              leftPosition = {
                x: pos_x,
                y: pos_y
              }
            } else if (jointType == 11) {
              // 记录右手位置
              rightPosition = {
                x: pos_x,
                y: pos_y
              }
            } else {
              // 记录头部位置
              headPosition = {
                x: pos_x,
                y: pos_y
              }
            }
          }
        }
        var leftDistance = Math.abs(leftPosition.x - headPosition.x);
        var rightDistance = Math.abs(rightPosition.x - headPosition.x);
        if (leftDistance > rightDistance) {
          handleState = body.leftHandState
          if (window.washingMachine) {
            window.washingMachine.drumBody.SetAngularVelocity(Config.DRUM_ANGULAR_VELOCITY)
          }
        } else {
          handleState = body.rightHandState
          if (window.washingMachine) {
            window.washingMachine.drumBody.SetAngularVelocity(-Config.DRUM_ANGULAR_VELOCITY)
          }
        }
        if (handleState == 2) {
          rate += V_RATE
          if (rate > MAX_RATE) {
            rate = MAX_RATE
          }
        } else {
          rate -= V_RATE
          if (rate < MIN_RATE) {
            rate = MIN_RATE
          }
        }
        Config.SIMULATION_RATE = rate
      } else {
        timer = setTimeout(() => {
          Config.SIMULATION_RATE = DEAFULT_RATE
        }, 1000)
      }
    }, 50));
  });

}).call(this);
