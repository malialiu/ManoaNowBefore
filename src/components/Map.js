import React, { Component, createRef, useState } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import {
  View,
  Text,
  Dimensions,
  StatusBar,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Pressable
} from 'react-native';
import { Header, Button, SearchBar, CheckBox, Image, Icon } from 'react-native-elements';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { withNavigation } from 'react-navigation';
import ActionSheet from "react-native-actions-sheet";
import PropTypes from 'prop-types';
import MapViewDirections from 'react-native-maps-directions';
import getDirections from 'react-native-google-maps-directions';

const _ = require('lodash');
const { width, height } = Dimensions.get('window');

const TAB_BAR_HEIGHT = 40;
const CHECKBOX_WIDTH = 120;

const GOOGLE_MAPS_APIKEY = 'AIzaSyD0WdQRhLYFDkToGyrhVdAXHDx6WYfECbk';

const actionSheetRef = createRef();
let calloutPressed = false;
let markerPressed = false;

class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      showPin: true,
      fullData: [],
      pinRef: props.data,
      filteredPins: props.data,
      fontsAreLoaded: false,
      tempMarker: '',
      tempPinTitle: '',
      tempImages: '',
      tempDesc: '',
      myLat: '',
      myLng: '',
      myDestination: [],
      search: '',
      userLat: 0,
      userLng: 0,
    };
  }

  async componentDidMount() {
    // Apple loads "Material Icons"
    await Font.loadAsync({ 'Material Icons': require('../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf') });
    // Android loads "MaterialIcons"
    await Font.loadAsync({ 'MaterialIcons': require('../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf') });


    this.setState({ fontsAreLoaded: true })
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

        // How to add my formatted officeRefs to here
        this.props.pinRef.once('value').then((snapshot) => {
          let arrayOfFirebaseData = snapshot.val();

          // reformats object to get rid of keys
          arrayOfFirebaseData = objectReformatPin(arrayOfFirebaseData);

          // sorts reformated object by position
          this.setState({
            data: arrayOfFirebaseData,
            fullData: arrayOfFirebaseData,
            pinsAreLoaded: true,
          });
        });

        console.log("hELLO\n");

        console.log(data);
      }


  onMarkerPress = location => () => {
    calloutPressed = true;
    console.log("Callout pressed!");
    this.props.navigation.push('Location', {
      pin: location,
    });
  };


  handleSearch = (text) => {
    const formatText = " " + text.toLowerCase();
    this.setState({
      search: formatText,
      filteredPins: this.state.pinRef.filter(place => {
        if (place.title.toLowerCase().indexOf(formatText.trim()) > -1) {
          return place.title.indexOf(formatText);
      } })});
  };

  // when back icon is pressed
  onBackPress = () => {
    this.props.navigation.goBack()
  }

  onListPress = (type, link) => () => {
    actionSheetRef.current?.hide();
    if(type == 'web'){
        this.props.navigation.push('Details', {
          navigation: link,
        });
    } else if (type == 'page') {
        this.props.navigation.push('Search', {
        });
        }
    }

	handleGetDirections = () => {
		const data = {
			destination,
			params: [
				{
					key: "dirflg",
					value: "d"
				}
			]
		}

		getDirections(data)
	}

  /*
  getLat = () => {
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log("Latitude is :", position.coords.latitude);
    var coords = {lat: position.coords.latitude, lon: position.coords.longitude};
  });
  }

  getLng = () => {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log("long is :", position.coords.longitude);
        return position.coords.longitude;
    });
    }
*/

  // when marker is pressed
  onPinPress = (marker) => {
    markerPressed = true;
    // this.setState({ markerPressed: true });
    this.setState({ tempPinTitle: marker.title })
    this.setState({ tempImages: marker.images })
    this.setState({ tempDesc: marker.description })
    this.setState({ myLat: marker.lat})
    this.setState({ myLng: marker.lng })
    this.setState({ tempMarker: marker })
    console.log('Pin Pressed, show Bottom Drawer')
  }

  bottomTitleShower = (marker) => {
    if(marker.title){
      return(
        <Text style = {styles.drawerText}>
          {marker.title}
        </Text>
      )
    }
  }

  bottomDescShower = (marker) => {
    if(marker.description){
      return(
        <Text style = {styles.drawerDesc}>
          {marker.description}
        </Text>
      )
    }
  }

  bottomImageShower = (marker) => {
    if(marker.images){
      return(
        <Image
          style={{ width: width, height: height * 0.3}}
          source={{ uri: marker.images[0]}}
        />
      )
    }
  }

  showBottomDrawer = (marker) => {
   if (markerPressed && !calloutPressed){
      markerPressed = false;
      actionSheetRef.current?.setModalVisible();
      console.log("bottom drawer");
      return(
        <ActionSheet containerStyle = {{height: 400, backgroundColor: '#2D2D2D'}} ref={actionSheetRef} gestureEnabled={true} >
          <ScrollView
            nestedScrollEnabled={true}
            onScrollEndDrag={() =>
              actionSheetRef.current?.handleChildScrollEnd()
            }
            onScrollAnimationEnd={() =>
              actionSheetRef.current?.handleChildScrollEnd()
            }
            onMomentumScrollEnd={() =>
              actionSheetRef.current?.handleChildScrollEnd()
            }
          >

          </ScrollView>
        </ActionSheet>
      );
    }
    else{
      calloutPressed = false;
      actionSheetRef.current?.hide();
    }
  }

  setDestination = (destination) => {
    this.setState({ myDestination: destination});
  }

  render() {
    const { pins, search, fontsAreLoaded } = this.state;
    let padSize = height / 120;
    const destination = Object.assign({}, this.state.myLat, this.state.myLng);
    /*const source = navigator.geolocation.getCurrentPosition(function(position) {
      console.log("sfwfw :", position.coords.latitude  + " and " + position.coords.longitude);
      this.setState({myLat: position.coords.latitude});
      return {latitude: position.coords.latitude, longitude: position.coords.longitude};
    })*/
   // console.log("mysource" + JSON.stringify(source));
    return (!fontsAreLoaded) ? <AppLoading /> : (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <Header
          leftComponent={{ icon: 'keyboard-backspace', color: '#fff', onPress: this.onBackPress, iconStyle: {paddingTop: padSize, paddingRight: padSize, paddingLeft: padSize, paddingBottom: padSize},
          }}
          centerComponent={{ text: 'Campus Map', style: { color: '#fff', fontSize: 20 } }}
          rightComponent={{ icon: 'apartment', color: '#fff', onPress: this.onListPress('page', 'Search'), iconStyle: {paddingTop: padSize, paddingRight: padSize, paddingLeft: padSize, paddingBottom: padSize}, }}
          containerStyle={{
            backgroundColor: 'black',
            borderBottomWidth: 0,
          }}
        />
        {Platform.OS === 'android' ? <StatusBar translucent={false} barStyle="light-content" backgroundColor="black" /> : null}

        <MapView
          style={{ flex: 1, marginTop: 10, marginRight: 10, marginLeft: 10 }}
          initialRegion={{
            latitude: 21.297152,
            longitude: -157.817677,
            latitudeDelta: 0.008,
            longitudeDelta: 0.008,
          }}
          showsMyLocationButton={true}
          showUserLocation={true}
          mapType={'satellite'}
        >
           {this.state.filteredPins.map((marker, idx) => (
            <MapView.Marker
              key={idx}
              coordinate={{ latitude: marker.lat, longitude: marker.lng }}
              onPress = {(e) => {e.stopPropagation(); this.onPinPress(marker);}}
            >
              <Callout
                onPress={this.onMarkerPress(marker)}
              >
                <View>
                    <Text style={{fontSize: 15}}>{marker.title}</Text>
                </View>
              </Callout>
            </MapView.Marker>
          ))}
        </MapView>

        {this.showBottomDrawer(this.state.tempMarker)}
        <View style={{ marginTop: 20, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <View style={{ flex: 3 }}>
                    <SearchBar
                        onChangeText={text => this.handleSearch(text)}
                        value={search}
                        round
                    />
                </View>
            </View>
        </View>
      </View>
    );
  }
}

Map.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
  pinRef: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  checkboxText: {
    color: 'white',
    marginLeft: 1,
    marginRight: 5,
    marginBottom: 5
  },
  checkboxContainer: {
    backgroundColor: 'black',
    width: CHECKBOX_WIDTH,
    marginRight: 0.1
  },
  drawerText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 5
  },
  drawerDesc: {
    fontSize: 16,
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20
  },
  drawerView: {
    padding: 15,
    color: '#2D2D2D'
  },
  button: {
    textAlign:'center',
    paddingBottom: 10
  },
});

// add info for offices/department in props
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

export default withNavigation(Map);

SearchScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};
