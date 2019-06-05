import React, { Component } from 'react';

import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import ajax from '../ajax';
import DealList from './DealList';
import DealDetail from './DealDetail';
import SearchBar from './Searchbar';

class App extends Component {
  titleXPos = new Animated.Value(0);
  state = {
    deals: [],
    dealsFromSearch: [],
    currentDealID: null,
  };

  animateTitle = (direction = 1) => {
    const width = Dimensions.get('window').width - 170;
    Animated.timing(this.titleXPos, { 
      toValue: direction * width / 2,
      duration: 1000,
      easing: Easing.bounce 
    }).start(({finished}) => {
      if(finished){
        this.animateTitle(-1 * direction);
      }
    });
  };
  async componentDidMount() {
    this.animateTitle();
    const deals = await ajax.fetchInitialDeals();
    this.setState({ deals });
  }

  searchDeals = async searchTerm => {
    let dealsFromSearch = [];
    if (searchTerm) {
      dealsFromSearch = await ajax.fetchDealsSearchResult(searchTerm);
    }
    this.setState({ dealsFromSearch });
  };

  setCurrentDeal = dealId => {
    this.setState({
      currentDealID: dealId,
    });
  };
  unsetCurrentDeal = () => {
    this.setState({
      currentDealID: null,
    });
  };

  currentDeal = () => {
    return this.state.deals.find(deal => deal.key === this.state.currentDealID);
  };

  render() {
    const dealsToDisplay = this.state.dealsFromSearch.length > 0 ? this.state.dealsFromSearch : this.state.deals;

    if (this.state.currentDealID) {
      return (
        <View style={styles.main}>
          <DealDetail initialDealData={this.currentDeal()} onBack={this.unsetCurrentDeal} />
        </View>
      );
    }
    if (this.state.deals.length > 0) {
      return (
        <View style={styles.main}>
          <SearchBar searchDeals={this.searchDeals} />
          <DealList deals={dealsToDisplay} onItemPress={this.setCurrentDeal} />
        </View>
      );
    }
    return (
      <Animated.View style={[{ left: this.titleXPos }, styles.container]}>
        <Text style={styles.header}>Bake Sale</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 40,
  },
  main: {
    marginTop: 50,
  },
});

export default App;
