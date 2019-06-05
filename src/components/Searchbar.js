import React, { Component } from 'react'

import { TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

export default class Searchbar extends Component {
    static propTypes = {
        searchDeals: PropTypes.func.isRequired,
    }
    state={
        searchTerm: '',
    };

    debounceSearchDeals = debounce(this.props.searchDeals, 150);

    handleChange = (searchTerm) => {
        this.setState({searchTerm}, () => {
            // debounce operation for searching
            this.debounceSearchDeals(this.state.searchTerm);
        })
    }
    render() {
        return (
            <TextInput placeholder="Search All Deals" style={styles.input} onChangeText={this.handleChange} />
        )
    }
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        marginHorizontal: 12,
    },
});