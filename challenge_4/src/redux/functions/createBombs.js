var createBombs = () => {
  var bombs = [];
  var store = {};
  var randomize = () => {
    var random = String(Math.floor(Math.random() * 100) + 1);
    if (store[random]) {
      randomize();
    } else {
      store[random] = 1;
      bombs.push(random);
    }
    if (bombs.length < 10) {
      randomize();
    }
  }
  randomize();
  return bombs;
}

export default createBombs;