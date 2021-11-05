import axios from 'axios'
import { logout } from './userActions'

export const listProducts = (keyword = '', pageNumber = '') => async (dispatch) => {
    try {
        dispatch({ type: 'PRODUCT_LIST_REQUEST', })

        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products?keyword=${keyword}&pageNumber=${pageNumber}`)
        dispatch({ type: 'PRODUCT_LIST_SUCCESS', payload: data })

    } catch (error) {
        dispatch({ type: 'PRODUCT_LIST_FAIL', payload: error.response && error.response.data.message })
    }
}

export const listProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: 'PRODUCT_DETAILS_REQUEST' })

        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products/${id}`)

        dispatch({ type: 'PRODUCT_DETAILS_SUCCESS', payload: data })

    } catch (error) {
        dispatch({ type: 'PRODUCT_DETAILS_FAIL', payload: error.response && error.response.data.message })
    }
}

export const deleteProduct = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: 'PRODUCT_DELETE_REQUEST' })

        const { userLogin: { userInfo } } = getState()

        await axios({
            method: 'delete',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/products/${id}`,
            headers: {
                Authorization: "Bearer " + userInfo.token,
            },
        });

        dispatch({ type: 'PRODUCT_DELETE_SUCCESS' })

    } catch (error) {
        dispatch({ type: 'PRODUCT_DELETE_FAIL', payload: error.response && error.response.data.message })
    }
}

export const createProduct = () => async (dispatch, getState) => {
    try {
        dispatch({ type: 'PRODUCT_CREATE_REQUEST' })

        const { userLogin: { userInfo } } = getState()

        const { data } = await axios({
            method: 'post',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/products`,
            headers: {
                Authorization: "Bearer " + userInfo.token,
            },
        });

        dispatch({ type: 'PRODUCT_CREATE_SUCCESS', payload: data })
    } catch (error) {
        dispatch({ type: 'PRODUCT_CREATE_FAIL', payload: error.response && error.response.data.message })
    }
}

export const updateProduct = (product) => async (dispatch, getState) => {
    try {
        dispatch({ type: 'PRODUCT_UPDATE_REQUEST', })

        const {
            userLogin: { userInfo } } = getState()

        const { data } = await axios({
            method: 'patch',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/products/${product._id}`,
            headers: {
                Authorization: "Bearer " + userInfo.token,
            },
            data: product
        });

        dispatch({ type: 'PRODUCT_UPDATE_SUCCESS', payload: data })
        dispatch({ type: 'PRODUCT_DETAILS_SUCCESS', payload: data })
    } catch (error) {
        console.log(error.response.data.message);
        const message = { payload: error.response && error.response.data.message }
        if (message === 'Not authorized, invalid token' || '') {
            dispatch(logout())
        }
        dispatch({ type: 'PRODUCT_UPDATE_FAIL', payload: message })
    }
}

export const createProductReview = (productId, review) => async (dispatch, getState) => {
    try {
        dispatch({ type: 'PRODUCT_CREATE_REVIEW_REQUEST', })

        const {
            userLogin: { userInfo } } = getState()

        await axios({
            method: 'post',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/products/${productId}/reviews`,
            headers: {
                Authorization: "Bearer " + userInfo.token,
            },
            data: review
        });

        dispatch({ type: 'PRODUCT_CREATE_REVIEW_SUCCESS' })
    } catch (error) {
        dispatch({ type: 'PRODUCT_CREATE_REVIEW_FAIL', payload: error.response && error.response.data.message })
    }
}