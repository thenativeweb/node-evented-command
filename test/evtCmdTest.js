var expect = require('expect.js'),
    _ = require('lodash'),
    dotty = require('dotty'),
    index = require('../');

describe('evented-command', function() {

  var evtCmd;

  describe('creating a new instance', function() {

    it('it should have the correct interface', function() {

      evtCmd = index();

      expect(evtCmd).to.be.an('object');
      expect(evtCmd.defineCommand).to.be.a('function');
      expect(evtCmd.defineEvent).to.be.a('function');
      expect(evtCmd.idGenerator).to.be.a('function');
      expect(evtCmd.on).to.be.a('function');
      expect(evtCmd.emit).to.be.a('function');
      expect(evtCmd.Command).to.be.a('function');

    });

    it('it should have a default id generator function', function(done) {

      evtCmd.getNewId(function(err, id) {
        expect(id).to.be.a('string');
        done();
      });

    });

    describe('defining the command structure', function() {

      it('it should apply the defaults', function() {

        var defaults = _.cloneDeep(evtCmd.definitions.command);

        evtCmd.defineCommand({
          id: 'commandId',
          payload: 'data'
        });

        expect(evtCmd.definitions.command.id).to.eql('commandId');
        expect(defaults.id).not.to.eql(evtCmd.definitions.command.id);
        expect(evtCmd.definitions.command.payload).to.eql('data');
        expect(defaults.payload).not.to.eql(evtCmd.definitions.command.payload);
        expect(evtCmd.definitions.command.name).to.eql(defaults.name);
        expect(evtCmd.definitions.command.aggregate).to.eql(defaults.aggregate);
        expect(evtCmd.definitions.command.aggregateId).to.eql(defaults.aggregateId);
        expect(evtCmd.definitions.command.context).to.eql(defaults.context);

      });

    });

    describe('defining the event structure', function() {

      it('it should apply the defaults', function() {

        var defaults = _.cloneDeep(evtCmd.definitions.event);

        evtCmd.defineEvent({
          id: 'eventId',
          payload: 'data'
        });

        expect(evtCmd.definitions.event.id).to.eql('eventId');
        expect(defaults.id).not.to.eql(evtCmd.definitions.event.id);
        expect(evtCmd.definitions.event.payload).to.eql('data');
        expect(defaults.payload).not.to.eql(evtCmd.definitions.event.payload);
        expect(evtCmd.definitions.event.correlationId).to.eql(defaults.correlationId);
        expect(evtCmd.definitions.event.name).to.eql(defaults.name);
        expect(evtCmd.definitions.event.aggregate).to.eql(defaults.aggregate);
        expect(evtCmd.definitions.event.aggregateId).to.eql(defaults.aggregateId);
        expect(evtCmd.definitions.event.context).to.eql(defaults.context);

      });

    });

    describe('defining an id generator function', function() {

      beforeEach(function() {
        evtCmd.getNewId = null;
      });

      afterEach(function() {
        evtCmd = index();
      });

      describe('in a synchronous way', function() {

        it('it should be transformed internally to an asynchronous way', function(done) {

          evtCmd.idGenerator(function() {
           var id = require('node-uuid').v4().toString();
           return id;
          });

          evtCmd.getNewId(function(err, id) {
            expect(id).to.be.a('string');
            done();
          });

        });

      });

      describe('in an synchronous way', function() {

        it('it should be taken as it is', function(done) {

          evtCmd.idGenerator(function(callback) {
            setTimeout(function() {
              var id = require('node-uuid').v4().toString();
              callback(null, id);
            }, 10);
          });

          evtCmd.getNewId(function(err, id) {
            expect(id).to.be.a('string');
            done();
          });

        });
        
      });

    });

    describe('executing a command', function() {

      before(function() {
        evtCmd = index();
      });

      describe('via "Command" interface', function() {

        describe('fire and forget', function() {

          it('it should notify correctly', function(done) {

            evtCmd.once('command', function(cmd) {
              done();
            });

            (new evtCmd.Command({
              name: 'changeSomething'
            })).emit();

          });

        });

        describe('waiting for an event', function() {

          before(function() {
            evtCmd.once('command', function(cmd) {
              var evt = { correlationId: cmd.id };
              evtCmd.emit('event', evt);
            });
          });

          it('it should notify correctly', function(done) {

            (new evtCmd.Command({
              name: 'changeSomething'
            })).emit(function(evt) {
              done();
            });

          });

        });

        describe('waiting for multiple events', function() {

          before(function() {
            evtCmd.once('command', function(cmd) {
              evtCmd.emit('event', { correlationId: cmd.id, name: 'event1' });
              evtCmd.emit('event', { correlationId: cmd.id, name: 'event2' });
            });
          });

          it('it should notify correctly', function(done) {

            var finished = 0;

            function check() {
              finished++;
              if (finished === 2) {
                done();
              }
            }

            (new evtCmd.Command({
              name: 'changeSomething'
            })).emit({
              event1: function(evt) {
                check();
              },
              event2: function(evt) {
                check();
              }
            });

          });

        });

        describe('passing a command id', function() {

          before(function() {
            evtCmd.once('command', function(cmd) {
              var evt = { correlationId: cmd.id };
              evtCmd.emit('event', evt);
            });
          });

          it('it should use that id command id', function(done) {

            (new evtCmd.Command({
              id: 'my own id!!!',
              name: 'changeSomething'
            })).emit(function(evt) {
              expect(evt.correlationId).to.eql('my own id!!!');
              done();
            });

          });

        });

        describe('not passing a command id', function() {

          before(function() {
            evtCmd.once('command', function(cmd) {
              var evt = { correlationId: cmd.id };
              evtCmd.emit('event', evt);
            });
          });

          it('it should generate a command id', function(done) {

            (new evtCmd.Command({
              // id: 'no id passed',
              name: 'changeSomething'
            })).emit(function(evt) {
              expect(evt.correlationId).to.be.a('string');
              done();
            });

          });

        });

      });

      describe('via "speakable" interface', function() {

        describe('fire and forget', function() {

          describe('without data', function() {

            it('it should notify correctly', function(done) {

              evtCmd.once('command', function(cmd) {
                done();
              });

              evtCmd.send('changeSomething')
                    .go();

            });
            
          });

          describe('with data', function() {

            it('it should notify correctly', function(done) {

              evtCmd.once('command', function(cmd) {
                done();
              });

              evtCmd.send('changeSomething')
                    .with({ data: 'hohoho' })
                    .go();

            });

          });

        });

        describe('waiting for an event', function() {

          before(function() {
            evtCmd.once('command', function(cmd) {
              var evt = { correlationId: cmd.id };
              evtCmd.emit('event', evt);
            });
          });

          it('it should notify correctly', function(done) {

            evtCmd.send('changeSomething')
                  .with({ data: 'hohoho' })
                  .go(function(evt) {
                    done();
                  });

          });

        });

        describe('waiting for multiple events', function() {

          before(function() {
            evtCmd.once('command', function(cmd) {
              evtCmd.emit('event', { correlationId: cmd.id, name: 'event1' });
              evtCmd.emit('event', { correlationId: cmd.id, name: 'event2' });
            });
          });

          it('it should notify correctly', function(done) {

            var finished = 0;

            function check() {
              finished++;
              if (finished === 2) {
                done();
              }
            }

            evtCmd.send('changeSomething')
                  .with({ data: 'hohoho' })
                  .go({
                    event1: function(evt) {
                      check();
                    },
                    event2: function(evt) {
                      check();
                    }
                  });
          });

        });

        describe('passing a command id', function() {

          before(function() {
            evtCmd.once('command', function(cmd) {
              var evt = { correlationId: cmd.id };
              evtCmd.emit('event', evt);
            });
          });

          it('it should use that id command id', function(done) {

            evtCmd.send('changeSomething')
                  .with({ id: 'my own id!!!' })
                  .go(function(evt) {
                    expect(evt.correlationId).to.eql('my own id!!!');
                    done();
                  });

          });

        });

        describe('not passing a command id', function() {

          before(function() {
            evtCmd.once('command', function(cmd) {
              var evt = { correlationId: cmd.id };
              evtCmd.emit('event', evt);
            });
          });

          it('it should generate a command id', function(done) {

            evtCmd.send('changeSomething')
                  .with({
                    // id: 'no id passed',
                    data: 'hohoho'
                  })
                  .go(function(evt) {
                    expect(evt.correlationId).to.be.a('string');
                    done();
                  });

          });

        });

        describe('defining an aggregate name', function() {

          before(function() {
            evtCmd.once('command', function(cmd) {
              var evt = { correlationId: cmd.id, aggregate: cmd.aggregate };
              evtCmd.emit('event', evt);
            });
          });

          it('it should handle it correctly', function(done) {

            evtCmd.send('changeSomething')
                  .for('person')
                  .with({
                    data: 'hohoho'
                  })
                  .go(function(evt) {
                    expect(evt.aggregate.name).to.eql('person');
                    done();
                  });

          });

        });

        describe('not defining an aggregate name', function() {

          before(function() {
            evtCmd.once('command', function(cmd) {
              var evt = { correlationId: cmd.id, aggregate: cmd.aggregate };
              evtCmd.emit('event', evt);
            });
          });

          it('it should not handle it', function(done) {

            evtCmd.send('changeSomething')
                  .with({
                    data: 'hohoho'
                  })
                  .go(function(evt) {
                    expect(dotty.exists(evt, 'aggregate.name')).to.eql(false);
                    done();
                  });

          });

        });

        describe('defining an aggregate id', function() {

          before(function() {
            evtCmd.once('command', function(cmd) {
              var evt = { correlationId: cmd.id, aggregate: cmd.aggregate };
              evtCmd.emit('event', evt);
            });
          });

          it('it should handle it correctly', function(done) {

            evtCmd.send('changeSomething')
                  .for('person')
                  .instance('112233')
                  .with({
                    data: 'hohoho'
                  })
                  .go(function(evt) {
                    expect(evt.aggregate.id).to.eql('112233');
                    done();
                  });

          });

        });

        describe('not defining an aggregate id', function() {

          before(function() {
            evtCmd.once('command', function(cmd) {
              var evt = { correlationId: cmd.id, aggregate: cmd.aggregate };
              evtCmd.emit('event', evt);
            });
          });

          it('it should not handle it', function(done) {

            evtCmd.send('changeSomething')
                  .with({
                    data: 'hohoho'
                  })
                  .go(function(evt) {
                    expect(dotty.exists(evt, 'aggregate.id')).to.eql(false);
                    done();
                  });

          });

        });

        describe('defining an context name', function() {

          before(function() {
            evtCmd.once('command', function(cmd) {
              var evt = { correlationId: cmd.id, context: cmd.context };
              evtCmd.emit('event', evt);
            });
          });

          it('it should handle it correctly', function(done) {

            evtCmd.send('changeSomething')
                  .in('hr')
                  .with({
                    data: 'hohoho'
                  })
                  .go(function(evt) {
                    expect(evt.context.name).to.eql('hr');
                    done();
                  });

          });

        });

        describe('not defining an context name', function() {

          before(function() {
            evtCmd.once('command', function(cmd) {
              var evt = { correlationId: cmd.id, context: cmd.context };
              evtCmd.emit('event', evt);
            });
          });

          it('it should not handle it', function(done) {

            evtCmd.send('changeSomething')
                  .with({
                    data: 'hohoho'
                  })
                  .go(function(evt) {
                    expect(dotty.exists(evt, 'context.name')).to.eql(false);
                    done();
                  });

          });

        });

        describe('defining all', function() {

          before(function() {
            evtCmd.once('command', function(cmd) {
              var evt = cmd;
              evt.correlationId = cmd.id;
              evtCmd.emit('event', evt);
            });
          });

          it('it should handle it correctly', function(done) {

            evtCmd.send('changeSomething')
                  .with({
                    id: 'c1cfe2ba-2f2d-439f-88a2-0ed78c78c827',
                    data: 'hohoho'
                  })
                  .for('person')
                  .instance('112233')
                  .in('hr')
                  .go(function(evt) {
                    expect(evt.aggregate.name).to.eql('person');
                    expect(evt.aggregate.id).to.eql('112233');
                    expect(evt.context.name).to.eql('hr');
                    expect(evt.data).to.eql('hohoho');
                    expect(evt.correlationId).to.eql('c1cfe2ba-2f2d-439f-88a2-0ed78c78c827');
                    done();
                  });

          });

        });

      });

    });

  });

});