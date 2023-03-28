 import React, { Component } from 'react';
import * as firebase from 'firebase';
import { ImageBackground, Header, Text, StyleSheet, View, FlatList, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { List, Image, Overlay } from 'react-native-elements'
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import CustomHeader from './CustomHeader';
const _ = require('lodash');
const { width } = Dimensions.get('window');
let IDR;

class Deals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IDAds: [],
      JobAds: [],
      overlayImage: "http://www.manoanow.org/app/uhid/upload/KaloTerrace.png",
      IDAreLoaded: false,
      JobsAreLoaded: false,
      fontsAreLoaded: false,
      isVisible: false,
      type: this.props.type,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({ 'Material Icons': require('../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf') });
    this.setState({ fontsAreLoaded: true });
    await Font.loadAsync({ 'MaterialIcons': require('../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf') })
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
    const JobRef = database.ref('jobs');
    const IDRef = database.ref('UHID');
    IDR = IDRef;


    function objectReformatJob(inputObject) {
      const arrayOfPins = [];
      let objectOfPin = {};
      const keys = Object.keys(inputObject);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        objectOfPin = {
          adimage: inputObject[key].adimage,
          name: inputObject[key].name,
        };
        arrayOfPins.push(objectOfPin);
      }
      return arrayOfPins;
    }

    function objectReformatID(inputObject) {
      const arrayOfPins = [];
      let objectOfPin = {};
      const keys = Object.keys(inputObject);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        objectOfPin = {
          adimage: inputObject[key].adimage,
          clicks: inputObject[key].clicks,
          edate: inputObject[key].edate,
          imp: inputObject[key].imp,
          link: inputObject[key].link,
          name: inputObject[key].name,
          sdate: inputObject[key].sdate,
          dataID: key,
        };
        arrayOfPins.push(objectOfPin);
      }
      return arrayOfPins;
    }

    JobRef.once('value').then((snapshot) => {
      let arrayOfFirebaseData = snapshot.val();
      // reformats object to get rid of keys
      arrayOfFirebaseData = objectReformatJob(arrayOfFirebaseData);
      // sorts reformated object by position
      this.setState({
        JobAds: arrayOfFirebaseData,
        JobsAreLoaded: true,
      });
    });

    IDRef.once('value').then((snapshot) => {
      let arrayOfFirebaseData = snapshot.val();
      // reformats object to get rid of keys
      arrayOfFirebaseData = objectReformatID(arrayOfFirebaseData);
      // sorts reformated object by position
      this.setState({
        IDAds: arrayOfFirebaseData,
        IDAreLoaded: true,
      });
    });
  }

  // when back icon is pressed
  onBackPress = () => {
    this.props.navigation.goBack()
  }

  typeChecker = (type, IDads, JobAds, overlayImage) => {
    let IDstr = 'https://www.manoanow.org/app/portal/add_ad/upload/';
    let Jobstr = 'https://www.manoanow.org/app/jobs/upload/';

    if(type === "Deal" ){
      return (
      <View style={{width: '100%', height: '100%', resizeMode: 'contain', marginTop: '50%'}}>
          <Text style={{ paddingLeft: width/14, fontWeight: 'bold', paddingRight: width/14, color: 'white', fontFamily: 'AvenirNext-Medium', fontSize: 25, textAlign: 'center' }}>COMING SOON</Text>
          <Text style={{ paddingLeft: width/14, paddingRight: width/14, color: 'white', fontFamily: 'AvenirNext-Medium', fontSize: 25, textAlign: 'center' }}> The Kaleo Team is working hard to find you UH Deals</Text>
      </View>
      );
    } else {
      return (
      <ScrollView scrollEnabled contentContainerStyle={styles.container}>
          {JobAds.map((ad, idx) => (
            <TouchableOpacity onPress={()=> this.onJobImagePress(ad, Jobstr)} key={idx} style={styles.button}>
                <Text>{ad.name}</Text>
            </TouchableOpacity>
          )) }
          <Overlay
            isVisible={this.state.isVisible}
            onBackdropPress={() => this.setState({ isVisible: false })}
            width={width * .85}
            height={width * .85}
            windowBackgroundColor="rgba(0, 0, 0, .75)"
            overlayStyle={{backgroundColor: 'rgba(0, 0, 0, 0.0)'}}
          >
            <Image
              source={{uri: overlayImage}}
              style={{width: width * .8, height: width * .8, }}
            />
          </Overlay>
        </ScrollView>
        );
      }
    }


  onIDImagePress = (ad, str) => {
    let path = str.concat(ad.adimage);
    this.setState({ isVisible: true, overlayImage: path })
    let clicks = ad.clicks;
    clicks++;
    IDR.child(ad.dataID).update({ clicks: clicks });

  }

  onJobImagePress = (ad, str) => {
    let path = str.concat(ad.adimage);
    this.setState({ isVisible: true, overlayImage: path })
  }

  render() {
    const { type, IDAreLoaded, JobsAreLoaded, IDAds, JobAds, overlayImage } = this.state;
    const { navigation } = this.props;
    return !IDAreLoaded && !JobsAreLoaded ? <AppLoading /> : (
      <View style={{ width: '100%', backgroundColor: '#FFFFFF'}} >
        <CustomHeader />
         {this.typeChecker(type, IDAds, JobAds, overlayImage)}
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap' ,
    justifyContent: "center"
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    margin: 10,
    width: '95%',
    padding: 15
  },
});

Deals.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};

export default withNavigation(Deals);
