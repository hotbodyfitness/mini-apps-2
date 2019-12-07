var surroundingValues = (id, numbers, revealed, bombs) => {

  var skipOrNot = (current, num) => {
    if (current === 1 && num === -9) {/* SKIP topL corner */ return true; }
    else if (current === 10 && (num === -1 || num === -11)) {/* SKIP topR corner */ return true; }
    else if (current === 91 && (num === 11 || num === 1)) {/* SKIP botL corner */ return true; }
    else if (current === 100 && num === 9) {/* SKIP botR corner  */ return true; }
    else if (String(current).slice(1) === '1' && (num === 11 || num === 1 || num === -9)) {/* SKIP left side */ return true; }
    else if (String(current).slice(1) === '0' && (num === 9 || num === -1 || num === -11)) {/* SKIP right side */ return true; }

    else if (current - num > 0 && current - num <= 100) { // between 1-100
      if (!rev.includes(String(current - num)) && !arr.includes(String(current - num))) {
        return false;
      }
    }
    return true;
  };

  var arr = [];
  var arrAddl = [];
  var test = [11, 10, 9, 1, 0, -1, -9, -10, -11];
  var blanks = [];
  var current = id;
  var rev = revealed.length ? [...revealed] : [];

  for (let i = 0; i < test.length; i++) {
    let num = test[i];
    if (!skipOrNot(current, num)) {
      if (numbers[current - num]) { // if it's a number
        arr.push(String(current - num));
      } else {                     // if it's a blank

        if (num > 0) { // topL hasn't been completed
          blanks.push([current, i - 1]); // store for later
          current -= num;
          i = -1;

        } else if (num === 0) {
          arr.push(String(current));
          if (current + 9 < 101 && String(current + 9).slice(1, 2) !== '0') {arrAddl.push(String(current + 9));}
          if (current + 11 < 101 && String(current + 11).slice(1) !== '1') {arrAddl.push(String(current + 11));}

        } else { // topL completed, move forward

          if (String(current - num).slice(1) !== '1') { // if it's not the left edge
            let testBotL = current - num + 9;
            if (!skipOrNot(current + 9, num)) {
              if (numbers[testBotL]) {
                arr.push(String(testBotL));
              } else if (!bombs.includes(String(testBotL))) { // make sure it's not a bomb
                blanks.push([testBotL, -1]);
              }
            }
          } // this testBotL handles the special case of a number in the bottom L corner of a newly found blank square

          if (String(current - num).slice(1) !== '0') { // if it's not the right edge
            let testBotR = current - num + 11;
            if (!skipOrNot(current + 11, num)) {
              if (numbers[testBotR]) {
                arr.push(String(testBotR));
              } else if (!bombs.includes(String(testBotR))) { // make sure it's not a bomb
                blanks.push([testBotR, -1]);
              }
            }
          } // testBotR handles the special case of a number in the bottom R corner of a newly found blank square

          current -= num;
          i = -1; // start over with the next blank value
        }
      }
    }
    if (i === test.length - 1 && blanks.length) { // last value and still have blanks
      let testThis = blanks[blanks.length - 1];
      current = testThis[0];
      i = testThis[1];
      blanks.splice(blanks.length - 1);
    }
  }

  return [...new Set([...arr, ...arrAddl])];
  // return arr;
}

export default surroundingValues;