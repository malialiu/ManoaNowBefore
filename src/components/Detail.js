import React, { Component } from 'react';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { View, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';
import { withNavigation } from 'react-navigation';
import CustomHeader from './CustomHeader';

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageLink: this.props,
      fontsAreLoaded: false,
    };
  }

  async componentDidMount() {
    // Apple loads "Material Icons"
    await Font.loadAsync({ 'Material Icons': require('../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf') });
    // Android loads "MaterialIcons"
    await Font.loadAsync({ 'MaterialIcons': require('../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf') });
    this.setState({ fontsAreLoaded: true });
  }

  render() {
    const { fontsAreLoaded, pageLink } = this.state;
    return !fontsAreLoaded ? <AppLoading /> : (
      <View style={{ flex: 1 }}>
        <CustomHeader />
        <WebView
          source={{ uri: pageLink.pageLink }}
          automaticallyAdjustContentInsets={false}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState

        />
      </View>
    );
  }
}

Detail.protoTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};

export default withNavigation(Detail);
