import axios from 'axios'

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: 'USER_LOGIN_REQUEST' })

    const { data } = await axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/users/login`,
      data: {
        email,
        password
      },
    });

    dispatch({ type: 'USER_LOGIN_SUCCESS', payload: data })

    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (e) {
    console.log(e);
    dispatch({ type: 'USER_LOGIN_FAIL', payload: e.response && e.response.data.message })
  }
}

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo')
  localStorage.removeItem('cartItems')
  localStorage.removeItem('shippingAddress')
  localStorage.removeItem('paymentMethod')
  dispatch({ type: 'USER_LOGOUT' })
  dispatch({ type: 'USER_DETAILS_RESET' })
  dispatch({ type: 'ORDER_LIST_MY_RESET' })
  dispatch({ type: 'USER_LIST_RESET' })
  document.location.href = '/login'
}

export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: 'USER_REGISTER_REQUEST' })

    const { data } = await axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/users/create`,
      data: {
        name,
        email,
        password
      },
    });

    dispatch({ type: 'USER_REGISTER_SUCCESS', payload: data })

    dispatch({ type: 'USER_LOGIN_SUCCESS', payload: data })

    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({ type: 'USER_REGISTER_FAIL', payload: error.response && error.response.data.message })
  }
}

export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: 'USER_DETAILS_REQUEST' })

    const { userLogin: { userInfo } } = getState()

    const { data } = await axios({
      method: 'get',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/users/${id}`,
      headers: {
        Authorization: "Bearer " + userInfo.token,
      },
    });

    dispatch({ type: 'USER_DETAILS_SUCCESS', payload: data })
  } catch (error) {
    dispatch({ type: 'USER_DETAILS_FAIL', payload: error.response && error.response.data.message })
  }
}

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: 'USER_UPDATE_PROFILE_REQUEST' })

    const { userLogin: { userInfo } } = getState()

    const { data } = await axios({
      method: 'patch',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/users/profile`,
      headers: {
        Authorization: "Bearer " + userInfo.token,
      },
      data: user,
    });

    dispatch({ type: 'USER_UPDATE_PROFILE_SUCCESS', payload: data })

  } catch (error) {
    dispatch({ type: 'USER_UPDATE_PROFILE_FAIL', payload: error.response && error.response.data.message })
  }
}

export const getUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: 'USER_LIST_REQUEST' })

    const { userLogin: { userInfo } } = getState()

    const { data } = await axios({
      method: 'get',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/users/`,
      headers: {
        Authorization: "Bearer " + userInfo.token,
      },
    });

    dispatch({ type: 'USER_LIST_SUCCESS', payload: data })

  } catch (error) {
    dispatch({ type: 'USER_LIST_FAIL', payload: error.response && error.response.data.message })
  }
}

export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: 'USER_DELETE_REQUEST' })

    const { userLogin: { userInfo } } = getState()

    const { data } = await axios({
      method: 'delete',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/users/${id}`,
      headers: {
        Authorization: "Bearer " + userInfo.token,
      },
    });

    dispatch({ type: 'USER_DELETE_SUCCESS', payload: data })

  } catch (error) {
    dispatch({ type: 'USER_DELETE_FAIL', payload: error.response && error.response.data.message })
  }
}

export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: 'USER_UPDATE_REQUEST' })

    const { userLogin: { userInfo } } = getState()

    const { data } = await axios({
      method: 'patch',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/users/${user._id}`,
      data: user,
      headers: {
        Authorization: "Bearer " + userInfo.token,
      },
    })

    dispatch({ type: 'USER_UPDATE_SUCCESS' })

    dispatch({ type: 'USER_DETAILS_SUCCESS', payload: data })

    dispatch({ type: 'USER_DETAILS_RESET' })
  } catch (error) {
    const message = { payload: error.response && error.response.data.message }
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({ type: 'USER_UPDATE_FAIL', payload: message, })
  }
}