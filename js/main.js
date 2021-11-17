//環境變數
var updateFPS = 30
var showMouse = true
var time = 0
var bgColor = 'black'

//控制
var controls = {
  freq: 0.02,//頻率
  amp: 30, //震幅
  noise: 30 //雜訊
}
var gui = new dat.GUI()
gui.add(controls,'freq',0,1).step(0.01).onChange(function(value){})
gui.add(controls,'amp',0,30).step(0.01).onChange(function(value){})
gui.add(controls,'noise',0,150).step(0.01).onChange(function(value){})

//---------------------------------------------
// Vec2
class Vec2{
  constructor(x,y){
    this.x = x
    this.y= y
  }
  set(x,y){
    this.x = x
    this.y = y
  }
  move(x,y){
    this.x += x
    this.y += y
  } 
  add(v){
    return new Vec2(this.x+v.x,this.y+v.y)
  }  
  sub(v){
    return new Vec2( this.x-v.x,this.y-v.y)
  } 
  mul(s){
    return new Vec2( this.x*s,this.y*s)
  } 
  get length(){
    return Math.sqrt(this.x*this.x+this.y*this.y)
  }
  set length(nv){
    let temp = this.unit.mul(nv)
    this.set(temp.x,temp.y)
  }
  clone(){ //回傳一個新的向量
    return new Vec2(this.x,this.y)
  }
  toString(){
    return `(${this.x}, ${this.y})`
  }
  equal(v){
    return this.x == v.x && this.y == v.y
  }
  get angel(){
    return Math.atan2(this.y,this.x)
  }
  get unit(){ //取得單位向量
    return this.mul(1/this.length)
  }
}
var a = new Vec2(3,4)
//---------------------------------------------

var canvas = document.getElementById('mycanvas')
var ctx = canvas.getContext('2d')

ctx.circle = function(v,r){
  this.arc(v.x,v.y,r,0,Math.PI*2)
}

ctx.line = function(v1,v2){
  this.moveTo(v1.x,v1.y)
  this.lineTo(v2.x,v2.y)
}

//canvas設定
function initCanvas(){
  ww = canvas.width = window.innerWidth
  wh = canvas.height = window.innerHeight
}
initCanvas()

//物件邏輯初始化
function init(){}

//遊戲邏輯更新
function update(){
  time++
}


//畫面更新
function draw(){
  //清空背景
  ctx.fillStyle = bgColor
  ctx.fillRect(0,0,ww,wh)
  
  //---------------------------
  //在這裡繪製
  ctx.beginPath()
  for(var i = 0; i<ww; i++){
    let deg = i * controls.freq + time/20
    let noise = controls.amp * Math.random()
    let wave = controls.amp * Math.sin(deg)
    ctx.lineTo(i,wave+noise+wh/2)
  }
  ctx.lineWidth = 2
  ctx.strokeStyle = 'rgba(255,255,255,.1)'
  ctx.stroke()
  
  ctx.beginPath()
  for(var i=0; i < wh ; i++){
    let deg = i*controls.freq + time/20
    ctx.lineTo(controls.amp*Math.sin(deg)+ww/2,i)
  }
  ctx.strokeStyle = '#ffffff'
  ctx.stroke()
  
  ctx.beginPath()
  for(var i=0; i < wh ; i++){
    let deg = i*controls.freq + time/20
    ctx.lineTo(-controls.amp*Math.sin(deg)+ww/2,i)
  }
  ctx.strokeStyle = '#ffffff'
  ctx.stroke()
  
  ctx.lineWidth = 1
  for(var i=0; i<wh; i+=15){
    let deg = i*controls.freq+time/20
    let amp = controls.amp*Math.sin(deg)
    let x1 = ww/2 + amp
    let x2 = ww/2 - amp
    ctx.beginPath()
    ctx.moveTo(x1,i)
    ctx.lineTo(x2,i)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.arc(x2,i,Math.sin(i + time/10)*1+5,0,Math.PI*2)
    ctx.arc(x1,i,3,0,Math.PI*2)
    ctx.fillStyle = "rgb("+i/4+","+i/2+","+(50+i/1.5)+")"
    ctx.fill()
  }
  
  

  
  //---------------------------
  //滑鼠
  ctx.fillStyle = 'red'
  ctx.beginPath()
  ctx.circle(mousePos,3)
  ctx.fill()
  
  ctx.save()
    ctx.beginPath()
    ctx.translate(mousePos.x,mousePos.y)
    ctx.strokeStyle = 'red'
    let len = 20
    ctx.line(new Vec2(-len,0),new Vec2(len,0))
    ctx.fillText(mousePos,10,-10)
    ctx.rotate(Math.PI/2)
    ctx.line(new Vec2(-len,0),new Vec2(len,0))
    ctx.stroke()
  ctx.restore()
  
  requestAnimationFrame(draw)
}

//當頁面載入完成後呼叫
function loaded(){
  initCanvas()
  init()
  requestAnimationFrame(draw)
  setInterval(update,1000/updateFPS)
}

//載入 縮放的事件
window.addEventListener('load',loaded)
window.addEventListener('resize',initCanvas)


//滑鼠事件跟紀錄
var mousePos = new Vec2(0,0)
var mousePosDown = new Vec2(0,0)
var mousePosUp = new Vec2(0,0)
window.addEventListener('mousemove',mousemove)
window.addEventListener('mouseup',mouseup)
window.addEventListener('mousedown',mousedown)
function mousemove(e){
  mousePos.set(e.x,e.y)
  // console.log(mousePos)
}
function mouseup(e){
  mousePos.set(e.x,e.y)
  mousePosUp = mousePos.clone()
}
function mousedown(e){
  mousePos.set(e.x,e.y)
  mousePosDown = mousePos.clone()
}