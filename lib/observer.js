var Observer;

Observer = function() {

	this.commands = {};

};

Observer.prototype = {

	observe: function(commandId, callback) {
		this.commands[commandId] = callback;
	},

	getPendingCommand: function(commandId) {
		return this.commands[commandId];
	}

};

module.exports = Observer;