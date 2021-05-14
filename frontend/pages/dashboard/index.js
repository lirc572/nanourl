import { useEffect, useState } from "react";
import { Row, Col, Divider, Button, List, Space, Tooltip, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import styles from "../../styles/Dashboard.module.css";
import { useSelector } from "react-redux";
import { readShortUrls } from "../../util/api";

function copyToClipboard(textToCopy) {
  navigator.clipboard.writeText(textToCopy).then(
    function () {
      console.log("Copied to clipboard successfully!");
      message.info("Link copied to clipboard!");
    },
    function (err) {
      console.error("Could not copy text: ", err);
    }
  );
}

export default function DashboardPage() {
  const baseUrl = useSelector((state) => {
    let res = state.baseUrl;
    while (res.slice(-1) === "/") {
      res = res.substring(0, res.length - 1);
    }
    return res;
  });

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
                  <Row align="middle" className={styles.entryrow}>
                    <Col span={2}>
                      <Tooltip title="copy url">
                        <Button
                          shape="circle"
                          icon={<CopyOutlined />}
                          onClick={() =>
                            copyToClipboard(`${baseUrl}/go/${item.alias}`)
                          }
                        />
                      </Tooltip>
                    </Col>
                    <Col span={4}>
                      <Tooltip title="go to url">
                        <a href={`${baseUrl}/go/${item.alias}`} target="_blank">
                          {item.alias}
                        </a>
                      </Tooltip>
                    </Col>
                    <Col span={14}>{item.url}</Col>
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
