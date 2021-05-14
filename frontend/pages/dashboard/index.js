import { useEffect, useState } from "react";
import { Row, Col, Divider, Button, List, Space } from "antd";
import styles from "../../styles/Dashboard.module.css";
import { readShortUrls } from "../../util/api";
import { useRouter } from "next/router";

const data = [
  {
    alias: "tmp",
    url: "https://abc.com",
  },
  {
    alias: "bbc",
    url: "https://stupid.io",
  },
  {
    alias: "google",
    url: "https://google.com",
  },
  {
    alias: "git",
    url: "https://github.com",
  },
];

export default function DashboardPage() {
  const [shortUrls, setShortUrls] = useState([]);
  useEffect(async () => {
    const data = await readShortUrls();
    if (data) {
      setShortUrls(data);
    }
  });
  return (
    <div className={styles.main}>
      <Row justify="center">
        <Col span={20} className={styles.column}>
          <div className={styles.headerdivider}>
            <span className={styles.heading}>Aliases</span>
            <Button type="primary" ghost>
              Add New
            </Button>
          </div>
          <Divider />
          <div className={styles.fullgrow}>
            <List
              dataSource={shortUrls}
              renderItem={(item) => (
                <List.Item>
                  <Row className={styles.entryrow}>
                    <Col span={4}>{item.alias}</Col>
                    <Col span={16}>{item.url}</Col>
                    <Col span={4}>
                      <Space size="middle">
                        <Button shape="round" type="primary">
                          Edit
                        </Button>
                        <Button shape="round" type="primary" danger>
                          Delete
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </div>
        </Col>
      </Row>
      <div className={styles.fullgrow} />
    </div>
  );
}
