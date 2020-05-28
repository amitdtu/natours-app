import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ResetPassword from "./resetPassword";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  //   const [resetToken, setResetToken] = useState(null);

  const onFinish = (values) => {
    setIsLoading(true);
    console.log(values);
    const url = "/users/forgotPassword";
    axios
      .post(url, values)
      .then((res) => {
        const { data } = res;
        console.log(res.data);
        setIsLoading(false);
        message.success("Reset Link has been sent to your email.");
        // setResetToken(data.data.resetToken);
        // history.push({
        //   pathname: "/resetPassword",
        //   state: { resetToken: data.data.resetToken },
        // });
      })
      .catch((err) => console.log(err?.response?.data));
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Reset Password</h2>
        <Form
          name="forgot-password"
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
          <Form.Item>
            <Button
              className="btn btn--green-login"
              type="primary"
              htmlType="submit"
              style={{ width: "9em !important" }}
              loading={isLoading}
            >
              Send Email
            </Button>
          </Form.Item>
        </Form>
      </div>
    </main>
  );
}
