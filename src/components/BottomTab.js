import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

const BottomTab = createBottomTabNavigator();

function Tabs() {
    return(
    <Tab.Navigator
        tabBarOptions={{
            showLabel: false, 
            style: {
                position: 'absolute',
                bottom: 25,
                left: 20,
                right: 20,
                elevation: 0,
                backgroundColor: '#fff',
                borderRadius: 15,
                height: 90,
            }
        }}>
        <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
 );
}

export default Tabs;