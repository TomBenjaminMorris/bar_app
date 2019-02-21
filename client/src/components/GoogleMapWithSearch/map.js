import React, {Fragment} from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import SearchBar from '../SearchBar/SearchBar';
import './map.css';

const API_KEY = 'AIzaSyDbgEJYukI5kbd_EijpPud_0EJna-YKa44';

export class MyMap extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      latitude: 55,
      longitude: -5,
      zoom: 5,
      isCurrentLocation: false,
      showingInfoWindow: false
    };

    this.getLocation = this.getLocation.bind(this);
    this.setLocation = this.setLocation.bind(this);
    this.errorHandler = this.errorHandler.bind(this);
    this.findPlace = this.findPlace.bind(this);
    this.onMapClicked = this.onMapClicked.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.centerOn) {
      return {
        latitude: props.centerOn.lat,
        longitude: props.centerOn.long,
        isCurrentLocation: false
      };
    }
    // Return null if the state hasn't changed
    return null;
  }

  componentDidMount(){
    this.getLocation();
  }

  errorHandler(errorObj){
    alert(errorObj.code + ": " + errorObj.message);
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setLocation, this.errorHandler, {enableHighAccuracy: true, maximumAge: 10000});
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }


  setLocation(position) {
    this.setState({ isCurrentLocation: true, latitude: position.coords.latitude, longitude: position.coords.longitude, zoom: 15 });
  }

  findPlace(e) {
      const { google } = this.props;
      console.log('this.map', this.map);
      var map = this.map;

      // Create the search box and link it to the UI element.
      var searchBox = new google.maps.places.SearchBox(e.target);
      // map.controls[google.maps.ControlPosition.TOP_LEFT].push(e.target);

      console.log('map.getBounds()', map.getBounds());

      // Bias the SearchBox results towards current map's viewport.
      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });

      var markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.

      searchBox.addListener('places_changed', function() {
        console.log('before PlacesService');
        var places = searchBox.getPlaces();
        console.log('places', places);

        if (places.length === 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          markers.push(new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });

        map.fitBounds(bounds);
      });
  }


  onMarkerClick(props, marker, e){
    console.log('onMarkerClick');
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  onMapClicked(props){
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };


  render() {

    return (
      <Fragment>
      <SearchBar className='searchbar' getNode={node => this.searchBox = node} onChange={this.findPlace} />
      <div className='map'>
      <Map google={this.props.google} zoom={14}
            center={{
              lat: this.state.latitude,
              lng: this.state.longitude
            }}
            onReady={(a, map) => this.map = map}
            onClick={this.onMapClicked}
      >

          <Marker onClick={this.onMarkerClick}
                  position={{lat: this.state.latitude,
                  lng: this.state.longitude}}
          />

          <InfoWindow marker={this.state.activeMarker} onClose={this.onInfoWindowClose} visible={this.state.showingInfoWindow} >
            <h1>You Are Here!</h1>
          </InfoWindow>

      </Map>
      </div>
      </Fragment>
    );
  }
}


export default GoogleApiWrapper({
  apiKey: API_KEY
})(MyMap)
