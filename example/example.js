var evtCmd = require('../')();

evtCmd.defineCommand({
  id: 'id',                       // optional
  name: 'name',                   // optional
  context: 'context.name',        // optional
  aggregate: 'aggregate.name',    // optional
  aggregateId: 'aggregate.id'     // optional
});

evtCmd.defineEvent({
  correlationId: 'correlationId', // optional
  id: 'id',                       // optional
  name: 'name',                   // optional
  context: 'context.name',        // optional
  aggregate: 'aggregate.name',    // optional
  aggregateId: 'aggregate.id'     // optional
});

evtCmd.idGenerator(function(callback) {
  setTimeout(function() {
    var id = require('node-uuid').v4().toString();
    callback(null, id);
  }, 50);
});

evtCmd.idGenerator(function() {
  var id = require('node-uuid').v4().toString();
  return id;
});


evtCmd.on('command', function(cmd) {
  if (cmd.name === 'multi') {
    evtCmd.emit('event', {name: 'event1', correlationId: cmd.id});
    evtCmd.emit('event', {name: 'event2', correlationId: cmd.id});
    return;
  }

  cmd.correlationId = cmd.id;
  delete cmd.id;

  evtCmd.emit('event', cmd);
});



(new evtCmd.Command({
  // id: '12345',
  name: 'bla'
})).emit(function(evt) {
  console.log(evt);
});


(new evtCmd.Command({
  name: 'multi'
})).emit({
  event1: function(evt) {
    console.log(evt);
  },
  event2: function(evt) {
    console.log(evt);
  }
});


setTimeout(function() {
  console.log('-------------------');

  evtCmd.send('command')
        .for('aggregate')
        .instance('instanceId')
        .in('context')
        .with({
          revision: '12',
          payload: 'data'
        })
        .go(function(evt) {
          console.log('speakable', evt);
        });

  evtCmd.send('multi')
        .for('aggregate')
        .instance('instanceId')
        .in('context')
        .with({
          revision: '43',
          payload: 'data2'
        })
        .go({
          event1: function(evt) {
            console.log('speakable', evt);
          },
          event2: function(evt) {
            console.log('speakable', evt);
          }
        });
}, 500);
