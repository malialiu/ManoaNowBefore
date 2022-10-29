import React, { Component } from 'react';
import {
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation'; // eslint-disable-line

/* Cant use width and height percentages because weird things happen with scrollview.
 * Instead calculate pixel values by taking device dimensions using percents there.
 */
const { width } = Dimensions.get('window');


const styles = StyleSheet.create({
  jumbo: {
    width: width * 1,
    height: (width / 3816) * 1951,
  },
  tab: {
    width: width * 0.33,
    height: ((width / 1272) * 1212) * 0.33,
  },
  bar: {
    width: width * 1,
    height: (width / 3816) * 676,
  },
});

class Tile extends Component {
  constructor(props) {
    super(props);
    const { image } = this.props;
    this.state = {
      image,
    };
  }

  render() {
    let style;
    const { image } = this.state;
    const { navigation, path, type } = this.props;

    // This formats the button to be either a bar, tab, or jumbo based on the type field in the
    // database entry.
    if (type === 'Tab') style = styles.tab;
    else if (type === 'Bar') style = styles.bar;
    else if (type === 'Jumbo') style = styles.jumbo;

    // If no path is specified then the tile will be an unclickable image
    if (path === '') {
      return (
        <Image style={style} source={{ uri: image }} />
      );
    } else if (path === 'Map' || path === 'Events') {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate( (path === 'Events' ? 'Events' : 'Search') )}
        >
          {/* The ternary operator for the style is there, instead of style={style}, to support...*/}
          {/* ...v5.1.1 which ONLY supports Map tabs and ONLY when type === 'Map'.  Future... */}
          {/* ...versions of the app will eliminate this bug. */}
          <Image style={(type === 'Map' ? styles.tab : style)} source={{ uri: image }} />
        </TouchableOpacity>
      );
    } else {
      // This section applies to Deals, Jobs, and Details
      return (
        <TouchableOpacity
          onPress={() => {
            // If path is a Deal or Job then return ('Deals', {type: path}) for the parameters.
            // Else return ('Details', {navigation: path}) for the parameters.
            navigation.push( ((path === 'Deal' || path === 'Jobs') ? 'Deals' : 'Details'), 
              ((path === 'Deal' || path === 'Jobs') ? { type: path } : { navigation: path })
            );
          }}
        >
          <Image style={style} source={{ uri: image }} />
        </TouchableOpacity>
      );
    }
  }
}

Tile.propTypes = {
  image: PropTypes.string.isRequired,
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
  path: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default withNavigation(Tile);
