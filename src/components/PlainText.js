import React, { Component } from 'react';
import { Dimensions, ScrollView, Text, View, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import AppLoading from 'expo-app-loading';
import { Header } from 'react-native-elements';
const { height } = Dimensions.get('window');



let appPkg = require('../../app.json');


class PlainText extends Component {
  constructor(props) {
    super(props);
    const { info } = this.props;
    this.state = {
      text: [],
      textsAreLoaded: false,
    };
  }

  async componentDidMount() {

    this.props.textRef.once('value').then((snapshot) => {
      let arrayOfFirebaseData = snapshot.val();
      // reformats object to get rid of keys
      this.setState({
        text: arrayOfFirebaseData,
        textsAreLoaded: true,
      });
    });
  }

  onBackPress = () => {
    this.props.navigation.goBack()
  };

  textLoader = (info) => {
    if(info === 'about us') {
      return this.state.text.about;
    } else if (info === 'advertising') {
      return this.state.text.advertising;
    } else if (info === 'privacy') {
      return this.state.text.privacy;
    } else if (info === 'terms') {
      return this.state.text.terms;
    } else if (info === 'version') {
      return '\n' + appPkg.expo.version;
    } else if (info === 'license') {
      return this.state.text.license;
    } else {
      return 'ERROR';
    }
  }

  //Loads Header for whichever page is passed in the paramter
  headerLoader = (info) => {
    if(info === 'about us') {
      return 'About Us';
    } else if (info === 'advertising') {
      return 'Advertising';
    } else if (info === 'privacy') {
      return 'Privacy Policy';
    } else if (info === 'terms') {
      return 'Terms & Conditions';
    } else if (info === 'version') {
      return 'Version';
    } else if (info === 'license') {
      return 'License';
    } else {
      return 'ERROR';
    }
  }

  render() {
    const { textsAreLoaded } = this.state;
    let padSize = height / 120;
    return !textsAreLoaded  ? <AppLoading /> : (
      <View style={{ flex: 1 }}>
        <Header
          leftComponent={{
            icon: 'keyboard-backspace',
            color: '#fff',
            onPress: this.onBackPress,
            iconStyle: {paddingTop: padSize, paddingRight: padSize, paddingLeft: padSize, paddingBottom: padSize},
          }}
          centerComponent={{ text: this.headerLoader(this.props.info), style: { color: '#fff', fontSize: 20 } }}
          containerStyle={{
            backgroundColor: 'black',
          }}
        />
        {Platform.OS === 'android' ? <StatusBar translucent={false} barStyle="light-content" backgroundColor="black" /> : null}
        <ScrollView backgroundColor={"black"} >
          <Text style={{color: "white", marginHorizontal: 20}}>{this.textLoader(this.props.info)}</Text>
        </ScrollView>
      </View>
    );
  }
}

PlainText.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
  info: PropTypes.string.isRequired,
  textRef: PropTypes.object.isRequired,
};

export default withNavigation(PlainText);
