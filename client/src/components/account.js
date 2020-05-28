import React, { useState, useContext } from "react";
import { Form, Input, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import AuthContext from "./authContext";
import axios from "axios";

export default function Account() {
  const { user, setUser } = useContext(AuthContext);
  const [form] = Form.useForm();

  const [isDisable, setIsDisable] = useState(true);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [image, setImage] = useState(null);

  // upload img 2
  const uploadImg = (e) => {
    setImage(e.target.files[0]);
    setIsDisable(false);
  };

  const enableSaveBtn = (e, field) => {
    setIsDisable(false);
    console.log(e.target.value);

    console.log(field);
    if (field === "name") {
      if (e.target.value === user.name) setIsDisable(true);
    } else {
      if (e.target.value === user.email) setIsDisable(true);
    }
  };
  const onFinishUser = (values) => {
    setIsLoadingUser(true);

    let formData = new FormData();

    if (image) formData.append("photo", image);
    formData.append("email", values.email);
    formData.append("name", values.name);

    console.log("Success:", values);
    const url = `/users/updateMe`;

    axios
      .patch(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        const { data } = res;
        console.log(res.data);
        setUser(res.data.data.user);
        setIsDisable(true);
        message.success("Updated successfully.");
        setIsLoadingUser(false);
      })
      .catch((err) => {
        console.log(err?.response?.data);
        message.error(err?.response?.data);
        setIsLoadingUser(false);
      });
  };

  const onFinishFailedUser = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinishPassword = (values) => {
    setIsLoadingPassword(true);
    console.log("Success:", values);
    const url = "/users/updatePassword";
    axios
      .patch(url, values)
      .then((res) => {
        console.log(res.data);
        message.success("Password updaed successfully.");
        setIsLoadingPassword(false);
        form.resetFields();
      })
      .catch((err) => {
        console.log(err.response.data);
        message.error(err.response.data);
        setIsLoadingPassword(false);
      });
    console.log("setting isLoadingPassword false");
  };

  const onFinishFailedPassword = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <main className="main">
      <div className="user-view">
        <nav className="user-view__menu">
          <ul className="side-nav">
            <li className="side-nav--active">
              <div>
                <svg>
                  <use xlinkHref="img/icons.svg#icon-settings" />
                </svg>
                Settings
              </div>
            </li>
            <li>
              <div>
                <svg>
                  <use xlinkHref="img/icons.svg#icon-briefcase" />
                </svg>
                My bookings
              </div>
            </li>
            <li>
              <div>
                <svg>
                  <use xlinkHref="img/icons.svg#icon-star" />
                </svg>
                My reviews
              </div>
            </li>
            <li>
              <div>
                <svg>
                  <use xlinkHref="img/icons.svg#icon-credit-card" />
                </svg>
                Billing
              </div>
            </li>
          </ul>
          {user.role === "admin" ? (
            <div className="admin-nav">
              <h5 className="admin-nav__heading">Admin</h5>
              <ul className="side-nav">
                <li>
                  <div>
                    <svg>
                      <use xlinkHref="img/icons.svg#icon-map" />
                    </svg>
                    Manage tours
                  </div>
                </li>
                <li>
                  <div>
                    <svg>
                      <use xlinkHref="img/icons.svg#icon-users" />
                    </svg>
                    Manage users
                  </div>
                </li>
                <li>
                  <div>
                    <svg>
                      <use xlinkHref="img/icons.svg#icon-star" />
                    </svg>
                    Manage reviews
                  </div>
                </li>
                <li>
                  <div>
                    <svg>
                      <use xlinkHref="img/icons.svg#icon-briefcase" />
                    </svg>
                  </div>
                </li>
              </ul>
            </div>
          ) : null}
        </nav>
        <div className="user-view__content">
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">
              Your account settings
            </h2>
            <Form
              name="update-user"
              className="form form-user-data"
              initialValues={{ name: user.name, email: user.email }}
              onFinish={onFinishUser}
              onFinishFailed={onFinishFailedUser}
              hideRequiredMark={true}
              layout={"vertical"}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <Input onChange={(e) => enableSaveBtn(e, "name")} />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email" },
                ]}
              >
                <Input onChange={(e) => enableSaveBtn(e, "email")} />
              </Form.Item>

              <div className="form__group form__photo-upload">
                <img
                  className="form__user-photo"
                  src={`${axios.defaults.params.mediaURL}/img/users/${user.photo}`}
                  alt=""
                />

                <input
                  className="btn-text"
                  type="file"
                  name="photo"
                  id="upload-photo"
                  onChange={uploadImg}
                />
              </div>

              <Form.Item>
                <div className="form__group right">
                  <Button
                    className="btn btn--small btn--green"
                    type="primary"
                    htmlType="submit"
                    disabled={isDisable}
                    loading={isLoadingUser}
                  >
                    Save settings
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
          <div className="line">&nbsp;</div>
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Password change</h2>

            <Form
              name="password-change"
              initialValues={{}}
              onFinish={onFinishPassword}
              onFinishFailed={onFinishFailedPassword}
              layout={"vertical"}
              hideRequiredMark={true}
              form={form}
            >
              <Form.Item
                label="Current Password"
                name="currentPassword"
                rules={[
                  {
                    required: true,
                    message: "Please input your current password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: "Please input your new password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Confirm New Password"
                name="newPasswordConfirm"
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
                  className="btn btn--green-password"
                  type="primary"
                  htmlType="submit"
                  loading={isLoadingPassword}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
}
