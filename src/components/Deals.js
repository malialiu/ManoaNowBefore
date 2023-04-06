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
      refreshing: false,
      isDealImageVisible: false,
      dealImage: "http://www.manoanow.org/app/uhid/upload/KaloTerrace.png",
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
    let IDstr = 'https://www.manoanow.org/app/portal/add_ad/upload/';
    let Jobstr = 'https://www.manoanow.org/app/jobs/upload/';

    const { refreshing } = this.state;
    const images= [
      'https://media.discordapp.net/attachments/1019847790588854272/1091229775605018644/Big_City_Diner.png?width=1280&height=1274',
      'https://resizing.flixster.com/oKZx6R0LR26Hy_-BwPxj05F3dsg=/ems.cHJkLWVtcy1hc3NldHMvdHZzZWFzb24vYWZmMjgxMzYtMjg5Yi00ZmVhLWEwYjctYmEyMmI4MTFjNzBjLnBuZw==',
      'data:image/jpeg;base64,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',
      'https://store.crunchyroll.com/on/demandware.static/-/Sites-crunchyroll-master-catalog/default/dw0747300c/images/6894865121324-2-gee-throws-blankets-spy-x-family-poster-art-throw-blanket-31755049730092.jpg',
      'https://media.discordapp.net/attachments/1019847790588854272/1091229775605018644/Big_City_Diner.png?width=1280&height=1274',
      'data:image/jpeg;base64,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',
      'https://store.crunchyroll.com/on/demandware.static/-/Sites-crunchyroll-master-catalog/default/dw0747300c/images/6894865121324-2-gee-throws-blankets-spy-x-family-poster-art-throw-blanket-31755049730092.jpg',
      'https://media.discordapp.net/attachments/1019847790588854272/1091229775605018644/Big_City_Diner.png?width=1280&height=1274',
      'https://resizing.flixster.com/oKZx6R0LR26Hy_-BwPxj05F3dsg=/ems.cHJkLWVtcy1hc3NldHMvdHZzZWFzb24vYWZmMjgxMzYtMjg5Yi00ZmVhLWEwYjctYmEyMmI4MTFjNzBjLnBuZw==',
    ];

    if(type === "Deal" ){
      return (
          <SafeAreaView style={styles.container}>
            <ScrollView
                style={{ backgroundColor: 'white', width: '100%', height: height }}
                contentContainerStyle={styles.scroll_container}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
                }>
              <FlatList
                  data={images}
                  numColumns={2}
                  renderItem={({item}) => this.showImage(item)}
                  keyExtractor={item => item.id}
              />
              <Overlay
                  overlayStyle={{ backgroundColor: 'black', justifyContent: 'center', alignItems: 'center'}}
                  isVisible={this.state.isDealImageVisible}
                  fullScreen={true}
              >
                <Pressable onPress={() => {this.setState({isDealImageVisible: false})}} style={{width: width, height: height}}>
                  <View style={{height: height, width: width}}>
                    <Image
                        source={{uri: this.state.dealImage}}
                        style={{flex: 1, width: undefined, height: undefined, resizeMode: 'contain'}}
                    />
                  </View>
                </Pressable>
              </Overlay>
            </ScrollView>
          </SafeAreaView>
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
