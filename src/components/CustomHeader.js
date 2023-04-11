import React, { Component } from 'react';
import { Header } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { Dimensions, View, StatusBar } from 'react-native';
const { height } = Dimensions.get('window');


class CustomHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sectionTitle: '',
      color: '',
    };
  }

  onBackPress = () => {
    this.props.navigation.goBack()
  };

  render() {
    let padSize = height / 120;

    // return (
    //   <Header
    //     leftComponent={{
    //       icon: 'keyboard-backspace',
    //       color: '#fff',
    //       onPress: this.onBackPress,
    //       iconStyle: {paddingTop: padSize, paddingRight: padSize, paddingLeft: padSize, paddingBottom: padSize},
    //     }}
    //     centerComponent={{ text: this.props.sectionTitle, style: { color: '#fff', fontSize: 20 } }}
    //     containerStyle={{
    //       backgroundColor: 'black',
    //     }}
    //   />
    // );
    return (
      <View>
        <Header
          leftComponent={{
            icon: 'keyboard-backspace',
            color: 'black',
            onPress: this.onBackPress,
            iconStyle: {paddingTop: padSize, paddingRight: padSize, paddingLeft: padSize, paddingBottom: padSize},
          }}
          centerComponent={{ text: this.props.sectionTitle, style: { color: 'black', fontSize: 20, fontFamily: 'AvenirNext-Medium' } }}
          containerStyle={{
            backgroundColor: this.props.color,
            borderBottomWidth: 0,
          }}
        />
        {Platform.OS === 'android' ? <StatusBar translucent={false} barStyle="light-content" backgroundColor="black" /> : null}

      </View>
    );


  }
}

export default withNavigation(CustomHeader);

//6.76666
//5.55
//for 120
