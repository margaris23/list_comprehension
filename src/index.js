const log = console.log;
const time = console.time;
const timeEnd = console.timeEnd;
const metric = (name, fn) => { time(name); fn(); timeEnd(name); };

// Σ2 = [ 2χ | χ ε Σ1, χ < 1000 ]
// for every x in S1 and x < 1000 then provide 2*x

/**
 * Sets can either be finite or infinite
 */
// This looks like a Set of primitive items i.e numbers
function IntegerSet(initial) {
  let _val = initial;

  this.next = function () {
    return ++_val;
  };
}

// Transformer of items from IntegerSet (Morphism)
function S2(morphFn, condFn) {
  let _integers = new IntegerSet(0);  // very restrictive !!!

  this.iterate = function* () {
    let newItem = _integers.next(); // holds current element...why?
    while (condFn(newItem)) {
      yield morphFn(newItem);
      newItem = _integers.next();
    }
  };
}

// Generate another Set from a Set of integers
const morpher = x => 2* x;
const conditioner = x => x < 1000;  // or 'limiter'

// Parse using for..of (slower)
const s2_a = new S2(morpher, conditioner);

metric('for..of', () => {
  const list = s2_a.iterate();
  for (let x of list) x;
});

// Parse using iterator
const s2_b = new S2(morpher, conditioner);
const iter = s2_b.iterate();

metric('iterator', () => {
  let res = iter.next();
  while(!res.done) {  // while === 'where'
    res.value;
    res = iter.next();
  }
});

// IDEAS!!!

/* Through method call (similar to LinQ)
const newSet = new IntegerSet(0)
  .select(x => x < 10)
  .morph(x => x + 1);
*/

/* Through util function

Idea 1:
const newSet = [ x => x + 1, new IntegerSet(0).select(x => x < 10) ];
iterate(newSet); // or generate(newSet);

Idea 2:
const newSet = [ x => x + 1, IntegerSet, x => x < 10];
make(newSet); // or iterate(newSet) or morph(newSet) e.t.c
*/

/* Through factory
Idea 1:
const newSet = [ x => x + 1, From.IntegerSet.select(x => x < 10) ];

Idea 2:
const newSet = From(IntegerSet).forEvery(x => x < 10).take(x => x + 1);
*/


// Should distinguish finite from infinite series
// TODO: soon to come ...

// let view;
// metric('typed-arrays.intialize', () => {
//   const MAX = 2 ** 24;
//   view = new Int32Array(MAX);
//   for (let i = 0; i < MAX; i++) {
//     view[0] = i;
//   }
// });

// log('Memory Usage', process.memoryUsage());
