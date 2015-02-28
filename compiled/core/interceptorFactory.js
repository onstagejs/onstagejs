(function() {
  var Actor, InterceptorFactory, interceptors;

  Actor = require('studio').Actor;

  interceptors = require('./interceptors');

  InterceptorFactory = (function() {
    function InterceptorFactory() {}

    InterceptorFactory.prototype.create = function(options) {
      var clazz, interceptor;
      clazz = options.clazz || Actor;
      interceptor = new clazz(options);
      interceptors.push({
        interceptor: interceptor,
        route: options.routes
      });
      return interceptor;
    };

    return InterceptorFactory;

  })();

  module.exports = new InterceptorFactory();

}).call(this);

//# sourceMappingURL=../maps/interceptorFactory.js.map
