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

export default function RegisterPage() {
  const router = useRouter();

  const dispatch = useDispatch();
  const { baseUrl } = useSelector((state) => {
    return {
      baseUrl: state.baseUrl,
    };
  });

  async function registerAccount(username, password) {
    try {
      const res = await axios.post(`${baseUrl}/register`, {
        username,
        password,
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
        router.push("/login");
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
