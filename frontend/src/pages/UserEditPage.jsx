import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, updateUser, logout } from "../actions/userActions";
import FormContainer from "../components/FormContainer";

const UserEditPage = ({ match, history }) => {
    const userId = match.params.id
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isAdmin, setAdmin] = useState(false);

    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails;

    const userUpdate = useSelector((state) => state.userUpdate);
    const { loading: loadingUpdate, error: errorUpdate, success: sucessUpdate } = userUpdate;

    useEffect(() => {
        if (sucessUpdate) {
            dispatch({ type: 'USER_UPDATE_RESET' })
            history.push('/admin/userList')
        } else {
            if (!user.name || user._id !== userId) {
                dispatch(getUserDetails(userId))
            } else {
                setName(user.name);
                setEmail(user.email);
                setAdmin(user.isAdmin)
            }
        }

    }, [user, userId, dispatch, history, sucessUpdate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateUser({ _id: userId, name, email, isAdmin }))
        const userStoredInfo = localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo'))
        if (userId === userStoredInfo._id) {
            dispatch(logout())
        }
    };

    return (
        <>
            <Link to='/admin/userList' className="btn btn-light">
                Go Back
            </Link>

            <FormContainer>
                <h1>Edit User</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
                {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="name"
                                value={name}
                                placeholder="Enter Your Name"
                                onChange={(e) => setName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="email">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                placeholder="Enter Email"
                                onChange={(e) => setEmail(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="isAdmin">
                            <Form.Label>isAdmin</Form.Label>
                            <Form.Check
                                type="checkbox"
                                label="Is Admin"
                                checked={isAdmin}
                                onChange={(e) => setAdmin(e.target.checked)}
                            ></Form.Check>
                        </Form.Group>

                        <Button type="submit" variant="primary">
                            Update
                        </Button>
                    </Form>
                )}

            </FormContainer>
        </>
    );
};

export default UserEditPage;
