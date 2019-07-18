import React from "react";
import "./SearchBar.css";

class SearchBar extends React.Component {
  render() {
    const {
      onChange,
      getNode,
      onfocusin,
      onfocusout,
      onClickButton
    } = this.props;
    return (
      <div className="searchBarWrapper">
        <input
          ref={node => {
            this.searchBar = node;
            getNode(node);
          }}
          className="searchbar"
          onChange={onChange}
          placeholder="Search..."
          onFocus={onfocusin}
          onBlur={onfocusout}
          id="keyword"
          onKeyDown={event => {
            if (event.keyCode == 13) {
              this.searchBar.blur();
              return false;
            }
          }}
        />
        <div className="searchbarButton" onClick={onClickButton} />
        <span className="line" />
      </div>
    );
  }
}

export default SearchBar;
