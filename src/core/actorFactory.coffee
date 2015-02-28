Studio = require('studio')
Actor = Studio.Actor
router = Studio.router
Promise = require('studio').Promise

interceptors = require('./interceptors')

actors = []
proxies=[]
# Responsible for create and manage an actor lifecycle.
class ActorFactory
  #Creates a new Actor
  # @param [Object] options the actor options
  # @option options [String] id actor id (should be unique) when you instantiate an actor you automatically create a stream on the router with this id
  # @option options [Function] process the process function which will be executed for every message
  # @option options [Function] initialize function called after actor creation (optional)
  create:(options)->
    options._innerProcess = options.process
    process = (body,headers,sender,receiver)->
      toCallInterceptors=[]
      toCallInterceptors.push(interceptor) for interceptor in interceptors when interceptor.route(receiver)
      console.log('R',receiver)
      console.log('T',toCallInterceptors)
      console.log('I',interceptors)
      message = {body,headers,sender,receiver}
      produceNext = (index,message)=>
        if index==toCallInterceptors.length-1
          ()=> Promise.method(()=>@_innerProcess(body,sender,receiver))()
        else
          nextRoute = toCallInterceptors[index+1].interceptor.id
          ()->
            message.next = produceNext(index+1,message)
            router.send(sender,nextRoute,message)
      if toCallInterceptors.length==0
        Promise.method(()=>@_innerProcess(body,sender,receiver))()
      else
        message.next=produceNext(0,message)
        router.send(sender,toCallInterceptors[0].interceptor.id,message)
    options.process = process
    proxy = new Actor(options)
    proxy


module.exports =new ActorFactory()
