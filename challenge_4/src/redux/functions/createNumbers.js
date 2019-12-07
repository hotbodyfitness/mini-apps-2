var createNumbers = (b) => {
  // var numbers = []; // array of arrays
  var numbers = {};
  var bombs = [];

  // build bombs array as integers
  b.forEach(e => {
    bombs.push(Number(e))
  });

  // when a bomb is hit add one (+1) to all surrounding number squares (except for other bombs or blanks)
  bombs.forEach(e => {
    var test = [11, 10, 9, 1, -1, -9, -10, -11];
    test.forEach(num => {
      if (e === 1 && num === -9) {/* SKIP topL corner */}
      else if (e === 10 && (num === -1 || num === -11)) {/* SKIP topR corner */}
      else if (e === 91 && (num === 11 || num === 1)) {/* SKIP botL corner */}
      else if (e === 100 && num === 9) {/* SKIP botR corner  */}
      else if (String(e).slice(1) === '1' && (num === 11 || num === 1 || num === -9)) {/* SKIP left side */}
      else if (String(e).slice(1) === '0' && (num === 9 || num === -1 || num === -11)) {/* SKIP right side */}

      // if none of those constraints are hit, see if square is between 1-100
      else if (e - num > 0 && e - num <= 100) {
        if (numbers[e - num]) { numbers[e - num]++; }
        else { numbers[e - num] = 1; }
      }
    })
  })
  return numbers;
}

export default createNumbers;