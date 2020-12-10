var container = document.querySelector('.container');
var list = document.querySelector('.list');
var items = document.querySelectorAll('.item');


//小点自动根据图片个数创建方法
var pointWrap = document.querySelector('.point')
var point = []
//根据item的长度创建小点
//携带参数i因为要判断i=1时即初始化时就选中
var createPoint = function (i) {
  var pointDom = document.createElement('li')
  //创建基础类名
  pointDom.classList.add('point-item')
  //第一个初始化时就选中
  if (i === 0) {
    pointDom.classList.add('active')
  }
  //放到数组里
  point.push(pointDom)
  //将pointDom添加到容器内
  pointWrap.appendChild(pointDom);
}

//根据index来切换active类名
var setIndex = function () {
  for (var i = 0; i < point.length; i++) {
    //清除所有active类名
    point[i].classList.remove('active')
  }
  //当前项添加active类名
  point[state.index].classList.add('active')
}


//解决移动端屏幕宽度兼容问题,使用window.innerWidth代替375
for (var i = 0; i < items.length; i++) {
  items[i].style.width = window.innerWidth + 'px';
  createPoint(i)
}
//ul的长度兼容写法
list.style.width = items.length * window.innerWidth + 'px'


//记录状态,beginX，endX均为坐标
var state = {
  beginX: 0,
  endX: 0,
  moveX: 0,
  //当前第index张在轮播
  index: 0
}

//复位函数
var reset = function () {
  //需要一个过渡让复位效果更自然
  list.style.transition = 'all .3s'
  //现在在第几张就要复位到第几张
  list.style.marginLeft = (-state.index * window.innerWidth + 'px')
}

var goNext = function () {
  //state.index小于最后一张写法items.length - 1
  if (state.index < items.length - 1) {
    state.index++;
    list.style.transition = 'all .3s'
    list.style.marginLeft = (-state.index * window.innerWidth + 'px');
    setIndex()
  } else {
    reset()
  }
}


var goPrev = function () {
  if (state.index > 0) {
    state.index--;
    list.style.transition = 'all .3s'
    list.style.marginLeft = -state.index * window.innerWidth + 'px';
    setIndex()
  } else {
    reset()
  }
}

//判断怎么移动，向左向右还是复位;touchend时调用
var judgemove = function () {
  //moveX为移动距离（移动结束时坐标-开始移动坐标），向左移动为负数，向右移动为正数
  // 移动到下一张时moveX为负值,移动到上一张时moveX为正值
  if (state.moveX >= window.innerWidth * 2 / 5) {
    //上一张
    goPrev()
  } else if (state.moveX < -window.innerWidth * 2 / 5) {
    //下一张
    goNext()
  } else {
    //复位
    reset()
  }
}

//跟手函数，计算跟手时的移动，放在touchmove事件中
var slice = function () {
  moveX = state.endX - state.beginX;
  state.moveX = moveX;
  // console.log(state.moveX)
  //注意此处写法,27分钟处
  list.style.marginLeft = -(window.innerWidth * state.index) + moveX + 'px';
}


//开始触摸到
list.addEventListener('touchstart', function (e) {
  //去除过度获得良好的跟手反馈
  list.style.transition = 'none'
  state.beginX = e.targetTouches[0].clientX
})

//触摸移动时
list.addEventListener('touchmove', function (e) {
  state.endX = e.changedTouches[0].clientX;
  slice()
})

//触摸结束时
list.addEventListener('touchend', function (e) {
  //结束触摸式判断如何移动
  judgemove()
})