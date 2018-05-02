import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import { Slider, Button } from 'react-native-elements';
import profileStar from '../../assets/icons/profile_star.png';
import profileStarEmpty from '../../assets/icons/profile_star_empty.png';
import s from './styles';
import { getNearbyEvents, navigateBack, setQueryState } from '../../actions';

class Filter extends Component {
  state = {
    ratings: 0,
    score: 0,
  };

  handleGo = async () => {
    const newQuery = {
      ratings: this.state.ratings,
    };
    await this.props.setQueryState(newQuery);
    this.props.getNearbyEvents(this.props.query);
    this.props.navigateBack();
  };

  renderBotom() {
    return (
      <Button
        buttonStyle={s.goButton}
        textStyle={s.goButtonText}
        title='GO FOR IT'
        onPress={this.handleGo}
      />
    );
  }

  renderStar = (key) => {
    return (
        <Image
          key={key}
          style={s.rating_star}
          source={key<=this.state.ratings?profileStar:profileStarEmpty}/>
    );
  }

  render() {
    const stars = [];
    for (var i = 1; i <= 5; i++) {
      stars.push(this.renderStar(i));
    }
    return (
      <View style={s.container}>
        <View style={s.rating_star_container}>
          {stars}
        </View>
        <Slider
          style={s.slider}
          trackStyle={s.track}
          thumbStyle={s.thumb}
          minimumTrackTintColor='#30a935'
          value={this.state.ratings}
          minimumValue={0}
          maximumValue={5}
          step={1}
          onValueChange={(value) => this.setState({ratings: value})} />
        <View style={s.bottomContainer}>
          {this.renderBotom()}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  query: state.pages.Maps.query,
});

const mapDispatchToProps = (dispatch) => ({
  setQueryState: (newQuery) => dispatch(setQueryState(newQuery)),
  getNearbyEvents: (queryString) => dispatch(getNearbyEvents(queryString)),
  navigateBack: () => dispatch(navigateBack()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
