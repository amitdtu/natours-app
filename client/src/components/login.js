import React, { useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import AuthContext from "./authContext";

export default function Login() {
  const history = useHistory();

  const { setIsAuthenticated, setUser } = useContext(AuthContext);
  const onFinish = (values) => {
    console.log("Success:", values);
    const url = "/users/login";
    axios
      .post(url, values)
      .then((res) => {
        console.log(res);
        setIsAuthenticated(true);
        setUser(res.data.data.user);
        message.success("You are logged in successfully.");
        history.replace("/");
      })
      .catch((err) => {
        message.error(err.response.data.message);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Log into your account</h2>
        <Form
          name="login"
          initialValues={{}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="form"
          hideRequiredMark={true}
          layout={"vertical"}
        >
          <Form.Item
            label="Emial"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              className="btn btn--green-login"
              type="primary"
              htmlType="submit"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        <Link to="/forgotPassword">Forgot Password</Link>
      </div>
    </main>
  );
}
