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
    Pressable,
    Linking, TouchableOpacity
} from 'react-native';
import { Header, Button, SearchBar, CheckBox, Image} from 'react-native-elements';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { withNavigation } from 'react-navigation';
import ActionSheet from "react-native-actions-sheet";
import PropTypes from 'prop-types';
import MapViewDirections from 'react-native-maps-directions';
import getDirections from 'react-native-google-maps-directions';
import Icon from 'react-native-vector-icons//FontAwesome';

const _ = require('lodash');
const { width, height } = Dimensions.get('window');

const TAB_BAR_HEIGHT = 40;
const CHECKBOX_WIDTH = 120;

const GOOGLE_MAPS_APIKEY = 'AIzaSyD0WdQRhLYFDkToGyrhVdAXHDx6WYfECbk';

const actionSheetRef = createRef();
const filterDrawer = createRef();
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
      isModalVisible: false,
      isBuildings: false,
      isParking: false,
      isOffice: false,
      isBusStop: false,
      isFood: false,
      isStudyArea: false,
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

        console.log(data);
      }


  onMarkerPress = location => (marker) => {
    calloutPressed = true;
    console.log("Callout pressed!");
    /*
    this.props.navigation.push('Location', {
      pin: location,
    });
    */
    {this.showBottomDrawer(marker)}
  };


  handleSearch = (text) => {
    calloutPressed = false;
    markerPressed = false;
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
  markerPressed = false;
  calloutPressed = false;
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
   if (markerPressed || calloutPressed){
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
            <View style={styles.drawerView} >
                {this.bottomTitleShower(marker)}
                <View style={{ flexDirection: 'row' }}>
                    {this.bottomDescShower(marker)}
                </View>
                <Button
                    buttonStyle={styles.dirButton}
                    title = 'Get Walking Directions'
                    onPress={this.onListPress('web', "https://www.google.com/maps/dir/?api=1&destination=" + this.state.myLat + "," + this.state.myLng + "&dir_action=navigate")}
                />
                <Button
                    buttonStyle={styles.infoButton}
                    title = 'More Information'
                    onPress={() => {
                        this.toggleModal(marker);
                    }}
                />
            </View>
          </ScrollView>
        </ActionSheet>
      );
    }
    else{
      calloutPressed = false;
      actionSheetRef.current?.hide();
    }
  }

  handleBuildingsChange = () => {
      this.setState({isBuildings: !this.state.isBuildings});
  }
  handleParkingChange = () => {
      this.setState({isParking: !this.state.isParking});
  }
  handleOfficeChange = () => {
      this.setState({isOffice: !this.state.isOffice});
  }
  handleBusStopChange = () => {
      this.setState({isBusStop: !this.state.isBusStop});
  }
  handleFoodChange = () => {
      this.setState({isFood: !this.state.isFood});
  }
  handleStudyAreaChange = () => {
      this.setState({isStudyArea: !this.state.isStudyArea});
  }
  showFilterDrawer = () => {
      return(
          <ActionSheet containerStyle = {{height: 300, backgroundColor: '#2D2D2D'}} ref={filterDrawer} gestureEnabled={true} >
              <ScrollView
                  nestedScrollEnabled={true}
                  onScrollEndDrag={() =>
                      filterDrawer.current?.handleChildScrollEnd()
                  }
                  onScrollAnimationEnd={() =>
                      filterDrawer.current?.handleChildScrollEnd()
                  }
                  onMomentumScrollEnd={() =>
                      filterDrawer.current?.handleChildScrollEnd()
                  }
              >
                  <View style={styles.drawerView} >
                      <View style={{flexDirection: 'row-reverse'}}>
                          <TouchableOpacity style={styles.filterSearchButton}>
                              <Text style={{color: 'white', fontSize: width/25, fontWeight: 'bold'}} onPress={() => {filterDrawer.current?.hide()}}>Search</Text>
                          </TouchableOpacity>
                      </View>
                      <View style={{flexDirection: 'row', justifyContent: "space-around"}}>
                          <View style={{flexDirection: 'column', marginTop: 30}}>
                              <TouchableOpacity onPress={this.handleBuildingsChange} style={{flexDirection: 'row'}}>
                                  {this.state.isBuildings ? (<View style={styles.filterCheckBox}><Icon name="check" size={17} color='white'/></View>) : <View style={styles.filterCheckBox}/>}
                                  <Text style={styles.filterText}>Buildings</Text>
                                  <View style={styles.filterIcon}><Icon name="building-o" size={24} color='white'/></View>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={this.handleOfficeChange} style={{flexDirection: 'row', marginTop: 30}}>
                                  {this.state.isOffice ? (<View style={styles.filterCheckBox}><Icon name="check" size={17} color='white'/></View>) : <View style={styles.filterCheckBox}/>}
                                  <Text style={styles.filterText}>Offices</Text>
                                  <View style={styles.filterIcon}><Icon name="building" size={24} color='white'/></View>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={this.handleFoodChange} style={{flexDirection: 'row', marginTop: 30}}>
                                  {this.state.isFood ? (<View style={styles.filterCheckBox}><Icon name="check" size={17} color='white'/></View>) : <View style={styles.filterCheckBox}/>}
                                  <Text style={styles.filterText}>Food</Text>
                                  <View style={styles.filterIcon}><Icon name="cutlery" size={24} color='white'/></View>
                              </TouchableOpacity>
                          </View>
                          <View style={{flexDirection: 'column', marginTop: 30}}>
                              <TouchableOpacity onPress={this.handleParkingChange} style={{flexDirection: 'row'}}>
                                  {this.state.isParking ? (<View style={styles.filterCheckBox}><Icon name="check" size={17} color='white'/></View>) : <View style={styles.filterCheckBox}/>}
                                  <Text style={styles.filterText}>Parking Lots</Text>
                                  <View style={styles.filterIcon}><Icon name="car" size={24} color='white'/></View>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={this.handleBusStopChange} style={{flexDirection: 'row', marginTop: 30}}>
                                  {this.state.isBusStop ? (<View style={styles.filterCheckBox}><Icon name="check" size={17} color='white'/></View>) : <View style={styles.filterCheckBox}/>}
                                  <Text style={styles.filterText}>Bus Stops</Text>
                                  <View style={styles.filterIcon}><Icon name="bus" size={24} color='white'/></View>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={this.handleStudyAreaChange} style={{flexDirection: 'row', marginTop: 30}}>
                                  {this.state.isStudyArea ? (<View style={styles.filterCheckBox}><Icon name="check" size={17} color='white'/></View>) : <View style={styles.filterCheckBox}/>}
                                  <Text style={styles.filterText}>Study Areas</Text>
                                  <View style={styles.filterIcon}><Icon name="book" size={24} color='white'/></View>
                              </TouchableOpacity>
                          </View>
                      </View>
                  </View>
              </ScrollView>
          </ActionSheet>
      );
  }

  setDestination = (destination) => {
    this.setState({ myDestination: destination});
  }

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
    // console.log('show modal:' + this.state.isModalVisible);
  };

  modalTitle = (marker) => {
    if(marker.title){
      return(
        <Text style = {styles.drawerText}>
          {marker.title}
        </Text>
      )
    }
  }

  modalDescription = (marker) => {
    if(marker.description){
      return(
        <Text style = {styles.modalText}>
          {marker.description}
        </Text>
      )
    }
  }

  modalImage = (marker) => {
    if(marker.images){
      return(
        <Image
          style={{ width: width, height: height * 0.3}}
          source={{ uri: marker.images[0]}}
        />
      )
    }
  }

  modalDetails = (detail, type) => {
    if(detail){
        if (type === 'Website') {
            return (
                <Button
                    buttonStyle={styles.dirButton}
                    title = 'Website'
                    onPress={() => Linking.openURL(detail)}
                    containerStyle={{ marginTop: 10, marginBottom: 10 }}
                />
            )
        } else if (type === 'Email') {
            return (
                <>
                    {detail ?
                        <Text style = {styles.modalText}>{type} : {detail}</Text> :
                        <Text style = {styles.modalText}>No email provided</Text>
                    }
                </>
            )
        } else if (type === 'Phone') {
            return (
                <>
                    {detail ?
                        <Text style = {styles.modalText}>{type} : {detail}</Text> :
                        <Text style = {styles.modalText}>No phone number provided</Text>
                    }
                </>
            )
        }
    }
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
          centerComponent={{ style: { color: '#fff', fontSize: 20 } }}
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
                    onPress={this.onMarkerPress(this.state.tempMarker)}
              >
                <View>
                    <Text style={{fontSize: 15}}>{marker.title}</Text>
                </View>
              </Callout>
            </MapView.Marker>
          ))}
        </MapView>

        <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isModalVisible}
        >

            <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <ScrollView nestedScrollEnabled={true}>

                    <Icon
                        name='keyboard-backspace'
                        style={styles.modalHeaderStyle}
                        color="white"
                        onPress={() => {this.toggleModal()}}
                    />
                    {this.modalTitle(this.state.tempMarker)}
                    {this.modalImage(this.state.tempMarker)}
                    {this.modalDescription(this.state.tempMarker)}
                    {this.modalDetails(this.state.tempMarker.website, 'Website')}
                    {this.state.tempMarker.email || this.state.tempMarker.phone ?
                        <Text style={styles.modalSubtitleStyle}>Contact Information</Text> : ''
                    }
                    {this.modalDetails(this.state.tempMarker.email, 'Email')}
                    {this.modalDetails(this.state.tempMarker.phone, 'Phone')}
            </ScrollView>
            </View>
             </View>
        </Modal>

        {this.showBottomDrawer(this.state.tempMarker)}

        {this.showFilterDrawer()}

        <View style={{ marginTop: 20, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <View style={{ flex: 5 }}>
                    <SearchBar
                        onChangeText={text => this.handleSearch(text)}
                        value={search}
                        round
                    />
                </View>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center"}}>
                    <Icon name="filter" size={24} color="white" onPress={() => {
                        filterDrawer.current?.setModalVisible();
                    }}/>
                </View>
            </View>
        </View>
      </View>
    );
  }
}

// containerStyle={{ position: 'absolute', right: 15, marginTop: 15 }}

Map.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
  pinRef: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: 'purple',
  },
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
  dirButton: {
    textAlign:'center',
  },
  infoButton: {
    textAlign:'center',
    marginTop: 10,
    backgroundColor: '#009933'
  },
  modalView: {
    padding: 15,
    backgroundColor: '#2D2D2D',
    borderRadius: 20,
    width: "90%",
    height: "85%",
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalHeaderStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 15,
  },
  modalSubtitleStyle: {
    flex: 1,
    color: 'white',
    fontSize: 20,
  },
  closeModal: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 20,
  },
  modalCloseButtonTextStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  filterSearchButton: {
    color: 'white',
    backgroundColor: 'grey',
    fontWeight: 'bold',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    width: width/4,
    height: height/18,
  },
  filterCheckBox: {
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
    width: width/15,
    height: width/15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: width/25,
  },
  filterIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
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
