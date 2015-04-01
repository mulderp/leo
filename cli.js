var fs = require('fs');
var path = require('path');
var program = require('commander');
var pkg = require('./package.json');

var out = require('./lib/output');

program
  .version(pkg.version);

// Load command from directory as modules
function requireCommand(f){
  var m = require(path.join(__dirname,'./commands',f));

  if(!m.setup || typeof m.setup !== 'function')
    throw new Error('Command must export setup as a function.')

  // call module setup for command
  m.setup(program);

  return m;
}

fs.readdirSync(path.join(__dirname,'./commands')).map(requireCommand);

function increaseVerbosity(v,total){
  out.verbose(v);
  return v;
}

// no valid command  --> display help
program
  .command('*')
  .action(function(env){
    out.error('Command not found');
    program.help();
  });

program.parse(process.argv);

// no command  --> display help
if(program.args.length === 0)
  return program.help();
