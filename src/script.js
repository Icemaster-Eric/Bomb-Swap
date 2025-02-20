const app = new PIXI.Application();
await app.init({ 
    background: "black",
    resizeTo: window,
    antialias: true,
    autoDensity: true,
    hello: true,
});

document.body.appendChild(app.canvas);

const texture = await PIXI.Assets.load('https://pixijs.com/assets/bunny.png');
const bunny = new Sprite(texture);
bunny.x = app.screen.width / 2;
bunny.y = app.screen.height / 2;
app.stage.addChild(bunny);