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
      ad: [],
      event: [
        require('./src/images/assets/EVENTS_THUMB_HALLOWEEN.png'),
      ],
      images: [ // Network image
        require('./src/images/assets/mod6.png'),
        require('./src/images/assets/mod7.png'),
        require('./src/images/assets/mod8.png'),
        require('./src/images/assets/mod9.png'),
        require('./src/images/assets/mod10.png'),
      ],
      programs: [ // Refers to Student Essentials
        { path: require('./src/images/assets/key_deals.png') },
        { path: require('./src/images/assets/key_dining.png') },
        { path: require('./src/images/assets/key_map.png') },
        { path: require('./src/images/assets/key_shuttle.png') },
        { path: require('./src/images/assets/key_star.png') },
        // UH Programs
        { path: require('./src/images/KaLeo.png') },
        { path: require('./src/images/KTUH.png') }, // Local image
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

      this.state.event[0] = IDstr + latestEvent.eventImage;

      console.log(this.state.event);
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
        <Header
          centerComponent={() => this.renderCustomIconB()}
          containerStyle={{ borderWidth: 0, borderBottomWidth: 0, backgroundColor: '#333333', paddingTop: 10, paddingBottom: 10 }}
        />
        <SafeAreaView style={{ flex: 0 }}>

          {Platform.OS === 'ios' ? <StatusBar barStyle="light-content" /> : null}
          {Platform.OS === 'android' ? <StatusBar translucent={false} barStyle="light-content" backgroundColor="black" /> : null}

          <View style={{ width: '100%' }} />
          <ImageBackground source={backgroundUri.length != 0 ? { uri: backgroundUri } : {uri: 'http://www.manoanow.org/app/mobile_assets/assets/app_background.png'}} style={{ width: '100%', height: '100%' }}>
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
                marginTop: 15,
                flexDirection: 'row',
                marginLeft: width/20
              }}>
                <TouchableOpacity onPress={this.onListPress('web', 'https://www.star.hawaii.edu/studentinterface/')}>
                    <Image
                        source={require('./src/images/assets/key_star.png')}
                        style={{
                            width: width/6,
                            height: width/6,
                            marginRight: 8
                        }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.onListPress('web', 'https://eacct-hawaii-manoa-sp.transactcampus.com/eAccounts/AnonymousHome.aspx')}>
                    <Image
                        source={require('./src/images/assets/key_dining.png')}
                        style={{
                            width: width/6,
                            height: width/6,
                            marginRight: 8
                        }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.onListPress('page', 'MAP')}>
                  <Image
                    source={require('./src/images/assets/key_map.png')}
                    style={{
                      width: width/6,
                            height: width/6,
                            marginRight: 8
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.push('Details', {
                  navigation: "https://uhmshuttle.com/routes"
                })}>
                  <Image
                    source={require('./src/images/assets/key_shuttle.png')}
                    style={{
                      width: width/6,
                      height: width/6,
                      marginRight: 8
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.onListPress('page', 'UH ID DEALS')}>
                    <Image
                        source={require('./src/images/assets/key_deals.png')}
                        resizeMode='contain'
                        style={{
                            width: width/6,
                            height: width/6,
                            marginRight: 8
                        }}
                    />
                </TouchableOpacity>
              </View>

              <Text style={{ color: 'white', fontFamily: 'AvenirNext-Medium', paddingLeft: width/14, marginTop: 20, marginBottom: 5, fontSize: 25 }}>
              {'Advertisements'}
              </Text>

              <SliderBox
                images={this.state.images}
                sliderBoxHeight={height/4}
                circleLoop
                inactiveDotColor='#333333'
                dotColor='#fff'
                activeOpacity={0.5}
                autoplay={true}
                dotStyle={{ 'width': 8, margin: -2, 'height': 8 }}
                ImageComponentStyle={{ borderRadius: 15, width: '80%', marginBottom: 40 }}
                paginationBoxStyle={{
                  position: "absolute",
                  bottom: 0,
                  padding: 0,
                  width: '75%',
                  alignItems: "center",
                  alignSelf: "center",
                  justifyContent: "center",
                  paddingVertical: 10,
                  paddingBottom: 20
                }}
                onCurrentImagePressed={() => this.props.navigation.navigate('Ads')}
                />

              <Text style={{ color: 'white', fontFamily: 'AvenirNext-Medium', paddingLeft: width/14, marginTop: 5, marginBottom: 5, fontSize: 25 }}>
                {'Events'}
              </Text>

              <SliderBox images={this.state.event} paginationBoxVerticalPadding={20}
                sliderBoxHeight={height/4}
                circleLoop={true}
                dotStyle={{ 'width': 0, 'height': 0 }}
                inactiveDotColor={'black'}
                paginationBoxStyle={{
                  position: "absolute",
                  bottom: 0,
                  padding: 0,
                  width: '75%',
                  alignItems: "center",
                  alignSelf: "center",
                  justifyContent: "center",
                  paddingVertical: 10
                }}
                onCurrentImagePressed={() => this.props.navigation.navigate('Events')}
                ImageComponentStyle={{ resizeMode: 'contain', borderRadius: 15, width: '80%' }} />

              <Text style={{ color: 'white', fontFamily: 'AvenirNext-Medium', paddingLeft: width/14, marginTop: 20, marginBottom: 5, fontSize: 25 }}>
              {'Job Opportunities'}
              </Text>

              <SliderBox
                images={this.state.images}
                sliderBoxHeight={height/4}
                circleLoop
                inactiveDotColor='#333333'
                dotColor='#fff'
                activeOpacity={0.5}
                autoplay={true}
                dotStyle={{ 'width': 8, margin: -2, 'height': 8 }}
                ImageComponentStyle={{ borderRadius: 15, width: '80%', marginBottom: 40 }}
                paginationBoxStyle={{
                  position: "absolute",
                  bottom: 0,
                  padding: 0,
                  width: '75%',
                  alignItems: "center",
                  alignSelf: "center",
                  justifyContent: "center",
                  paddingVertical: 10,
                  paddingBottom: 20
                }}
                onPress={() => this.props.navigation.push('Details', {})}
                /* onCurrentImagePressed={(index) => {
                    if (index == 0) {
                        this.props.navigation.push('Details', {
                            navigation: "https://www.hawaii.edu/shs/",
                        });
                    }
                    }}
                */
                />

              <Text style={{ color: 'white', fontFamily: 'AvenirNext-Medium', paddingLeft: width/14, marginTop: 10, marginBottom: 5, fontSize: 25 }}>
                {'Student Media Programs'}
              </Text>
                <View style={{
                  marginLeft: width/15,
                  flexDirection: 'row',
                }}>
                  <TouchableOpacity onPress={() => this.props.navigation.push('Details', {
                    navigation: "https://youtube.com/c/UHProductions"
                  })}>
                    <Image
                      source={require('./src/images/UHP_revised.png')}
                      style={{
                        width: width/5,
                        height: width/5,
                        marginRight: 10
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.props.navigation.push('Details', {
                    navigation: "https://www.manoanow.org/kaleo/"
                  })}>
                    <Image
                      source={require('./src/images/kaleo1.png')}
                      style={{
                        width: width/5,
                        height: width/5,
                        marginRight: 10
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.props.navigation.push('Details', {
                    navigation: "https://stream.ktuh.org:8001/stream"
                  })}>
                    <Image
                      source={require('./src/images/ktuh1.png')}
                      style={{
                        width: width/5,
                        height: width/5,
                        marginRight: 10
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.props.navigation.push('Details', {
                    navigation: "http://hawaiireview.org/"
                  })}>
                    <Image
                      source={require('./src/images/hawaii_review1.png')}
                      style={{
                        width: width/5,
                        height: width/5,
                        marginRight: 10
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

const MapScreen = (props) => {

  const { navigation } = props;
  const pins = navigation.getParam('pins', []);
  const buildingList = nowappRef.child("map/Pins");
  return (
    <Map data={pins} />
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
  PlainText: {
    screen: TextScreen,
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
MapScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};
LocationScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};
SearchScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};
DealsScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};
