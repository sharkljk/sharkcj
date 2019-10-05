//说明
/*  参数: 
 *       1.要加功能的盒子 (每一项不能有间隔，可以有padding)
 *       2.一个数组,它得是盒子中的每一项
 *       3.回调函数，可使用参数1:当前拖拽项的索引 2:拖到哪里的那一项的索引
 * 可参考演示html  
 * 没完善，闲了会加左右拖拽 
 */

class sharkTz {
    constructor(nav, arr, fn) {
        this.nav = nav;
        this.tuoArr(arr);
        this.i = 0;
        this.arr = [];
        this.ary = arr;
        this.fn = fn;
    }
    tuoArr(arr) {
        this.nav.innerHTML = '';
        arr.forEach(item => {
            this.nav.innerHTML += `<div>${item}</div>`;
        })
        this.navList = [...this.nav.querySelectorAll('div')];
        this.h = this.navList[0].clientHeight;
        this.nav.style.height = this.navList[0].clientHeight * arr.length + 'px';
        this.boundary = this.h * (this.navList.length - 1);
        this.navList.forEach((item, index) => {
            item.style.top = this.h * index + 'px';
            // item.addEventListener('mousedown', this.down);
            item.onmousedown = this.down.bind(this, item);
        })
    }
    down(shark, ev) { //shark 当前这一项
        shark.style.zIndex = '999';
        shark.y = ev.pageY;
        shark.t = shark.offsetTop;
        this.navList.forEach((item, index) => {
            item == shark ? this.i = index : null; //记录当前是那一项
            this.arr.push(item.offsetTop); //记录所有项的offsetTop
        })
        this.topNav = this.navList.slice(0, this.i).reverse(); //记录当前项上面每一项 和 每一项的offsetTop
        this.topArr = this.arr.slice(0, this.i + 1).reverse();

        this.botNav = this.navList.slice(this.i + 1); //记录当前项下面每一项 和 每一项的offsetTop
        this.botArr = this.arr.slice(this.i);

        shark.move = this.move.bind(this, shark);
        shark.up = this.up.bind(this, shark);
        document.addEventListener('mousemove', shark.move);
        document.addEventListener('mouseup', shark.up)
    }
    move(shark, ev) {
        let H = ev.pageY - shark.y + shark.t;
        if (H < 0 || H > this.boundary) return;
        shark.style.top = H + 'px';
        let n = (shark.y - ev.pageY) / this.h; //算出初始位置到现在的距离
        if (n > 0) { // 上拖
            this.topNav.forEach((item, index) => {
                item.style.top = this.topArr[index + 1] + 'px';
            })
            for (let i = 0; i < Math.round(n); i++) {
                this.topNav[i].style.top = this.topArr[i] + 'px';
            }
        } else { // 下拽
            this.botNav.forEach((item, index) => {
                item.style.top = this.botArr[index + 1] + 'px';
            })
            for (let i = 0; i < Math.abs(Math.round(n)); i++) {
                this.botNav[i].style.top = this.botArr[i] + 'px';
            }
        }
    }
    up(shark, ev) {
        document.removeEventListener('mousemove', shark.move);
        document.removeEventListener('mouseup', shark.up)
        let n = Math.round(shark.offsetTop / this.h);
        this.ary.splice(n, 0, (this.ary.splice(this.i, 1)[0]));
        this.tuoArr(this.ary);
        this.fn(this.i, n);
    }
}