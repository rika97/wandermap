import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';

import Home from '../screens/Home';
import Groups from '../screens/Groups';
import Profile from '../screens/Profile';
import Create from '../screens/Create';
import Friends from '../screens/Friends';

const HomeRoute = () => <Home />;
const GroupsRoute = () => <Groups />;
const ProfileRoute = () => <Profile />;
const CreateRoute = () => <Create />;
const FriendsRoute = () => <Friends />;

const Navbar = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline'},
    { key: 'friends', title: 'Friends', focusedIcon: 'account-heart', unfocusedIcon: 'account-heart-outline' },
    { key: 'groups', title: 'Groups', focusedIcon: 'account-group', unfocusedIcon: 'account-group-outline' },
    { key: 'create', title: 'Create', focusedIcon: 'plus-box', unfocusedIcon: 'plus-box-outline' },
    { key: 'profile', title: 'Profile', focusedIcon: 'account-circle', unfocusedIcon: 'account-circle-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    groups: GroupsRoute,
    profile: ProfileRoute,
    create: CreateRoute,
    friends: FriendsRoute,
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