import React, { Component } from 'react';
import './App.css';
import Bubbles from './Bubbles';
import ItemBubbles from './ItemBubbles';

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
    var item;
    e.preventDefault();
    fname = this.refs.fname.value;
    lname = this.refs.lname.value;
    email = this.refs.email.value;
    item = this.refs.item.value;
    this.props.onSubmit(fname,lname,email,item);
  }

  createOptions = (option) => {
    return <option>{option}</option>;
  }

  render() {
    return(
      /*<GuestFName onSubmit={this.props.onSubmit}/>*/
      <form className="input_form">
        <input ref="fname" className="input_bar" placeholder="First Name" list="fnames"/>
        <datalist id="fnames">
          {this.props.fnames.map(this.createOptions)}
        </datalist>
        <input ref="lname" className="input_bar" placeholder="Last Name" list="lnames"/>
        <datalist id="lnames">
          {this.props.lnames.map(this.createOptions)}
        </datalist>
        <input ref="email" className="input_bar" placeholder="Email"/>
        <input ref="item" className="input_bar" placeholder="Item Ordered" list="items"/>
        <datalist id="items">
          {this.props.items.map(this.createOptions)}
        </datalist>
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
    if(this.props.displayGuestView)
      return null;
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
    if(this.props.groupByVisits === false || this.props.displayGuestView === true)
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
      displayGuestView: false,
      itemsOrdered: [],
      allItems: [],
      allFnames: [],
      allLnames: [],
    };
  };

  componentWillMount() {
    this.loadAllItems();
    this.loadDB();
  };

  componentDidMount() {

  };

  loadDB = () => {
    fetch('/api/guests/getAllGuests')
      .then(res => res.json())
      .then(allGuests => {
        var guests = [];
        for(var i = 0; i < allGuests.length; i++){
          guests.push(allGuests[i]);
        }
        var fnames = guests.map(guest => guest.firstName);
        var lnames = guests.map(guest => guest.lastName);
        lnames = [...new Set(lnames)];
        this.setState({
          db: guests,
          allFnames: fnames,
          allLnames: lnames,
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

  postDB = (fname,lname,email,item) => {
    /*var updateItemsOrdered = (guestExists, allGuests, allItemsOrdered, allItems) => {
      var itemId = (allItems.find(currItem => currItem.name === item)).id;

      if(guestExists){
        var guest = allGuests.find(guest => (guest.firstName === fname && guest.lastName === lname));
        var guestHasOrderedItem = allItemsOrdered.some(currItem => {
          return (currItem.GuestId === guest.id && currItem.ItemId === itemId);
        });
        console.log(guestHasOrderedItem, itemId);
        if(guestHasOrderedItem){
          var currItem = allItemsOrdered.find(currItem => currItem.GuestId === guest.id && currItem.ItemId === itemId);
          var timesOrdered = currItem.timesOrdered + 1;
          fetch('/api/itemsOrdered/updateItemsOrdered', {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              GuestId: guest.id,
              ItemId: itemId,
              timesOrdered: timesOrdered,
            }),
          }).catch(err => console.log(err));
        }else{
          fetch('/api/itemsOrdered/postItemOrdered', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              GuestId: guest.id,
              ItemId: itemId,
              timesOrdered: 1,
            }),
          });
        }
      }else{
        Promise.all([
          fetch(`/api/guests/findGuest?firstName=${encodeURIComponent(fname)}&lastName=${encodeURIComponent(lname)}`).then(res => res.json())
        ]).then((currGuest) => {
          console.log(currGuest);
          fetch('/api/itemsOrdered/postItemOrdered', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              GuestId: currGuest.id,
              ItemId: itemId,
              timesOrdered: 1,
            }),
          });
        });
      }
    }*/

    Promise.all([
      fetch('/api/guests/getAllGuests').then(res => res.json()),
      fetch('/api/itemsOrdered/getAllItemsOrdered').then(res => res.json()),
      fetch('/api/items/loadItems').then(res => res.json())
    ]).then(([allGuests, allItemsOrdered, allItems]) => {
      var itemId = (allItems.find(currItem => currItem.name === item)).id;
      var guestExists = allGuests.some(guest => {
        return (guest.firstName === fname && guest.lastName === lname);
      })
      var price = (allItems.find(currItem => currItem.name === item)).price;
      console.log(price, guestExists, allGuests);
      // POST / UPDATE to "Guests" table
      if(guestExists){ //UPDATE
        var guest = allGuests.find(guest => (guest.firstName === fname && guest.lastName === lname));
        var totalSpent = guest.totalSpent + price;
        var numVisits = guest.numVisits + 1;
        console.log(totalSpent);
        fetch('/api/guests/updateGuest', {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: fname,
            lastName: lname,
            totalSpent: totalSpent,
            numVisits: numVisits,
            lastOrderId: itemId,
            lastOrder: item,
            id: guest.id,
          }),
        }).catch(err => console.log(err));   
      }else{ //POST
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
            totalSpent: price,
            numVisits: 1,
            lastOrderId: itemId,
            lastOrder: item,
          }),
        });
      }

      // POST / UPDATE "ItemsOrdered" table
      //updateItemsOrdered(guestExists, allGuests, allItemsOrdered, allItems);

    });
    //console.log(this.state);
  };

  onSearch = (name) => {
    this.setState({
      searchText: name,
    });
    this.searchDB(name);
  };

  onCreate = (fname,lname,email,item) => {
    this.setState({
      fName: fname,
      lName: lname,
      email: email,
      //totalSpent: totalSpent,
      isModalOpen: false,
    }, () => {
      console.log(this.state);
    });
    this.postDB(fname,lname,email,item);
    
  }

  toggleDisplay = () => {
    this.setState({
      groupByVisits: (!this.state.groupByVisits)
    });
  }

  displayGuestView = (guestId) => {
    this.setState({
      displayGuestView: (!this.state.displayGuestView)
    });
    this.loadItemsOrdered(guestId);
  }

  loadItemsOrdered = (query) => {
    return Promise.all([
        fetch('/api/itemsOrdered/loadItemsOrdered?query=' + query)
          .then(res => res.json()).catch(err => console.log(err)),
        fetch('/api/items/loadItems')
          .then(res => res.json()).catch(err => console.log(err))
      ]).then(([itemsOrdered, allItems]) => {
        var findItem = (id) => allItems.find(item => item.id === id);
        itemsOrdered.forEach(itemOrdered => Object.assign(itemOrdered, findItem(itemOrdered.ItemId)));
        //console.log(allItems);
        //console.log(itemsOrdered);
        this.setState({
          itemsOrdered: itemsOrdered
        });
      });
  }

  loadAllItems = () => {
    fetch('/api/items/loadItems').then(res => res.json()).then(allItems => {
      var items = allItems.map(item => item.name);
      this.setState({
        allItems: items
      });
    });
  }

  loadAllNames = () => {
    var fnames = this.state.db.map(guest => guest.firstName);
    var lnames = this.state.db.map(guest => guest.lastName);
    this.setState({
      allFnames: fnames,
      allLnames: lnames
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Searchbar className="Searchbar" onChange={this.onSearch}/>
          <h1 className="App-title">G U E S T E K</h1>
          <button className="create" onClick={() => this.openModal()}>Create/Update Guest</button>
          <Modal isOpen={this.state.isModalOpen} onClose={() => this.closeModal()}>
            <CreateGuest className="Form" onSubmit={this.onCreate} items={this.state.allItems} 
              fnames={this.state.allFnames} lnames={this.state.allLnames}/>
          </Modal>
        </header>
        {/*<Results results={this.state.searchResults}/>*/}
        <ToggleDisplay onClick={this.toggleDisplay} displayGuestView={this.state.displayGuestView}/>
        <br/>
        <NumVisits groupByVisits={this.state.groupByVisits} displayGuestView={this.state.displayGuestView}/>
        <Bubbles data={this.state.db} groupByVisits={this.state.groupByVisits} 
          displayGuestView={this.state.displayGuestView} clickGuest={this.displayGuestView} width="1000px" height="1000px"/>
        <ItemBubbles data={this.state.itemsOrdered} displayGuestView={this.state.displayGuestView} 
          width="1000px" height="1000px"/>
      </div>
    );
  }
};

export default App;
