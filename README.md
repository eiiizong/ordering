# 项目介绍

> 线上点餐小程序 支付宝/微信（By mpvue）

# 项目搭建运行

# 初始化项目

## 下载

`git clone https://github.com/eiiizong/ordering.git`

完成之后

`cd myproject`

## 安装依赖

`npm install`

## 开发时构建（默认微信）

`npm run dev` 

## 打包构建

`npm  run build`

## 指定平台的开发时构建(微信、百度、头条、支付宝)

微信:

`npm run dev:wx`

百度:

`npm run dev:swan`

头条:

`npm run dev:tt`

支付宝:

`npm run dev:my`

## 指定平台的打包构建

`npm run build:wx`

`npm run build:swan`

`npm run build:tt`

`npm run build:my`

## 生成 bundle 分析报告

`npm run build --report`
