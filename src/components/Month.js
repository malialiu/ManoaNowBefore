import React, { Component } from 'react';
import * as firebase from 'firebase';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  Platform,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Card, Icon, Image, Button } from 'react-native-elements';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import CustomHeader from './CustomHeader';
import { Collapse, CollapseBody, CollapseHeader } from "accordion-collapse-react-native";
import * as Calendar from 'expo-calendar';
import * as Reminders from 'expo-calendar';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Localization from 'expo-localization'


const _ = require('lodash');
const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  height: Platform.OS === 'android' ? {
    flexGrow: 1,
    flexWrap: 'wrap',
  } : { paddingTop: 0, flexGrow: 1, flexWrap: 'wrap', },
  month: {
    width: width,
    height: (width / 3816) * 901,
  },
  weekday: {
    color: 'white',
    fontSize: width * .024,
    textAlign: 'center',
  },
  day: {
    color: 'white',
    fontSize: width * .05,
    textAlign: 'center',
  },
  title: {
    color: 'white',
    fontWeight: "bold",
    fontSize: width * .08,
    paddingBottom: width * .1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    textAlign: 'center'
  },
  subtitle: {
    color: 'white',
    fontSize: width * .045,
    paddingBottom: width * .015,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 0,
  },
  desc: {
    color: 'white',
    fontSize: width * .05,
    paddingTop: 10,
    paddingBottom: width * .015,
    paddingLeft: 10,
    paddingRight: 10,
  },
  link: {
    color: '#aba1f6',
    textDecorationLine: 'underline',
    fontSize: width * .045,
    paddingTop: 10,
    paddingBottom: width * .015,
    paddingLeft: 10,
    paddingRight: 10,
  }
});

//Contains the saved urls for the month image banners
const monthURL = [
  'http://www.manoanow.org/app/mobile_assets/assets/month_tab_open_1.png',
  'http://www.manoanow.org/app/mobile_assets/assets/month_tab_open_2.png',
  'http://www.manoanow.org/app/mobile_assets/assets/month_tab_open_3.png',
  'http://www.manoanow.org/app/mobile_assets/assets/month_tab_open_4.png',
  'http://www.manoanow.org/app/mobile_assets/assets/month_tab_open_5.png',
  'http://www.manoanow.org/app/mobile_assets/assets/month_tab_open_6.png',
  'http://www.manoanow.org/app/mobile_assets/assets/month_tab_open_7.png',
  'http://www.manoanow.org/app/mobile_assets/assets/month_tab_open_8.png',
  'http://www.manoanow.org/app/mobile_assets/assets/month_tab_open_9.png',
  'http://www.manoanow.org/app/mobile_assets/assets/month_tab_open_10.png',
  'http://www.manoanow.org/app/mobile_assets/assets/month_tab_open_11.png',
  'http://www.manoanow.org/app/mobile_assets/assets/month_tab_open_12.png',
];

class Month extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsAreLoaded: false,
      Events: null,
      ACEvents: null,
      eventsAreLoaded: false,
      ACEventsAreLoaded: false,
      eventDataLoaded: false,     //Created this flag to check if there is data on the firebase
      ACEventDataLoaded: false,     //Created this flag to check if there is data on the firebase
      granted: false,
      eventIdInCalendar: false, //Needed since we need to bypass the apploading checker on the render method
      imageHeight: 0,
      imageWidth: 0,
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
    const ACRef = database.ref('AC/Events/' + this.props.year + '/' + this.props.month);
    const EventRef = firebase.database().ref().child('ka-leo/' + this.props.year + '/' + this.props.month);

    function objectReformatPin(inputObject) {
      const arrayOfPins = [];
      let objectOfPin = {};
      const keys = Object.keys(inputObject);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        objectOfPin = {
          date: inputObject[key].date,
          dayNumber: inputObject[key].dayNumber,
          dayText: inputObject[key].dayText,
          desc: inputObject[key].desc,
          location: inputObject[key].location,
          month: inputObject[key].month,
          name: inputObject[key].name,
          endDate: inputObject[key].endDate,
          endDayText: inputObject[key].endDayNumber,
          endMonth: inputObject[key].endMonth,
          endDayNumber: inputObject[key].endDayNumber,
          endYear: inputObject[key].endYear,
          timeEnd: inputObject[key].timeEnd,
          timeStart: inputObject[key].timeStart,
          website: inputObject[key].website,
          website2: inputObject[key].website2,
          website3: inputObject[key].website3,
          websiteLabel: inputObject[key].websiteLabel,
          websiteLabel2: inputObject[key].websiteLabel2,
          websiteLabel3: inputObject[key].websiteLabel3,
          imageWidth: inputObject[key].imageWidth,
          imageHeight: inputObject[key].imageHeight,
          year: inputObject[key].year,
          image: inputObject[key].image,
          allDay: inputObject[key].allDay,
          zoomLink: inputObject[key].zoomLink,
          instagram: inputObject[key].instagram,
        };
        arrayOfPins.push(objectOfPin);
      }
      return arrayOfPins;
    }

    EventRef.once('value').then((snapshot) => {
      if (snapshot.exists()) {
        let arrayOfFirebaseData = snapshot.val();
        // reformat object to get rid of keys
        arrayOfFirebaseData = objectReformatPin(arrayOfFirebaseData);
        // sorts reformatted object by position
        this.setState({
          events: arrayOfFirebaseData,
          eventsAreLoaded: true,
          eventDataLoaded: true,
        });
      } else {
        this.setState({
          eventDataLoaded: false,
          eventsAreLoaded: true
        })
      }
    });


    ACRef.once('value').then((snapshot) => {
      if (snapshot.exists()) {
        let arrayOfFirebaseData = snapshot.val();
        // reformat object to get rid of keys
        arrayOfFirebaseData = objectReformatPin(arrayOfFirebaseData);
        // sorts reformatted object by position
        this.setState({
          ACEvents: arrayOfFirebaseData,
          ACEventsAreLoaded: true,
          ACEventDataLoaded: true,
        });
      } else {
        this.setState({
          ACEventDataLoaded: false,
          ACEventsAreLoaded: true
        })
      }
    });
  }

  monthCol = () => {
    const colorVal = [
      '#A6CE39', //January, June, November
      '#00AEEF', //February, July, December
      '#EF4C7F', //March, August
      '#F2702B', //April, September
      '#FFC500' //May, October
    ];

    let currMonth = this.props.month;

    if (currMonth === 1 || currMonth === 6 || currMonth === 11) {
      return colorVal[0];
    } else if (currMonth === 2 || currMonth === 7 || currMonth === 12) {
      return colorVal[1];
    } else if (currMonth === 3 || currMonth === 8) {
      return colorVal[2];
    } else if (currMonth === 4 || currMonth === 9) {
      return colorVal[3];
    } else if (currMonth === 5 || currMonth === 10) {
      return colorVal[4];
    }
  };

  timeReturner = (time) => {
    let newTime = time.slice(0, time.indexOf(':'));
    let minutes = time.slice(time.indexOf(':'), time.indexOf(' '));
    newTime = parseInt(newTime);

    if(time[time.length - 2] == 'A'){
      if(time[0] == '1' && time[1] == '2'){
        newTime = 0;
      }
    } else {
      newTime += 12;
    }
    newTime = String(newTime + minutes);
    return newTime;
  }

  addToCalendar = async (event) => {
      let currMonth = this.props.month;
      const { status: perStatus } = await Calendar.requestCalendarPermissionsAsync();

    if(Platform.OS === 'android') {
      if (perStatus === 'granted') {
        let calendar;
        const calendars = await Calendar.getCalendarsAsync();
        if(calendars.length === 0) {
          // alert('Event had been added to calendar');
          Alert.alert(
            'Error: Could not find any calendars'
          );
        } else {
          // Didn't work on Matt's Galasy S9 because no calendars matched the "isPrimary === true"
          let calendar = calendars.find(cal => {
            let regexEmailValidator = /\S+@\S+\.\S+/;
            if(cal.isPrimary === true) {
              console.log("isPrimary")
              return cal;
            } else if(cal.ownerAccount === cal.source.name && regexEmailValidator.test(cal.ownerAccount) &&
                      cal.name === cal.ownerAccount.substring(0, cal.ownerAccount.indexOf('@'))) {
              return cal;
            } else if(calendars[calendars.length - 1] === cal) {
              return calendars[0];
            }
          });

          //"My Calendar" is name for Matt's Galaxy S9 default calendar
          // calendar = calendars.find(({source}) => source.isLocalAccount && source.name === "My calendar");

          // Search for id === "1" for other android devices?????? DOESN'T WORK
          // calendar = calendars.find(({source}) => source.isLocalAccount && source.name === "My calendar");

          console.log(calendar);
          console.log("Time: " + event.year + "-" + currMonth + "-" + event.dayNumber + "T"  + this.timeReturner(event.timeEnd) + ":00:00.000Z");


          //variables to store time string
          const startDate = event.year + "-" + currMonth + "-" + event.dayNumber + " " + this.timeReturner(event.timeStart);
          const endDate = event.year + "-" + currMonth + "-" + event.endDayNumber + " " + this.timeReturner(event.timeEnd);

          const details = {
            location: event.location,
            notes: event.desc,
            startDate: this.jsCoreDateCreator(startDate),
            endDate: this.jsCoreDateCreator(endDate),
            allDay: event.allDay,
            timeZone: 'Pacific/Honolulu',
            title: event.name,
            url: event.zoomLink,
          };

          const newEvent = await Calendar.createEventAsync(calendar.id, details);

          // alert('Event had been added to calendar');
          Alert.alert(
            `Event added to "${calendar.name}" calendar`
          );

          const returnEvent = await Calendar.getEventAsync(newEvent);
          console.log("returned event: " + returnEvent.startDate);
        }


      } else {

        Alert.alert(
          'Please allow permission for Calendar'
        );
      }

    } else {
      const { status: remStatus } = await Calendar.requestRemindersPermissionsAsync();

      if (perStatus === 'granted' && remStatus === 'granted') {
        let calendar;
        calendar = await Calendar.getDefaultCalendarAsync();

      console.log("Time: " + event.year + "-" + currMonth + "-" + event.dayNumber + "T"  + this.timeReturner(event.timeEnd) + ":00:00.000Z");

      //variables to store time string
      const startDate = event.year + "-" + currMonth + "-" + event.dayNumber + " " + this.timeReturner(event.timeStart);
      const endDate = event.year + "-" + currMonth + "-" + event.endDayNumber + " " + this.timeReturner(event.timeEnd);

      const details = {
        location: event.location,
        notes: event.desc,
        startDate: this.jsCoreDateCreator(startDate),
        endDate: this.jsCoreDateCreator(endDate),
        allDay: event.allDay,
        timeZone: 'Pacific/Honolulu',
        title: event.name,
        url: event.zoomLink,
      };


      const newEvent = await Calendar.createEventAsync(calendar.id, details);

      // alert('Event had been added to calendar');
      Alert.alert(
        `Event added to "${calendar.name}" calendar`
      );

      const returnEvent = await Calendar.getEventAsync(newEvent);
      console.log("returned event: " + returnEvent.startDate);
    } else {
      Alert.alert(
        'Please allow permission for Calendar and Reminders'
      );
    }
    }
  }

  mergeSortedArray = (a, b)  => {
    let sorted = [], indexA = 0, indexB = 0;
    if(a == null) {
      return b;
    } else if (b == null) {
      return a;
    } else {
      while (indexA < a.length && indexB < b.length) {
        if (this.sortFn(a[indexA], b[indexB]) > 0) {
          sorted.push(b[indexB++]);
        } else {
          sorted.push(a[indexA++]);
        }
      }

      if (indexB < b.length) {
        sorted = sorted.concat(b.slice(indexB));
      } else {
        sorted = sorted.concat(a.slice(indexA));
      }

      return sorted;
    }
  }

  jsCoreDateCreator = (dateString) => {
    // dateString *HAS* to be in this format "YYYY-MM-DD HH:MM:SS"
    console.log(dateString);

    let dateParam = dateString.split(/[\s-:]/)
    dateParam[1] = (parseInt(dateParam[1], 10) - 1).toString()
    return new Date(...dateParam)
  }

  sortFn = (a, b) => {
    return a.dayNumber - b.dayNumber;
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

  timeShower = (event) => {
    if(event.timeEnd === ''){
      return ( <Text style={styles.subtitle}>{event.timeStart}</Text>);
    } else {
      return ( <Text style={styles.subtitle}>{event.timeStart} - {event.timeEnd}</Text>);
    }

  };


  dateShower = (event) => {
    if(event.date != event.endDate){
      return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
        <Text style={styles.subtitle}>Start: {event.date} - {event.timeStart}</Text>
        <Text style={styles.subtitle}>End: {event.endDate} - {event.timeEnd}</Text>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
        <Text style={styles.subtitle}>{event.date}</Text>
          {this.timeShower(event)}
        </View>
      );
    }
  };



  imageShower = (event) => {

    if(event.image != '' && event.image != null && event.image != "") {
      let newHeight = (width / event.imageWidth * event.imageHeight);
      return (
        <Image
        style = {{width: width, height: newHeight}}
        source={{ uri: event.image}}
      /> );
    }
  }

  websiteLabelChecker = (website, websiteLabel) => {
    if(websiteLabel != '' && websiteLabel != null && websiteLabel) {
      return websiteLabel;
    } else {
      return website;
    }
  }

  websiteLinkShower = (event) => {
    if(event.website != '' && event.website != null && event.website != "") {
      return (
        <Text style={styles.link} onPress={ () => {
          this.props.navigation.push('Details', {
            navigation: event.website,
          });
        } }>
          {this.websiteLabelChecker(event.website, event.websiteLabel)}
        </Text>
      );
    }
  }

  websiteLinkShower2= (event) => {
    if(event.website2 != '' && event.website2 != null && event.website2 != "") {
      return (
        <Text style={styles.link} onPress={ () => {
          this.props.navigation.push('Details', {
            navigation: event.website2,
          });
        } }>
          {this.websiteLabelChecker(event.website2, event.websiteLabel2)}
        </Text>
      );
    }
  }
  websiteLinkShower3 = (event) => {
    if(event.website3 != '' && event.website3 != null && event.website3 != "") {
      return (
        <Text style={styles.link} onPress={ () => {
          this.props.navigation.push('Details', {
            navigation: event.website3,
          });
        } }>
          {this.websiteLabelChecker(event.website3, event.websiteLabel3)}
        </Text>
      );
    }
  }

  zoomLinkShower = (event) => {
    if(event.zoomLink != '' && event.zoomLink != null && event.zoomLink != "") {
      return (
        <Text style={styles.link} onPress={ () => {
          Linking.openURL(event.zoomLink);
        } }>
          Zoom Link
        </Text>
      );
    }
  }

  instagramLinkShower = (event) => {
    if(event.instagram != '' && event.instagram != null && event.instagram != "") {
      return (
        <Text style={styles.link} onPress={ () => {
          this.props.navigation.push('Details', {
            navigation: event.instagram,
          });
        } }>
          {event.instagram}
        </Text>
      );
    }
  }

  singleEvent = (event, navigation) => {
    const weekday = this.weekdayReturner(event.date);
    return (
      <View style={{ backgroundColor: '#2d2d2d', paddingTop: 25, paddingBottom: 10 }}>
        <View style={{ borderColor: `${this.monthCol()}`, borderWidth: 1, width: width}}>
          <TouchableOpacity>
            <Collapse isCollapsed={false}>
              <CollapseHeader>
                {this.imageShower(event)}
                <Text style={styles.title}>{event.name}</Text>


                <View style={{ flex: 1, flexDirection: 'row', paddingBottom: width * .05 }}>
                  <Icon
                    name= 'schedule'
                    color= 'white'
                    size={width * .075}
                  />
                    {this.dateShower(event)}
                </View>

                <View style={{ flex: 1, flexDirection: 'row', paddingBottom: width * .025 }}>
                  <Icon
                    name= 'location-on'
                    color= 'white'
                    size={width * .075}
                  />
                <Text style={styles.subtitle}>{event.location}</Text>
                </View>



              </CollapseHeader>
              <CollapseBody>
                <Text style={styles.desc}>{event.desc}</Text>

                <View style={{flex: 1, flexDirection: 'column'}}>
                  {this.websiteLinkShower(event)}
                  {this.websiteLinkShower2(event)}
                  {this.websiteLinkShower3(event)}
                  {this.instagramLinkShower(event)}
                  {this.zoomLinkShower(event)}

                </View>
                <Button
                  title="Add to Calendar"
                  onPress={() => this.addToCalendar(event)}
                  buttonStyle={{marginTop: width * .025, marginLeft: width * .025, marginRight: width * .025, marginBottom: width * .025}}
                />
              </CollapseBody>
            </Collapse>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const { eventsAreLoaded, events, eventDataLoaded, ACEvents, ACEventsAreLoaded, ACEventDataLoaded } = this.state;
    const { month } = this.props;
    let monthurl = monthURL[month - 1];
    return (!eventsAreLoaded || !ACEventsAreLoaded) ? (<AppLoading/>) : (
      ((!eventDataLoaded && !ACEventDataLoaded) ?
        <View style={{ flex: 1, backgroundColor: '#2d2d2d' }}>
          <CustomHeader/>
          <ScrollView contentContainerStyle={styles.height}>
            <Image style={styles.month} source={{ uri: monthurl }}/>
            <View style={{
              borderColor: 'white',
              borderWidth: 1,
              width: width / 2,
              paddingBottom: 25,
              marginTop: 25,
              marginLeft: width / 4
            }}>
              <Text style={styles.title}>No Events</Text>
            </View>
          </ScrollView>
        </View>
        : (<View style={{ flex: 1, backgroundColor: '#2d2d2d' }}>
          <CustomHeader/>
          <ScrollView contentContainerStyle={styles.height}>
            <Image style={styles.month} source={{ uri: monthurl }}/>
            {_.map(this.mergeSortedArray(events, ACEvents), this.singleEvent)}
          </ScrollView>
        </View>))
    );
  }
}

Month.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};

export default withNavigation(Month);
