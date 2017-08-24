
var ctx = this;
var origMovingAverage = ctx.movingAverage;

function isNumber(obj) {
  if (isNaN(obj)) {
    return false
  }

  return Object.prototype.toString.call(obj) === '[object Number]'
}

function maybeCoerce(item) {
  if (!isNumber(item)) {
    item = parseFloat(item) || 0
  }

  return item
}

function reducer(memo, item, index, arr) {
  Object.defineProperty(memo, 'currentTotal', {
    value: (memo.currentTotal || 0) + item,
    enumerable: false,
    writable: true
  })

  memo.push(memo.currentTotal / (index + 1))
  return memo
}

function movingAverage(items) {
  if (!Array.isArray(items)) {
    items = []
  }

  return items.map(maybeCoerce).reduce(reducer, [])
}

module.exports = movingAverage;
