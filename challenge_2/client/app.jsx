import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Chart from 'chart.js';
import $ from 'jquery';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allData: [],
      currency: ['Bitcoin', 'Ethereum', 'Litecoin', 'Zcash', 'Dash', 'Ripple', 'Monero', 'NEO', 'Cardano', 'EOS'],
      currencyAbbr: ['BTC', 'ETH', 'LTC', 'ZEC', 'DASH', 'XRP', 'XMR', 'NEO', 'ADA', 'EOS'],
      timeRange: ['1 Week', '1 Month', '3 Months', '6 Months', '1 Year', '3 Years', '5 Years'],
      currentTime: '1 Year',
      charts: [],
      selected: 0,
      lowHigh: [],
      times: ['1w', '1m', '3m', '6m', '1y', '3y', '5y'],
      selectedTime: 4,
      allArray: []
    }
  }
  componentDidMount() {
    this.getData();
    var timeOptions = $('#timeRange').children('option');
    $(timeOptions[0]).attr('selected', false);
    $(timeOptions[4]).attr('selected', true);

    var times = ['1w', '1m', '3m', '6m', '1y', '3y', '5y'];
    var allArray = [];
    for (let e of this.state.currencyAbbr) {
      for (let i in times) {
        allArray.push(times[i] + e)
      }
    }
    this.setState({ allArray });
  }

  getData() {
    var s = this.state;
    $.get({
      url: '/data',
      data: { coin: s.currency[s.selected].toLowerCase(), time: s.currentTime },
      success: (data) => {
        let allData = [];
        if (s.currentTime.includes('Year')) {
          if (s.currentTime[s.currentTime.length - 1] === 's') {
            data.forEach((e, i) => {
              if (i % 7 === 0) { allData.push(e); }
            })
          } else {
            data.forEach((e, i) => {
              if (i % 3 === 0) { allData.push(e); }
            })
          }
        } else {
          if (s.currentTime.includes('1 Month')) {
            data.forEach((e, i) => {
              if (i % 7 === 0) { allData.push(e); }
            })
          } else {
            allData = [...data];
          }
        }
        this.setState({ allData }, () => {
          this.convertData();
        })
      }
    })
  }

  convertData() {
    var s = this.state;
    let times = [], prices = [], backgroundColor = ['green'], high = 0, low = 0;
    s.allData.forEach((e, i) => {
      let time = String(new Date(e[0])).slice(4, 16).replace(' 201', `, 201`).replace(' 202', `, 202`); // convert time
      if (prices.length && i > 0) {
        if (prices[prices.length - 1] > e[1]) {
          backgroundColor.push('red');
          if (e[1] < low) { low = e[1]; }
        } else {
          backgroundColor.push('green');
          if (e[1] > high) { high = e[1]; }
        }
      } else {
        high = e[1]; low = e[1];
      }
      times.push(time);
      prices.push(e[1]);
    });
    let temp;
    let diff = String(high / low - 1).split('.');
    diff = diff[0] + diff[1].slice(0, 2);
    if (diff[0] === '0') { diff = diff.slice(1); if (diff[0] === '0') { diff = diff.slice(1) } }
    if (diff.length > 3) { temp = diff.slice(diff.length - 3); diff = diff.slice(0, diff.length - 3) + ',' + temp; }
    let lowDecimals = String(low).split('.')[1].slice(0, 2);
    let highDecimals = String(high).split('.')[1].slice(0, 2);
    low = String(Math.floor(low));
    if (low.length > 3) { temp = low.slice(low.length - 3); low = low.slice(0, low.length - 3) + ',' + temp; }
    else { low += '.' + lowDecimals }
    high = String(Math.floor(high));
    if (high.length > 3) { temp = high.slice(high.length - 3); high = high.slice(0, high.length - 3) + ',' + temp; }
    else { high += '.' + highDecimals }
    this.setState({ lowHigh: [low, high, diff] });
    this.createChart(times, prices, backgroundColor);
  }

  createChart(times, prices, backgroundColor) {
    var s = this.state;
    var charts = s.charts ? (s.charts.length ? [...s.charts] : []) : [];
    if (!s.charts.includes(s.currency[s.selected])) {
      charts.push(s.currency[s.selected]);
      this.setState({ charts })
    }
    if (s.selected < 9) { // there's a gitch on EOS (last currency), so this conditional allows 2 different chart render methods
      var myChart = new Chart(s.allArray[s.selectedTime], {
        type: 'bar',
        data: {
          labels: times,
          datasets: [{
            label: `${s.currencyAbbr[s.selected]} Price`,
            data: prices,
            backgroundColor: backgroundColor,
            // borderColor: [],
            borderWidth: 1
          }]
        }
      });
    } else { // EOS render method (this works but, visual glitch after changing time values and moving mouse over chart)
      var myChart = new Chart(s.currency[s.selected], {
        type: 'bar',
        data: {
          labels: times,
          datasets: [{
            label: `${s.currencyAbbr[s.selected]} Price`,
            data: prices,
            backgroundColor: backgroundColor,
            borderWidth: 1
          }]
        }
      });
    }
  }

  selectCurrency(e) {
    e.preventDefault();
    var s = this.state;
    var newCurrency = e.target.value;
    var index = s.currency.indexOf(newCurrency);
    if (index !== this.state.selected) {
      this.setState({ selected: index }, () => {
        this.selectedTimeMaker(newCurrency);
        this.getData();
      })
    }
  }

  selectedTimeMaker(coin) {
    var selectedTime = 0;
    var s = this.state;
    if (coin === 'Bitcoin') { selectedTime = 0; }
    else if (coin === 'Ethereum') { selectedTime = 7; }
    else if (coin === 'Litecoin') { selectedTime = 14; }
    else if (coin === 'Zcash') { selectedTime = 21; }
    else if (coin === 'Dash') { selectedTime = 28; }
    else if (coin === 'Ripple') { selectedTime = 35; }
    else if (coin === 'Monero') { selectedTime = 42; }
    else if (coin === 'NEO') { selectedTime = 49; }
    else if (coin === 'Cardano') { selectedTime = 56; }
    else if (coin === 'EOS') { selectedTime = 73; }

    var time = 0;
    if (s.currentTime === '1 Week') { time = 0; }
    else if (s.currentTime === '1 Month') { time = 1; }
    else if (s.currentTime === '3 Months') { time = 2; }
    else if (s.currentTime === '6 Months') { time = 3; }
    else if (s.currentTime === '1 Year') { time = 4; }
    else if (s.currentTime === '3 Years') { time = 5; }
    else if (s.currentTime === '5 Years') { time = 6; }

    selectedTime += time;
    this.setState({ selectedTime });
  }

  timeRange(e) {
    e.preventDefault();
    var currentTime = e.target.value;
    this.setState({ currentTime }, () => {
      this.selectedTimeMaker(this.state.currency[this.state.selected]);
      this.getData()
    })
  }

  convertTime() {
    var s = this.state;
    var num = s.currentTime[0];
    var interval = s.currentTime.slice(2);
    if (interval[interval.length - 1] === 's') { interval = interval.slice(0, -1) }
    if (num === '1') { num = 'One-' }
    else if (num === '3') { num = 'Three-' }
    else if (num === '5') { num = 'Five-' }
    else if (num === '6') { num = 'Six-' }
    return num + interval;
  }

  render() {
    var s = this.state;
    return (
      <>
        <h1>{this.convertTime()} {s.currency[s.selected]} Chart in $USD</h1>
        <div className="select top">
          <div className="selectTitle">Cryptocurrency -</div><p style={{ color: 'white' }}>_</p>
          <select name="Currency" onChange={this.selectCurrency.bind(this)}>
            {s.currency.map((e, i) => (
              <option key={i} id={i}>{e}</option>
            ))}
          </select>
          <p style={{ color: 'white' }}>__</p>
          <div className="selectTitle">Time Range -</div><p style={{ color: 'white' }}>_</p>
          <select name="TimeRange" id="timeRange" onChange={this.timeRange.bind(this)}>
            {s.timeRange.map((e, i) => (
              <option key={i} id={i}>{e}</option>
            ))}
          </select>
        </div>
        <br></br>
        <div className="select">
          <div style={{ width: '130px' }}></div>
          {s.selected < 9 ?
            s.allArray.map((e, i) => (
              i === s.selectedTime ? <canvas key={e} id={e} className="chart"></canvas> : <div key={e}></div>
            ))
            : <canvas id={s.currency[9]} className="chart"></canvas> /* render method for EOS only */

            // : s.currency.map((e, i) => ( // render method for EOS only
            //   i === s.selected ? <canvas key={e} id={s.currency[i]} className="chart"></canvas> : <div key={i}></div>
            // ))
          }
          <div style={{ width: '130px' }}></div>
        </div>
        <div className="select lowHigh">
          <div className="selectTitle">Low: </div><p style={{ color: 'white' }}>_</p><h2>${s.lowHigh[0]}</h2><p style={{ color: 'white' }}>___</p>
          <div className="selectTitle">High: </div><p style={{ color: 'white' }}>_</p><h2>${s.lowHigh[1]}</h2><p style={{ color: 'white' }}>___</p>
          <div className="selectTitle">Differential: </div><p style={{ color: 'white' }}>_</p><h2>{s.lowHigh[2]}%</h2>
        </div>
      </>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));