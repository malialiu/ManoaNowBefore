import React from 'react';
import {
  View,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Text,
  Image,
  TouchableOpacity,
  Linking
} from 'react-native'; // eslint-disable-line
import { LogBox } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import PropTypes from 'prop-types';
import AppLoading from 'expo-app-loading';
import * as firebase from 'firebase';
import Tile from './src/components/Tile';
import Map from './src/components/Map';
import PinList from './src/components/PinList';
import PinInfo from './src/components/PinInfo';
import Advertisements from './src/components/Advertisements';
import Detail from './src/components/Detail';
import Deals from './src/components/Deals';
import Events from './src/components/Events';
import EventsSignIn from './src/components/EventsSignIn';
import PlainText from './src/components/PlainText';
import Month from './src/components/Month';
import SubmitInfo from './src/components/SubmitInfo';
import Menu from './src/components/Menu';
import { Header, Overlay, Button, } from 'react-native-elements';
import * as Font from 'expo-font';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import Tabs from './src/components/BottomTab.js';
import { SliderBox } from "react-native-image-slider-box";

// import { StatusBar } from 'expo-status-bar';

const { height, width } = Dimensions.get('window');
const _ = require('lodash');
let nowappRef;
let appPkg = require('./app.json');
const Tab = createBottomTabNavigator();
const MyTheme = {
  colors: {
    primary: '#333333',
    card: '#333333'
  },
};


class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tiles: [],
      data: [],
      linkArray: [],
      adImages: [],
      background: null,
      backgroundIsLoaded: false,
      text: '',
      fontsAreLoaded: false,
      isVisible: false,
      ad: [
      require('./src/images/assets/advertisement.png'),
      ],
      event: [
        require('./src/images/assets/EVENTS_THUMB_HALLOWEEN.png'),
      ],
      images: [ // Network image
        require('./src/images/assets/APP_JP_POWERSPORTS.png'),
        require('./src/images/assets/XK3_APP2.png'),
      ],
      programs: [ // Refers to Student Essentials
        { path: require('./src/images/assets/key_deals.png') },
        { path: require('./src/images/assets/key_dining.png') },
        { path: require('./src/images/assets/key_map.png') },
        { path: require('./src/images/assets/key_shuttle.png') },
        { path: require('./src/images/assets/key_star.png') },
        // UH Programs
        { path: require('./src/images/KaLeo.png') },
        { path: require('./src/images/KTUH.png') },
        { path: require('./src/images/UHP.png') },
        { path: require('./src/images/HIReview.png') },
      ]
    };
  }
  async componentDidMount() {
    const firebaseConfig = {
      apiKey: 'AIzaSyBtWT33Efe65RjvWSaz8akRB17f8R4BS4Q',
      authDomain: 'ka-leo.firebaseapp.com',
      databaseURL: 'https://ka-leo.firebaseio.com',
      projectId: 'ka-leo',
      storageBucket: 'ka-leo.appspot.com',
      messagingSenderId: '332977316492',
      appId: '1:332977316492:web:93984a5d78025cb3',
    };

    // Apple loads "Material Icons"
    await Font.loadAsync({ 'Material Icons': require('./node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf') });
    // Android loads "MaterialIcons"
    await Font.loadAsync({ 'MaterialIcons': require('./node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf') })
    this.setState({ fontsAreLoaded: true });

    // Initialize Firebase
    !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
    const database = firebase.database();

    nowappRef = database.ref('now-app');

    function objectReformat(inputObject) {
      const arrayOfTiles = [];
      let objectOfTile = {};
      const keys = Object.keys(inputObject);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        objectOfTile = {
          image: inputObject[key].image,
          path: inputObject[key].path,
        };
        arrayOfTiles.push(objectOfTile);
      }
      return arrayOfTiles;
    }

    
    function pictureReformat(inputObject) {
      const arrayOfTiles = [];
      let objectOfTile = {};
      const keys = Object.keys(inputObject);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        objectOfTile = {
          eventImage: inputObject[key].eventImage,
        };
        arrayOfTiles.push(objectOfTile);
      }
      return arrayOfTiles;
    }

    function objectReformatPin(inputObject) {
      const arrayOfPins = [];
      let objectOfPin = {};
      const keys = Object.keys(inputObject);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        objectOfPin = {
          title: inputObject[key].title,
          description: inputObject[key].description,
          lat: inputObject[key].lat,
          lng: parseFloat(inputObject[key].lng),
          images: inputObject[key].images,
          website: inputObject[key].website,
          phone: inputObject[key].phone,
          address: inputObject[key].address,
          email: inputObject[key].email,
          type: inputObject[key].type,
          buildingKey: inputObject[key].buildingKey,
        };
        arrayOfPins.push(objectOfPin);
      }
      return arrayOfPins;
    }

    // make sure data is loaded text and backgroundisloaded
    // when u print data make sure its loaded then print
    nowappRef.once('value').then((snapshot) => {
      const data = snapshot.val().background;
      const text = snapshot.val().text;

      let arrayOfFirebaseData = snapshot.val().ads;
      // reformats object to get rid of keys
      arrayOfFirebaseData = objectReformat(arrayOfFirebaseData);
      // sorts reformated object by position
      arrayOfFirebaseData = _.sortBy(arrayOfFirebaseData, 'position');

      var imageArray = [], linkArray = [];

      arrayOfFirebaseData = objectReformat(arrayOfFirebaseData);
      arrayOfFirebaseData = _.sortBy(arrayOfFirebaseData, 'position');

      arrayOfFirebaseData.forEach(element => {
        imageArray.push(element.image)
      });

      arrayOfFirebaseData.forEach(element => {
        linkArray.push(element.path)
      });

      // for featured event
      let firebaseEventImage = snapshot.val().EventImage;
      firebaseEventImage = pictureReformat(firebaseEventImage);
      firebaseEventImage = _.sortBy(firebaseEventImage, 'position');

      let latestEvent = firebaseEventImage.slice(-1).pop();
      let IDstr = 'https://www.manoanow.org/app/portal/add_featured/upload/';

      this.setState({
        tiles: arrayOfFirebaseData,
        background: data,
        text: text,
        backgroundIsLoaded: true,
        adImages: imageArray,
        adLinks: linkArray,
      });
      this.updateChecker(this.state.text.VersionCode, this.state.text.version);
    });

    const pinRef = nowappRef.child("map/Pins");
    pinRef.once('value').then((snapshot) => {
        let arrayOfFirebaseData = snapshot.val();

        // reformats object to get rid of keys
        arrayOfFirebaseData = objectReformatPin(arrayOfFirebaseData);
        // console.log(`array of firebase data (landing): ${arrayOfFirebaseData}`);

        this.setState({
          data: arrayOfFirebaseData,
        });
    });
  }

  // when search icon is pressed
  onTextPress = (location) => {
    this.setState({ isVisible: false });
    this.props.navigation.push('PlainText', {
      info: location,
    });
  };

  tileLoader = (tiles) => {
    const tempList = [];
    for (let i = 0; i < tiles.length; i += 1) {
      tempList.push(
        <Tile
          image={tiles[i].image}
          key={tiles[i].position}
          path={tiles[i].path}
          type={tiles[i].type}
        />,
      );
    }
    return tempList;
  }

  onListPress = (type, link) => () => {
    if (type == 'web') {
      this.props.navigation.push('Details', {
        navigation: link,
      });
    }
    else if (type == 'text') {
      this.props.navigation.push('PlainText', {
        info: link,
      });
    }
    else if (type == 'page') {
      if (link == 'EVENTS') {
        this.props.navigation.push('Events', {
        });
      } else if (link == 'UH ID DEALS') {
        this.props.navigation.push('Deals', {
          type: 'Deal',
        });
      } else if (link == 'JOBS') {
        this.props.navigation.push('Deals', {
          type: 'Jobs',
        });
      } else if (link == 'ADS') {
        this.props.navigation.push('Ads', {
        });
      } else if (link == 'MAP') {
        this.props.navigation.push('Maps', {
            pins: this.state.data,
        });
      }
    }
  };

  updateChecker = (androidRef, appleRef) => {
    console.log(appleRef);
    console.log(androidRef);
    let ret = false;

    if ((androidRef === undefined) || (appleRef === undefined)) {
      return null;
    }
    if (Platform.OS === 'android') {
      // if (appPkg.android.versionCode === nowappRef.child("map/pin") ){
      if (appPkg.expo.android.versionCode !== androidRef) {
        ret = true;
      }
    } else if (Platform.OS === 'ios') {
      // if (appPkg.expo.version === nowappRef.child("map/pin")){
      if (appPkg.expo.version !== appleRef) {
        ret = true;
        console.log(this.state.isVisible);
      }
    }
    this.setState({ isVisible: ret });
  }

  onLinkPress = () => {
    if (Platform.OS === 'android') {
      Linking.openURL('https://play.google.com/store/apps/details?id=com.icampustimes.kaleo');
    } else if (Platform.OS === 'ios') {
      try {
        Linking.openURL('itms-apps://apps.apple.com/us/app/m%C4%81noa-now/id538671814');
      } catch (e) {
        Linking.openURL('https://apps.apple.com/us/app/m%C4%81noa-now/id538671814');
      }
    } else {
      return null;
    }
  }

  renderCustomIconB = () => {
    return (
      <View>
        <Image
          style={{ width: 200, height: 50, resizeMode: 'contain' }}
          source={require('./src/images/horiz.png')}
        />
      </View>
    );
  };

  render() {
    const { tiles, background, backgroundIsLoaded, fontsAreLoaded } = this.state;
    const backgroundUri = background != null ? background : ""
    let padSize = height / 120;
    LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
    LogBox.ignoreAllLogs();//Ignore all log notifications

    return (!backgroundIsLoaded && !fontsAreLoaded) ? <AppLoading /> : (
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 0 }}>

          {Platform.OS === 'ios' ? <StatusBar barStyle="light-content" /> : null}
          {Platform.OS === 'android' ? <StatusBar translucent={false} barStyle="light-content" backgroundColor="black" /> : null}

          <View style={{ width: '100%' }} />
          <ImageBackground source={ require('./src/images/2023_assets/BACKGROUND_2023.jpg') } style={{ width: '100%', height: '100%' }}>
            <ScrollView scrollEnabled contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap', paddingBottom: height/5 }}>
              <SliderBox images={this.state.adImages}
                paginationBoxVerticalPadding={0}
                sliderBoxHeight={height/11}
                circleLoop={true}
                dotStyle={{ 'width': 0, 'height': 0 }}
                inactiveDotColor={'black'}
                onCurrentImagePressed={(index) => this.props.navigation.push('Details', {
                  navigation: this.state.adLinks[index],
                })}
                ImageComponentStyle={{ width: '120%', resizeMode: 'contain', marginBottom: 20 }} />

              <View style={{
                flexDirection: 'row'

              }}>

                <TouchableOpacity onPress={this.onListPress('web', 'https://www.star.hawaii.edu/studentinterface/')}>
                    <Image
                        source={require('./src/images/2023_assets/2023_STAR.png')}
                        style={{
                            width: width/2.6,
                            height: width/2.6,
                            marginLeft: (width-width/2.6)/2,
                            marginTop: 15
                        }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
              </View>
              <View style={{
                            marginTop: 30,
                            flexDirection: 'row'
                            }}>

                <TouchableOpacity onPress={this.onListPress('page', 'MAP')}>
                    <Image
                      source={require('./src/images/2023_assets/2023_CAMPUS_MAP.png')}
                        style={{
                          width: width/2.6,
                          height: width/2.6,
                          marginLeft: 20
                        }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={this.onListPress('page', 'UH ID DEALS')}>
                    <Image
                        source={require('./src/images/2023_assets/2023_UH_ID.png')}
                        style={{
                          width: width/2.6,
                          height: width/2.6,
                          marginLeft:  width - 2*(width/2.6 + 20)
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <View style={{
                      marginTop: 30,
                      flexDirection: 'row',
                      }}>

                <TouchableOpacity onPress={() => this.props.navigation.push('Details', {
                  navigation: "https://uhmshuttle.com/routes"
                })}>
                  <Image
                    source={require('./src/images/2023_assets/2023_RAINBOW_SHUTTLE.png')}
                    style={{
                          width: width/2.6,
                          height: width/2.6,
                          marginLeft: 20
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {this.props.navigation.push('Deals', { type: 'Jobs', });}}>
                    <Image
                        source={require('./src/images/2023_assets/2023_JOBS.png')}
                        resizeMode='contain'
                        style={{
                          width: width/2.6,
                          height: width/2.6,
                          marginLeft:  width - 2*(width/2.6 + 20)
                        }}
                    />
                </TouchableOpacity>
              </View>
               <View style={{
                marginTop: 30,
                flexDirection: 'row',
              }}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Events')}>
                  <Image
                      source={require('./src/images/2023_assets/2023_EVENTS.png')}
                      style={{
                          width: width/2.6,
                          height: width/2.6,
                          marginLeft: 20
                      }}
                      resizeMode="contain"
                  />

              </TouchableOpacity>
                <TouchableOpacity onPress={this.onListPress('web', 'https://eacct-hawaii-manoa-sp.transactcampus.com/eAccounts/AnonymousHome.aspx')}>
                    <Image
                        source={require('./src/images/2023_assets/2023_DINING_DOLLARS.png')}
                      style={{
                          width: width/2.6,
                          height: width/2.6,
                          marginLeft:  width - 2*(width/2.6 + 20)
                      }}
                      resizeMode="contain"
                  />
              </TouchableOpacity>
            </View>
              <Overlay
                isVisible={this.state.isVisible}
                onBackdropPress={() => this.setState({ isVisible: false })}
                width={width * .85}
                height={width * .85}
                windowBackgroundColor="rgba(0, 0, 0, 1)"
                overlayStyle={{ backgroundColor: 'rgba(0, 0, 0, 100.0)' }}
                fullScreen={true}
              >
                <View>

                  <Header
                    centerComponent={{ text: 'Mānoa Now', style: { color: '#fff', fontSize: 20 } }}
                    rightComponent={{
                      icon: 'close',
                      color: '#fff',
                      onPress: () => this.setState({ isVisible: false }),
                      iconStyle: { paddingTop: padSize, paddingRight: padSize, paddingLeft: padSize, paddingBottom: padSize },
                    }}
                    containerStyle={{
                      backgroundColor: 'black',
                    }}
                  />

                  {Platform.OS === 'ios' ? <StatusBar barStyle="light-content" /> : null}
                  {Platform.OS === 'android' ? <StatusBar translucent={false} barStyle="light-content" backgroundColor="black" /> : null}

                  <Text style={{
                    color: 'white', paddingTop: height * .25, textAlign: 'left', marginHorizontal: width * 0.05,
                    fontWeight: 'bold', fontSize: width * 0.05
                  }}
                  >Update Mānoa Now</Text>
                  <Text style={{ color: 'white', paddingTop: height * .03, textAlign: 'left', marginHorizontal: width * 0.05 }}
                  >We recommend that you update to the latest version that fixes bugs and adds new features!</Text>
                  <Button title="Update Now" containerStyle={{ paddingTop: height * .01 }} buttonStyle={{ marginHorizontal: width * 0.05 }} onPress={this.onLinkPress} />
                </View>
              </Overlay>
            </ScrollView>
          </ImageBackground>
        </SafeAreaView>
      </View>
    );
  }
}

const DetailsScreen = (props) => {
  const { navigation } = props;
  const pageLink = navigation.getParam('navigation', 'https://google.com');
  return (
    <Detail pageLink={pageLink} />
  );
};

//add info for offices/department in props
const LocationScreen = (props) => {
  const { navigation } = props;
  const pin = navigation.getParam('pin', []);
  return (
    <PinInfo data={pin} />
  );
};

//add info for offices/department in props
//Contains PinList
const SearchScreen = (props) => {
  const { navigation } = props;
  const pins = navigation.getParam('pins', []);

  const buildingList = nowappRef.child("map/Pins");
  return (
    <View>
      <PinList
        pinRef={buildingList}
      />
    </View>
  );
};

const MapScreen = (props) => {

  const { navigation } = props;
  const pins = navigation.getParam('pins', []);
  const buildingList = nowappRef.child("map/Pins");
  return (
    <Map data={pins} pinRef={buildingList} />
  );
};

const MenuScreen = (props) => {
  const { navigation } = props;
  return (
    <View>
      <Menu />
    </View>
  );
};


const DealsScreen = (props) => {
  const { navigation } = props;
  const type = navigation.getParam('type', 'error');
  return (
    <Deals type={type} />
  );
};

const EventsScreen = (props) => {
  const { navigation } = props;
  return (
    <Events />
  );
};

const AdvertisementScreen = (props) => {
  const { navigation } = props;
  return (
    <Advertisements />
  );
};

const EventsSignInScreen = (props) => {
  const { navigation } = props;
  return (
    <EventsSignIn />
  );
};


const SubmitInfoScreen = (props) => {
  const { navigation, pass } = props;
  const event = navigation.getParam('event', 'error');
  return (
    <SubmitInfo event={event} />
  );
};

const MonthScreen = (props) => {
  const { navigation } = props;
  const month = navigation.getParam('month', 'error');
  const year = navigation.getParam('year', 'error');
  return (
    <Month month={month} year={year} />
  );
};
const TextScreen = (props) => {
  const { navigation } = props;
  const info = navigation.getParam('info', 'error');
  return (
    <PlainText info={info} textRef={nowappRef.child("text")} />
  );
};

const RootStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  Ads: {
    screen: AdvertisementScreen,
    navigationOptions: {
        headerShown: false,
    },
  },
  Details: {
    screen: DetailsScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  Menu: {
    screen: MenuScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  Location: {
    screen: LocationScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  Search: {
    screen: SearchScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  Maps: {
    screen: MapScreen,
    navigationOptions: {
        headerShown: false,
    },
  },
  PlainText: {
    screen: TextScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  Deals: {
    screen: DealsScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  Events: {
    screen: EventsScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  EventsSignIn: {
    screen: EventsSignInScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  SubmitInfo: {
    screen: SubmitInfoScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  Month: {
    screen: MonthScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
});


const App = createAppContainer(RootStack);

export default App;

DetailsScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};
LocationScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};
SearchScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};
MapScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};
DealsScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};
