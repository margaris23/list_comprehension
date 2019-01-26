const log = console.log;
const time = console.time;
const timeEnd = console.timeEnd;
const metric = (name, fn) => { time(name); fn(); timeEnd(name); };

// S2 = [ x^2 | x ε S1, x < 10 ]
// for every x in S1 and x < 10 then provide 2x

// This looks like a Set of primitive items i.e numbers
function S1(initial) {
  let _val = initial;

  this.next = function () {
    return ++_val;
  };
}

// Transformer of items in S1
function S2(calcFn, condFn) {
  let _set1 = new S1(0);  // very restrictive !!!

  this.toList = function* () {
    let newItem = _set1.next(); // holds current element...why?

    while (condFn(newItem)) {
      yield calcFn(newItem);
      newItem = _set1.next();
    }

  };
}

// Generate a Set from another Set of integers
const evaluator = x => x * x;
const conditioner = x => x < 1000;  // or 'limiter'

// Parse using for..of (slower)
const s2_a = new S2(evaluator, conditioner);

metric('for..of', () => {
  const toList = s2_a.toList();
  for (let x of toList) x;
});

// Parse using iterator
const s2_b = new S2(evaluator, conditioner);
const iter = s2_b.toList();

metric('iterator', () => {
  let res = iter.next();
  while(!res.done) {  // while === 'where'
    res.value;
    res = iter.next();
  }
});
