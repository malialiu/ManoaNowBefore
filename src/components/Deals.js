 import React, {Component} from 'react';
import * as firebase from 'firebase';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Image,
  Pressable
} from 'react-native';
import { List, Overlay } from 'react-native-elements'
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import CustomHeader from './CustomHeader';
const _ = require('lodash');

const { width, height } = Dimensions.get('window');

class Deals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IDAds: [],
      JobAds: [],
      overlayImage: "",
      IDAreLoaded: false,
      JobsAreLoaded: false,
      fontsAreLoaded: false,
      isVisible: false,
      type: this.props.type,
      refreshing: false,
      isDealImageVisible: false,
      dealImage: "",
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
      const deals = [];
      let dealObject = {};
      const keys = Object.keys(inputObject);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        dealObject = {
          image: inputObject[key].image,
          name: inputObject[key].name,
        };
        deals.push(dealObject);
      }
      return deals;
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

  onRefresh = () => {
    this.setState({ refreshing: true });
    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 1000);
  };

  handleOnClick = (url) => {
    this.setState({ isDealImageVisible: true, dealImage: url });
    return this.state.isDealImageVisible;
  };

  showImage(url) {
    return(
        <TouchableOpacity onPress={() => this.handleOnClick(url)}>
          <Image
                 style={styles.image}
                 source={{uri: url}}
          />
        </TouchableOpacity>
    );
  }

  typeChecker = (type, IDads, JobAds, overlayImage) => {
    let IDstr = 'https://www.manoanow.org/app/uhid/upload/';
    let Jobstr = 'https://www.manoanow.org/app/jobs/upload/';
    console.log(overlayImage);

    if(type === "Deal" ){
      return (
          <ScrollView scrollEnabled contentContainerStyle={styles.container}>
                    {IDads.map((ad, idx) => (
                      <TouchableOpacity onPress={()=> this.onIDImagePress(ad, IDstr)} key={idx} style={styles.button}>
                          <Text>{ad.name}</Text>
                      </TouchableOpacity>
                    )) }
                    <Overlay
                      isVisible={this.state.isVisible}
                      onBackdropPress={() => this.setState({ isVisible: false })}
                      width={width * .85}
                      height={width * .85}
                    >
                      <Image
                        source={{uri: overlayImage}}
                        style={{width: width * .8, height: width * .8, }}
                      />
                    </Overlay>
                  </ScrollView>
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
    let path = str.concat(ad.image);
    this.setState({ isVisible: true, overlayImage: path })
  }

  onJobImagePress = (ad, str) => {
    let path = str.concat(ad.adimage);
    this.setState({ isVisible: true, overlayImage: path })
  }

  render() {
    const { type, IDAreLoaded, JobsAreLoaded, IDAds, JobAds, overlayImage } = this.state;
    const { navigation } = this.props;
    let padSize = height / 120;
    return !IDAreLoaded && !JobsAreLoaded ? <AppLoading /> : (
      <View style={{ width: '100%'}} >
        <CustomHeader color="#ef4c7f"/>
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
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    margin: 10,
    width: '95%',
    borderWidth: 0.5,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    padding: 15
  },
  scroll_container: {
    paddingBottom : 80,
  },
  image: {
    aspectRatio: 1,
    width: (width - 8) / 2,
    height: undefined,
    resizeMode: 'contain',
    flex: 1,
    marginVertical: 2,
    marginHorizontal: 2,
    backgroundColor: 'black'
  },
});

Deals.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};

export default withNavigation(Deals);
