---
title: "RV1106嵌入式人脸识别系统开发实战"
description: "基于Rockchip RV1106开发AI桌面机器人，实现RetinaFace人脸检测、LVGL界面、RKNN模型推理的完整开发流程及踩坑记录"
date: "2025-02-21"
category: "embedded-ai"
tags: ["RV1106", "RKNN", "人脸识别", "RetinaFace", "LVGL", "嵌入式AI"]
author: "小肥熊"
featured: true
---

# RV1106嵌入式人脸识别系统开发实战

本文记录了在 Rockchip RV1106 平台上开发 AI 桌面机器人 Echo-Mate 人脸识别功能的完整过程，包括模型部署、UI开发、以及各种踩坑解决方案。

## 项目概述

### 硬件平台

| 组件 | 规格 |
|------|------|
| CPU | Rockchip RV1106 (ARM Cortex-A7) |
| NPU | 0.5 TOPS RKNPU |
| 内存 | 64MB DDR2 |
| 显示 | 320x240 LCD |
| 摄像头 | UYVY格式，支持ISP |

### 功能特性

- **人脸检测**: 使用 RetinaFace RKNN 模型，640x640 输入
- **人脸识别**: 简化版特征匹配（可扩展 MobileFaceNet）
- **用户界面**: LVGL 8.x，三个标签页（识别/注册/管理）
- **本地存储**: 人脸数据库保存到文件系统

### 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Echo-Mate 人脸识别系统                    │
├─────────────────────────────────────────────────────────────┤
│  摄像头采集    →    图像预处理    →    RetinaFace NPU推理   │
│  (UYVY格式)        (缩放/BGR转换)      (人脸坐标+关键点)    │
├─────────────────────────────────────────────────────────────┤
│  LVGL UI显示  ←    结果绘制      ←    后处理(NMS+解码)     │
│  (BGR565格式)       (矩形框/标签)                           │
└─────────────────────────────────────────────────────────────┘
```

## 技术栈

### 模型

| 模型 | 用途 | 输入尺寸 | 备注 |
|------|------|----------|------|
| RetinaFace | 人脸检测 | 640x640 RGB | 输出bbox + 5关键点 |
| MobileFaceNet | 特征提取 | 112x112 RGB | 预留，当前使用简化匹配 |

### 软件库

| 库 | 用途 |
|-----|------|
| RKNN SDK | NPU模型推理 |
| OpenCV-Mobile | 图像处理、摄像头采集 |
| LVGL 8.x | 嵌入式GUI |
| pthread | 多线程采集 |

## 核心代码实现

### 1. RetinaFace 模型推理

RetinaFace 输出三个张量，需要正确解码：

```c
// 输出张量
int8_t* bbox_i8 = (int8_t*)ctx->output_mems[0]->virt_addr;   // [16800, 4]
int8_t* score_i8 = (int8_t*)ctx->output_mems[1]->virt_addr;  // [16800, 2]
int8_t* landmark_i8 = (int8_t*)ctx->output_mems[2]->virt_addr; // [16800, 10]

// 反量化函数
auto deqnt = [](int8_t qnt, int zp, float scale) -> float {
    return ((float)qnt - (float)zp) * scale;
};

// Anchor Box 解码（关键！）
const float VARIANCES[2] = {0.1f, 0.2f};
const float (*prior_ptr)[4] = BOX_PRIORS_640;  // 16800个预设框

float box_x = deqnt(bbox[0]) * VARIANCES[0] * prior_w + prior_cx;
float box_y = deqnt(bbox[1]) * VARIANCES[0] * prior_h + prior_cy;
float box_w = expf(deqnt(bbox[2]) * VARIANCES[1]) * prior_w;
float box_h = expf(deqnt(bbox[3]) * VARIANCES[1]) * prior_h;
```

### 2. 摄像头采集线程

```c
static void* _camera_loop(void* arg) {
    cv::Mat bgr(240, 320, CV_8UC3);
    cv::Mat disp_out(120, 200, CV_16UC1);
    cv::Mat model_input(640, 640, CV_8UC3, retinaface_ctx.input_mems[0]->virt_addr);
    
    cv::VideoCapture cap;
    cap.set(cv::CAP_PROP_FRAME_WIDTH, 640);
    cap.set(cv::CAP_PROP_FRAME_HEIGHT, 480);
    cap.open(0);
    
    while (!camera_stop) {
        cap >> bgr;
        
        // 缩放到模型输入尺寸
        cv::resize(bgr, model_input, cv::Size(640, 640));
        
        // RKNN 推理
        inference_retinaface_model(&retinaface_ctx, &results);
        
        // 绘制检测框
        if (results.count > 0) {
            cv::rectangle(bgr, ...);
        }
        
        // 关键：先缩放再转换格式！
        cv::resize(bgr, bgr, cv::Size(200, 120));
        cv::cvtColor(bgr, disp_out, cv::COLOR_BGR2BGR565);
        memcpy(frame_buffer, disp_out.data, 200 * 120 * 2);
    }
    
    cap.release();
    return NULL;
}
```

### 3. LVGL UI 定时更新

```c
static void timer_frame_cb(lv_timer_t* timer) {
    if (current_view == VIEW_ENROLL) {
        // 获取帧
        face_enrollment_get_frame((uint8_t*)img_dsc.data);
        lv_img_set_src(cam_img, &img_dsc);
        
        // 检测人脸
        face_detected = (face_enrollment_get_detection(&result) > 0);
        
        // 更新UI状态
        if (face_detected) {
            lv_label_set_text(status_label, "Face detected");
        } else {
            lv_label_set_text(status_label, "No face");
        }
        update_button_states();
    }
}
```

## 踩坑记录与解决方案

### 问题1: 画面显示绿色/蓝色噪点

**现象**: 摄像头画面出现大量绿色和蓝色小点，物体边缘尤其明显。

**原因**: 对 BGR565 格式的图像进行 `cv::resize()` 时，双线性插值会跨越颜色通道的位边界，导致颜色错乱。

```c
// 错误：先转换再缩放
cv::cvtColor(bgr, disp, cv::COLOR_BGR2BGR565);
cv::resize(disp, disp_out, cv::Size(200, 120));  // 破坏颜色！

// 正确：先缩放再转换
cv::resize(bgr, bgr, cv::Size(200, 120));
cv::cvtColor(bgr, disp_out, cv::COLOR_BGR2BGR565);
```

### 问题2: 无人脸时误检测

**现象**: 即使画面中没有人脸，系统也显示 "Face detected"，置信度异常高（30-60）。

**原因**: 模型输出类型是 `RKNN_TENSOR_INT8`（type=2），但代码使用 `uint8_t*` 读取。

```c
// 错误：使用 uint8_t
uint8_t* score = (uint8_t*)output->virt_addr;
// 字节 243 → uint8_t: 243 → score ≈ 60 (错误)

// 正确：使用 int8_t
int8_t* score = (int8_t*)output->virt_addr;
// 字节 243 → int8_t: -13 → score ≈ -2.7 (正确，会被过滤)
```

### 问题3: 边界框坐标为 -inf/inf

**现象**: 检测到的人脸边界框坐标显示为 `-inf` 和 `inf`。

**原因**: 错误的 uint8 读取导致 bbox 偏移量计算错误，`expf()` 对大正数产生溢出。

**解决**: 同问题2，使用正确的 `int8_t` 类型读取。

### 问题4: 注册界面卡死

**现象**: 切换到注册界面后画面卡住，一直显示 "No face"。

**原因**: 逻辑错误导致死锁：

```c
// 错误逻辑
if (face_detected) {
    enrollment_active = true;
} else {
    enrollment_active = false;  // 无人脸时设为 false
}

if (enrollment_active && ...) {  // enrollment_active 为 false 时不执行
    // 帧更新代码永远不会执行！
}
```

**解决**: 分离状态变量：

```c
// enrollment_active - 摄像头是否运行（始终为 true）
// face_detected - 当前是否检测到人脸

if (img_dsc.data) {  // 无条件执行帧更新
    face_enrollment_get_frame(...);
    face_detected = (face_enrollment_get_detection(...) > 0);
    update_button_states();  // 根据 face_detected 更新按钮
}
```

### 问题5: 重新进入页面画面卡住

**现象**: 首次进入正常，退出后再进入画面卡住。

**原因**: `face_initialized` 为 true 时跳过了整个初始化块，导致摄像头未启动。

```c
// 错误：摄像头启动在模型初始化的 if 块内
if (!face_initialized) {
    face_recognition_init(...);
    face_initialized = true;
    start_face_enrollment();  // 第二次进入时被跳过！
}

// 正确：分离模型初始化和摄像头启动
if (!face_initialized) {
    face_recognition_init(...);
    face_initialized = true;
}
// 每次进入页面都启动摄像头
if (face_initialized) {
    start_face_enrollment();
}
```

## 编译和部署

### 编译命令

```bash
cd Demo/DeskBot_demo
mkdir -p build && cd build
cmake .. -DTARGET_ARM=ON
make -j$(nproc)
```

### 部署文件

```bash
# 复制到设备
cp -r bin/* /path/to/device/

# 目录结构
bin/
├── main                    # 主程序
├── model/
│   └── retinaface.rknn    # 模型文件
├── lib/
│   ├── librga.so
│   └── librknnmrt.so
└── system_para.conf        # 配置文件
```

## 后续优化方向

### 1. 提高识别准确度

启用 MobileFaceNet 提取 128 维特征向量：

```c
// 提取特征
float features[128];
inference_mobilefacenet_model(&ctx, face_input, features);

// 余弦相似度匹配
float similarity = cosine_similarity(features, db_features, 128);
```

### 2. 人脸质量检测

注册前检测人脸质量：

```c
// 模糊度检测 (Laplacian 方差)
float blur_score = check_blur(face);
if (blur_score < 100) return "人脸太模糊";

// 尺寸检测
if (face_width < 80 || face_height < 80) return "人脸太小";
```

### 3. 性能优化

使用 RKMPI + RGA 硬件加速：

```c
// RKMPI 获取 YUV 数据
RK_MPI_VI_GetChnFrame(0, 0, &stViFrame, -1);

// RGA 硬件缩放
rga_buffer_t src, dst;
imresize(src, dst);
```

## 总结

本文详细介绍了 RV1106 平台上人脸识别功能的完整开发流程：

1. **模型部署**: RetinaFace RKNN 模型的量化解码和 Anchor Box 后处理
2. **图像处理**: OpenCV 图像格式转换的正确顺序
3. **UI开发**: LVGL 多线程安全的帧更新机制
4. **踩坑解决**: INT8/UINT8 类型、BGR565缩放、状态管理等常见问题

完整代码已开源：[https://github.com/drucelee723/linux-mate](https://github.com/drucelee723/linux-mate)

## 参考资料

- [Rockchip RKNN SDK 文档](https://github.com/rockchip-linux/rknn-toolkit2)
- [LVGL 官方文档](https://docs.lvgl.io/)
- [RetinaFace 论文](https://arxiv.org/abs/1905.00641)
