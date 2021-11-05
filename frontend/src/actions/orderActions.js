import axios from 'axios'

export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({ type: 'ORDER_CREATE_REQUEST' })

        const { userLogin: { userInfo } } = getState()

        const { data } = await axios({
            method: 'post',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/orders`,
            data: order,
            headers: {
                Authorization: "Bearer " + userInfo.token,
            },
        });

        dispatch({ type: 'ORDER_CREATE_SUCCESS', payload: data })

        // dispatch({ type: 'CART_CLEAR_ITEMS', payload: data })
        localStorage.removeItem('cartItems')
    } catch (error) {
        console.log(error);

        // if (message === 'Not authorized, token failed') {
        //     dispatch(logout())
        // }
        dispatch({ type: 'ORDER_CREATE_FAIL', payload: error.response && error.response.data.message })
    }
}

export const getOrderDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: 'ORDER_DETAILS_REQUEST' })

        const { userLogin: { userInfo } } = getState()

        const { data } = await axios({
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/orders/${id}`,
            headers: {
                Authorization: "Bearer " + userInfo.token,
            },
        });

        dispatch({ type: 'ORDER_DETAILS_SUCCESS', payload: data })

    } catch (error) {
        console.log(error);
        dispatch({ type: 'ORDER_DETAILS_FAIL', payload: error.response && error.response.data.message })
    }
}

export const payOrder = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: 'ORDER_PAY_REQUEST' })

        const { userLogin: { userInfo } } = getState()

        const { data } = await axios({
            method: 'patch',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/orders/${id}/pay`,
            headers: {
                Authorization: "Bearer " + userInfo.token,
            },
        });

        dispatch({ type: 'ORDER_PAY_SUCCESS', payload: data })

    } catch (error) {
        console.log(error);
        dispatch({ type: 'ORDER_PAY_FAIL', payload: error.response && error.response.data.message })
    }
}

export const deliverOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({ type: 'ORDER_DELIVER_REQUEST' })

        const { userLogin: { userInfo } } = getState()

        const { data } = await axios({
            method: 'patch',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/orders/${order._id}/deliver`,
            headers: {
                Authorization: "Bearer " + userInfo.token,
            },
        });

        dispatch({ type: 'ORDER_DELIVER_SUCCESS', payload: data })

    } catch (error) {
        console.log(error);
        dispatch({ type: 'ORDER_DELIVER_FAIL', payload: error.response && error.response.data.message })
    }
}

export const listMyOrders = () => async (dispatch, getState) => {
    try {
        dispatch({ type: 'ORDER_LIST_MY_REQUEST' })

        const { userLogin: { userInfo } } = getState()

        const { data } = await axios({
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/orders/myorders`,
            headers: {
                Authorization: "Bearer " + userInfo.token,
            },
        });

        dispatch({ type: 'ORDER_LIST_MY_SUCCESS', payload: data })

    } catch (error) {
        console.log(error);
        dispatch({ type: 'ORDER_LIST_MY_FAIL', payload: error.response && error.response.data.message })
    }
}

export const listOrders = () => async (dispatch, getState) => {
    try {
        dispatch({ type: 'ORDER_LIST_REQUEST' })

        const { userLogin: { userInfo } } = getState()

        const { data } = await axios({
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/orders/orders`,
            headers: {
                Authorization: "Bearer " + userInfo.token,
            },
        });

        dispatch({ type: 'ORDER_LIST_SUCCESS', payload: data })

    } catch (error) {
        console.log(error);
        dispatch({ type: 'ORDER_LIST_FAIL', payload: error.response && error.response.data.message })
    }
}