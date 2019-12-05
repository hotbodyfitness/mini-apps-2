import React from 'react';

var Pins = ({ pinClick }) => {
  return (<>
    <h4>Select how many pins were knocked down...</h4>
    <div id='gridPins0' className='gridPins'>
      <button onClick={pinClick} id='b0'>0</button>
    </div>
    <div id='gridPins1' className='gridPins'>
      <button onClick={pinClick} id='b1'>1</button><button onClick={pinClick} id='b2'>2</button><button onClick={pinClick} id='b3'>3</button>
      <button onClick={pinClick} id='b4'>4</button>
    </div>
    <div id='gridPins2' className='gridPins'>
      <button onClick={pinClick} id='b5'>5</button><button onClick={pinClick} id='b6'>6</button><button onClick={pinClick} id='b7'>7</button>
    </div>
    <div id='gridPins3' className='gridPins'>
      <button onClick={pinClick} id='b8'>8</button><button onClick={pinClick} id='b9'>9</button>
    </div>
    <div id='gridPins4' className='gridPins'>
      <button onClick={pinClick} id='b10'>10</button>
    </div>
  </>)
};

export default Pins;