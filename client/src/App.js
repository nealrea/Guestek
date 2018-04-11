import React, { Component } from 'react';
import './App.css';
import Bubbles from './Bubbles';

/*
class GuestFName extends Component {
  handleClick = (e) => {
    var input;
    e.preventDefault();
    input = this.refs.create.value;
    this.props.onSubmit(input);

  }

  render() {
    return(
      <form>
        <input ref="create" className="search" placeholder="Create guest..."/>
        <button onClick={this.handleClick}>Create</button>
      </form>
    );
  }
};
*/

class CreateGuest extends Component {
  handleClick = (e) => {
    var fname;
    var lname;
    var email;
    var totalSpent;
    e.preventDefault();
    fname = this.refs.fname.value;
    lname = this.refs.lname.value;
    email = this.refs.email.value;
    totalSpent = this.refs.totalSpent.value;
    this.props.onSubmit(fname,lname,email,totalSpent);
  }

  render() {
    return(
      /*<GuestFName onSubmit={this.props.onSubmit}/>*/
      <form className="input_form">
        <input ref="fname" className="input_bar" placeholder="First Name"/>
        <input ref="lname" className="input_bar" placeholder="Last Name"/>
        <input ref="email" className="input_bar" placeholder="Email"/>
        <input ref="totalSpent" className="input_bar" placeholder="Total Spent"/>
        <button className="submit" onClick={this.handleClick}>Submit</button>
      </form>
    );
  }
};

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
        <input ref="srch" type="search" className="search" placeholder="Search guests..." onChange={this.handleChange}/>
          {/*<button onClick={this.handleClick}>Search</button>*/}
      </form>
    );
  }
};

class Results extends Component {
  render() {
    return (
      <div>
        <h1 className="results">{this.props.results}</h1>
      </div>
    );
  }
};

class Modal extends React.Component {
  render() {
    if (this.props.isOpen === false)
      return null

    let modalStyle = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: '9999',
      background: '#F07565'
    }

    let backdropStyle = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: '0px',
      left: '0px',
      zIndex: '9998',
      background: 'rgba(0, 0, 0, 0.3)'
    }

    return (
      <div>
        <div style={modalStyle}>{this.props.children}</div>
        <div style={backdropStyle} onClick={e => this.close(e)}/>}
      </div>
    )
  }

  close(e) {
    e.preventDefault()

    if (this.props.onClose) {
      this.props.onClose()
    }
  }
}

class ToggleDisplay extends Component {
  handleClick = () => {
    this.props.onClick();
  }

  render() {
    return(
      <div className="toggleSwitch">
        <div className="viewText"><p>Group to Center</p></div>
        <label className="switch">
          <input type="checkbox" onClick={this.handleClick}/>
          <div className="slider"/>
        </label>
        <div className="viewText"><p>Split by # Visits</p></div>
      </div>
    );
  };
};

class NumVisits extends Component {
  render(){
    if(this.props.groupByVisits === false)
      return null;
    return(
      <div className="numVisitsText">
        <p className="visits1">1-25</p>
        <p className="visits2">26-50</p>
        <p className="visits3">51-75</p>
        <p className="visits4">76+</p>
      </div>
    )
  }
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      isModalOpen: false,
      searchText: '',
      fName: '',
      lName: '',
      email: '',
      totalSpent: 0,
      searchResults: 'no match',
      db: [],
      groupByVisits: false,
    };
  };

  componentDidMount() {
    this.loadDB();
  };

  loadDB = () => {
    fetch('/api/guests/loadDB')
      .then(res => res.json())
      .then(allGuests => {
        var guests = [];
        for(var i = 0; i < allGuests.length; i++){
          guests.push(allGuests[i]);
        }
        this.setState({
          db: guests,
        });
        console.log(this.state);
      });
  };

  openModal() {
    this.setState({
      isModalOpen: true,
    });
  };

  closeModal() {
    this.setState({
      isModalOpen: false,
    });
  };

  searchDB = (query) => {
    fetch('/api/guests?query=' + query)
      .then(res => res.json())
      .then(guests => {
        this.setState({ searchResults: ("no match")})
        var names = [];
        for(var i = 0; i < guests.length; i++){
          names.push(guests[i].firstName.toLowerCase());
        }
        return names;
      }).then((names) => {
        for(var i = 0; i < names.length; i++){
          if(names[i] === query.toLowerCase()){
            this.setState({
              searchResults: (query + " is in the database")
            });
            break;
          }
        }
      });
    console.log(this.state);
  };

  postDB = (fname,lname,email,totalSpent) => {
    fetch('/api/guests', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: fname,
        lastName: lname,
        email: email,
        totalSpent: totalSpent,
      }),
    });
    //console.log(this.state);
  };

  onSearch = (name) => {
    this.setState({
      searchText: name,
    });
    this.searchDB(name);
  };

  onCreate = (fname,lname,email,totalSpent) => {
    this.setState({
      fName: fname,
      lName: lname,
      email: email,
      totalSpent: totalSpent,
      isModalOpen: false,
    }, () => {
      console.log(this.state);
    });
    this.postDB(fname,lname,email,totalSpent);
    
  }

  toggleDisplay = () => {
    this.setState({
      groupByVisits: (!this.state.groupByVisits)
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Searchbar className="Searchbar" onChange={this.onSearch}/>
          <h1 className="App-title">G U E S T E K</h1>
          <button className="create" onClick={() => this.openModal()}>Create Guest</button>
          <Modal isOpen={this.state.isModalOpen} onClose={() => this.closeModal()}>
            <CreateGuest className="Form" onSubmit={this.onCreate}/>
          </Modal>
        </header>
        {/*<Results results={this.state.searchResults}/>*/}
        <ToggleDisplay onClick={this.toggleDisplay}/>
        <br/>
        <NumVisits groupByVisits={this.state.groupByVisits}/>
        <Bubbles data={this.state.db} groupByVisits={this.state.groupByVisits} width="1000px" height="1000px"/>
      </div>
    );
  }
};

export default App;
