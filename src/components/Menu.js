import React, { Component } from 'react';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import {
  View, StatusBar, Dimensions, Text, TouchableOpacity, ScrollView
} from 'react-native';
import { Icon, Divider, Image } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { Platform, StyleSheet } from 'react-native';
import CustomHeader from './CustomHeader';
const { height, width } = Dimensions.get('window');
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { Left, ListItem } from 'native-base';
import Deals from './Deals';

const _ = require('lodash');

const styles = StyleSheet.create({
  title: {
    color: 'white',
    marginLeft: 35,
    marginTop: width * .02,
    marginBottom: width * .02,
    fontSize: width * .08,
    fontFamily: 'AvenirNext-Medium'
  },
  subItem: {
    color: '#C1C1C1',
    fontSize: width * .05,
    marginLeft: 50,
    marginTop: -10,
    fontFamily: 'AvenirNext-Medium'
  },
  lastSubItem: {
    color: '#C1C1C1',
    fontSize: width * .05,
    marginLeft: 50,
    marginTop: -10,
    paddingBottom: 20,
    fontFamily: 'AvenirNext-Medium'
  },
  subBody: {
    backgroundColor: '#2d2d2d',
    fontFamily: 'AvenirNext-Medium'
  },
  divider: {
    borderBottomColor: '#808080',
    borderBottomWidth: 1,
    width: '80%',
    alignSelf: 'center'
  },
  height: Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight } : { paddingTop: 0 },
});

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: props.data,
      fullData: props.data,
      error: null,
      fontsAreLoaded: false,
    };
  }

  async componentDidMount() {
    // Apple loads "Material Icons"
    await Font.loadAsync({ 'Material Icons': require('../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf') });
    // Android loads "MaterialIcons"
    await Font.loadAsync({ 'MaterialIcons': require('../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf') });
    this.setState({ fontsAreLoaded: true })
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
      } else if (link == 'MAP') {
        this.props.navigation.push('Search', {
        });
      }
    }
  };

  custIcon = () => {
    return (
      <Icon
        name='keyboard-backspace'
        color='#fff'
        onPress={() => this.props.navigation.goBack()
        }
      />
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          zIndex: 0,
          elevation: 0,
          backgroundColor: "#CED0CE",
          marginLeft: "0%"
        }}
      />
    );
  };

  render() {
    const { fontsAreLoaded, fullData } = this.state
    const divider = styles.divider;

    return !fontsAreLoaded ? <AppLoading /> : (
      <View style={{ backgroundColor: '#333333', width: width, height: height, }}>
        <CustomHeader sectionTitle={'Menu'} />

        <ScrollView>
          <TouchableOpacity onPress={this.onListPress('page', 'EVENTS')}>
            <Collapse disabled={true} >
              <CollapseHeader>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>Events</Text>
                  </View>
                </View>
              </CollapseHeader>
            </Collapse>
          </TouchableOpacity>

          <View style={divider}/>

          <TouchableOpacity onPress={this.onListPress('page', 'JOBS')}>
            <Collapse disabled={true} >
              <CollapseHeader>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>Jobs</Text>
                  </View>
                </View>
              </CollapseHeader>
            </Collapse>
          </TouchableOpacity>

          <View style={divider}/>

          <Collapse>
            <CollapseHeader>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>Navigation</Text>
                </View>
              </View>
            </CollapseHeader>
            <CollapseBody style={styles.subBody}>
              <ListItem noBorder style={styles.subBody} onPress={this.onListPress('page', 'MAP')}>
                <Text style={styles.subItem}>Campus Map</Text>
              </ListItem>
              <ListItem noBorder style={styles.subBody} onPress={this.onListPress('web', "http://www.uhmshuttle.com/")}>
                <Text style={styles.subItem}>Campus Shuttle</Text>
              </ListItem>
              <ListItem noBorder style={styles.subBody} onPress={this.onListPress('web', "http://www.thebus.org/")} last>
                <Text style={styles.subItem}>The Bus</Text>
              </ListItem>
            </CollapseBody>
          </Collapse>

          <View style={divider}/>

          <Collapse>
            <CollapseHeader>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>Student Media</Text>
                </View>
              </View>
            </CollapseHeader>
            <CollapseBody style={styles.subBody}>
              <ListItem noBorder style={styles.subBody} onPress={this.onListPress('web', "https://www.manoanow.org/kaleo/")} >
                <Text style={styles.subItem}>Ka Leo o Hawai'i</Text>
              </ListItem>
              <ListItem noBorder style={styles.subBody} onPress={this.onListPress('web', "http://www.manoanow.org/uhpro/")} >
                <Text style={styles.subItem}>UH Productions</Text>
              </ListItem>
              <ListItem noBorder style={styles.subBody} onPress={this.onListPress('web', "http://hawaiireview.org/")} >
                <Text style={styles.subItem}>Hawai'i Review</Text>
              </ListItem>
              <ListItem noBorder style={styles.subBody} onPress={this.onListPress('web', "https://ktuh.org/")} last>
                <Text style={styles.subItem}>KTUH Campus Radio</Text>
              </ListItem>
            </CollapseBody>
          </Collapse>

          <View style={divider}/>

          <TouchableOpacity onPress={this.onListPress('web', "https://www.star.hawaii.edu/studentinterface/")}>
            <Collapse disabled={true} >
              <CollapseHeader>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>STAR</Text>
                  </View>
                </View>
              </CollapseHeader>
            </Collapse>
          </TouchableOpacity>

          <View style={divider}/>

          <TouchableOpacity  onPress={this.onListPress('web', "https://manoa.hawaii.edu/crsc/")}>
            <Collapse disabled={true} >
              <CollapseHeader>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>Campus Help</Text>
                  </View>
                </View>
              </CollapseHeader>
            </Collapse>
          </TouchableOpacity>

          <View style={divider}/>

          <TouchableOpacity>
            <Collapse>
              <CollapseHeader>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>Dining</Text>
                  </View>
                </View>
              </CollapseHeader>
              <CollapseBody style={styles.subBody}>
                <ListItem noBorder style={styles.subBody}  onPress={this.onListPress('web', "https://eacct-hawaii-manoa-sp.transactcampus.com/eAccounts/AnonymousHome.aspx")}>
                  <Text style={styles.subItem}>Dining Dollars</Text>
                </ListItem>
                <ListItem noBorder style={styles.subBody} onPress={this.onListPress('web', "https://uhm.sodexomyway.com/")}>
                  <Text style={styles.subItem}>Campus Dining</Text>
                </ListItem>
              </CollapseBody>
            </Collapse>
          </TouchableOpacity>

          <View style={divider}/>

          <TouchableOpacity onPress={this.onListPress('page', 'JOBS')}>
            <Collapse>
              <CollapseHeader>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>Info</Text>
                  </View>
                </View>
              </CollapseHeader>
              <CollapseBody style={styles.subBody}>
                <ListItem noBorder style={styles.subBody} onPress={this.onListPress('text','about us')}>
                  <Text style={styles.subItem}>About us</Text>
                </ListItem>
                <ListItem noBorder style={styles.subBody} onPress={this.onListPress('text','advertising')}>
                  <Text style={styles.subItem}>Advertising Info</Text>
                </ListItem>
                <ListItem noBorder style={styles.subBody} onPress={this.onListPress('text','privacy')}>
                  <Text style={styles.subItem}>Privacy Policy</Text>
                </ListItem>
                <ListItem noBorder style={styles.subBody} onPress={this.onListPress('text','terms')} last>
                  <Text style={styles.subItem}>Terms & Conditions</Text>
                </ListItem>
              </CollapseBody>
            </Collapse>
          </TouchableOpacity>

          <View style={divider}/>

          {/*
        <TouchableOpacity onPress={this.onListPress('web',"https://www.star.hawaii.edu/")}>
          <Collapse disabled={true} >
            <CollapseHeader>
              <Text style={styles.title}>STAR</Text>
            </CollapseHeader>
          </Collapse>
        </TouchableOpacity>

        <Divider style={{ backgroundColor: '#333333' }} />

        <TouchableOpacity onPress={this.onListPress('web',"https://manoa.hawaii.edu/crsc/")}>
          <Collapse disabled={true} >
            <CollapseHeader>
              <Text style={styles.title}>CAMPUS HELP</Text>
            </CollapseHeader>
          </Collapse>
        </TouchableOpacity>

        <Divider style={{ backgroundColor: '#333333' }} />

        <Collapse>
          <CollapseHeader>
            <Text style={styles.title}>DINING</Text>
          </CollapseHeader>
          <CollapseBody style={styles.subBody}>
            <ListItem style={styles.subBody} onPress={this.onListPress('web',"https://eacct-hawaii-manoa-sp.transactcampus.com/eAccounts/AnonymousHome.aspx")}>
                <Text style={styles.subItem}>dining dollars</Text>
            </ListItem>
            <ListItem style={styles.subBody} onPress={this.onListPress('web',"https://uhm.sodexomyway.com/")} last>
                <Text style={styles.subItem}>campus dining</Text>
            </ListItem>
          </CollapseBody>
        </Collapse>

          <Divider style={{ backgroundColor: '#333333' }} />

        <Collapse>
          <CollapseHeader>
            <Text style={styles.title}>INFO</Text>
          </CollapseHeader>
          <CollapseBody style={styles.subBody}>
            <ListItem style={styles.subBody} onPress={this.onListPress('text','about us')} >
                <Text style={styles.subItem}>about us</Text>
            </ListItem>
            <ListItem style={styles.subBody} onPress={this.onListPress('text','advertising')} >
                <Text style={styles.subItem}>advertising info</Text>
            </ListItem>
            <ListItem style={styles.subBody} onPress={this.onListPress('text','terms')}>
                <Text style={styles.subItem}>terms & conditions</Text>
            </ListItem>
            <ListItem style={styles.subBody} onPress={this.onListPress('text','privacy')} >
                <Text style={styles.subItem}>privacy policy</Text>
            </ListItem>
            <ListItem style={styles.subBody} onPress={this.onListPress('text','version')} last>
                <Text style={styles.subItem}>version</Text>
            </ListItem>
            <ListItem style={styles.subBody} onPress={this.onListPress('text','license')} last>
              <Text style={styles.subItem}>licenses</Text>
            </ListItem>
          </CollapseBody>
        </Collapse>

<Divider style={{ backgroundColor:'#333333' }} /> */}
        </ScrollView>
      </View>
    );
  }
}

Menu.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};

export default withNavigation(Menu);
