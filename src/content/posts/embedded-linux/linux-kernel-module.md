---
title: "Linux内核模块开发入门"
description: "学习Linux内核模块的基本概念，编写第一个内核模块，理解模块的加载和卸载过程"
date: "2026-02-18"
category: "embedded-linux"
tags: ["Linux", "内核", "驱动开发", "内核模块"]
author: "小肥熊"
series: "Linux驱动开发系列"
seriesOrder: 1
---

# Linux内核模块开发入门

Linux内核模块是Linux内核的重要组成部分，允许在不重新编译内核的情况下动态添加功能。本文将带你编写第一个内核模块。

## 1. 内核模块概述

### 1.1 什么是内核模块

内核模块是一段可以被内核动态加载和卸载的代码，它扩展了内核的功能而不需要重启系统。

### 1.2 模块的优点

- 动态加载，无需重启
- 节省内存
- 方便调试和开发

## 2. 开发环境准备

```bash
# 安装内核头文件和构建工具
sudo apt-get install build-essential linux-headers-$(uname -r)

# 查看当前内核版本
uname -r
```

## 3. 第一个内核模块

### 3.1 模块代码

```c
// hello_module.c
#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("小肥熊");
MODULE_DESCRIPTION("A simple Linux kernel module");
MODULE_VERSION("1.0");

// 模块加载时调用
static int __init hello_init(void) {
    printk(KERN_INFO "Hello, Kernel!\n");
    return 0;
}

// 模块卸载时调用
static void __exit hello_exit(void) {
    printk(KERN_INFO "Goodbye, Kernel!\n");
}

module_init(hello_init);
module_exit(hello_exit);
```

### 3.2 Makefile

```makefile
obj-m += hello_module.o

KDIR := /lib/modules/$(shell uname -r)/build
PWD := $(shell pwd)

all:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean
```

## 4. 编译和测试

### 4.1 编译模块

```bash
make
```

编译后会生成以下文件：
- `hello_module.ko` - 内核模块文件
- `hello_module.mod.c`
- `hello_module.mod.o`
- `hello_module.o`
- `Module.symvers`
- `modules.order`

### 4.2 加载模块

```bash
# 加载模块
sudo insmod hello_module.ko

# 查看模块信息
modinfo hello_module.ko

# 查看已加载的模块
lsmod | grep hello

# 查看内核日志
dmesg | tail
```

### 4.3 卸载模块

```bash
# 卸载模块
sudo rmmod hello_module

# 查看日志确认
dmesg | tail
```

## 5. 模块参数

内核模块支持命令行参数：

```c
#include <linux/moduleparam.h>

static int count = 1;
static char *name = "world";

module_param(count, int, 0644);
module_param(name, charp, 0644);

MODULE_PARM_DESC(count, "Number of greetings");
MODULE_PARM_DESC(name, "Name to greet");

static int __init hello_init(void) {
    int i;
    for (i = 0; i < count; i++) {
        printk(KERN_INFO "Hello, %s!\n", name);
    }
    return 0;
}
```

使用参数加载模块：

```bash
sudo insmod hello_module.ko count=3 name="小肥熊"
```

## 6. 模块导出符号

导出符号供其他模块使用：

```c
// 导出函数
int my_function(int a, int b) {
    return a + b;
}
EXPORT_SYMBOL(my_function);

// 仅导出给GPL模块使用
EXPORT_SYMBOL_GPL(my_gpl_function);
```

## 7. 常用API

### 7.1 内存分配

```c
#include <linux/slab.h>

// 分配内存
void *ptr = kmalloc(size, GFP_KERNEL);
kfree(ptr);

// 分配并清零
void *ptr = kzalloc(size, GFP_KERNEL);
kfree(ptr);
```

### 7.2 打印调试信息

```c
// 日志级别
printk(KERN_EMERG "Emergency message\n");
printk(KERN_ALERT "Alert message\n");
printk(KERN_CRIT "Critical message\n");
printk(KERN_ERR "Error message\n");
printk(KERN_WARNING "Warning message\n");
printk(KERN_NOTICE "Normal but significant\n");
printk(KERN_INFO "Informational\n");
printk(KERN_DEBUG "Debug message\n");

// 使用pr_info等宏
pr_info("Information message\n");
pr_err("Error message\n");
pr_debug("Debug message (only if DEBUG defined)\n");
```

## 8. 注意事项

1. **不能使用标准C库** - 内核模块不能使用libc函数
2. **没有内存保护** - 错误可能导致系统崩溃
3. **不能使用浮点运算** - 除非显式保存/恢复FPU状态
4. **同步很重要** - 注意并发访问和竞态条件
5. **GPL许可证** - 许多内核API仅对GPL模块可用

## 总结

本文介绍了Linux内核模块开发的基础知识：
- 内核模块的概念和优点
- 模块的编写和Makefile配置
- 模块的加载、卸载和调试
- 模块参数和符号导出

下一篇文章将介绍字符设备驱动的开发。
