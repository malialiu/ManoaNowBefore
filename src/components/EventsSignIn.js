import React, { Component } from 'react';
import * as firebase from 'firebase';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  Linking,
} from 'react-native';
import { Button, Card, Header, Image, Icon } from 'react-native-elements';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import CustomHeader from './CustomHeader';

const _ = require('lodash');
const { width } = Dimensions.get('window');
let ACRef;


//Koby
// change button style, color to white
// have date loaded in with flex




// Kayla
// make zoomlink clickable (DONE)
// id and password for zoom may not be accesible to users *******
// Header saying events (DONE)



const styles = StyleSheet.create({
  title: {
    color: '#A6CE39',
    fontSize: width * .07,
    paddingBottom: width * .075,
    textAlign: 'center',
  },
  desc: {
    color: 'white',
    fontSize: width * .045,
    paddingTop: 10,
    paddingBottom: width * .015,
    paddingLeft: 10,
    paddingRight: 10,
  },
  link: {
    color: '#5844ED',
    textDecorationLine: 'underline',
    fontSize: width * .045,
    paddingTop: 10,
    paddingBottom: width * .015,
    paddingLeft: 10,
    paddingRight: 10,
  },
  date: {
    color: 'white',
    fontSize: width * .035,
    paddingTop: 5,
    paddingBottom: width * .015,
    paddingLeft: 10,
    paddingRight: 10,
  },
  button: {
    textAlign:'center',
    paddingLeft : 10,
    paddingRight : 10,
    borderColor: '#A6CE39'
  }
})


class EventsSignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsAreLoaded: false,
      events: [],
      eventsAreLoaded: false,
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
    const database = firebase.database();

    ACRef = database.ref('AC/Events');

    function objectReformat(inputObject) {
      const arrayOfEvents = [];
      let objectOfEvent = {};
      const keys = Object.keys(inputObject);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        objectOfEvent = {
          date: inputObject[key].Date,
          description: inputObject[key].Description,
          location: inputObject[key].Location,
          time: inputObject[key].Time,
          zoomlink: inputObject[key].ZoomLink,
          title: inputObject[key].Title,
          pass: inputObject[key].Pass,
          ref: inputObject[key].Ref,
        };
        arrayOfEvents.push(objectOfEvent);
      }
      return arrayOfEvents;
    }

    ACRef.once('value').then((snapshot) => {
      let arrayOfData = snapshot.val();

      // reformats object to get rid of keys
      arrayOfData = objectReformat(arrayOfData);
      // sorts reformated object by position
      //arrayOfData = _.sortBy(arrayOfData, 'position');
      this.setState({
        events: arrayOfData,
        eventsAreLoaded: true,
      });
    });
  }

  weekdayReturner = (weekday) => {
    let numDate = '';
    numDate = weekday.split(",");

    switch (numDate[0]) {
      case 'Monday':
        return 'MON' + '.' + numDate[1];

      case 'Tuesday':
        return 'TUE' + '.' + numDate[1];

      case 'Wednesday':
        return 'WED' + '.' + numDate[1];

      case 'Thursday':
        return 'THU' + '.' + numDate[1];

      case 'Friday':
        return 'FRI' + '.' + numDate[1];

      case 'Saturday':
        return 'SAT' + '.' + numDate[1];

      case 'Sunday':
        return 'SUN' + '.' + numDate[1];

      default:
        return 'BROKEN';
    }
  };

  singleEvent = (event) => {
    return(
      <View style={{ backgroundColor: '#2d2d2d', paddingTop: 25, paddingBottom: 10, flex: 0 }}>
        <View>
          <Card containerStyle={{borderColor: '#A6CE39', backgroundColor: '#2d2d2d'}}>
            {/*<View style={{flex: 1, flexDirection: 'row'}}>*/}
            {/*<Card containerStyle={{backgroundColor: '#A6CE39', paddingBottom: 20, width: width * 0.45, height: width * .15 }}>*/}


            {/* </Card>*/}
            <Text style={styles.title}>
              {event.title}
            </Text>
            {/*</View>*/}
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Icon
                name= 'schedule'
                color= 'white'
              />
            <Text style={styles.desc}>
              {event.time}
            </Text>

            <Text style={styles.desc}>
              {this.weekdayReturner(event.date)}
            </Text>
            </View>


            <Text style={styles.desc}>
              {event.description}
            </Text>
            <Text style={styles.desc}>
              {"Zoom Link:"}
            </Text>
            <Text style={styles.link} onPress={ ()=> Linking.openURL('https://us02web.zoom.us/j/88659202468?pwd=bDlYekNMUWN3RFE3bSs1VVRBLzBSQT09') }>
              {event.zoomlink}
            </Text>
            <Button
              buttonStyle={styles.button}
              titleStyle={{color: '#A6CE39'}}
              title='Sign Up'
              type='outline'
              onPress={ () => this.weekdayReturner(event.date)}
              //onPress={ () => this.onSignupPress(event)}
            />
            </Card>
        </View>
      </View>
    );
  }

  onSignupPress = (event) => {
    this.props.navigation.push('SubmitInfo', {
      event: event,
    });
  }

  render() {
    const { fontsAreLoaded, events, eventsAreLoaded } = this.state;
    return (!eventsAreLoaded && !fontsAreLoaded) ? (<AppLoading />) : (
      <View style={{ flex: 1, backgroundColor: '#2d2d2d' }}>
        <CustomHeader sectionTitle = {'Events Sign In'}/>
        <ScrollView>
          {_.map(events, this.singleEvent)}
        </ScrollView>
      </View>
    );
  }
}

EventsSignIn.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};

export default withNavigation(EventsSignIn);
