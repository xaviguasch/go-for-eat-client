import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, Image, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import profileStar from '../../assets/icons/profile_star.png';
import profileStarEmpty from '../../assets/icons/profile_star_empty.png';
import profileEdit from '../../assets/icons/profile_edit.png';
import profileSave from '../../assets/icons/profile_save.png';
import s from './styles.js';
import { updateUser } from '../../actions';

class UserBio extends Component {

  state = {
    edit: {
      interests: false,
      profession:false,
      description:false
    },
    text: {
      interests:'',
      profession:'',
      description:''
    },
    error: false
  };

  componentDidMount() {
    this.setState({
      ...this.state,
      text:{
        interests:this.props.user.interests,
        profession:this.props.user.profession,
        description:this.props.user.description
      }
    });
  }

  handleEdit = (key) => {

    return () => {
      const edit = {...this.state.edit};
      edit[key] = true;
      this.setState({edit: edit});
    };
  }

  handleSave = (key) => {
    return () => {
      if (this.state.text[key].length>140) {
        this.setState({error:true});
        return;
      }
      this.setState({
        error:false,
        edit: {
          ...this.state.edit,
          [key]:false
        }
      });

      const data = {[key]:this.state.text[key]};
      this.props.updateUser(data);
    };
  }

  getAgeFromBirthday = (birthday) => {
    const dateDiff = Date.now() - new Date(birthday);
    const newDate = new Date(dateDiff);
    return Math.abs(newDate.getUTCFullYear()-1970);
  }


  renderRating = () => {
    const { ratings_average } = this.props.user;
    const stars = [];
    for (var i = 1; i <= 5; i++) {
      if (i<=Math.ceil(ratings_average)) stars.push(<Image style={s.profile_stars}  key={i} source={profileStar}/>);
      else stars.push(<Image key={i} style={s.profile_stars} source={profileStarEmpty}/>);
    }
    return stars;
  }

  renderRatingSection =() => {
    const { ratings_number } = this.props.user;
    return (
      <View>
        <Text style ={s.profile_bio_title}>Rating:</Text>
        <View style={s.profile_rating_stars}>
          {ratings_number>0
            ? this.renderRating()
            : <Text>No ratings to show.</Text>
          }
        </View>
      </View>
    );
  }

  renderSection = (key, title) => {
    if (this.props.screen==='User' && this.state.text[key]==='') return null;
    return (
      <View style={s.profile_section_outercontainer}>
        <Text style={s.profile_bio_title}>{title}</Text>
        <View style={s.profile_section_container}>
          {(this.state.edit[key])?
            (
              <TextInput
                onChangeText={(text)=> this.setState({text:{...this.state.text, [key]:text}})}
                style={s.profile_section_text_edit}
                multiline = {true}
                numberOfLines = {4}
                value={this.state.text[key]}/>
            )
            :
            (this.state.text[key]==='')?
              <Text style={s.profile_section_text_italic}>Add your {key} here</Text>
              :
              <Text style={s.profile_section_text}>{this.state.text[key]}</Text>
          }
          {(this.props.screen==='Profile')
            ? this.renderButton(key, this.state.edit[key])
            : null
          }
        </View>
      </View>
    );
  }

  renderButton = (key, edit) => {
    return (
      <TouchableOpacity ref={key} style={s.profile_icon} onPress={edit?this.handleSave(key):this.handleEdit(key)}>
        <Image style={edit?s.profile_icon_save:s.profile_icon_edit} source={edit?profileSave:profileEdit}/>
      </TouchableOpacity>
    );
  }

  render() {
    if (!this.props.user) return null;
    const { name, birthday, profile_picture, interests, profession, description } = this.props.user;
    return (
      <KeyboardAwareScrollView  style={s.profile} behavior='padding'>
        <View style={s.profile_picture}>
          <Image
            source={{uri:profile_picture}}
            style={s.profile_picture_image}
          />
        </View>
        <Text style={s.profile_name}>{name}{birthday?', ' + this.getAgeFromBirthday(birthday):''}</Text>
        {this.state.error? <Text style={s.profile_error}>{'Fields must only be 140 characters or less.'}</Text>:null}
        {this.renderRatingSection()}
        {this.renderSection('profession', 'Profession: ')}
        {this.renderSection('description', 'Brief Description: ')}
        {this.renderSection('interests', 'Interests: ')}
        <View style={{ height: 60 }} />
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  screen:state.pages.currentScreen
});

const mapDispatchToProps = (dispatch) => ({
  updateUser:data => dispatch(updateUser(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserBio);
