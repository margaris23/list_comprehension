'use strict';

const log = console.log;
const time = console.time;
const timeEnd = console.timeEnd;

// S2 = [ x^2 | x ε S1, x < 10 ]
// for every x in S1 and x < 10 then provide 2x

function S1() {
  let _elem = 0; // initial value

  this.next = function () {
    return ++_elem;
  };
}

function S2(calcFn, condFn) {
  let _set1 = new S1();

  this.toList = function* () {
    let newItem = _set1.next();

    while (condFn(newItem)) {
      yield calcFn(newItem);
      newItem = _set1.next();
    }

  };
}

const s2_a = new S2(x => x*x, x => x < 1000);

time('for..of');
const toList = s2_a.toList();
for (let x of toList) x;
timeEnd('for..of');

const s2_b = new S2(x => x*x, x => x < 1000);
const iter = s2_b.toList();

time('iterator');
let res = iter.next();
while(!res.done) {
  res.value;
  res = iter.next();
}
timeEnd('iterator')