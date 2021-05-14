import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Divider,
  Button,
  List,
  Space,
  Tooltip,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import { CopyOutlined } from "@ant-design/icons";
import styles from "../../styles/Dashboard.module.css";
import { useSelector } from "react-redux";
import { readShortUrls, createShortUrl, deleteShortUrl } from "../../util/api";

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

  const [createModalVisiblility, setCreateModalVisibility] = useState(false);
  const showCreateModal = () => setCreateModalVisibility(true);
  const hideCreateModal = () => setCreateModalVisibility(false);

  const [form] = Form.useForm();
  const onCreate = () => {
    const { alias, url } = form.getFieldsValue();
    createShortUrl(alias, url).then((successful) => {
      if (successful === true) {
        hideCreateModal();
        readShortUrls().then((data) => {
          if (data) {
            setShortUrls(data);
          }
        });
      } else {
        message.error(
          "Failed to create alias. Please try a different alias!",
          5
        );
      }
    });
  };

  const getOnDelete = (alias) => {
    return () => {
      deleteShortUrl(alias).then((successful) => {
        if (successful === true) {
          setShortUrls(
            shortUrls.filter((item) => {
              return item.alias !== alias;
            })
          );
        } else {
          message.error("Failed to delete alias. Please try again later!", 5);
        }
      });
    };
  };

  useEffect(async () => {
    const data = await readShortUrls();
    if (data) {
      setShortUrls(data);
    }
  }, []);
  return (
    <div className={styles.main}>
      <Row justify="center">
        <Col span={20} className={styles.column}>
          <div className={styles.headerdivider}>
            <span className={styles.heading}>Aliases</span>
            <Button type="primary" ghost onClick={showCreateModal}>
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
                        <Button
                          shape="round"
                          type="primary"
                          danger
                          onClick={getOnDelete(item.alias)}
                        >
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
      <Modal
        visible={createModalVisiblility}
        title="Create New Alias"
        onOk={hideCreateModal}
        onCancel={hideCreateModal}
        footer={[
          <Button key="back" onClick={hideCreateModal}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={onCreate}>
            Create
          </Button>,
        ]}
      >
        <Form form={form} name="create_alias" layout="inline">
          <Form.Item
            name="alias"
            rules={[
              {
                required: true,
                message: "Please provide an alias!",
              },
            ]}
          >
            <Input placeholder="Alias" />
          </Form.Item>
          <Form.Item
            name="url"
            rules={[
              {
                required: true,
                message: "Please provide a URL!",
              },
            ]}
          >
            <Input placeholder="URL" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
