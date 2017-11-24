import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import base from '../base';

import sampleFishes from '../sample-fishes';

class App extends React.Component {
  constructor() {
    super();

    // Bind function to component
    this.addFish = this.addFish.bind(this);
    this.updateFish = this.updateFish.bind(this);
    this.removeFish = this.removeFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.removeFromOrder = this.removeFromOrder.bind(this);

    // Initial State / getInitialState
    this.state = {
      fishes: {},
      order: {}
    };
  }

  /**
   * Connect and initialize listener on state
   */
  componentWillMount() {
    this.stateSyncListener = base.syncState(`${this.props.params.storeId}/fishes`, {
      context: this,
      state: 'fishes'
    });

    const order = localStorage.getItem(`order-${this.props.params.storeId}`);

    if (order) {
      this.setState({order: JSON.parse(order)});
    }
  }

  /**
   * Remove listener
   */
  componentWillUnmount() {
    base.removeBinding(this.stateSyncListener)
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
  }

  addFish(fish) {
    // update state
    const fishes = {...this.state.fishes};
    // add in new fish
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;
    // set state
    this.setState({fishes: fishes});
  }

  updateFish(key, update) {
    const fishes = {...this.state.fishes};
    fishes[key] = update;
    this.setState({fishes: fishes});
  }

  removeFish(key) {
    const fishes = {...this.state.fishes};
    fishes[key] = null;
    this.setState({fishes: fishes});
  }

  loadSamples() {
    this.setState({
      fishes: sampleFishes
    });
  }

  addToOrder(key) {
    const order = {...this.state.order};
    order[key] = order[key] + 1 || 1;
    this.setState({ order: order });
  }

  removeFromOrder(key) {
    const order = {...this.state.order};
    delete order[key];
    this.setState({order: order});
  }

  render () {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline={`Fresh Seafood Market`}/>
          <ul className="list-of-fishes">
            {
              Object
                .keys(this.state.fishes)
                .map(idx => <Fish key={idx} index={idx} details={this.state.fishes[idx]} addToOrder={this.addToOrder}/>)
            }
          </ul>
        </div>
        <Order fishes={this.state.fishes} order={this.state.order} params={this.props.params} removeFromOrder={this.removeFromOrder} />
        <Inventory addFish={this.addFish} loadSamples={this.loadSamples} fishes={this.state.fishes} updateFish={this.updateFish} removeFish={this.removeFish} storeId={this.props.params.storeId}/>
      </div>
    )
  }
}

App.propTypes = {
  params: React.PropTypes.object.isRequired
};

export default App;