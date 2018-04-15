(function() {
  window.Config = {
    "MAX_NUM": 30, // 个数上限
    "DEAFULT_RATE": 0.5, // 无人状态下转盘速度0 - 1
    "MAX_RATE": 1.3, // 转盘速度上限
    "MIN_RATE": 0.2, // 转盘速度下限
    "NUM_EACH_SHAPE": 10, // 每种形状的个数
    "COLOR": ["#f0dfb9", "#e8b997", "#3f4e63", "#679fab", "#7badbf", "#b0c6d1"], //颜色参数
    "DRUM_ANGULAR_VELOCITY": Math.PI / 3, // 转盘速度
    "MIN_AUDIO_PLAYBACK_RATE": 0.3,
    "MAX_AUDIO_PLAYBACK_RATE": 0.5,
    "WORLD_WIDTH": 10,
    "WORLD_HALF_WIDTH": 5,
    "NUM_DRUM_SECTIONS": 32,
    "MIN_BALL_RADIUS": 0.1,
    "MAX_BALL_RADIUS": 0.3,
    "MIN_BOX_DIMENSION": 0.1,
    "MAX_BOX_DIMENSION": 0.3,
    "MIN_STEP_SIZE": 1 / 2400,
    "MAX_STEP_SIZE": 1 / 100,
    "SCALE": 40,
    // "MIN_AUDIO_PLAYBACK_RATE": 0.15,
    // "MAX_AUDIO_PLAYBACK_RATE": 0.75,
    "SIMULATION_RATE": 1
  };

  Config.MIN_CIRCLE_AREA = Math.min(Config.MIN_BALL_RADIUS * Config.MIN_BALL_RADIUS * Math.PI);

  Config.MAX_CIRCLE_AREA = Math.max(Config.MAX_BALL_RADIUS * Config.MAX_BALL_RADIUS * Math.PI);

  Config.MIN_BOX_AREA = Math.min(Config.MIN_BOX_DIMENSION * Config.MIN_BOX_DIMENSION);

  Config.MAX_BOX_AREA = Math.max(Config.MAX_BOX_DIMENSION * Config.MAX_BOX_DIMENSION);

  Config.MIN_SHAPE_AREA = Math.min(Config.MIN_CIRCLE_AREA, Config.MIN_BOX_AREA);

  Config.MAX_SHAPE_AREA = Math.max(Config.MAX_CIRCLE_AREA, Config.MAX_BOX_AREA);

}).call(this);