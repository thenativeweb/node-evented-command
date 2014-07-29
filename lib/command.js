'use strict';

module.exports = function (hub) {

  function Command (data) {
    this.data = data;
  }

  Command.prototype = {
    emit: function(callback) {
      hub.sendCommand(this.data, callback);
    }
  };

  return Command;
};