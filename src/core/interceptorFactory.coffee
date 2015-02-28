Actor = require('studio').Actor
interceptors = require('./interceptors')
proxies = require('./proxies')
#Responsible for intercept actor calls
class InterceptorFactory
  #Creates a new interceptor
  # @param [Object] options the actor options
  # @option options [String] id actor id (should be unique) when you instantiate an actor you automatically create a stream on the router with this id
  # @option options [Function] process the process function which will be executed for every message
  # @option options [Class] clazz Actor class (optional)
  # @option options [Function] initialize function called after actor creation (optional)
  create:(options)->
    clazz = options.clazz or Actor
    interceptor = new clazz(options)
    interceptors.push(interceptor)
    proxy._interceptors.push(interceptor) for proxy in proxies when interceptor.routes(proxy.id)
    interceptor
module.exports=new InterceptorFactory()
