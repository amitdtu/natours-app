import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";

export default function ResetPassword({ match }) {
  const history = useHistory();
  const location = useLocation();
  const resetToken = location.pathname;
  console.log(match);
  //   console.log("props reset token", resetToken);
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = (values) => {
    setIsLoading(true);
    console.log(values);

    if (values.password !== values.passwordConfirm) {
      setIsLoading(false);
      return message.error("Passwords are not equal.");
    }

    const url = `/users/resetPassword/${match.params.resetToken}`;
    console.log(resetToken);
    axios
      .patch(url, values)
      .then((res) => {
        const { data } = res;
        console.log(data);
        message.success("Password change successfully.");
        window.location.href = "/";
      })
      .catch((err) => {
        console.log(err?.response?.data);
        message.error(err?.response?.data);
        setIsLoading(false);
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Reset Password</h2>
        <Form
          name="reset-password"
          initialValues={{}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="form"
          hideRequiredMark={true}
          layout={"vertical"}
        >
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              { required: true, message: "Please input your new Password!" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Cormfirm Password"
            name="passwordConfirm"
            rules={[
              {
                required: true,
                message: "Please input your confirm password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
              className="btn btn--green-login"
              type="primary"
              htmlType="submit"
              style={{ width: "9em !important" }}
              loading={isLoading}
            >
              Reset
            </Button>
          </Form.Item>
        </Form>
      </div>
    </main>
  );
}
