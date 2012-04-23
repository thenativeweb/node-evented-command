//     lib/observer.js v0.1.1
//     (c) 2012 Adriano Raiano (adrai); under MIT License

// The command observer... observes a command until an event is coming...

var Observer;

// ## Observer
Observer = function() {

	this.commands = {};

};

Observer.prototype = {

	// __observe:__ observes a command by saving its callback.
    // 
    // `this.observe(commandId [, eventName], callback)`
    //
    // - __commandId:__ the command id
    // - __eventName:__ the event name [optional]
    // - __callback:__ `function(event){}`
	observe: function(commandId, eventName, callback) {
		if (typeof eventName === 'function') {
			callback = eventName;
			eventName = '';
		}
		this.commands[commandId + eventName] = callback;
	},

	// __getPendingCommand:__ returns the callback of the pending command.
    // 
    // `this.getPendingCommand(commandId[, eventName])`
    //
    // - __commandId:__ the command id
    // - __eventName:__ the event name [optional]
	getPendingCommand: function(commandId, eventName) {
		eventName = eventName || '';
		var callback = this.commands[commandId + eventName];
		if (!callback) {
			callback = this.commands[commandId];
			delete this.commands[commandId];
		} else {
			delete this.commands[commandId + eventName];
		}
		return callback;
	}

};

module.exports = Observer;