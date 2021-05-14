import { Form, Input, Button, Checkbox } from "antd";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

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
  const { username, password, remember, baseUrl } = useSelector((state) => {
    return {
      username: state.username,
      password: state.password,
      remember: state.remember,
      baseUrl: state.baseUrl,
    };
  });

  async function loginToAccount(username, password) {
    try {
      const res = await axios.post(`${baseUrl}/login`, {
        username,
        password,
        remember,
      });
      return res;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return error.response;
        }
      } else {
        console.log(error);
      }
    }
  }

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
        router.push("/account");
      } else {
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
            message: "Please input your username!",
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
            message: "Please input your password!",
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
