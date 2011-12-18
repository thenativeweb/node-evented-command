// get the hub
var hub = require('../lib/hub');

// initialize the hub by passing the function that gets the command id from the event
hub.init(
    function(evt) {
        return evt.id;
    }
);

hub.on('commands', function(data) {
	if (data.command === 'multi') {
		hub.emit('event:event1', {event: 'event1', id: data.id});
		hub.emit('event:event2', {event: 'event2', id: data.id});
	}

    hub.emit('events', data);
});

// and the command
var Command = require('../lib/command');

(new Command({
	command: 'bla'
})).emit(function(evt) {
	console.log(evt);
});

(new Command({
	command: 'multi'
})).emit({
	event1: function(evt) {
		console.log(evt);
	},
	event2: function(evt) {
		console.log(evt);
	}
});