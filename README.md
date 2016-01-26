# Star Wars BB8 + Xbox controller + Myo
### The droid you're looking for!

#### What?
Control your [Sphero Star Wars BB8](http://www.sphero.com/starwars) droid with a [Xbox 360 controller](http://www.xbox.com/xbox-360/accessories/controllers/wireless-controller) (wireless) !

Or, is ***The Force*** strong enough in you? If you have a [Myo](http://myo.com) armband, you can use commands such as `Force Push` or `Force Turn` (more to come) to control your BB8 droid as a Jedi or Sith master!

Demo (or it didn't happen!) - click for full video:

[![bb8-xbox-demo](https://j.gifs.com/o2jZQ3.gif)](https://www.youtube.com/watch?v=88WVjfoyQoQ&index=1&list=PLDwEXTsfrjH3ouxfuAtGlQaD6N6JSqN3X)
[![bb8-myo-demo](https://j.gifs.com/Z6z88J.gif)](https://www.youtube.com/watch?v=sLJMBUUDn3E&index=2&list=PLDwEXTsfrjH3ouxfuAtGlQaD6N6JSqN3X)

#### Tools:
- [Sphero Star Wars BB8](http://www.sphero.com/starwars)
- [Xbox 360 wireless controller](http://www.xbox.com/xbox-360/accessories/controllers/wireless-controller) (+ receiver)
- [Myo](http://myo.com)
- Node.js
- ES6
- Babel

### Requirements
1. Node.js `0.12.0`
2. [Xbox 360 driver for OSX](https://github.com/360Controller/360Controller) (tested 0.15_beta3)

### Getting started
1. Clone repo
2. Install deps: `$ npm install`
3. Build app: `$ npm run build` (`$ npm run dev` - for watcher)
3. Find BB8 UUID: `$ node dist/scan`
4. Add BB8 UUID to config `src/config.js` (DEVICE_UUID)
5. Start app:

    `$ npm start` (starts Xbox example by default and can be restarted on demand)
    
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
- improve
