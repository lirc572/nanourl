import { Form, Input, Button, Checkbox, message } from "antd";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { loginToAccount } from "../../util/api";

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

export default function LoginPage() {
  const router = useRouter();

  const dispatch = useDispatch();
  const { username, password, remember } = useSelector((state) => {
    return {
      username: state.username,
      password: state.password,
      remember: state.remember,
    };
  });

  const onRegisterButtonClick = () => {
    router.push("/register");
  };

  const onFinish = (values) => {
    const { username, password, remember } = values;
    dispatch({
      type: "SET_REMEMBER_CREDENTIALS",
      payload: {
        remember,
      },
    });
    loginToAccount(username, password).then((res) => {
      if (!res) {
        console.log("Stupid error");
        return;
      }
      if (res.status == 200) {
        const { token } = res.data;
        dispatch({
          type: "SET_CREDENTIALS",
          payload: {
            username,
            password,
          },
        });
        dispatch({
          type: "SET_ACCESS_TOKEN",
          payload: {
            accessToken: token,
          },
        });
        message.success("Logged in successfully!", 5);
        router.push("/dashboard");
      } else {
        if (res.status === 401) {
          message.error("Login failed. Please verify your credentials!", 5);
        }
        console.log(res);
      }
    });
  };

  const onFinishFailed = (errorInfo) => {};

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{
        username,
        password,
        remember,
      }}
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

      <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button type="link" htmlType="button" onClick={onRegisterButtonClick}>
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}
