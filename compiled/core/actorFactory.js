(function() {
  var Actor, ActorFactory, Promise, Studio, actors, interceptors, proxies, router;

  Studio = require('studio');

  Actor = Studio.Actor;

  router = Studio.router;

  Promise = require('studio').Promise;

  interceptors = require('./interceptors');

  actors = [];

  proxies = [];

  ActorFactory = (function() {
    function ActorFactory() {}

    ActorFactory.prototype.create = function(options) {
      var process, proxy;
      options._innerProcess = options.process;
      process = function(body, headers, sender, receiver) {
        var interceptor, message, produceNext, toCallInterceptors, _i, _len;
        toCallInterceptors = [];
        for (_i = 0, _len = interceptors.length; _i < _len; _i++) {
          interceptor = interceptors[_i];
          if (interceptor.route(receiver)) {
            toCallInterceptors.push(interceptor);
          }
        }
        message = {
          body: body,
          headers: headers,
          sender: sender,
          receiver: receiver
        };
        produceNext = (function(_this) {
          return function(index, message) {
            var nextRoute;
            if (index === toCallInterceptors.length - 1) {
              return function() {
                return Promise.method(function() {
                  return _this._innerProcess(body, sender, receiver);
                })();
              };
            } else {
              nextRoute = toCallInterceptors[index + 1].interceptor.id;
              return function() {
                message.next = produceNext(index + 1, message);
                return router.send(sender, nextRoute, message);
              };
            }
          };
        })(this);
        if (toCallInterceptors.length === 0) {
          return Promise.method((function(_this) {
            return function() {
              return _this._innerProcess(body, headers, sender, receiver);
            };
          })(this))();
        } else {
          message.next = produceNext(0, message);
          return router.send(sender, toCallInterceptors[0].interceptor.id, message);
        }
      };
      options.process = process;
      proxy = new Actor(options);
      return proxy;
    };

    return ActorFactory;

  })();

  module.exports = new ActorFactory();

}).call(this);

//# sourceMappingURL=../maps/actorFactory.js.map
