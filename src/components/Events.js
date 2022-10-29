import React, { Component } from 'react';
import * as firebase from 'firebase';
import { StyleSheet, View, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { List, Divider, Icon, Text, Image } from 'react-native-elements'
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import CustomHeader from './CustomHeader';
const _ = require('lodash');
const { height, width } = Dimensions.get('window');
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { NavigationContainer } from '@react-navigation/native';
import HtmlText from './HtmlText';

const styles = StyleSheet.create({
  jumbo: {
    width: width * 1,
    height: (width / 3816) * 901,
    marginBottom: (width / 3816) * 901 * .05,
  },
});

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
]


class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markedDays: '2022-01-28',
      selectedDate: '',
      selectedMonth: new Date().getMonth() + 1,
      selectedDay: new Date().getDate(),
      selectedYear: new Date().getFullYear(),
      currentYear: 0,
      currentMonth: 0,
      noEvent: true,
      fontsAreLoaded: false,
      pins: null,
      pinsAreLoaded: false,
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
    this.refreshMonth(this.state.selectedYear, this.state.selectedMonth);
    this.setState({ currentYear: new Date().getFullYear(), currentMonth: new Date().getMonth() + 1, fontsAreLoaded: true });
  }

  refreshMonth(year, month) {
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

    const ACRef = database.ref('AC/Events/' + year + '/' + month);
    const EventRef = firebase.database().ref().child('ka-leo/' + year + '/' + month);

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
          link: inputObject[key].link,
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
        console.log(arrayOfFirebaseData);
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

  onListPress = (currMonth, currYear) => {
    this.props.navigation.push('Month', {
      month: currMonth,
      year: currYear,
      navigation: this.props.navigation,
    });
  };


  getEvent() {
    var filteredArray = this.state.events.filter(obj => obj.dayNumber == this.state.selectedDay).map(obj => obj);
    return filteredArray;
  }

  getMonth(monthNumber) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[monthNumber - 1];
  }

  getListofEventDates = () => {
    let listofDates = [], shortenedDates = [], formattedDates = [], result = {};
    this.state.events.forEach(element => {
      listofDates.push(element.date);
    })

    listofDates.forEach(element => {
      shortenedDates.push(element.substring(element.indexOf(',') + 1));
    })

    shortenedDates.forEach(element => {
      formattedDates.push(element.substr(7, 4) + "-" + element.substr(1, 2) + "-" + element.substr(4, 2));
    })

    formattedDates.forEach((day) => {
      result[day] = { marked: true };
    });

    result = {
      ...result,
      [this.state.selectedDate]: { selected: true }
    }

    return result;
  }

  render() {
    const { fontsAreLoaded, eventsAreLoaded, events, eventDataLoaded, ACEvents, ACEventsAreLoaded, ACEventDataLoaded } = this.state;
    const style = styles.jumbo;
    const B = (props) => <Text style={{ color: 'white', fontWeight: 'bold' }}>{props.children}</Text>
    let IDstr = 'https://www.manoanow.org/app/portal/add_event/upload/';

    // Logic for getting the three months used on the page
    let date = new Date();
    let currMonth = date.getMonth() + 1;
    let nextMonth = 1 + ((date.getMonth() + 1) % 12);
    let nexnexMonth = nextMonth + 1;
    if ((nextMonth + 1) > 12) {
      nexnexMonth = 1;
    }

    // Logic for getting the years
    let currYear = date.getFullYear();
    let year1, year2;
    year1 = year2 = currYear;
    if (currMonth > nextMonth) {
      year1 = year2 = currYear + 1;
    }
    let uri1 = monthURL[currMonth - 1];
    let uri2 = monthURL[nextMonth - 1];
    let uri3 = monthURL[nexnexMonth - 1];
    // console.log('This Month: ' + currMonth + '\nNext Month: ' + nextMonth + '\nYear: ' + currYear + "\nNext Year: " + nextYear);
    return (!eventsAreLoaded || !ACEventsAreLoaded) ? (<AppLoading />) :
      <ScrollView style={{ backgroundColor: '#000000', marginTop: -11, width: '100%', height: height, }} >
        <CustomHeader sectionTitle={'Events'} />
        <Calendar
          theme={{
            calendarBackground: '#2d2d2d',
            dayTextColor: '#fff',
            monthTextColor: '#fff',
          }}
          // Handler which gets executed on day press. Default = undefined
          onDayPress={day => {
            this.setState({ selectedDate: day.dateString, selectedDay: day.day, selectedMonth: day.month });
          }}
          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          monthFormat={'MMMM yyyy'}
          // Handler which gets executed when visible month changes in calendar. Default = undefined
          onMonthChange={month => {
            console.log('month changed', month);
            this.refreshMonth(month.year, month.month);
          }}
          // Do not show days of other months in month page. Default = false
          hideExtraDays={true}
          // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
          // day from another month that is visible in calendar page. Default = false
          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
          firstDay={1}
          // Handler which gets executed when press arrow icon left. It receive a callback can go back month
          onPressArrowLeft={subtractMonth => subtractMonth()}
          // Handler which gets executed when press arrow icon right. It receive a callback can go next month
          onPressArrowRight={addMonth => addMonth()}
          // Enable the option to swipe between months. Default = false
          enableSwipeMonths={true}
          markedDates={this.getListofEventDates()}
        />
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <View>
          </View>
          <View style={{ flex: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            {this.getEvent() == 0 ?
              <View>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <Image
                    source={require('../images/assets/calendar1.png')}
                    style={{
                      width: 150,
                      height: 150,
                      marginTop: 20
                    }}
                    resizeMode="contain"
                  >
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>{this.getMonth(this.state.selectedMonth)} {this.state.selectedDay}</Text>
                    </View>
                    </Image>
                  <Text style={{ color: 'white', marginLeft: 80, fontWeight: 'bold', marginTop: 30, fontSize: 20, alignSelf: 'center' }}>No Events</Text>
                </View>
              </View> :
              <View style={{ marginLeft: 20 }}>
                {this.getEvent().map((event, x) => (
                    <View key={x} style={{ flexDirection: 'row', flex: 1 }}>

                      {event.image == undefined && event.link == undefined ?
                        <View>
                          <Image
                            source={require('../images/assets/calendar1.png')}
                            style={{
                              width: 150,
                              height: 150,
                              marginTop: 20
                            }}
                            resizeMode="contain"
                          >
                         <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>{this.getMonth(this.state.selectedMonth)} {this.state.selectedDay}</Text>
                      </View>
                      </Image>
                        </View> :
                        event.image != "" ?
                        <View>
                        <Image
                            source={{uri: IDstr + event.image}}
                            style={{
                            width: 150,
                            height: 150,
                            marginTop: 20,
                            borderRadius: 10
                          }}
                          resizeMode="cover"
                        ></Image>
                        </View>
                        :
                        <View>
                        <Image
                            source={{uri: event.link}}
                            style={{
                            width: 150,
                            height: 150,
                            marginTop: 20,
                            borderRadius: 10
                          }}
                          resizeMode="cover"
                        ></Image>
                        </View>
                      }

                    <View style={{marginLeft: 10}}>
                      <Text key={event} style={{ flex: 1, flexWrap: 'wrap', width: Dimensions.get('window').width - 200, color: 'white', fontWeight: 'bold', fontSize: 20, marginTop: 20 }}>{event.name.toString()}</Text>
                      <HtmlText html={event.desc.toString()} style={{ flex: 1, flexWrap: 'wrap', color: 'white', width: Dimensions.get('window').width - 175, marginTop: 20 }}><B></B></HtmlText>
                      <View style={{ flexDirection: 'row' }}>
                        <Icon style={{ marginTop: 17 }} name='schedule' color="white" />
                        <Text style={{ color: 'white', marginTop: 20 }}>{event.timeStart.toString()} - {event.timeEnd.toString()}</Text>
                      </View>
                      <View style={{ paddingBottom: 10, flexDirection: 'row' }}>
                        <Icon style={{ marginTop: 17 }} name='place' color="white" />
                        <Text style={{ color: 'white', marginTop: 20}}>{event.location.toString()}</Text>
                      </View>
                  </View>
                  </View>))}
          </View>}
        </View>
      </View>
      </ScrollView >
  }
}


Events.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};

export default withNavigation(Events);
