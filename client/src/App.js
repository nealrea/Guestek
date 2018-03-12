import React, { Component } from 'react';
import './App.css';

class Searchbar extends Component {
  handleChange = (e) => {
    var input;
    e.preventDefault();
    input = this.refs.srch.value;
    this.props.onChange(input);
  }

  render() {
    return (
      <form>
        <input ref="srch" type="search" className="search" placeholder="Type guest name..." onChange={this.handleChange}/>
          {/*<button onClick={this.handleClick}>Search</button>*/}
      </form>
    );
  }
}

class Results extends Component {
  render() {
    return (
      <div>
        <h1 className="results">{this.props.results}</h1>
      </div>
    );
  }
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchText: '',
      searchResults: '',
      db: []
    };
  }

  searchDB = (query) => {
    fetch('/users')
      .then(res => res.json())
      .then(guests => {
        var names = [];
        for(var i = 0; i < guests.length; i++){
          names.push(guests[i].name);
        }
        var db = this.state.db.slice();
        db.push(names);
        this.setState({ db: names })
      });
    for(var i = 0; i < this.state.db.length; i++){
      if(this.state.db[i] === query){
        this.setState({
          searchResults: (query + " is in the database")
        });
        break;
      }
      else{
        this.setState({
          searchResults: ("no match")
        });
      }
    }
  }

  onChange = (name) => {
    this.setState({
      searchText: name,
    });
    this.searchDB(name);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Guestek</h1>
          <Searchbar className="Searchbar" onChange={this.onChange}/>
          <Results results={this.state.searchResults}/>
        </header>
      </div>
    );
  }
}

export default App;
