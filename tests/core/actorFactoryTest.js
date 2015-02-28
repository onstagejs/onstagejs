var OnStage = require('../../compiled/core/onstage');
var Studio = OnStage.Studio;
describe("An actor factory", function () {
	var SENDER_ID = 'sender_factory_1',
		RECEIVER_ID = 'receiver_factory_1',
		INTERCEPTOR_ID = 'interceptor_1';

	var interceptor = OnStage.interceptorFactory.create({
		id: INTERCEPTOR_ID,
		routes: function (route) {
			return route === RECEIVER_ID;
		},
		process: function (message, sender) {
			this.called = true;
			return message.next();
		}
	});
	var sender = OnStage.actorFactory.create({
		id: SENDER_ID,
		process: function (message, headers) {}
	});
	var receiver = OnStage.actorFactory.create({
		id: RECEIVER_ID,
		process: function (message, headers) {
			return true;
		}
	});

	it("should be able to create an actor", function (done) {
		sender.send(RECEIVER_ID).then(function (result) {
			expect(result).toBe(true);
			done();
		});
	});
	it("should be able to intercept an actor", function (done) {
		sender.send(RECEIVER_ID).then(function (
			result) {
			expect(interceptor.called).toBe(true);
			expect(result).toBe(true);
			done();
		});
	});
});
