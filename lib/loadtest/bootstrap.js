'use strict'
const _ = require('lodash');
const fork = require('child_process').fork;

const defaultSettings = {
  commands: {
    get_around: 100,
    get_range: 50,
    update_scores: 50 
  },
  procs: 10
};

/**
 * 総実行回数をプロセスごとに分割する
 */
function distribute_(total, procs) {
  const unitCount = Math.floor(total / procs);
  const surplus = total % procs;
  const distribution = _.times(procs, _.constant(unitCount));

  if (surplus) {
    for (let i = 0; i < surplus; i++) {
      distribution[i] += 1;
    }
  }

  return distribution;
}

/**
 * 実行間隔を算出する
 */
function interval_(count) {
  return Math.round(1000 / count);
}

function main(args) {
  const commands = args.commands;

  const children = [];

  _.range(args.children).forEach((p) => {
    children.push(fork(`${__dirname}/command`));
  });

  Object.keys(commands).forEach((cmd) => {
    distribute_(commands[cmd], args.procs).forEach((c, i) => {
      const interval = interval_(c);
      children[i].send({type: 'setup', command: cmd, interval: interval, unitCount: c});
    });
  });

  const start = Date.now();
  setInterval(() => {
    console.log(`passing ${Date.now() - start}s`);
  }, 1000);
}

if (require.main === module) {
  main(defaultSettings);
}

