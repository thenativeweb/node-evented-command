module.exports = function (observerTimeout) {

  var commands = {};

  return {

    observe: function (commandId, eventname, callback) {
      if (typeof eventname === 'function') {
        callback = eventname;
        eventname = '';
      }
      commands[commandId + eventname] = callback;

      if (eventname !== '') {
        setTimeout(function () {
          delete commands[commandId + eventname];
        }, observerTimeout);
      }
    },

    getPendingCommand: function(commandId, eventname) {
      eventname = eventname || '';

      var callback = commands[commandId + eventname];
      if (callback) {
        delete commands[commandId + eventname];
        return callback;
      }

      callback = commands[commandId];
      if (callback) {
        delete commands[commandId];
      }

      return callback;
    }

  };

};
