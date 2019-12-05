import React, { Component } from 'react';
import $ from 'jquery';
import Pins from './Pins.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frame: 1, // out of 10
      round: 1, // out of 3
      pinsLeft: 10,
      pinsDown: 0,
      score: 0,
      tenthStrike: false,
      gameOver: false,
      lastFrameScored: 0,
      prevSpare: 0,
      prevStrike: 0
    }
  }
  componentDidMount() {
    this.setState({
      frame: 1, round: 1, pinsLeft: 10, pinsDown: 0, score: 0, tenthStrike: false, gameOver: false,
      lastFrameScored: 0, prevSpare: 0, prevStrike: 0
    });
  }
  reset() {
    this.componentDidMount();
    for (let i = 10; i > 0; i--) {
      $(`#b${i}`).css('background', 'lightgreen');
      $(`#${i}a`).text(``);
      $(`#${i}b`).text(``);
      $(`#s${i}`).text(``);
      if (i === 10) { $(`#${i}c`).text(``); }
    }
  }

  nextFrame() {
    var s = this.state;
    setTimeout(() => {
      if (s.round !== 3 || s.tenthStrike) {
        for (let i = 10; i > 0; i--) {
          $(`#b${i}`).css('background', 'lightgreen');
        }
      }
      var frame = s.frame < 10 ? s.frame + 1 : 10;
      var round = s.frame === 10 ? s.round + 1 : 1;
      var pinsLeft = s.round === 3 && !s.tenthStrike ? s.pinsLeft : 10;
      var pinsDown = s.round === 3 && !s.tenthStrike ? s.pinsDown : 0;
      this.setState({ frame, round, pinsLeft, pinsDown })
    }, 80);
  }

  changePinClickColor() {
    var s = this.state;
    let i = 10 - s.pinsDown;
    if (s.pinsLeft < i) {
      $(`#b${i}`).css('background', 'red');
      i--;
    }
    var interval = setInterval(() => {
      if (s.pinsLeft < i) {
        $(`#b${i}`).css('background', 'red');
        i--;
      } else {
        clearInterval(interval);
        if (s.round === 1 && s.pinsLeft > 0) {
          this.setState({ round: 2 });
        } else if (s.round === 1 && s.pinsLeft === 0) {
          this.nextFrame();
        } else if (s.round === 2 && s.frame < 10) {
          this.nextFrame();
        } else if (s.round === 2 && s.frame === 10 && !s.gameOver) {
          this.setState({ round: 3 }, () => {
            this.nextFrame();
          });
        }
        this.setState({ pinsDown: 10 - s.pinsLeft });
      }
    }, 80)
  }

  pinClick(e) {
    var s = this.state;
    var val = e.target.innerText;
    var pinsLeft = s.pinsLeft - Number(val);
    var gameOver = false;

    if (pinsLeft >= 0 && !s.gameOver) {

      if (s.round === 1) {
        if (pinsLeft > 0) {
          if (val !== '0') { $(`#${s.frame}a`).text(`${val}`) }
          else { $(`#${s.frame}a`).text(`—`) }
          if (s.prevSpare) {
            this.keepScore(10 - pinsLeft, false, false);
          } else if (s.prevStrike === 2) {
            this.keepScore(10 - pinsLeft, false, false);
          }
        } else {
          if (s.frame < 10) {
            $(`#${s.frame}b`).text(`X`);
            this.keepScore(10, true, false);
          } else {
            $(`#10a`).text(`X`); this.setState({ tenthStrike: true }, () => {
              this.keepScore(10, true, false);
            });
          }
        }
      } else if (s.round === 2) {

        // complete score unless 10th frame and spare or strike
        if (pinsLeft > 0) {
          if (val !== '0') { $(`#${s.frame}b`).text(`${val}`) }
          else { $(`#${s.frame}b`).text(`—`) }
          if (s.frame === 10) {
            if (s.tenthStrike) { this.setState({ tenthStrike: false }); }
            else { gameOver = true; }
          }
          // if (s.prevStrike || s.frame !== 10 || gameOver) {
          this.keepScore(10 - pinsLeft, false, false);
          // }
        } else {
          if (s.frame < 10 || !s.tenthStrike) {
            $(`#${s.frame}b`).text(`/`);
            this.keepScore(10, false, true);
            if (s.frame === 10) { this.setState({ tenthStrike: true }) }
          } else {
            $(`#10b`).text(`X`);
            this.keepScore(10, true, false);
          }
        }
      } else { // frame 10, round 3

        gameOver = true;
        if (pinsLeft > 0) {
          if (val !== '0') { $(`#10c`).text(`${val}`) }
          else { $(`#10c`).text(`—`) }
        } else {
          if (!s.tenthStrike) { $(`#10c`).text(`/`) }
          else { $(`#10c`).text(`X`) }
        }
        this.keepScore(10 - pinsLeft, false, false);
      }
      this.setState({ pinsLeft, gameOver }, () => {
        this.changePinClickColor();
      })

    }
  }

  keepScore(pins, strike, spare) {
    var s = this.state;
    var score = pins + s.score;

    if (strike) {
      var prevStrike = 1;

      if (s.prevSpare) {
        score += 10;
        $(`#s${s.lastFrameScored + 1}`).text(`${score}`);
        this.setState({ score, lastFrameScored: s.lastFrameScored + 1, prevSpare: 0 });
      } else if (s.prevStrike === 2) {
        score += 20;
        prevStrike++;
        $(`#s${s.lastFrameScored + 1}`).text(`${score}`);
        this.setState({ score, lastFrameScored: s.lastFrameScored + 1 });
      } else if (s.prevStrike === 1) {
        prevStrike++;
      }
      this.setState({ prevStrike })

    } else if (spare) {
      if (s.prevStrike) {
        score += 10;
        $(`#s${s.lastFrameScored + 1}`).text(`${score}`);
        this.setState({ score, lastFrameScored: s.lastFrameScored + 1, prevSpare: 1, prevStrike: 0 });
      } else { // no prevStrike or prevSpare
        this.setState({ prevSpare: 1 });
      }

    } else { // regular score keeping
      if (s.prevSpare) {
        score += 10;
        $(`#s${s.lastFrameScored + 1}`).text(`${score}`);
        this.setState({ score, lastFrameScored: s.lastFrameScored + 1, prevSpare: 0 });
      } else if (s.prevStrike === 2) {
        score += 20;
        $(`#s${s.lastFrameScored + 1}`).text(`${score}`);
        this.setState({ score, lastFrameScored: s.lastFrameScored + 1, prevStrike: 1 });
      } else if (s.prevStrike === 1) {
        score += 10;
        $(`#s${s.lastFrameScored + 1}`).text(`${score}`);
        score += pins;
        $(`#s${s.lastFrameScored + 2}`).text(`${score}`);
        this.setState({ score, lastFrameScored: s.lastFrameScored + 2, prevStrike: 0 });
      } else {
        $(`#s${s.frame}`).text(`${score}`);
        this.setState({ score, lastFrameScored: s.frame });
      }
    }
  }

  render() {
    var s = this.state;
    return (<>
      <h1>Bowling</h1>
      <div id='gridTop'>
        <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div><div>9</div><div>10</div>
      </div>
      <div id='grid'>
        <div><div className='smallSquare'></div></div>
        <div><div className='smallSquare'></div></div>
        <div><div className='smallSquare'></div></div>
        <div><div className='smallSquare'></div></div>
        <div><div className='smallSquare'></div></div>
        <div><div className='smallSquare'></div></div>
        <div><div className='smallSquare'></div></div>
        <div><div className='smallSquare'></div></div>
        <div><div className='smallSquare'></div></div>
        <div><div className='lastSquares ex'></div><div className='lastSquares'></div><div className='lastSquares'></div></div>
      </div>
      <div id='gridMid'>
        <div id='1a'></div><div id='1b'></div><div id='2a'></div><div id='2b'></div><div id='3a'></div><div id='3b'></div>
        <div id='4a'></div><div id='4b'></div><div id='5a'></div><div id='5b'></div><div id='6a'></div><div id='6b'></div>
        <div id='7a'></div><div id='7b'></div><div id='8a'></div><div id='8b'></div><div id='9a'></div><div id='9b'></div>
        <div id='10a'></div><div id='10b'></div><div id='10c'></div>
      </div>
      <div id='gridBott'> {/* SCORE */}
        <div id='s1'></div><div id='s2'></div><div id='s3'></div><div id='s4'></div><div id='s5'></div><div id='s6'></div>
        <div id='s7'></div><div id='s8'></div><div id='s9'></div><div id='s10'></div>
      </div>
      {/* <div className='x'><div className='hollow'></div></div> */}
      <div id='cross'></div>
      <Pins pinClick={this.pinClick.bind(this)} />
      <div id='flex'>
        <h2>FRAME</h2>
        <div style={{width: '130px'}}></div>
        <button onClick={this.reset.bind(this)} id='reset'>Reset</button>
      </div>
      <div id='frame'>{s.frame}</div>
    </>)
  }
}

export default App;
