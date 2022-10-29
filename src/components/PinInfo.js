import React, { Component } from 'react';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import {
  ScrollView, StatusBar,
  View,
  Text, Dimensions, StyleSheet, Platform, Linking
} from 'react-native';
import * as firebase from 'firebase';
import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import { List, Card, Header, Divider, Image } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
const _ = require('lodash');
const { height, width } = Dimensions.get('window');
import Swiper from 'react-native-swiper'


let nowappPinRef;

class PinInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsAreLoaded: false,
      background: null,
      backgroundIsLoaded: false,
      text: '',
      data: [],
      childData: [],
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
    await Font.loadAsync({ 'Material Icons': require('../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf') });
    // Android loads "MaterialIcons"
    await Font.loadAsync({ 'MaterialIcons': require('../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf') })
    this.setState({ fontsAreLoaded: true })

    // Initialize Firebase
    !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
    const database = firebase.database();

    // Connect
    nowappPinRef = database.ref('now-app/map/Pins');

    this.setState({ fontsAreLoaded: true })


    function objectReformatPin(inputObject) {
      const arrayOfPins = [];
      let objectOfPin = {};
      var childRef = nowappPinRef.child;
      const keys = Object.keys(inputObject);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        objectOfPin = {
          title: inputObject[key].title,
          buildingKey: inputObject[key].buildingKey,
          key: nowappPinRef.child(key).key,
          description: inputObject[key].description,
          lat: inputObject[key].lat,
          lng: parseFloat(inputObject[key].lng),
          images: inputObject[key].images,
          website: inputObject[key].website,
          phone: inputObject[key].phone,
          address: inputObject[key].address,
          email: inputObject[key].email,
          type: inputObject[key].type,
        };
        arrayOfPins.push(objectOfPin);
      }
      return arrayOfPins;
    }

    nowappPinRef.once('value').then((snapshot) => {
      let firebaseData = snapshot.val();
      firebaseData = objectReformatPin(firebaseData);
      this.setState({
        childData: firebaseData,
      });
    });
  }

  onBackPress = () => {
    this.props.navigation.goBack()
  };

  colorHandler = (p) => {
    const pinColor = [
      'white',
      '#aba1f6'
    ]

    if((p.indexOf('N/A') > -1) || (p.indexOf('None') > -1) || (p.indexOf('Coming Soon') > -1)){
      return pinColor[0];
    } else {
      return pinColor[1];
    }
  }

  handleEmail = (email) => {
    if((email.indexOf('N/A') > -1) || (email.indexOf('Coming Soon') > -1)){
    } else {
      Linking.openURL(`mailto:${email}`);
    }
  };

  handlePhone = (phone) => {
    if((phone.indexOf('N/A') > -1) || (phone.indexOf('Coming Soon') > -1)){
    } else {
      Linking.openURL(`tel:${phone}`);
    }
  };

  handleWeb = (web) => {
    if((web.indexOf('N/A') > -1) || (web.indexOf('Coming Soon') > -1)){
    } else {
      Linking.openURL(web);
    }
  };

  handleBuilding = building => () => {
    if((building.indexOf('N/A') > -1) || (building.indexOf('Coming Soon') > -1)){
    } else {
    }
  };

  handleOffice = (buildingKey, type) => {
    // Building keys should not be missing :
    if((buildingKey.indexOf('N/A') > -1) || (buildingKey.indexOf('Coming Soon') > -1)){
    } else {
      var offices = [];
      const keys = Object.keys(this.state.childData);
      for (var i = 0; i < keys.length; i++) {
           if (buildingKey == this.state.childData[i].buildingKey && (buildingKey != this.state.childData[i].key)) {
               offices.push(this.state.childData[i].title);
           }
      }
      if (offices.length == 0 || !type.includes('Building')) {
         offices = [];
         offices.push('None');
      }
      return offices;
    }
  };

//y es
  handleList(location) {
      var childLocation = location;
      var keys = Object.keys(this.state.childData);
      for (var i = 0; i < keys.length; i++) {
          if (location == this.state.childData[i].title.replace(/\s+/g, '')) {
              childLocation = this.state.childData[i];
          }
      }
      return childLocation;
  };

  onListPress = location => () => {
    if (location != 'None') {
    this.props.navigation.push('Location', {
        pin: location,
    });
    }
  };

  onNavigatePress = (lat, lng) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${lng}`;
    const label = 'Custom Label';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url);
  };

  imageReturner = (imageArr) => {
    const templist = [];
    let i = 0;
    for(i; i < imageArr.length; i++){
      templist.push(
        <View style={styles.slide} key={i}>
          <Image
            source={{ uri: imageArr[i] }}
            style={{ width: width, height: height * 0.4}}
            key={i}
          />
        </View>
      );
    }
    return templist;
  };

  showInformation = (desc) => {
    let info = '';
    if(!desc){
      info = 'Description not yet filled out';
    }else {
      info = desc;
    }
    return info;
  };

  showEmailHeader = (email) => {
    if(email){
      return (
        <View>
          <Text style={{ color: `white`, fontWeight: 'bold', fontSize: 16, marginBottom: 4, marginTop: 4 }}>
            Email
          </Text>
          <Text style={{ color: `${this.colorHandler(email)}`, marginBottom: 10 }} onPress={() => this.handleEmail(email)}>
            {email}
          </Text>
        </View>
      );
    }
  };

  showWebsiteHeader = (web) => {
    if(web){
      return (
        <View>
          <Text style={{ color: `white`, fontWeight: 'bold', fontSize: 16, marginBottom: 4, marginTop: 4 }}>
            Website
          </Text>
          <Text style={{ color: `${this.colorHandler(web)}`, marginBottom: 10 }}
            onPress={() => this.handleWeb(web)}>
            {web}
          </Text>
        </View>
      );
    }
  };

  showPhoneHeader = (phone) => {
    if(phone){
      return (
        <View>
          <Text style={{ color: `white`, fontSize: 16, fontWeight: 'bold', marginBottom: 4, marginTop: 4 }}>
            Phone Number
          </Text>
                <Text style={{ color: `${this.colorHandler(phone)}`, marginBottom: 10 }}
                onPress={() => this.handlePhone(phone)}>
            {phone}
          </Text>
        </View>
      );
    }
  }



  render() {
    const { fontsAreLoaded } = this.state;
    const { data, navigation } = this.props;
    const officesTest = this.handleOffice(data.buildingKey, data.type);
    let padSize = height / 120;
    const B = (props) => <Text style={{color: 'white', fontWeight: 'bold'}}>{props.children}</Text>

    let info = this.showInformation(data.description);

    this.imageReturner(data.images);

    return !fontsAreLoaded ? <AppLoading /> : (
      <View>
        <Header
          leftComponent={{ icon: 'keyboard-backspace', color: '#fff', onPress: this.onBackPress, iconStyle: {paddingTop: padSize, paddingRight: padSize, paddingLeft: padSize, paddingBottom: padSize},
          }}
          centerComponent={{ text: data.title, style: { color: '#fff', fontSize: 20 } }}
          containerStyle={{
            backgroundColor: 'black',
          }}
        />
        {Platform.OS === 'android' ? <StatusBar translucent={false} barStyle="light-content" backgroundColor="black" /> : null}
      <ScrollView>
        {data.images.length > 0 ? (
          <Swiper showsButtons={true} style={styles.imageContainer}>
            {this.imageReturner(data.images)}
          </Swiper>
        ) : null}
          <Card containerStyle={{marginTop: 0, marginLeft: -8, marginRight: -8, backgroundColor: 'black'}}>
            <Text style={{ marginBottom: 16, textAlign: 'center', fontWeight: 'bold', fontSize: 25, color: 'white'}}>
              {data.title}
            </Text>
            <Text style={{ color: `white`, fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
              Description
            </Text>
            <Text style={{ marginBottom: 10 , color: 'white'}}>
              {info}
            </Text>

            <Text style={{ color: `white`, fontWeight: 'bold', fontSize: 16, marginBottom: 4, marginTop: 4 }}>
              Building
            </Text>
            <Text style={{ color: 'white', marginBottom: 10 }} onPress={() => this.handleBuilding(data.buildingKey)}>
              {data.buildingKey.replace(/([a-z])([A-Z])/g, '$1 $2')}
            </Text>
            {data.type.includes("Building") ? (
              <View>
                <Text style={{ color: `white`, fontSize: 16, fontWeight: 'bold', marginBottom: 4, marginTop: 4 }}>
                  Offices/Eateries
                </Text>

                <ScrollView>
                    {
                        officesTest.map((item, key) => (
                        <View key={key} >
                          <Text key={key} style={{ color: `${this.colorHandler(item)}`, marginBottom: 10 }} onPress={this.onListPress(this.handleList(item.replace(/\s+/g, '')))}>
                            {item}
                            </Text>
                        </View>))
                    }
                </ScrollView>
              </View>
            ) : null}
            {/* <Text style={{ color: `white`, fontSize: 16, marginBottom: 4, marginTop: 4 }}>
              Offices/Eateries
            </Text> */}

            {/* <ScrollView>
                {
                    officesTest.map((item, key) => (
                    <View key={key} >
                       <Text key={key} style={{ color: `${this.colorHandler(item)}`, marginBottom: 10 }} onPress={this.onListPress(this.handleList(item.replace(/\s+/g, '')))}>
                         {item}
                        </Text>
                   </View>))
                }
            </ScrollView> */}

            <Divider style={{ backgroundColor: `white` }} />

            {this.showEmailHeader(data.email)}
            {this.showWebsiteHeader(data.website)}
            {this.showPhoneHeader(data.phone)}

            <Divider />
            <Text style={{ color: '#aba1f6', fontSize: 16, marginTop: 4, marginBottom: 4 }}
                  onPress={() => this.onNavigatePress(data.lat, data.lng)} >
                  Directions
            </Text>

          </Card>

        <MapView
          provider={this.props.provider}
          style={styles.map}
          pitchEnabled={false}
          rotateEnabled={false}
          mapType={'satellite'}
          initialRegion={{
            latitude: data.lat,
            longitude: data.lng,
            latitudeDelta: 0.0022,
            longitudeDelta: 0.0021,
          }}
        >

          <Marker
            coordinate={{ latitude: data.lat, longitude: data.lng }}
          >
          </Marker>
        </MapView>
      </ScrollView>
    </View>
    );
  }
}

PinInfo.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    // ...StyleSheet.absoluteFillObject,
    flex: 1
  },
  scrollview: {
    alignItems: 'stretch',
  },
  map: {
    width: width,
    height: 300,
  },
  imageContainer: {
    height: height * 0.4,
    // width: width * 1.5,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
});

export default withNavigation(PinInfo);
