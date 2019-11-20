import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      pageCount: 0,
      first: '',
      prev: '',
      next: '',
      last: ''
    }
  }

  componentDidMount() {
    $('#paginate ul').css('display', 'inline-block').css('list-style-type', 'none');
    $('#paginate li').css('display', 'inline-block').css('border', '1px solid grey').css('margin', '2px').css('padding', '3px');
    $('.nextOne').click(() => { this.clickNext() })
    $('.prevOne').click(() => { this.clickPrev() })
  }

  componentDidUpdate() {
    $('#paginate ul').css('display', 'inline-block').css('list-style-type', 'none');
    $('#paginate li').css('display', 'inline-block').css('border', '1px solid grey').css('margin', '2px').css('padding', '3px');
  }

  clickNext() {
    $.get({
      url: this.state.next,
      success: (json, status, xhr) => {
        this.pagination(xhr.getResponseHeader('Link'))
        this.setState({ list: json })
      }
    })
  }

  clickPrev() {
    $.get({
      url: this.state.prev,
      success: (json, status, xhr) => {
        this.pagination(xhr.getResponseHeader('Link'))
        this.setState({ list: json })
      }
    })
  }

  pagination(linkHeader) {
    let arrOfValues = linkHeader.split(',').slice(1); // first, prev (possible), next (possible), last
    var prev = '', next = '', last = '';
    arrOfValues.forEach(e => {
      var eSplit = e.split(';');
      if (eSplit[1].includes('prev')) {
        prev = eSplit[0].slice(2, -1);
      } else if (eSplit[1].includes('next')) {
        next = eSplit[0].slice(2, -1);
      } else if (eSplit[1].includes('last')) {
        last = eSplit[0].slice(2, -1);
      }
    });
    let pageCount = Number(last.split('page=')[1]);
    this.setState({ prev, next, last, pageCount });
  }

  search(e) {
    e.preventDefault();
    let val = document.getElementById('search').value;
    let first = `http://localhost:3000/events?q=${val}&_page=1`;
    $.get({
      url: first,
      success: (json, status, xhr) => {
        this.pagination(xhr.getResponseHeader('Link'));
        this.setState({ list: json, first });
      }
    })
  }

  render() {
    var s = this.state;
    return (
      <>
        <h1>Search Historical Events</h1>
        <form onSubmit={this.search.bind(this)}>
          <input type="text" id="search"></input>
          <input type="submit" value="Search"></input>
        </form>
        <div id="paginate">
          <ReactPaginate
            pageCount={s.pageCount}
            pageRangeDisplayed={0}
            marginPagesDisplayed={0}
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={''}
            previousClassName={'prevOne'}
            nextClassName={'nextOne'}
          />
        </div>
        <ul>
          {s.list.map((e, i) => (
            <li key={i}>
              <div style={{ marginBottom: '0px' }}><b style={{ display: 'inline', color: 'blue' }}>Date: </b>{e.date}</div>
              <div><b style={{ display: 'inline', color: 'blue' }}>Description: </b>{e.description}</div>
              <div><b style={{ display: 'inline', color: 'blue' }}>Language: </b>{e.lang}</div>
              <div><b style={{ display: 'inline', color: 'blue' }}>Category 1: </b>{e.category1}</div>
              <div><b style={{ display: 'inline', color: 'blue' }}>Category 2: </b>{e.category2}</div>
              <div><b style={{ display: 'inline', color: 'blue' }}>Granularity: </b>{e.granularity}</div>
              <br></br>
            </li>
          ))}
        </ul>
      </>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

