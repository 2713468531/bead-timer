-- 拼豆DIY会员系统数据库初始化脚本
-- 数据库：bead_timer
-- 创建时间：2026-06-06

-- 创建数据库
CREATE DATABASE IF NOT EXISTS bead_timer DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE bead_timer;

-- 1. 会员表
CREATE TABLE IF NOT EXISTS `member` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '会员ID',
  `name` VARCHAR(50) NOT NULL COMMENT '会员姓名',
  `phone` VARCHAR(11) NOT NULL COMMENT '手机号（11位）',
  `balance` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '账户余额',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '开卡时间',
  `total_recharge` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '累计充值总额',
  `total_consume` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '累计消费总额',
  `remark` VARCHAR(255) DEFAULT NULL COMMENT '备注',
  `status` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态：1-正常，0-注销',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会员信息表';

-- 2. 会员充值记录表
CREATE TABLE IF NOT EXISTS `member_recharge` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '充值记录ID',
  `member_id` INT(11) NOT NULL COMMENT '会员ID',
  `phone` VARCHAR(11) NOT NULL COMMENT '手机号',
  `recharge_money` DECIMAL(10,2) NOT NULL COMMENT '充值金额',
  `after_balance` DECIMAL(10,2) NOT NULL COMMENT '充值后余额',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '充值时间',
  PRIMARY KEY (`id`),
  KEY `idx_member_id` (`member_id`),
  KEY `idx_phone` (`phone`),
  KEY `idx_create_time` (`create_time`),
  CONSTRAINT `fk_recharge_member` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会员充值记录表';

-- 3. 订单表（新增会员相关字段）
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `table_id` INT(11) NOT NULL COMMENT '桌台ID',
  `table_name` VARCHAR(50) NOT NULL COMMENT '桌台名称',
  `start_time` DATETIME NOT NULL COMMENT '开单时间',
  `end_time` DATETIME NOT NULL COMMENT '结账时间',
  `duration` INT(11) NOT NULL DEFAULT 0 COMMENT '时长（分钟）',
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '订单金额',
  `package_name` VARCHAR(100) DEFAULT NULL COMMENT '套餐名称',
  `remark` VARCHAR(255) DEFAULT NULL COMMENT '备注',
  `member_phone` VARCHAR(11) DEFAULT NULL COMMENT '会员手机号',
  `pay_type` VARCHAR(20) NOT NULL DEFAULT '现金' COMMENT '支付方式：现金/会员余额',
  `member_pay_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '会员余额支付金额',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_table_id` (`table_id`),
  KEY `idx_start_time` (`start_time`),
  KEY `idx_end_time` (`end_time`),
  KEY `idx_member_phone` (`member_phone`),
  KEY `idx_pay_type` (`pay_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单记录表';

-- 插入测试会员数据（可选）
-- INSERT INTO `member` (`name`, `phone`, `balance`, `remark`) VALUES
-- ('张三', '13800138001', 100.00, 'VIP客户'),
-- ('李四', '13800138002', 50.00, '常客');