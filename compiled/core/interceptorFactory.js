(function() {
  var Actor, InterceptorFactory, interceptors,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Actor = require('studio').Actor;

  interceptors = require('./interceptors');

  InterceptorFactory = (function(_super) {
    __extends(InterceptorFactory, _super);

    function InterceptorFactory() {
      return InterceptorFactory.__super__.constructor.apply(this, arguments);
    }

    InterceptorFactory.prototype.process = function(options) {
      var clazz, interceptor;
      clazz = options.clazz || Actor;
      interceptor = new clazz(options);
      interceptors.push({
        interceptor: interceptor,
        route: this.mapRoute(options.routes)
      });
      return interceptor;
    };

    return InterceptorFactory;

  })(Actor);

  module.exports = new InterceptorFactory({
    id: 'addInterceptor'
  });

}).call(this);

//# sourceMappingURL=../maps/interceptorFactory.js.map
