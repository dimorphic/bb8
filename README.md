# Star Wars BB8 + Xbox controller + Myo
### The droid you're looking for!

#### What?!
Control your [Sphero Star Wars BB8](http://www.sphero.com/starwars) droid with an [Xbox 360 controller](http://www.xbox.com/xbox-360/accessories/controllers/wireless-controller) (wireless) !

Or, is ***The Force*** strong enough in you?

If you own a [Myo](http://myo.com) armband, you can use gesture commands such as `Force Push` or `Force Turn` (more to come) to control your BB8 droid as a Jedi or Sith master!

#### Demo, or it didn't happen! (click for full video):

[![bb8-xbox-demo](https://j.gifs.com/o2jZQ3.gif)](https://www.youtube.com/watch?v=88WVjfoyQoQ&index=1&list=PLDwEXTsfrjH3ouxfuAtGlQaD6N6JSqN3X)
[![bb8-myo-demo](https://j.gifs.com/Z6z88J.gif)](https://www.youtube.com/watch?v=sLJMBUUDn3E&index=2&list=PLDwEXTsfrjH3ouxfuAtGlQaD6N6JSqN3X)

### Tools:
- [Sphero Star Wars BB8](http://www.sphero.com/starwars)
- [Xbox 360 wireless controller](http://www.xbox.com/xbox-360/accessories/controllers/wireless-controller) (+ receiver)
- [Myo](http://myo.com)
- Node.js
- ES6
- Babel

### Requirements
1. Node.js >= `6.0.0`
2. Bluetooth ready computer (tested on Macbook Pro)
3. OSX only: [Xbox 360 driver](https://github.com/360Controller/360Controller) (tested 0.15_beta3)

### Getting started
1. Clone repo
2. Install deps: `$ npm install`
3. Find your BB8 device UUID using the BLE scanner included: `$ npm run scan`
4. Add the BB8 UUID to the config in `src/config.js` (DEVICE_UUID)

5. Build the code (pick one):
- **Development mode**: `$ npm run dev` (will recompile code on changes)
- **Production mode**: `$ npm run build`

Code will be 'compiled' to `dist/` folder.

*Note*: You'll have to open another terminal window to run the examples when using the **developing mode** as the watcher needs to always run.

6. **Running examples** (finnaly!) - start the app via any:

`$ npm start` (starts Myo example by default)

`$ node dist/example/xbox`

`$ node dist/example/myo`

#### Libs:
- Xbox 360 driver (for OSX)
- Myo
- Sphero
- Cylon

#### Todo:
- cleanup here-and-there
- better docs
- convert to TypeScript ?
