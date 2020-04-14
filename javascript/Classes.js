class Paddle{
    constructor(x, y, width, height, speed){
        this.x = x+width/2;
        this.y = y+height/2;
        this.width = width;
        this.height = height;
        this.left = false;
        this.right = false;
        this.speed = speed;
    }
    drawImg(src){
        let paddleImg = new Image();
        paddleImg.src = src;
        paddleImg.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(paddleImg, this.x-this.width/2, this.y-this.height/2, this.width, this.height);
        }
    }
    draw(color){
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(this.x-this.width/2, this.y-this.height/2, this.width, this.height);
        ctx.fill();
    }
}
class Ball{
    constructor(x, y, radius, vx, vy, id){
        this.x = x;
        this.y = y;
        this.r = radius;
        this.vx = vx;
        this.vy = vy;
        this.id = id;
        this.selected = false;
        this.mass = radius*10;
    }
    draw(color){
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();
    }
    /*distanceFromRectangle(x, y, width, height){ //distance from ball and a rectangle
        let dx = Math.max(Math.abs(this.x - x) - width / 2, 0);
        let dy = Math.max(Math.abs(this.y - y) - height / 2, 0);
        return Math.sqrt(dx * dx + dy * dy);
    }*/
    distanceFromPoint(x,y){
        //console.log(x+ " lčmao "+this.x);
        return Math.sqrt((this.x-x)*(this.x-x) + (this.y-y)*(this.y-y));
    }
    dynamicCollision(ball, moveOtherBall){
        let xnormal = (this.x - ball.x)/this.distanceFromPoint(ball.x, ball.y); //vektor normale - ta gleda proti središču collided kroga
        let ynormal = (this.y - ball.y)/this.distanceFromPoint(ball.x, ball.y);
        let xtangent = -ynormal;
        let ytangent = xnormal;

        let skalarTang1 = xtangent*this.vx + ytangent*this.vy; //skalarni produkt tangente in hitrosti žoge
        let skalarTang2 = xtangent*ball.vx + ytangent*ball.vy;
        let skalarNorm1 = xnormal*this.vx + ynormal*this.vy; //skalarni produkt normale in hitrosti žoge
        let skalarNorm2 = xnormal*ball.vx + ynormal*ball.vy;

        //računanje momentuma - enačbe pridobljene iz wikipedije: https://en.wikipedia.org/wiki/Elastic_collision
        let v1 = (this.mass - ball.mass)/(this.mass + ball.mass)*skalarNorm1
        +(2*ball.mass)/(this.mass + ball.mass)*skalarNorm2;
        let v2 = (2*this.mass)/(this.mass+ball.mass)*skalarNorm1
        +(ball.mass-this.mass)/(this.mass+ball.mass)*skalarNorm2;

        this.vx = skalarTang1 * xtangent + xnormal * v1; //naša hitrost je skalarni produkt novih vektorjev
        this.vy = skalarTang1 * ytangent + ynormal * v1;

        if(moveOtherBall){
            ball.vx = skalarTang2 * xtangent + xnormal * v2;
            ball.vy = skalarTang2 * ytangent + ynormal * v2;
        }
    }
}
class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}
class Wall{
    constructor(startx, starty, endx, endy, radius){
        this.startx = startx;
        this.starty = starty;
        this.endx = endx;
        this.endy = endy;
        this.r = radius;
        this.startSelected = false;
        this.endSelected = false;
        this.length = Math.sqrt((this.startx-this.endx)*(this.startx-this.endx) + (this.starty-this.endy)*(this.starty-this.endy));
    }
    draw(fillColor, strokeColor){
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.arc(this.startx, this.starty, this.r, 0, 2 * Math.PI);
        ctx.arc(this.endx, this.endy, this.r, 0, 2 * Math.PI);
        ctx.fill();

        this.length = Math.sqrt((this.startx-this.endx)*(this.startx-this.endx) + (this.starty-this.endy)*(this.starty-this.endy));
        let xvector = (this.startx - this.endx)/this.length;
        let yvector = (this.starty - this.endy)/this.length;
        let xnormal = -yvector;
        let ynormal = xvector;

        ctx.strokeStyle = strokeColor;
        let p1 = new Point(this.startx+xnormal*this.r, this.starty+ynormal*this.r);
        let p2 = new Point(this.endx+xnormal*this.r, this.endy+ynormal*this.r);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        p1 = new Point(this.startx-xnormal*this.r, this.starty-ynormal*this.r);
        p2 = new Point(this.endx-xnormal*this.r, this.endy-ynormal*this.r);
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }
}