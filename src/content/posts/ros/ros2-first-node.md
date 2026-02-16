---
title: "ROS2入门：创建你的第一个节点"
description: "从零开始学习ROS2，创建发布者和订阅者节点，理解ROS2的基本概念和通信机制"
date: "2024-01-20"
category: "ros"
tags: ["ROS2", "机器人", "Python", "节点通信"]
author: "小肥熊"
featured: true
series: "ROS2入门系列"
seriesOrder: 1
---

# ROS2入门：创建你的第一个节点

ROS2（Robot Operating System 2）是新一代机器人操作系统，相比ROS1有了很多改进。本文将带你创建第一个ROS2节点。

## 1. ROS2安装

### 1.1 系统要求

推荐使用Ubuntu 22.04 LTS，安装ROS2 Humble版本：

```bash
# 设置locale
sudo apt update && sudo apt install locales
sudo locale-gen en_US en_US.UTF-8
sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
export LANG=en_US.UTF-8

# 添加ROS2 apt仓库
sudo apt install software-properties-common
sudo add-apt-repository universe
sudo apt update && sudo apt install curl -y
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null

# 安装ROS2
sudo apt update
sudo apt install ros-humble-desktop

# 环境配置
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
```

## 2. 创建工作空间

### 2.1 工作空间结构

```bash
# 创建工作空间
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws

# 构建工作空间
colcon build
```

### 2.2 创建功能包

```bash
cd ~/ros2_ws/src

# 创建Python功能包
ros2 pkg create --build-type ament_python my_first_package --dependencies rclpy std_msgs

# 创建C++功能包
ros2 pkg create --build-type ament_cmake my_cpp_package --dependencies rclcpp std_msgs
```

## 3. 编写发布者节点

### 3.1 Python版本

```python
#!/usr/bin/env python3
# publisher_node.py

import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalPublisher(Node):
    def __init__(self):
        super().__init__('minimal_publisher')
        self.publisher_ = self.create_publisher(String, 'topic', 10)
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = 'Hello, ROS2! Count: %d' % self.i
        self.publisher_.publish(msg)
        self.get_logger().info('Publishing: "%s"' % msg.data)
        self.i += 1

def main(args=None):
    rclpy.init(args=args)
    minimal_publisher = MinimalPublisher()
    rclpy.spin(minimal_publisher)
    minimal_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### 3.2 C++版本

```cpp
// publisher_node.cpp

#include <chrono>
#include <functional>
#include <memory>
#include <string>

#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"

using namespace std::chrono_literals;

class MinimalPublisher : public rclcpp::Node {
public:
  MinimalPublisher() : Node("minimal_publisher"), count_(0) {
    publisher_ = this->create_publisher<std_msgs::msg::String>("topic", 10);
    timer_ = this->create_wall_timer(
        500ms, std::bind(&MinimalPublisher::timer_callback, this));
  }

private:
  void timer_callback() {
    auto message = std_msgs::msg::String();
    message.data = "Hello, ROS2! Count: " + std::to_string(count_++);
    RCLCPP_INFO(this->get_logger(), "Publishing: '%s'", message.data.c_str());
    publisher_->publish(message);
  }

  rclcpp::TimerBase::SharedPtr timer_;
  rclcpp::Publisher<std_msgs::msg::String>::SharedPtr publisher_;
  size_t count_;
};

int main(int argc, char *argv[]) {
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<MinimalPublisher>());
  rclpy::shutdown();
  return 0;
}
```

## 4. 编写订阅者节点

### 4.1 Python版本

```python
#!/usr/bin/env python3
# subscriber_node.py

import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalSubscriber(Node):
    def __init__(self):
        super().__init__('minimal_subscriber')
        self.subscription = self.create_subscription(
            String,
            'topic',
            self.listener_callback,
            10)
        self.subscription  # prevent unused variable warning

    def listener_callback(self, msg):
        self.get_logger().info('I heard: "%s"' % msg.data)

def main(args=None):
    rclpy.init(args=args)
    minimal_subscriber = MinimalSubscriber()
    rclpy.spin(minimal_subscriber)
    minimal_subscriber.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## 5. 编译和运行

### 5.1 编译

```bash
cd ~/ros2_ws
colcon build --packages-select my_first_package
source install/setup.bash
```

### 5.2 运行节点

```bash
# 终端1：运行发布者
ros2 run my_first_package publisher_node

# 终端2：运行订阅者
ros2 run my_first_package subscriber_node
```

## 6. 常用ROS2命令

```bash
# 查看节点列表
ros2 node list

# 查看话题列表
ros2 topic list

# 查看话题信息
ros2 topic info /topic

# 查看话题数据
ros2 topic echo /topic

# 查看节点信息
ros2 node info /minimal_publisher

# 绘制节点图
rqt_graph
```

## 7. launch文件

创建launch文件同时启动多个节点：

```python
# my_launch.py
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='my_first_package',
            executable='publisher_node',
            name='publisher'
        ),
        Node(
            package='my_first_package',
            executable='subscriber_node',
            name='subscriber'
        ),
    ])
```

运行launch文件：

```bash
ros2 launch my_first_package my_launch.py
```

## 总结

本文介绍了ROS2的基础知识：
- ROS2安装和环境配置
- 工作空间和功能包的创建
- 发布者和订阅者节点的编写
- 编译、运行和调试方法

下一篇文章将介绍ROS2的服务和动作通信机制。
