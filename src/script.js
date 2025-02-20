const app = new PIXI.Application();
await app.init({
    background: "green",
    resizeTo: window,
    antialias: true,
    autoDensity: true,
    hello: true,
    canvas: document.getElementById("cvs")
});

// Load the bunny texture
const texture = await PIXI.Assets.load("https://pixijs.com/assets/bunny.png");

// Create a bunny Sprite
const bunny = new PIXI.Sprite(texture);

// Center the sprite's anchor point
bunny.anchor.set(0.5);

// Move the sprite to the center of the screen
bunny.x = app.screen.width / 2;
bunny.y = app.screen.height / 2;

app.stage.addChild(bunny);

// Listen for animate update
app.ticker.add((time) => {
    // Just for fun, let's rotate mr rabbit a little.
    // * Delta is 1 if running at 100% performance *
    // * Creates frame-independent transformation *
    bunny.rotation += 0.1 * time.deltaTime;
});

const gameboardBackground = new PIXI.Sprite();
gameboardBackground.width = app.screen.width;
gameboardBackground.height = app.screen.height;

let gameboardIsBeingDragged = false;
let gameboardDragStartPos = [0, 0];
gameboardBackground.on("pointerdown", (ev) => {
    gameboardIsBeingDragged = true;
    gameboardDragStartPos = [ev.pageX, ev.pageY];
    console.log("pointerdown")
});
gameboardBackground.on("pointermove", (ev) => {
    if (!gameboardIsBeingDragged) return;
    bunny.position.x += ev.movementX;
    bunny.position.y += ev.movementY;    
});
gameboardBackground.on("pointerup", (ev) => {
    gameboardIsBeingDragged = false;
})
gameboardBackground.eventMode = "static";
const gameboardLayer = new PIXI.Container();
gameboardLayer.eventMode = "static";
gameboardLayer.addChild(gameboardBackground);

app.stage.addChild(gameboardLayer)