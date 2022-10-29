import React, { Component } from 'react';
import * as firebase from 'firebase';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Button, Card, Image, Input, Overlay } from 'react-native-elements';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import CustomHeader from './CustomHeader';

const _ = require('lodash');
const { width } = Dimensions.get('window');

let signInRef;
let database;

const styles = StyleSheet.create({
  title: {
    color: '#A6CE39',
    fontSize: width * 0.07,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
  },
  desc: {
    color: 'white',
    fontSize: width * 0.045,
    paddingTop: 10,
    paddingBottom: width * 0.015,
    paddingLeft: 10,
    paddingRight: 10,
  },
  input: {
    color: 'white',
    fontSize: width * 0.045,
    paddingTop: 5,
    paddingBottom: width * 0.015,
    paddingLeft: 10,
    paddingRight: 10,
  },
  button: {
    color: 'white',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
});


class SubmitInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsAreLoaded: false,
      firebaseLoaded: false,
      name: '',
      email: '',
      password: '',
      isVisible: false,
      errorMessage: 'Your info has been submitted',
    };
  }

  async componentDidMount() {
    await Font.loadAsync({ 'Material Icons': require('../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf') });
    await Font.loadAsync({ 'Ionicons': require('../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf') });
    this.setState({ fontsAreLoaded: true });

    const firebaseConfig = {
      apiKey: 'AIzaSyBtWT33Efe65RjvWSaz8akRB17f8R4BS4Q',
      authDomain: 'ka-leo.firebaseapp.com',
      databaseURL: 'https://ka-leo.firebaseio.com',
      projectId: 'ka-leo',
      storageBucket: 'ka-leo.appspot.com',
      messagingSenderId: '332977316492',
      appId: '1:332977316492:web:93984a5d78025cb3',
    };
    // Initialize Firebase
    !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
    database = firebase.database();



    signInRef = database.ref('AC/StudentInfo/');
    // console.log(signInRef);
    signInRef.once('value').then((snapshot) => {
      // console.log(snapshot);
      this.setState({ firebaseLoaded: true });
    });
  }

  emailCheck = () => {
    let email = this.state.email;
    console.log(email);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false) {
      console.log("Please us a valid email.");
      this.setState({errorMessage: "Please use an @hawaii.edu email"});
      this.setState({ email: email });
      return false;
    } else {
      let length = email.length;
      if(email.charAt(length - 11) == '@' && email.charAt(length - 10) == 'h' && email.charAt(length - 9) == 'a' && email.charAt(length - 8) == 'w' && email.charAt(length - 7) == 'a' && email.charAt(length - 6) == 'i' && email.charAt(length - 5) == 'i' && email.charAt(length - 4) == '.' && email.charAt(length - 3) == 'e' && email.charAt(length - 2) == 'd' && email.charAt(length - 1) == 'u' ) {
        this.setState({ email: email })
        console.log("Email is Correct");
        if (this.state.errorMessage != "Password is incorrect") {
          this.setState({ errorMessage: "Your info has been submitted" });
        }
        return true;
      }
      console.log("Please use an @hawaii.edu email");
      this.setState({errorMessage: "Please use an @hawaii.edu email"});
      this.setState({ email: email });
      return false;
    }
  }

  passwordCheck = () => {
    let text = this.state.password;
    if (text != this.props.event.pass){
      console.log("Password is Not Correct");
      this.setState({errorMessage: "Password is incorrect"});
      return false;
    } else{
      console.log("Password is Correct");
      if (this.state.errorMessage != "Please use an @hawaii.edu email") {
        this.setState({ errorMessage: "Your info has been submitted" });
      }
      return true;
    }
  }

  onSubmitPress = () => {

    if(this.emailCheck(this.state.email) && this.passwordCheck(this.state.password)) {

      let event = this.props.event;

      let date = new Date();
      let currentDay = date.getDate().toString();
      let currentHour = date.getHours().toString();
      let currentMin = date.getMinutes().toString();
      let currentMil = date.getMilliseconds().toString();
      let currentTime = currentDay + currentHour + currentMin + currentMil;

      let id = currentTime + this.generateUID();

      database.ref('AC/StudentInfo/' + event.ref + '/' + id)
        .set({
          name: 'john',
          email: 'john@hawaii.edu',
        });
    }
    else{
      console.log(false);
    }

    this.toggleOverlay(this.state.isVisible);

  }

   generateUID = () => {
    let randID = "";
    const randChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 6; i++)
      randID += randChars.charAt(Math.floor(Math.random() * randChars.length));

    return randID;
  }

  toggleOverlay = (isVisible) => {
    this.setState({ isVisible: !isVisible })
  }

  render() {
    const { fontsAreLoaded, firebaseLoaded, isVisible } = this.state;
    return (!fontsAreLoaded && firebaseLoaded) ? (<AppLoading />) : (
      <View style={{ flex: 1, backgroundColor: '#2d2d2d' }}>
        <CustomHeader />
        <ScrollView>
          <Card containerStyle={{ borderColor: '#A6CE39', backgroundColor: '#2d2d2d' }}>
            <Input
              inputStyle={styles.input}
              placeholder="Name"
              onChangeText={value => this.setState({ name: value })}
            />
            <Input
              inputStyle={styles.input}
              placeholder="UH Email"
              onChangeText={value => this.setState({ email: value })}
            />
            <Input
              inputStyle={styles.input}
              placeholder="Event Password"
              onChangeText={value => this.setState({ password: value })}
            />
            <Button
              title="Submit"
              type="outline"
              onPress={this.onSubmitPress}
            />
            <Overlay isVisible={isVisible} onBackdropPress={() =>this.toggleOverlay(isVisible)}>
              <Text>
                {this.state.errorMessage}
              </Text>
            </Overlay>
          </Card>
        </ScrollView>
      </View>
    );
  }
}


SubmitInfo.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};

export default withNavigation(SubmitInfo);
