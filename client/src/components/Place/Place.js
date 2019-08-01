import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../state/actions/actions';
import './Place.css';
import ReactGA from 'react-ga';

class Place extends React.Component {

    constructor(props) {
        super(props);
        this.state = { name: null, description: null, city: null, visible: false, startTime: null, endTime: null, weekDays: null };
        this.close = this.close.bind(this);
        this.submit = this.submit.bind(this);

        this.updateButtonMsg = this.updateButtonMsg.bind(this);
        this.finalButtonMsg = this.finalButtonMsg.bind(this);
        this.setInitialButtonState = this.setInitialButtonState.bind(this);


        this.state = {
          submitState: 'submit-button',
          submitMessage: ''
        };
    }

    static getDerivedStateFromProps(nextProps, prevState){
      return { visible : nextProps.visible, place: nextProps.place };
    }

    close(){
      this.descriptionInput.value = '';
      this.startTimeInput.value = '';
      this.endTimeInput.value = '';
      this.props.onClick();
    }

    submit() {
      const { place, startTime, endTime, description } = this.state;

      if(!place) return;

      const newPlace = {
        name: place.name,
        address: place.address,
        city: place.city,
        location:{
          coordinates:[place.lat, place.lng],
          type:"Point"
        },
        place_id: place.place_id,
        validated: true,
        website: place.website,
        imgUrl: place.photo,
        deals: [
          {
            startTime: startTime,
            endTime: endTime,
            weekDays: [0,1,2,3,4,5,6],
            description: description,
            fullDescription: description,
          }
        ]
      };

      this.props.actions.postData(newPlace);

      ReactGA.event({
        category: 'DB',
        action: 'User submitted a hapihour'
      });      

      this.props.onAdd();
      this.close();
    };


    updateButtonMsg() {
      const { startTime, endTime, description } = this.state;

      if(!startTime || !endTime || !description){
        alert("All fields must be populated");
        return;
      }

      if(startTime >= endTime){
        alert("Start time can't be after or the same as the end time");
        return;
      }

      this.setState({ submitState: 'submit-button animated', submitMessage: 'state-1'})
      setTimeout(this.finalButtonMsg, 2000);
    };

    finalButtonMsg() {
      this.setState({ submitState: 'submit-button animated', submitMessage: 'state-2'})
      setTimeout(this.setInitialButtonState, 2000);
    };

    setInitialButtonState() {
      this.submit();
      this.setState({ submitState: 'submit-button', submitMessage: ''})
    };

    render() {
        const { place = { name: '', address: '', photo: '' } } = this.state;

        return (
            <div className="PlaceInfoWrapper">
            <div onClick={this.close} type="button" className="closeButton" aria-label="Close">&times;</div>
            <div className='placeDetailsWrapper'>
              <div className='placeDetails'>
                <div className='placeDetailsName'>{place.name}</div>
                <div className='placeDetailsAddress'>{place.address}</div>
                <div>Deal:</div>
                <div><input className='placeDetailsDescription' ref={node => this.descriptionInput = node} onChange={event => this.setState({ description: event.target.value })} /></div>
                <div>Start Time:</div>
                <div><input type ="time" className='placeDetailsStartTime' ref={node => this.startTimeInput = node} onChange={event => this.setState({ startTime: event.target.value })} /></div>
                <div>End Time:</div>
                <div><input type ="time" className='placeDetailsEndTime' ref={node => this.endTimeInput = node} onChange={event => this.setState({ endTime: event.target.value })} /></div>
                <div>Days of the week:</div>
              </div>
              { place.photo && <img className='placeImage' src={place.photo} /> }
            </div>
            <button onClick={this.updateButtonMsg} className={this.state.submitState}>
              <span className={'submit-pres-state ' + this.state.submitMessage}>Submit</span>
              <span className='submit-sending-state'>...sending</span>
              <span className='submit-done-state'>done</span>
            </button>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Place);
