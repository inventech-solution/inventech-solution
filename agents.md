# Agents.md

## Overview

This document outlines the key agents (modules/services) powering the **Meta Ads Creative Analytics** platform, which provides a performance-based visual analysis of video ad, image ad, carousel ad, etc creatives using metrics from Facebook Ads data.

---

## 1. **Data Aggregator Agent**
**Role**: Interfaces with Facebook's Graph API to fetch ad insights.
- **Responsibilities**:
  - Pull insights from Facebook Marketing API.
  - Format data consistently across all workspaces and users.
  - Respect multi-attribution configurations.

---

## 2. **Metric Processor Agent**
**Role**: Compute and structure performance metrics.
- **Implemented in**: `metrics.js`
- **Functions**:
  - Calculate over 80+ metrics, including:
    - ROAS, CPM, CTR, AOV, Purchase Count
    - Video Metrics (Thruplay, 3s Views, Retention Rates)
    - Engagement (Like Rate, Comment Rate, Shares)
    - Drop-off analysis

---

## 3. **Report Builder Agent**
**Role**: Generate visual reports from metrics data.
- **Features**:
  - Data should be grouped by ad name, creative type (video, image, carousel, feed), copy (primary text), headline, landing page, cta button (shop now, order now, sign up, subscribe, learn more, etc.) discount code or post ID
  - Card view, graph view.
  - Tabular view with customizable columns.
  - Date filters, saved presets, and export options.
  - AJAX-powered interactive dashboard with PHP/MySQL backend.

---

## 4. **Workspace Manager Agent**
**Role**: Manage multiple workspaces (1 workspace = ad account) per user agency.
- **Responsibilities**:
  - Enable workspace-based segmentation.
  - Ensure secure, scoped data access.
  - Support linking/disconnecting ad accounts dynamically.

---

## 5. **User Authentication & Role Agent**
**Role**: Handle user sessions, permissions, and data segregation.
- **Roles Supported**:
  - Super admin (developer of the portal)
  - Admin (full access)
  - Agency Manager (workspace control)
  - Analyst (report access only)
  - Client (workspace control)

---

## 6. **Frontend Agent**
**Role**: Render dynamic UI/UX components using:
- **Tech Stack**:
  - HTML, CSS, AJAX
  - Tailwind CSS, Alpine JS, Bootsratp
  - Apache ECharts for Graphs (https://echarts.apache.org/)
  - Tables: Bootstrap Tables (https://bootstrap-table.com)
  - Custom JavaScript integrations for visual reports
  - Realtime filtering, sorting, and visualization
- No NodeJs, ReactJS use

- ## 7. **Database Tables & Structure**

**Database Tables**:
- `folders`:
  - `id`, `workspace_id`, `name`, `f_uid`, `created_at`
- `metrics`:
  - `id`, `name`, `apiName`, `description`, `formula`, `sum`, `columnal`, `graphical`, `format`, `notes`
- `reports`:
  - `id`, `folder_id`, `icon_url`, `title`, `description`, `grouping`, `metrics`, `card_metrics`, `filters`, `date_range`, `report_url_id`, `report_type`, `created_at`
- `shared_reports`:
  - `id`, `report_id`, `public_token`, `password_hash`, `expires_at`, `date_range`, `columns`, `pills_columns`, `table_data`, `creative_insights`, `created_at`
- `users`:
  - `id`, `name`, `email`, `mobile`, `password`, `type`, `logins`, `level`, `subscription_plan`, `subscription_status`, `subscription_start_date`, `subscription_end_date`, `renewal_date`, `auto_renew`, `trial_ends_at`, `last_payment_date`, `last_payment_amount`, `currency`, `payment_method`, `payment_status`, `transaction_id`, `account_status`, `coupon_code`, `last_login`, `created_at`, `updated_at`
- `workspaces`:
  - `id`, `user_id`, `name`, `facebook_account_id`, `facebook_account_name`, `created_at`

## Database Schema Summary

| Table              | Purpose                                                                                                                                |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `folders`          | Organizes reports and metrics into logical collections.                                                                                |
| `metrics`          | Stores precomputed or custom-defined metric results for creatives. This supports faster report rendering and analytics.                |
| `reports`          | Holds user-generated report configurations (filters, date ranges, visual preferences, columns). Useful for restoring saved views.      |
| `shared_reports`   | Manages sharing of reports across users without them requiring access to ad accounts data.                                             |
| `users`            | Manages user accounts, roles, and access levels.                                                                                       |
| `workspaces`       | Represents separate environments for agencies to connect and manage multiple Meta ad accounts. 1 Meta Ad account per Workspace.        |
##Agency owners/brands are being billed per workspace i.e. per ad account.                                                                                    |

## 8. **Subscription & SaaS Billing Agent**
**Role**: Manage user subscriptions, plans, invoices, and billing status using **Zoho Subscriptions**.

**Responsibilities**:
- Handle sign-ups, upgrades, downgrades, and cancellations.
- Sync billing status (active, canceled) with internal user access control.
- Manage plan-based access to features (e.g., number of workspaces, addons).
- Webhook integration to respond to billing events in real-time.

**External Service**:
- [Zoho Subscriptions](https://www.zoho.com/subscriptions/)


## Final Notes
All agents follow the principles of modularity, reusability, and scalability, making it easy to plug in new data sources or metrics with minimal effort.
