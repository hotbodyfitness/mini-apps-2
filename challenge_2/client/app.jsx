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
      selected: 0
    }
  }
  componentDidMount() {
    this.getData();
    var timeOptions = $('#timeRange').children('option');
    $(timeOptions[0]).attr('selected', false);
    $(timeOptions[4]).attr('selected', true);
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
          allData = [...data];
        }
        this.setState({ allData }, () => {
          this.convertData();
        })
      }
    })
  }

  convertData() {
    var s = this.state;
    let times = [], prices = [], backgroundColor = ['green'];
    s.allData.forEach((e, i) => {
      let time = String(new Date(e[0])).slice(4, 16).replace(' 201', `, 201`); // convert time
      if (prices.length) {
        if (prices[prices.length - 1] > e[1]) {
          backgroundColor.push('red');
        } else {
          backgroundColor.push('green');
        }
      }
      times.push(time);
      prices.push(e[1]);
    });
    this.createChart(times, prices, backgroundColor);
  }

  createChart(times, prices, backgroundColor) {
    var s = this.state;
    var charts = s.charts.length ? [...s.charts] : [];
    if (!s.charts.includes(s.currency[s.selected])) {
      charts.push(s.currency[s.selected]);
      this.setState({ charts })
    }
    // console.log($('.chart').val());
    // myChart.destroy();
    var myChart = new Chart(s.currency[s.selected], {
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
  }

  selectCurrency(e) {
    e.preventDefault();
    var newCurrency = e.target.value;
    var index = this.state.currency.indexOf(newCurrency);
    if (index !== this.state.selected) {
      this.setState({ selected: index }, () => {
        this.getData(newCurrency);
      })
    }
  }

  timeRange(e) {
    e.preventDefault();
    var currentTime = e.target.value;
    this.setState({ currentTime }, () => {
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
        <div className="select">
          <div id="selectTitle">Cryptocurrency -</div><p style={{ color: 'white' }}>_</p>
          <select name="Currency" onChange={this.selectCurrency.bind(this)}>
            {s.currency.map((e, i) => (
              <option key={i} id={i}>{e}</option>
            ))}
          </select>
          <p style={{ color: 'white' }}>__</p>
          <div id="selectTimeRange">Time Range -</div><p style={{ color: 'white' }}>_</p>
          <select name="TimeRange" id="timeRange" onChange={this.timeRange.bind(this)}>
            {s.timeRange.map((e, i) => (
              <option key={i} id={i}>{e}</option>
            ))}
          </select>
        </div>
        <br></br>
        {s.currency.map((e, i) => (
          i === s.selected ? <canvas key={e} id={s.currency[i]} className="chart"></canvas> : <div key={i}></div>
        ))}
      </>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));