Studio = require('studio')
Actor = Studio.Actor
router = Studio.router
Promise = require('studio').Promise

interceptors = require('./interceptors')

proxies=require('./proxies')
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
      message = {body,headers,sender,receiver}
      produceNext = (index,message)=>
        if index==@_interceptors.length-1
          (nextMessage)=>
            message = nextMessage or message
            {body,headers,sender,receiver} = message
            @_innerProcess(body,headers,sender,receiver)
        else
          nextRoute = @_interceptors[index+1].id
          (nextMessage)->
            message = nextMessage or message
            message.next = produceNext(index+1,message)
            router.send(sender,nextRoute,message)
      if @_interceptors.length==0
        @_innerProcess(body,headers,sender,receiver)
      else
        message.next=produceNext(0,message)
        router.send(sender,@_interceptors[0].id,message)
    options.process = process
    type = options.type or Actor
    proxy = new type(options)
    proxy._interceptors=[]
    proxy._interceptors.push(interceptor) for interceptor in interceptors when interceptor.routes(proxy.id)
    proxies.push(proxy)
    proxy

module.exports =new ActorFactory()
