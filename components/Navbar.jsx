import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';

import Home from '../screens/Home';
import History from '../screens/History';
import Profile from '../screens/Profile';

const HomeRoute = () => <Home />;
const HistoryRoute = () => <History />;
const ProfileRoute = () => <Profile />;

const Navbar = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline'},
    { key: 'history', title: 'History', focusedIcon: 'history', unfocusedIcon: 'history' },
    { key: 'profile', title: 'Profile', focusedIcon: 'account-circle', unfocusedIcon: 'account-circle-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    history: HistoryRoute,
    profile: ProfileRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{ backgroundColor: '#0b9cbd' }}
    />
  );
};

export default Navbar;