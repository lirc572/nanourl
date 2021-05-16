import { Form, Input, Button, message } from "antd";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { registerAccount } from "../../util/api";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

export default function RegisterPage() {
  const router = useRouter();

  const dispatch = useDispatch();

  const onLoginButtonClick = () => {
    router.push("/login");
  };

  const onFinish = (values) => {
    const { username, password } = values;
    registerAccount(username, password).then((res) => {
      if (!res) {
        console.log("Stupid error");
        return;
      }
      if (res.status == 204) {
        dispatch({
          type: "SET_CREDENTIALS",
          payload: {
            username,
            password,
          },
        });
        message.success("Registered successfully!", 5);
        router.push("/login");
      } else {
        message.error(
          "Register failed. Please try a different combination!",
          5
        );
        console.log(res);
      }
    });
  };

  const onFinishFailed = (errorInfo) => {};

  return (
    <Form
      {...layout}
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            min: 6,
            max: 16,
            message: "Please provide a username of a lenght between 6 and 16!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            min: 8,
            max: 18,
            message: "Please provide a password of a lenght between 8 and 18!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button type="link" htmlType="button" onClick={onLoginButtonClick}>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
}
