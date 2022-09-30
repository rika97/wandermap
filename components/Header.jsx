import React from 'react';
import { Appbar } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const Header = (props) => {
  return (
    <Appbar.Header style={styles.header}>
       <Appbar.Content title={props.title} />
    </Appbar.Header>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0b9cbd',
  },
})

export default Header;