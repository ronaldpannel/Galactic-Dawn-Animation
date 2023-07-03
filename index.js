/**@type{HTMLCanvasElement} */

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let numOfStars = 30;
  let starsArray = [];
  let timer = 0;
  const gasCloudArray = [];
  const numberOfLines = 10;

  let grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, "rgba(222, 176, 39, 0.1)");
  grad.addColorStop(0.5, "rgba(230, 115, 15, 0.1)");
  grad.addColorStop(1, "rgba(168, 12, 106,0.1)");
  class GasCloud {
    constructor() {
      this.x = Math.floor(Math.random() * canvas.width);
      this.y = Math.floor(Math.random() * canvas.height);
      this.history = [{ x: this.x, y: this.y }];
      this.lineWidth = Math.floor(Math.random() * 60 + 1);
      this.hue = Math.floor(Math.random() * 360);
      this.maxLength = Math.floor(Math.random() * 150 + 10);
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = 0.1;
      this.lifeSpan = this.maxLength * 10;
      this.timer = 0;
    }
    draw() {
      ctx.save();
      ctx.strokeStyle = grad;
      ctx.lineWidth = this.lineWidth;
      ctx.beginPath();
      ctx.filter = "blur(50px)";
      ctx.moveTo(this.history[0].x, this.history[0].y);
      for (let i = 0; i < this.history.length; i++) {
        ctx.lineTo(this.history[i].x, this.history[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }
    update() {
      this.timer++;
      if (this.timer < this.lifeSpan) {
        this.x += this.speedX + Math.random() * 20 - 10;
        this.y += this.speedY + Math.random() * 20 - 10;
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > this.maxLength) {
          this.history.shift();
        }
      } else if (this.history.length <= 1) {
        this.reset();
      } else {
        this.history.shift();
      }
    }
    reset() {
      this.x = Math.floor(Math.random() * canvas.width);
      this.y = Math.floor(Math.random() * canvas.height);
      this.history = [{ x: this.x, y: this.y }];
      this.timer = 0;
    }
  }
  for (let i = 0; i < numberOfLines; i++) {
    gasCloudArray.push(new GasCloud());
  }

  class Star {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 0;
      this.scale = 0;
      this.maxRadius = 100;
      this.opacity = 0;
      this.image = document.getElementById("starImg");
    }
    draw() {
      // ctx.beginPath();
      // //ctx.filter = "blur(5px)";
      // ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
      // ctx.arc(this.x, this.y, (this.radius += this.scale), 0, Math.PI * 2);
      // //ctx.fill();
      ctx.closePath();
      ctx.drawImage(
        this.image,
        this.x,
        this.y,
        (this.radius += this.scale),
        (this.radius += this.scale)
      );
    }
    update() {
      if (
        this.radius <
        Math.floor(Math.random() * this.maxRadius + this.maxRadius * 0.5)
      ) {
        this.scale += 0.01;
        this.opacity += 0.005;
      } else {
        this.scale = 0;
      }
    }
  }

  function InitStars() {
    if (timer % 10 == 0) {
      let x = Math.random() * canvas.width;
      let y = Math.random() * canvas.height;
      starsArray.push(new Star(x, y));
    }
    console.log(starsArray.length);
  }

  function animate() {
    timer++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    InitStars();
    starsArray.forEach((star, index) => {
      star.draw();
      star.update();
      if (starsArray.length > numOfStars) {
        // if (timer % 1 == 0) {
          starsArray.splice(index, 3);
        // }
      }

      gasCloudArray.forEach((lineObject) => {
        lineObject.draw(ctx);
        lineObject.update();
      });
    });

    requestAnimationFrame(animate);
  }

  animate();
  this.window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    animate();
  });

  //load function end
});
