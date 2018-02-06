import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, ActivityIndicator } from 'react-native';
import s from './styles';
import { getNearbyEvents } from '../../actions';
import { Event } from '../Event';
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';

class DragBar extends Component {
  constructor (props) {
    super(props);
  }


  render() {
    console.log(this.props.mainEvent);
    return  (
      <View>
        <Animatable.View duration={500}
          transition='height' style={{height: this.props.dragBarHeight}}>
          <View style={s.dragBar}>
            <View style={s.dragBar_bubble}>
              <View style={s.dragBar_line}></View>
            </View>
          </View>
        </Animatable.View>
        {this.props.mainEvent ?
          <Event suggested={true}
            key={this.props.mainEvent}
            eventID={this.props.mainEvent}/>
          :  <View style={{paddingVertical: 40}}>
            <ActivityIndicator size="large" color="#ffffff"/>
          </View>}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  events: state.pages.Home.events,
  mainEvent: state.pages.Home.mainEvent,
});

const mapDispatchToProps = (dispatch) => ({
  getNearbyEvents: (queryString) => dispatch(getNearbyEvents(queryString)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DragBar);
