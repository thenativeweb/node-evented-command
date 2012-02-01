//     lib/observer.js v0.0.1
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
    // `this.observe(commandId, callback)`
    //
    // - __commandId:__ the command id
    // - __callback:__ `function(event){}`
	observe: function(commandId, callback) {
		this.commands[commandId] = callback;
	},

	// __getPendingCommand:__ returns the callback of the pending command.
    // 
    // `this.getPendingCommand(commandId)`
    //
    // - __commandId:__ the command id
	getPendingCommand: function(commandId) {
		return this.commands[commandId];
	}

};

module.exports = Observer;