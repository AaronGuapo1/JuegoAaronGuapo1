var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var player;
var nashit;
var nashit2;
var nashit3;
var bullets;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

  var game = new Phaser.Game(config);
  
  function preload() {
      this.load.image(
      "sky",
      "./sky.png"
      );
      this.load.image(
      "ground",
      "./platform.png"
      );
      this.load.image("star", "/3380800-starcoin.png");

      this.load.image("bomb", "./bomb.png");

      this.load.image("nashi", "./nashit.png");
      this.load.image("nashi2", "./nashit2.png");
      this.load.image("nashi3", "./nashit3.png");

      this.load.image("bullet", "./bullet.png");

      this.load.spritesheet(
      "dude",
      "./dude.png",
      { frameWidth: 32, frameHeight: 48 }
      );
      //https://labs.phaser.io/src/games/firstgame/assets/dude.png
  }
  
  function create() {
    bullets = this.physics.add.group();

      //  A simple background for our game
      this.add.image(400, 300, "sky");
  
      //  The platforms group contains the ground and the 2 ledges we can jump on
      platforms = this.physics.add.staticGroup();
  
      //  Here we create the ground.
      //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
      platforms
      .create(400, 568, "ground")
      .setScale(2)
      .refreshBody();
  
      //  Now let's create some ledges
      platforms.create(600, 400, "ground");
      platforms.create(50, 250, "ground");
      platforms.create(750, 220, "ground");
  
      // The player and its settings
      player = this.physics.add.sprite(100, 450, "dude");


      //  Player physics properties. Give the little guy a slight bounce.
      player.setBounce(0.2);
      player.setCollideWorldBounds(true);



      //  Our player animations, turning, walking left and walking right.
      this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
      });
  
      this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20
      });
  
      this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
      });

    
      //  Input Events
      cursors = this.input.keyboard.createCursorKeys();
  
      //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
// Create the stars group
stars = this.physics.add.group({
  key: "star",
  repeat: 11,
  setXY: { x: 12, y: 0, stepX: 70 }



});

// Set the scale of each star to 0.5 (or any desired scale)
stars.children.iterate(function(child) {
  child.setScale(0.1);
  child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
});
  
      bombs = this.physics.add.group();
      
      nashit = this.physics.add.group();
      nashit2 = this.physics.add.group();
      nashit3 = this.physics.add.group();


      //  The score
      scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#000"
      });
  
      //  Collide the player and the stars with the platforms
      this.physics.add.collider(player, platforms);
      this.physics.add.collider(stars, platforms);
      this.physics.add.collider(bombs, platforms);
      this.physics.add.collider(nashit, platforms);

      this.physics.add.collider(nashit2, platforms);
      this.physics.add.collider(nashit3, platforms);
      //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
      this.physics.add.overlap(player, stars, collectStar, null, this);
      this.physics.add.collider(player,bombs, hitBomb, null, this);

      this.physics.add.collider(player,nashit, hitNashi, null, this);
      this.physics.add.collider(player,nashit2, hitNashi2, null, this);
      this.physics.add.collider(player,nashit3, hitNashi3, null, this)

  }  // ,,

function update() {
  if (gameOver) {
    return;
  }

  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);

    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);

    player.anims.play("turn");
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
  if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
    var bullet = bullets.create(player.x, player.y, "bullet");
    var bulletSpeed = 400; // adjust bullet speed as desired
    if (cursors.left.isDown) {
      bullet.setVelocity(-bulletSpeed, -200); // move left
    } else if (cursors.right.isDown) {
      bullet.setVelocity(bulletSpeed, -200); // move right
    } else {
      bullet.setVelocity(0, -400); // move straight up by default
    }
  }
  
  
}
var nashiCreated = false; // variable to keep track if nashi has been created
var nashi2Created = false; // variable to keep track if nashi has been created
var nashi3Created = false; // variable to keep track if nashi has been created

function collectStar(player, star) {
  star.disableBody(true, true);

  //  Add and update the score
  score += 10;
  scoreText.setText("Score: " + score);

  if (stars.countActive(true) === 0) {
    
    //  A new batch of stars to collect
    stars.children.iterate(function(child) {
      child.enableBody(true, child.x, 0, true, true);
    });

    var x =
      player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
console.log(nashiCreated)




      if (!nashiCreated  ) { // check if nashi has not been created yet
        var nashi = nashit.create(game.config.width, 510, "nashi"); // create nashi
        nashiCreated = true; // set nashiCreated to true
        nashi.setBounce(1);
        nashi.setCollideWorldBounds(true);
        nashi.body.checkCollision.up = true;
        nashi.body.checkCollision.down = false;
        nashi.body.checkCollision.left = true;
        nashi.body.checkCollision.right = true;
        nashi.setVelocityX(-100); // negative velocity in x-direction
        nashi.body.allowGravity = false;

        var distance = 20000; // distance to move in pixels
        var counter = 0; // counter variable to keep track of distance moved
        var direction = -1; // direction of movement

        nashit.scene.events.on("update", function(){
            if (counter < distance) {
                nashi.setVelocityX(-100 * direction); // keep moving left or right depending on direction
                counter += Math.abs(nashi.body.velocity.x); // increment counter with absolute velocity
            } else {
                direction = -direction; // change direction
                counter = 0; // reset counter
            }
        }, this);
      }

      if (stars.countActive(true) === 0 && !nashit.active) { // check if all stars are collected and nashit is not active
        nashit.enableBody(true, game.config.width, 510, true, true); // enable nashit again
        nashiCreated = false;
      }


//soldado 2
if (!nashi2Created  ) { // check if nashi has not been created yet
  var nashi2 = nashit2.create(game.config.width, 360, "nashi2"); // create nashi
  nashi2Created = true; // set nashiCreated to true
  nashi2.setBounce(1);
  nashi2.setCollideWorldBounds(true);
  nashi2.body.checkCollision.up = true;
  nashi2.body.checkCollision.down = false;
  nashi2.body.checkCollision.left = true;
  nashi2.body.checkCollision.right = true;
  nashi2.setVelocityX(-100); // negative velocity in x-direction
  nashi2.body.allowGravity = false;

  var distance = 20000; // distance to move in pixels
  var counter = 0; // counter variable to keep track of distance moved
  var direction = -1; // direction of movement

  nashit2.scene.events.on("update", function(){
      if (counter < distance) {
          nashi2.setVelocityX(-100 * direction); // keep moving left or right depending on direction
          counter += Math.abs(nashi2.body.velocity.x); // increment counter with absolute velocity
      } else {
          direction = -direction; // change direction
          counter = 0; // reset counter
      }
  }, this);
}

if (stars.countActive(true) === 0 && !nashit2.active) { // check if all stars are collected and nashit is not active
  nashit2.enableBody(true, game.config.width, 510, true, true); // enable nashit again
  nashi2Created = false;
}






if (!nashi3Created  ) { // check if nashi has not been created yet
  var nashi3 = nashit3.create(50, 210, "nashi3"); // create nashi
  nashi3Created = true; // set nashiCreated to true
  nashi3.setBounce(1);
  nashi3.setCollideWorldBounds(true);
  nashi3.body.checkCollision.up = true;
  nashi3.body.checkCollision.down = false;
  nashi3.body.checkCollision.left = true;
  nashi3.body.checkCollision.right = true;
  nashi3.setVelocityX(-100); // negative velocity in x-direction
  nashi3.body.allowGravity = false;

  var distance = 20000; // distance to move in pixels
  var counter = 0; // counter variable to keep track of distance moved
  var direction = -1; // direction of movement

  nashit3.scene.events.on("update", function(){
      if (counter < distance) {
          nashi3.setVelocityX(-100 * direction); // keep moving left or right depending on direction
          counter += Math.abs(nashi3.body.velocity.x); // increment counter with absolute velocity
      } else {
          direction = -direction; // change direction
          counter = 0; // reset counter
      }
  }, this);
}

if (stars.countActive(true) === 0 && !nashit3.active) { // check if all stars are collected and nashit is not active
  nashit3.enableBody(true, game.config.width, 510, true, true); // enable nashit again
  nashi3Created = false;
}




















    this.physics.add.collider(bullets, nashit, function(bullet, nashi) {
      bullet.disableBody(true, true);
      nashi.disableBody(true, true);
      nashiCreated = false;

    });


    this.physics.add.collider(bullets, nashit2, function(bullet, nashi2) {
      bullet.disableBody(true, true);
      nashi2.disableBody(true, true);
      nashi2Created = false;

    });
    this.physics.add.collider(bullets, nashit3, function(bullet, nashi3) {
      bullet.disableBody(true, true);
      nashi3.disableBody(true, true);
      nashi3Created = false;

    });
  }
}



function hitBomb(player, bomb) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play("turn");
  //prompt("Introduce tu nombre para guardar tu puntuación")
  const FinalScore = score;
  gameOver = true;

  var nombre = prompt("¡Introduce tu nombre para guardar tu puntuación!")

  document.getElementById("score").innerHTML = FinalScore;

  document.getElementById("task-stats").value = FinalScore;
  document.getElementById("nombre").innerHTML = nombre;

  document.getElementById("task-title").value = nombre;
  
  document.getElementById("btn-task-form").click();


}

function hitNashi(player, nashi) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play("turn");
  //prompt("Introduce tu nombre para guardar tu puntuación")
  const FinalScore = score;
  gameOver = true;

  var nombre = prompt("¡Introduce tu nombre para guardar tu puntuación!")

  document.getElementById("score").innerHTML = FinalScore;

  document.getElementById("task-stats").value = FinalScore;
  document.getElementById("nombre").innerHTML = nombre;

  document.getElementById("task-title").value = nombre;
  
  document.getElementById("btn-task-form").click();


}
function hitNashi2(player, nashi2) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play("turn");
  //prompt("Introduce tu nombre para guardar tu puntuación")
  const FinalScore = score;
  gameOver = true;

  var nombre = prompt("¡Introduce tu nombre para guardar tu puntuación!")

  document.getElementById("score").innerHTML = FinalScore;

  document.getElementById("task-stats").value = FinalScore;
  document.getElementById("nombre").innerHTML = nombre;

  document.getElementById("task-title").value = nombre;
  
  document.getElementById("btn-task-form").click();


}
function hitNashi3(player, nashi3) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play("turn");
  //prompt("Introduce tu nombre para guardar tu puntuación")
  const FinalScore = score;
  gameOver = true;

  var nombre = prompt("¡Introduce tu nombre para guardar tu puntuación!")

  document.getElementById("score").innerHTML = FinalScore;

  document.getElementById("task-stats").value = FinalScore;
  document.getElementById("nombre").innerHTML = nombre;

  document.getElementById("task-title").value = nombre;
  
  document.getElementById("btn-task-form").click();


}
