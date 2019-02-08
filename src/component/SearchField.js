import React, { Component } from 'react';


class SearchField extends Component {
    constructor() {
        super();
        this.state = {
          inputValue: ''
        };
        this.changeInputValue = this.changeInputValue.bind(this)
    }

    changeInputValue(e) {
        this.setState({
            inputValue: e.target.value
        }, this.props.searchQuery(e.target.value))
    }

    render() {
        return (
            <div className="SearchField">
                <img src={require('../img/search.png')} alt="search icon" className="search-icon"/>
                <input
                    type="text"
                    className="search-field"
                    placeholder="Поиск автора по имени"
                    onChange={this.changeInputValue}
                    value={this.state.inputValue}
                />
            </div>
        );
    }
}

export default SearchField;
