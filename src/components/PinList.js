import React, { Component, useState } from 'react';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import {
  View, Switch, Text,
  FlatList, StatusBar, Dimensions, ViewComponent, Modal, TouchableHighlight
} from 'react-native';
import { List, ListItem, SearchBar, Icon, Header, Image } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { Platform, StyleSheet} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; 

const { height, width } = Dimensions.get('window');
const { deviceHeight, deviceWidth } = Dimensions.get('screen');

const _ = require('lodash');

class PinList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      fullData: [],
      buildingData: [],
      officeData: [],
      eateryData: [],
      pinsAreLoaded: false,
      error: null,
      fontsAreLoaded: false,
      search: '',
      buildingIsEnabled: true,
      officeIsEnabled: true,
      eateryIsEnabled: true,
      isModalVisible: false,
      types: {
        Building: true,
        Office: true,
        Eatery: true,
      }
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
  }


//When clicking on individual building
//Should Send appropriates office's info here
  onListPress = location => () => {
    this.props.navigation.push('Location', {
        pin: location,
    });
  };

  contains = ({ title }, query) => {
     title = title.toLowerCase();
    if (title.includes(query)) {
      return true;
    }
    return false;
  };

  custIcon = () => {
    return(
      <Icon
        name='keyboard-backspace'
        color='#fff'
        onPress={() => this.props.navigation.goBack()
        }
      />
    );
  };

  // when search icon is pressed
  onMapPress =  () => {
    this.props.navigation.push('Maps', {
      pins: this.state.data,
    });
  };


  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "black",
        }}
      />
    );
  };

  onBackPress = () => {
    this.props.navigation.goBack()
  };

  handleSearch = (text) => {
    const formatText = text.toLowerCase();
    const data = this.state.fullData.filter(place => {
      for (let j = 0; j < place.type.length; j += 1) {
        for (const [key, value] of Object.entries(this.state.types)) {
          if (value && place.type[j] === key && this.contains(place, formatText)) {
            return true;
          }
        }
      }
      return false;
    });
    this.setState({search: formatText, data});
  };

  //Very similar to this.handleSearch.  Not sure if i should just get rid of this onw
  filterDataByType = () => {
    //set data
    const data = this.state.fullData.filter(place => {
      for (let j = 0; j < place.type.length; j += 1) {
        for (const [key, value] of Object.entries(this.state.types)) {
          if (value && place.type[j] === key && this.contains(place, this.state.search)) {
            return true;
          }
        }
      }
      return false;
    });
    this.setState({data});
  }

  toggleTypeSwitch(type) {
    this.setState(
      prevState => ({
        types: {                   // object that we want to update
            ...prevState.types,    // keep all other key-value pairs
            [type]: !prevState.types[type]       // update the value of specific key
        }
      }), function() {
        this.filterDataByType()
      }
    )
  }

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  render() {
    const { fontsAreLoaded, search, pinsAreLoaded } = this.state
    let padSize = height / 120;

    return (!pinsAreLoaded && !fontsAreLoaded) ? <AppLoading /> : (
      <View style={styles.container, {}}>
        <View>
          <Header
            leftComponent={{ icon: 'keyboard-backspace', color: 'black', onPress: this.onBackPress, iconStyle: {paddingTop: padSize, paddingRight: padSize, paddingLeft: padSize, paddingBottom: padSize},
            }}
            centerComponent={{ text: 'Building List', style: { color: 'black', fontSize: 20} }}
            rightComponent={{icon:'map', color: 'black', onPress: () => this.onMapPress(), iconStyle: {paddingTop: padSize, paddingRight: padSize, paddingLeft: padSize, paddingBottom: padSize},
            }}
            containerStyle={{
              borderBottomWidth: 0,
              // flex: 1, 
              // marginTop: StatusBar.currentHeight || 0,
              backgroundColor: 'white',
            }}
            centerContainerStyle={{
              justifyContent: "center",
            }}
            statusBarProps={{backgroundColor: "black"}}
          />
          <SearchBar
            onChangeText={text => this.handleSearch(text)}
            value={search}
            round
            inputStyle={{ backgroundColor: 'white' }}
            containerStyle={{ backgroundColor: 'white', borderWidth: 1, borderRadius: 5 }}
            placeholderTextColor={ '#g5g5g5' }
            inputContainerStyle={{ backgroundColor: 'white' }}
          />

          <FlatList
            //original: height * .5 //
            style={{
                backgroundColor: 'white',
              }}
            data={this.state.data}
            renderItem={({ item }) => (
              <ListItem containerStyle={{backgroundColor: 'white'}} onPress={this.onListPress(item)}>
                <ListItem.Content >
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1, flexDirection: 'column', marginRight: 15}}>
                      <ListItem.Title style={{fontWeight: 'bold', marginBottom: width * .01, color: "black"}}>{item.title}</ListItem.Title>
                      <ListItem.Subtitle style={{color: "black"}}>
                        {item.description.length > 110 ? item.description.slice(0,100) + '...' : item.description}
                      </ListItem.Subtitle>
                    </View>
                    {item.images.length > 0 ? (
                        <Image
                          source={{ uri: item.images[0] }}
                          style={{ width: width * .3, height: height * 0.15, borderWidth: .5}}
                        />
                      ) : null 
                    }
                  </View>
                </ListItem.Content>
              </ListItem>

            )}
            keyExtractor={item => item.title}
            ItemSeparatorComponent={this.renderSeparator}
            ListFooterComponent={this.renderSeparator}
          />
          {/* <TouchableHighlight style={styles.filterButton} onPress={this.toggleModal}>
            <Icon
              name= 'search'
              color= 'white'
              size={width * .075}
            />
          </TouchableHighlight> */}

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isModalVisible}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalHeaderStyle}>Filter Options:</Text>
                <View style={styles.filterOption}>
                  <Text style={styles.modalSubtitleStyle}>Buildings</Text>
                  <Switch
                    //Building Switch
                    trackColor={{ false: '#767577', true: '#f4f3f4' }}
                    thumbColor={'#008000'}
                    ios_backgroundColor="#3e3e3e"
                    onChange={() => this.toggleTypeSwitch("Building")}
                    value={this.state.types.Building}
                    style={styles.switchStyle}
                  />

                </View>
                <View style={styles.filterOption}>
                  <Text style={styles.modalSubtitleStyle}>Offices</Text>
                  <Switch
                    //Office Switch
                    trackColor={{ false: '#767577', true: '#f4f3f4' }}
                    thumbColor={'#008000'}
                    ios_backgroundColor="#3e3e3e"
                    onChange={() => this.toggleTypeSwitch("Office")}
                    value={this.state.types.Office}
                    style={styles.switchStyle}
                  />
                </View>
                <View style={styles.filterOption}>
                  <Text style={styles.modalSubtitleStyle}>Eateries</Text>
                  <Switch
                    //Eatery Switch
                    trackColor={{ false: '#767577', true: '#f4f3f4' }}
                    thumbColor={'#008000'}
                    ios_backgroundColor="#3e3e3e"
                    onChange={() => this.toggleTypeSwitch("Eatery")}
                    value={this.state.types.Eatery}
                    style={styles.switchStyle}
                  />
                </View>
                <TouchableHighlight
                  style={{ ...styles.closeModal, backgroundColor: '#008000' }}
                  onPress={() => {
                    this.toggleModal();
                  }}>
                  <Text style={styles.modalCloseButtonTextStyle}>Close</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        </View>
        <TouchableHighlight style={styles.filterButton} onPress={this.toggleModal}>
          {/* <Icon
            name= 'filter'
            type='font-awesome-5'
            color= 'white'
            size={width * .075}
          /> */}
          <FontAwesome5 name="filter" size={width * .075} color="white" />
        </TouchableHighlight>
      </View>
    );
  }
}

//Assigns a specific stylesheet for devices that are detected as android
//Meant to counteract the overlapping of the statusbar and the search bar
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: 'purple',
  },
  // height: Platform.OS === 'android' ? {paddingTop: StatusBar.currentHeight} : {paddingTop: 0},
  filterText: {fontSize: 20, fontWeight: 'bold', color: 'white'},
  filterButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 15,
    // bottom: 305,
    top: height * .895,          //This may be crappy code but I haven't figured out an alternate solution yet
    backgroundColor: '#008000',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 2,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    padding: 25,
    backgroundColor: 'gray',
    borderRadius: 20,
    width: "80%",
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
  modalHeaderStyle: {
    color: 'white',
    fontWeight: 'bold',
    // textAlign: 'center',
    fontSize: 25,
    marginBottom: 15,
  },
  filterOption: {
    flexDirection: 'row',
    // marginBottom: 5,
    paddingVertical: 10,
    // paddingVertical: 5,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: "center",
    borderBottomColor: 'white',
    borderBottomWidth: 1,
  },
  modalSubtitleStyle: {
    flex: 1,
    color: 'white',
    // fontWeight: 'bold',
    fontSize: 20,
  },
  switchStyle: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
    // marginRight: 20,
    // backgroundColor: '#f0f',
    alignItems: 'flex-end'
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
});

PinList.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
  pinRef: PropTypes.object.isRequired,
};

export default withNavigation(PinList);
