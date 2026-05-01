# TestMind API 文档

## 概述

本文档描述 TestMind 的所有 API 接口。

## 认证

所有 API 请求都需要携带认证信息。

## 接口列表

### 项目相关
- `GET /api/projects` - 获取项目列表
- `POST /api/projects` - 创建新项目
- `GET /api/projects/:id` - 获取项目详情

### 测试相关
- `POST /api/generate` - 生成测试用例
- `GET /api/testcases` - 获取测试用例列表
- `POST /api/testcases/run` - 运行测试

### 报告相关
- `GET /api/reports` - 获取测试报告
- `GET /api/reports/:id` - 获取报告详情
