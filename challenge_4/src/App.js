import React from 'react';
import surroundingValues from './redux/functions/surroundingValues.js';
import './App.css';

var App = ({ win, lose, logWin, logLose, revealSurrounding, revealed, click, bombs, numbers, reset }) => {
  var arr = [];
  var revIndex = 0;
  var rev = revealed ? revealed.revealed : revealed;
  var loser = false;
  if (rev && rev.length === 90 && !lose) {
    logWin();
  }
  if (rev && !rev.length) {
    for (let i = 1; i < 101; i++) {
      let node = document.getElementById('g' + i);
      if (node) {
        node.innerText = '';
      }
    }
  }

  for (let i = 1; i <= 100; i++) {
    if (rev && rev[revIndex] && Number(rev[revIndex]) === i) {
      if (bombs && bombs.includes(String(i))) {
        arr.push('boom' + i);
        logLose(String(i));
        loser = true;
      } else if (numbers[i]) {
        arr.push(['n' + i, numbers[i]])
      } else {
        arr.push('g' + i);
      }
      revIndex++;
    } else {
      if (numbers[i] || (bombs && bombs.includes(String(i)))) {
        arr.push(i);
      } else {
        arr.push('o' + i);
      }
    }
  }
  if (loser) {
    bombs.forEach(e => {
      if (String(e) !== lose) {
        arr[e - 1] = 'b' + e;
      }
    })
  }

  if (win) {
    bombs.forEach(e => {
      let node = document.getElementById('g' + e);
      node.innerText = '⚑';
      node.style.color = 'rgb(254, 173, 0)';
      node.style.textShadow = '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000';
      node.style.fontWeight = '500';
    })
  }

  var showOpenMouth = () => {
    var smile = document.getElementById('smile').childNodes[0];
    if (!win) {
      smile.innerText = '😮';
    }
  };
  var closeMouth = () => {
    var smile = document.getElementById('smile').childNodes[0];
    if (lose) {
      smile.innerText = '😵';
    } else if (win) {
      smile.innerText = '😎';
    } else {
      smile.innerText = '🙂';
    }
  };

  var handleRight = (e) => {
    // e.preventDefault(); // don't need this because it's prevented in the html file
    if (!win) {
      var node = document.getElementById(e.target.id);
      if (node.innerText === '') {
        node.innerText = '⚑';
      } else if (node.innerText === '⚑') {
        node.innerText = '?';
        node.style.color = 'black';
        node.style.textShadow = 'none';
        node.style.fontWeight = '700';
      } else {
        node.innerText = '';
        node.style.color = 'rgb(254, 173, 0)';
        node.style.textShadow = '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000';
        node.style.fontWeight = '500';
      }
    }
  }

  return (
    <div>
      <h1>Minesweeper</h1>
      <button id='smile' onClick={reset}>{
        win ? <span role='img'>😎</span> :
          (lose ? <span role='img'>😵</span> :
            <span role='img'>🙂</span>)
      }</button>
      <div id='mainGrid'>
        {arr.map((e, i) => (
          e[0] === 'g' ?
            <div key={e} id={e} className='blank'></div> : (
              e[0] === 'b' ?
                (e.slice(0, 4) === 'boom' ? <div key={e} id={e} className='bomb'><div><p>X</p></div></div> :
                  <div key={e} id={e} className='bomb bomb2'><div></div></div>) : (
                  e[0] && e[0][0] === 'n' ? <div className='number' key={e[0]} id={e[0]}><span className={'n' + e[1]}>{e[1]}</span></div> : (
                    e[0] === 'o' ?
                      <button className='button' onContextMenu={handleRight} onMouseDown={showOpenMouth} onMouseUp={closeMouth} onMouseOut={closeMouth} onClick={() => revealSurrounding(surroundingValues(Number(e.slice(1)), numbers, revealed, bombs))} key={e} id={'g' + e.slice(1)}></button> :
                      <button className='button' onContextMenu={handleRight} onMouseDown={showOpenMouth} onMouseUp={closeMouth} onMouseOut={closeMouth} onClick={(ev) => { if (document.getElementById(ev.target.id).innerText === '') { click(ev) } }} key={e} id={'g' + e}></button>
                  )
                )
            )
        ))}
      </div>
    </div>
  )
}

export default App;
