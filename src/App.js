import { useState, useEffect } from "react";
import { Table, Switch, Col, Row, List, Typography } from "antd";
import styles from "./App.css";
const App = () => {
  const [tableDataSource, setTableDataSource] = useState([]);
  const [taskCompleted, setTaskCompleted] = useState([]);
  const [subtaskCompleted, setSubtaskCompleted] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos?_start=0&_limit=10")
      .then((response) => response.json())
      .then((json) => {
  // manupulating input API for subtask
        const updatedValue = json;
        updatedValue[0] = {
          ...json[0],
          subTasks: [10, 11]
        }
        setTableDataSource(updatedValue)
      });
  }, []);

  const columns = [
    {
      title: "Completed",
      dataIndex: "completed",
      key: "completed",
      render: (text, record, index) => {
        return (
          <Switch
            disabled={taskCompleted.includes(index)}
            onChange={(e) => toggleTask(e, text, record, index)}
          />
        );
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record, index) => {
        return taskCompleted.includes(index) ? (
          <del>{text}</del>
        ) : (
          <span>{text}</span>
        );
      },
    },
  ];

  const toggleTask = (e, text, record, index, subtask = false) => {
    if (subtask) {
      if(record.subTasks && record.subTasks.every(record => subtaskCompleted.includes(record))){
        setTaskCompleted(taskCompleted.concat(record.id));
      }
      setSubtaskCompleted(
        subtaskCompleted.concat(parseInt(`${record.id}${index}`))
      );
    } else {
      setTaskCompleted(taskCompleted.concat(index));
    }
  };

  const subTasksData = [
    {
      id: 1,
      title: "Racing car sprays burning fuel into crowd.",
      parentId: 1,
    },
    {
      id: 2,
      title: "Los Angeles battles huge wildfires.",
      parentId: 1,
    },
    {
      id: 3,
      title: "Los Angeles battles huge wildfires.",
      parentId: 2,
    },
    {
      id: 4,
      title: "Los Angeles battles huge wildfires.",
      parentId: 5,
    },
  ];

  const getSubTasks = (record, index) => {
    const { title } = record;
    const getData = subTasksData
      .filter((i) => i.parentId === record.id)
      .map((i) => i.title);
    return (
      getData.length && (
        <List
          dataSource={getData}
          renderItem={(item, subindex) => (
            <List.Item>
              <Switch
                checked={subtaskCompleted.includes(
                  parseInt(`${record.id}${subindex}`)
                )}
                disabled={subtaskCompleted.includes(
                  parseInt(`${record.id}${subindex}`)
                )}
                onChange={(e) => toggleTask(e, title, record, subindex, true)}
              />
              {subtaskCompleted.includes(
                parseInt(`${record.id}${subindex}`)
              ) ? (
                <del>{item}</del>
              ) : (
                <span>{item}</span>
              )}
            </List.Item>
          )}
        />
      )
    );
  };

  return (
    <Row>
      <Col span={3}></Col>
      <Col span={18}>
        <h1 style={{ textAlign: "center" }}>TODO LIST</h1>
        <Table
          dataSource={tableDataSource}
          columns={columns}
          pagination={false}
          rowKey={(record) => record.id}
          expandable={{
            expandedRowRender: (record, index) => getSubTasks(record, index),
          }}
        />
      </Col>
      <Col span={3}></Col>
    </Row>
  );
};

export default App;
