import styles from "../styles/Layout.module.css";
import { PageHeader, Button, Menu, Dropdown, message } from "antd";
import {
  GithubOutlined,
  UserOutlined,
  LoginOutlined,
  UserAddOutlined,
  FireOutlined,
} from "@ant-design/icons";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

export default function Layout({ children }) {
  const router = useRouter();

  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => {
    return {
      accessToken: state.accessToken,
    };
  });

  const onLogOutClick = () => {
    dispatch({
      type: "LOG_OUT",
    });
    message.success('Logged out successfully!', 5);
    router.push("/login");
  };

  let menu = (
    <Menu>
      {!accessToken && (
        <Menu.Item icon={<UserAddOutlined />} key="0">
          <Link href="/register">
            <a>Register</a>
          </Link>
        </Menu.Item>
      )}
      {!accessToken && (
        <Menu.Item icon={<LoginOutlined />} key="1">
          <Link href="/login">
            <a>Login</a>
          </Link>
        </Menu.Item>
      )}
      {accessToken && (
        <Menu.Item icon={<UserOutlined />} key="2">
          <Link href="/account">
            <a>Account</a>
          </Link>
        </Menu.Item>
      )}
      {accessToken && (
        <Menu.Item icon={<UserOutlined />} key="3">
          <a onClick={onLogOutClick}>Log Out</a>
        </Menu.Item>
      )}
      <Menu.Divider key="4" />
      <Menu.Item icon={<GithubOutlined />} disabled key="5">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/lirc572/nanourl"
        >
          GitHub
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Head>
        <title>NanoURL</title>
        <meta name="description" content="A fantastic URL shortener" />
        <link rel="icon" href="/app/favicon.ico" />
      </Head>
      <PageHeader
        backIcon="false"
        avatar={{
          className: styles["home-avatar"],
          src: "/app/favicon.ico",
          onClick: (e) => {
            router.push("/");
          },
        }}
        title="NanoURL"
        subTitle="A fantastic URL shortener"
        extra={[
          <Dropdown overlay={menu} placement="bottomLeft" arrow key="0">
            <Button>
              <FireOutlined />
            </Button>
          </Dropdown>,
        ]}
      />
      <div className={styles.container}>{children}</div>
      <footer className={styles.footer}>Copyright © 2021 NanoURL</footer>
    </>
  );
}
