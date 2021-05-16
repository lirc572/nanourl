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
import {
  readShortUrls,
  createShortUrl,
  updateShortUrl,
  deleteShortUrl,
} from "../../util/api";

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
          "Failed to create alias. Please try a different combination!",
          5
        );
      }
    });
  };

  const onModelInputKeyPress = (target) => {
    if (target.charCode === 13) {
      const { alias, url } = form.getFieldsValue();
      if (alias.length > 2 && url.length > 4) {
        onCreate();
      }
    }
  };

  const [editModalVisiblility, setEditModalVisiblility] = useState(false);
  const getShowEditModal = (alias, url) => {
    return () => {
      editForm.setFieldsValue({
        alias,
        url,
      });
      setEditModalVisiblility(true);
    };
  };
  const hideEditModal = () => setEditModalVisiblility(false);

  const [editForm] = Form.useForm();
  const onEdit = () => {
    const { alias, url } = editForm.getFieldsValue();
    updateShortUrl(alias, url).then((successful) => {
      if (successful === true) {
        hideEditModal();
        readShortUrls().then((data) => {
          if (data) {
            setShortUrls(data);
          }
        });
      } else {
        message.error("Failed to edit alias. Please try a different url!", 5);
      }
    });
  };

  const onEditModelInputKeyPress = (target) => {
    if (target.charCode === 13) {
      const { alias, url } = editForm.getFieldsValue();
      if (alias.length > 2 && url.length > 4) {
        onEdit();
      }
    }
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
                            copyToClipboard(`${baseUrl}/${item.alias}`)
                          }
                        />
                      </Tooltip>
                    </Col>
                    <Col span={4}>
                      <Tooltip title="go to url">
                        <a href={`${baseUrl}/${item.alias}`} target="_blank">
                          {item.alias}
                        </a>
                      </Tooltip>
                    </Col>
                    <Col span={14}>{item.url}</Col>
                    <Col span={4}>
                      <Space size="middle">
                        <Button
                          shape="round"
                          type="primary"
                          onClick={getShowEditModal(item.alias, item.url)}
                        >
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
                min: 3,
                max: 20,
                message:
                  "Please provide an alias of a length between 3 and 20!",
              },
            ]}
          >
            <Input placeholder="Alias" onKeyPress={onModelInputKeyPress} />
          </Form.Item>
          <Form.Item
            name="url"
            rules={[
              {
                required: true,
                min: 5,
                message: "Please provide a URL of a length of at least 5!",
              },
            ]}
          >
            <Input placeholder="URL" onKeyPress={onModelInputKeyPress} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={editModalVisiblility}
        title="Create New Alias"
        onOk={hideEditModal}
        onCancel={hideEditModal}
        footer={[
          <Button key="back" onClick={hideEditModal}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={onEdit}>
            Create
          </Button>,
        ]}
      >
        <Form form={editForm} name="edit_alias" layout="inline">
          <Form.Item name="alias">
            <Input placeholder="Alias" disabled />
          </Form.Item>
          <Form.Item
            name="url"
            rules={[
              {
                required: true,
                min: 5,
                message: "Please provide a URL of a length of at least 5!",
              },
            ]}
          >
            <Input placeholder="URL" onKeyPress={onEditModelInputKeyPress} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
