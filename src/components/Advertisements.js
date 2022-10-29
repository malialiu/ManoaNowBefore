import React, { Component } from 'react';
import * as firebase from 'firebase';
import { SafeAreaView, StyleSheet, FlatList, View, Dimensions, ScrollView, StatusBar  } from 'react-native';
import { List, Divider, Icon, Text, Header, Image } from 'react-native-elements'
import * as Font from 'expo-font';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import CustomHeader from './CustomHeader';

const _ = require('lodash');
const { height, width } = Dimensions.get('window');
import { NavigationContainer } from '@react-navigation/native';
import HtmlText from './HtmlText';

const styles = StyleSheet.create({
  container: {
      flex: 1,
    },
    item: {
      backgroundColor: 'grey',
      padding: 10,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 32,
    },
    jumbo: {
    width: width * 1,
    height: (width / 3816) * 901,
    marginBottom: (width / 3816) * 901 * .05,
  },
});

const Item = ({ title }) => (
       <View style={styles.item}>
         <Text style={styles.title}>{title}</Text>
       </View>
     );


const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Ad',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Ad',
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Ad',
    },
];

class Advertisements extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onBackPress = () => {
      this.props.navigation.goBack()
    };

  render() {
    const {  } = this.state;
    const renderItem = ({ item }) => (
        <Item title={item.title} />
      );
    const style = styles.jumbo;
    let padSize = height / 120;

    return (
        <ScrollView style={{ backgroundColor: '#000000', width: '100%', height: height, }} >
            <View>
                <Header
                    leftComponent={{ icon: 'keyboard-backspace', color: '#fff', onPress: this.onBackPress, iconStyle: {paddingTop: padSize, paddingRight: padSize, paddingLeft: padSize, paddingBottom: padSize},
                    }}
                    centerComponent={{ text: 'Advertisements', style: { color: '#fff', fontSize: 20} }}
                    containerStyle={{
                        borderBottomWidth: 0,
                        backgroundColor: 'black',
                    }}
                    centerContainerStyle={{
                      justifyContent: "center",
                    }}
                    statusBarProps={{backgroundColor: "black"}}
                />
        <SafeAreaView style={styles.container}>
        <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={item => item.id}
        />
        <Text style={{color: "white", marginHorizontal: 20}}>{'Advertise your Manoa Now with us! XXX-XXX-XXXX'}</Text>
        </SafeAreaView>
    </View>
    </ScrollView >
    )
  }
}

Advertisements.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};

export default withNavigation(Advertisements);
