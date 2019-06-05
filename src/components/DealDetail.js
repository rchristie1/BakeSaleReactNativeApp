import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet, TouchableOpacity, PanResponder, Animated, Dimensions, Button, Linking } from 'react-native';

import { priceDisplay } from '../util';
import ajax from '../ajax';

export default class DealDetail extends Component {
  imageXPos = new Animated.Value(0);
  imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gs) => {
      // console.log('moving', gs.dx);
      this.imageXPos.setValue(gs.dx);
    },
    onPanResponderRelease: (evt, gs) => {
      this.width = Dimensions.get('window').width;
      if (Math.abs(gs.dx) > this.width * 0.4) {
        const direction = Math.sign(gs.dx);
        Animated.timing(this.imageXPos, {
          toValue: direction * this.width,
          duration: 250,
        }).start(() => this.handleSwipe(-1 * direction));
      } else {
        Animated.spring(this.imageXPos, {toValue: 0}).start();
      }
    },
  });

  handleSwipe = (indexDirection) => {
    if(!this.state.deal.media[this.state.imageIndex + indexDirection]) {
      Animated.spring(this.imageXPos, {
        toValue: 0,
      }).start();
      return;
    }
    this.setState((prevState) => ({
      imageIndex: prevState.imageIndex + indexDirection
    }), () => {
      //Next Image Animation
      this.imageXPos.setValue(indexDirection * this.width);
      Animated.spring(this.imageXPos, {
        toValue: 0,
      }).start();
    }
  )}

  static propTypes = {
    initialDealData: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
  };

  state = {
    deal: this.props.initialDealData,
    imageIndex: 0,
  };

  async componentDidMount() {
    const fullDeal = await ajax.fetchDealDetail(this.state.deal.key);

    this.setState({ deal: fullDeal });
  }

  openDealURL = () => {
    Linking.openURL(this.state.deal.url);
  }

  render() {
    const { deal } = this.state;
    return (
      <View style={styles.deal}>
        <TouchableOpacity onPress={this.props.onBack}>
          <Text style={styles.backLink}>Back</Text>
        </TouchableOpacity>
        <Animated.Image {...this.imagePanResponder.panHandlers} source={{ uri: deal.media[this.state.imageIndex] }} style={[{ left: this.imageXPos }, styles.image]} />
        <View style={styles.info}>
          <Text style={styles.title}>{deal.title}</Text>
          <View style={styles.preBody}>
            <View style={styles.footer}>
              <Text>{deal.cause.name}</Text>
              <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
            </View>

            {deal.user && (
              <View style={styles.footer}>
                <Image source={{ uri: deal.user.avatar }} style={styles.avatar} />
                <Text>{deal.user.name}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.desc}>
          <Text>
            <Text>{deal.description}</Text>
          </Text>
        </View>
        <Button title="Choose this Deal!" onPress={this.openDealURL}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backLink: {
    marginBottom: 5,
    marginLeft: 10,
    color: '#22f',
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc',
  },
  info: {
    backgroundColor: '#fff',
    height: 120,
  },
  title: {
    width: '100%',
    fontSize: 16,
    padding: 10,
    fontWeight: 'bold',
    backgroundColor: 'rgba(237, 149, 45, 0.4)',
  },
  footer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  cause: {
    flex: 2,
  },
  price: {
    fontWeight: 'bold',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  preBody: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  desc: {
    padding: 8,
    paddingTop: 20,
  },
});
