'use strict';

const executors = {};
const commands = {};

function setupCommand_(command, interval, unitCount) {
  if (executors[command]) {
    clearInterval(executors[command]);
  }

  let count = 0;
  executors[command] = setInterval(() => {
    commands[command](count++, unitCount);
  }, interval);
}

commands.get_around = function(c, unitCount) {
  if (c % unitCount === 0) {
    console.log('call get_around', c, process.pid);
  }
}

commands.get_range = function(c, unitCount) {
  if (c % unitCount === 0) {
    console.log('call get_range', c, process.pid);
  }
}

commands.update_scores = function(c, unitCount) {
  if (c % unitCount === 0) {
    console.log('call update_scores', c, process.pid);
  }
}

process.on('message', (message) => {
  if (message.type === 'setup') {
    setupCommand_(message.command, message.interval, message.unitCount);
  }
});

