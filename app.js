const blyncCore = require('blync-core');
var ColorEffects = require('color-effects')
const argv = require('yargs')
  .command('color', 'Color to set the light.')
  .alias('c', 'color')
  .command('blink', 'Rate at which to blink. [slow | fast]')
  .alias('b', 'blink')
  .command('off', 'Turn the light off')
  .alias('o', 'off')
  .boolean('o')
  .argv

const blyncs = blyncCore.findAllBlyncLights();

function rainbow(light, colors, cycleTime = 40, totalCycles = 10, currentCycle = 0) {
  if (currentCycle < colors.length * totalCycles) {
    const newColorIndex = currentCycle % colors.length;
    const newColor = colors[newColorIndex];
    light
      .setColor(newColor)
      .then(function() {
        setTimeout(function() {
          rainbow(light, colors, cycleTime, totalCycles, currentCycle + 1);
        }, cycleTime);
      });
  } else {
    light.turnOff();
  }
};

const colorEffects = new ColorEffects(512);

function setLight (color, blink = 'none') {
  if (argv.off) return blyncs[0].turnOff();
  if(blink === 'rainbow') return rainbow(blyncs[0], [...colorEffects.rainbow(), ...colorEffects.rainbow(true)]);
  return blyncs[0].setColor({
    color,
    blink,
  })
}

setLight(argv.color, argv.blink)
