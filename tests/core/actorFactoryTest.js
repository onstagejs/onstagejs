var OnStage = require('../../compiled/core/onstage');
var Studio  = OnStage.Studio;
describe("An actor factory", function() {
  var SENDER_ID = 'sender_factory_1',
    RECEIVER_ID = 'receiver_factory_1',
    INTERCEPTOR_ID = 'interceptor_1';
  var senderPromise = OnStage.actorFactory.send(OnStage.actorFactory.id, {
    id: SENDER_ID,
    process: function(message, headers) {}
  });
  var receiverPromise = OnStage.actorFactory.send(OnStage.actorFactory.id, {
    id: RECEIVER_ID,
    process: function(message, headers) {
      return true;
    }
  });
  it("should be able to create an actor", function(done) {
    Studio.Q.all([senderPromise, receiverPromise]).then(function(
      response) {
      var sender = response[0];
      var receiver = response[1];
      sender.send(RECEIVER_ID, 'factory').then(function(result) {
        expect(result).toBe(true);
        done();
      });
    });
  });
  it("should be able to intercept an actor", function(done) {
    Studio.Q.all([senderPromise, receiverPromise]).then(function(
      response) {
      var sender = response[0];
      var receiver = response[1];
      var interceptor = OnStage.interceptorFactory.send(OnStage.interceptorFactory
        .id, {
          id: INTERCEPTOR_ID,
          routes: RECEIVER_ID,
          process: function(message, sender) {
            return message.next();
          }
        }).then(function(interceptor) {
        sender.send(RECEIVER_ID, 'factory').then(function(
          result) {
          expect(result).toBe(true);
          done();
        });
      });
    });
  });
});
