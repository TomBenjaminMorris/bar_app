import axios from "axios";

//ACTION TYPES - used to label each action
export const DATA_FETCH_REQUEST = "DATA_FETCH_REQUEST";
export const DATA_FETCH_SUCCESS = "DATA_FETCH_SUCCESS";
export const DATA_FETCH_SINGLE_REQUEST = "DATA_FETCH_SINGLE_REQUEST";
export const DATA_FETCH_SINGLE_SUCCESS = "DATA_FETCH_SINGLE_SUCCESS";

export const GOOGLE_PHOTOS_FETCH_REQUEST = "GOOGLE_PHOTOS_FETCH_REQUEST";
export const GOOGLE_PHOTOS_FETCH_SUCCESS = "GOOGLE_PHOTOS_FETCH_SUCCESS";
export const CLEAR_PHOTOS = "CLEAR_PHOTOS";

export const GOOGLE_PLACE_FETCH_REQUEST = "GOOGLE_PLACE_FETCH_REQUEST";
export const GOOGLE_PLACE_FETCH_SUCCESS = "GOOGLE_PLACE_FETCH_SUCCESS";

export const DATA_POST_REQUEST = "DATA_POST_REQUEST";
export const DATA_POST_SUCCESS = "DATA_POST_SUCCESS";
export const DATA_POST_FAILURE = "DATA_POST_FAILURE";
export const SET_CENTER_COORDINATES = "SET_CENTER_COORDINATES";
export const SET_MILES = "SET_MILES";
export const SET_TIME_FILTER = "SET_TIME_FILTER";
export const SET_USER_COORDINATES = "SET_USER_COORDINATES";
export const SET_HOVER_COORDINATES = "SET_HOVER_COORDINATES";
export const SET_CAROUSEL_SLIDE = "SET_CAROUSEL_SLIDE";
export const SET_LOADING = "SET_LOADING";
export const SET_JWT = "SET_JWT";
export const RESET = "RESET";
export const SET_BOUNDS = "SET_BOUNDS";

//ACTIONSSSS - these basically label the input argument
//Then the reducers can be like ...if(action.type == ADD_TRANSACTIONS){ do this }...else if(action.type == GET_TRANSACTIONS_IN_RANGE){ do this instead }...etc
export function reset() {
  return { type: RESET };
}

export function setLoading(isLoading) {
  return { type: SET_LOADING, payload: isLoading };
}

export function setSingleBar(bar) {
  return { type: DATA_FETCH_SINGLE_SUCCESS, payload: bar };
}

export function clearPhotos() {
  return { type: CLEAR_PHOTOS };
}

export function setBounds(bounds) {
  return { type: SET_BOUNDS, payload: bounds };
}

export const getToken = async (dispatch, getState) => {
  const { jwt } = getState();
  let newJwt;
  if (!jwt) {
    newJwt = await axios.get("/api/jwt");
    dispatch({ type: SET_JWT, payload: newJwt.data });
    return newJwt.data;
  }
  return jwt;
};

export function getGooglePlacePhotos(place_id) {
  return async (dispatch, getState) => {
    dispatch({ type: GOOGLE_PHOTOS_FETCH_REQUEST });

    await window.places.getDetails(
      {
        placeId: place_id,
      },
      (details) => {
        const photos =
          details.photos && details.photos.map((photo) => photo.getUrl());
        return dispatch({
          type: GOOGLE_PHOTOS_FETCH_SUCCESS,
          payload: photos,
        });
      }
    );
  };
}

export function getGooglePlace() {
  return async (dispatch, getState) => {
    dispatch({ type: GOOGLE_PLACE_FETCH_REQUEST });

    const url = window.location.pathname.split("/");
    const place_id = url[2];
    let detailsYo = null;

    window.places.getDetails(
      {
        placeId: place_id,
      },
      (details) => {
        dispatch({
          type: GOOGLE_PLACE_FETCH_SUCCESS,
          payload: details,
        });
      }
    );
  };
}

export function fetchData(obj) {
  const { lat, long, miles } = obj;

  return async (dispatch, getState) => {
    const token = await getToken(dispatch, getState);

    dispatch({ type: DATA_FETCH_REQUEST });
    const values = await axios.get("/api/locations", {
      params: { long: long, lat: lat, miles: miles },
      headers: { Authorization: "jwt " + token },
    });

    //quicK way to view all bars!
    const url = window.location.pathname.split("/");
    if (url.pop() === "all") {
      values.data.map((bar) => {
        bar.deals = [{ category: "inactive ", weekDays: [], description: [] }];
      });

      return dispatch({ type: DATA_FETCH_SUCCESS, payload: values.data });
    }

    const filteredValues = await categoriseData(values.data);
    const reorderedValues = await reorderData(filteredValues);

    return dispatch({ type: DATA_FETCH_SUCCESS, payload: reorderedValues });
  };
}

export function fetchOne(id) {
  return async (dispatch, getState) => {
    dispatch({ type: DATA_FETCH_SINGLE_REQUEST });
    const token = await getToken(dispatch, getState);

    const value = await axios.get("/api/bar", {
      params: { place_id: id },
      headers: { Authorization: "jwt " + token },
    });

    let valueArray = [];
    valueArray.push(value.data);
    let returnValue = categoriseData(valueArray, true)[0];

    return dispatch({ type: DATA_FETCH_SINGLE_SUCCESS, payload: returnValue });
  };
}

export function postData(obj) {
  return async (dispatch, getState) => {
    const token = await getToken(dispatch, getState);

    dispatch({ type: DATA_POST_REQUEST });
    await axios
      .post("/api/bar", obj, {
        headers: { Authorization: "jwt " + token },
      })
      .then(function (response) {
        return dispatch({ type: DATA_POST_SUCCESS });
      })
      .catch(function (error) {
        // console.log(`error: ${error}`);
        return dispatch({ type: DATA_POST_FAILURE });
      });
  };
}

export function setCenterCoordinates(coordinates) {
  console.log("yooooo setCenterCoordinates", coordinates);
  return { type: SET_CENTER_COORDINATES, payload: coordinates };
}

export function setCarouselSlide(index) {
  return { type: SET_CAROUSEL_SLIDE, payload: index };
}

export function setHoverCoordinates(coordinates) {
  return { type: SET_HOVER_COORDINATES, payload: coordinates };
}

export function setMiles(miles) {
  return { type: SET_MILES, payload: { miles } };
}

export function setTimeFilter(timeFilter) {
  return { type: SET_TIME_FILTER, payload: { timeFilter } };
}

export function categoriseData(data, returnAllDeals = false) {
  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  var day = d.getDay();
  m < 10 ? (m = `${0}${m}`) : null;

  var time = parseInt(`${h}${m}`);

  var categorisedBlob = data.filter((item) => {
    var final = [];
    var finalOther = [];
    const url = window.location.pathname.split("/");

    if (item.validated || url.pop() === "edit") {
      item.deals.map((deal) => {
        if (deal.weekDays.includes(day)) {
          var st = deal.startTime.replace(":", "");
          var et = deal.endTime.replace(":", "");

          if (st <= time && et > time && deal.weekDays.includes(day)) {
            deal.category = "Now";
          } else if (st > time && et > time && deal.weekDays.includes(day)) {
            deal.category = "Upcoming";
          } else {
            deal.category = "Inactive";
          }
          final.push(deal);
        } else {
          deal.category = "Inactive";
          finalOther.push(deal);
        }
      });
    }

    item.deals = final;
    item["otherDeals"] = finalOther;

    if (item.deals[0] || returnAllDeals) {
      return item;
    }
  });

  return categorisedBlob;
}

export function reorderData(data) {
  console.log("reordering data");

  let tmpInactiveData = [];
  let tmpActiveData = [];

  data.map((item, i) => {
    item.deals[0] && item.deals[0].category == "Inactive"
      ? tmpInactiveData.push(item)
      : tmpActiveData.push(item);
  });

  return tmpActiveData.concat(tmpInactiveData);
}

export function setUserCoordinates(coordinates) {
  return { type: SET_USER_COORDINATES, payload: coordinates };
}
