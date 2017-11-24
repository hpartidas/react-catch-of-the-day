import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';
import Loader from "./Loader";

class Inventory extends React.Component {
  constructor() {
    super();
    this.renderInventory = this.renderInventory.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.updateState = this.updateState.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.logout = this.logout.bind(this);
    this.authHandler= this.authHandler.bind(this);

    this.state = {
      uid: null,
      owner: null,
      baseLoaded: null,
    }
  }

  componentDidMount() {
    base.onAuth((user) => {
      if (user) {
        this.authHandler(null, {user});
      }
      else {
        this.setState({baseLoaded: true})
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.uid !== nextState.uid
      || this.state.owner !== nextState.owner
      || this.state.baseLoaded !== nextState.baseLoaded
      || this.props.fishes !== nextProps.fishes
  }

  componentDidUpdate() {
    this.render();
  }

  componentWillUnmount() {
    console.log(`component did unmount`);
  }

  updateState(e, key) {
    const fish = this.props.fishes[key];

    const update = {...fish, [e.target.name]: e.target.value};

    this.props.updateFish(key, update);
  }

  authenticate(provider) {
    base.authWithOAuthPopup(provider, this.authHandler);
  }

  logout() {
    base.unauth();
    this.setState({uid: null});
  }

  authHandler(err, authData) {
    if (err) {
      console.error(err);
      return;
    }

    const storeRef = base.database().ref(this.props.storeId);

    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {};

      if (!data.owner) {
        storeRef.set({
          owner: authData.user.uid
        });
      }


      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid,
        baseLoaded: true,
      })
    });

  }

  renderLogin() {
    return(
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="github" onClick={() => this.authenticate('github')}>Log In with Github</button>
        <button className="facebook" onClick={() => this.authenticate('facebook')}>Log In with Facebook</button>
        <button className="twitter" onClick={() => this.authenticate('twitter')}>Log In with Twitter</button>
      </nav>
    );
  }

  renderInventory(key) {
    const fish = this.props.fishes[key];
    return (
      <div className="fish-edit" key={key}>
        <input type="text" name="name" value={fish.name} placeholder="Fish Name" onChange={(e) => this.updateState(e, key)}/>
        <input type="text" name="price" value={fish.price} placeholder="Fish Price" onChange={(e) => this.updateState(e, key)}/>
        <select name="status" value={fish.status} placeholder="Fish Status" onChange={(e) => this.updateState(e, key)}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea name="desc" placeholder="Fish Desc" value={fish.desc} onChange={(e) => this.updateState(e, key)}></textarea>
        <input type="text" name="image" value={fish.image} placeholder="Fish Image" onChange={(e) => this.updateState(e, key)}/>
        <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
      </div>
    );
  }

  render () {
    if (!this.state.baseLoaded) {
      return <Loader />;
    }

    const logout = <button onClick={this.logout}>Log Out!</button>;
    // logged in?
    if (!this.state.uid) {
      return <div>{this.renderLogin()}</div>
    }

    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry you aren't the owner of this store!</p>
          {logout}
        </div>
      );
    }

    return (
      <div>
        <h2>Inventory</h2>
        {logout}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    )
  }
}

Inventory.propTypes = {
  fishes: React.PropTypes.object.isRequired,
  updateFish: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  addFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired,
  storeId: React.PropTypes.string.isRequired,
};

export default Inventory;