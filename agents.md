# Agents.md

## Overview

This document outlines the key agents (modules/services) powering the **Meta Ads Creative Analytics** platform, which provides a performance-based visual analysis of video ad creatives using metrics from Facebook Ads data.

---

## 1. **Data Aggregator Agent**
**Role**: Interfaces with Facebook's Graph API to fetch ad insights.
- **Responsibilities**:
  - Pull insights using `facebook_post_id`, `ad_id`, or `ad_name`.
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
  - Ensure rounding, fallback defaults, and data validation.

---

## 3. **Report Builder Agent**
**Role**: Generate visual reports from metrics data.
- **Implemented in**: `reports.php`, `ReportController.php`
- **Features**:
  - Card view grouped by ad or post ID.
  - Tabular view with customizable columns.
  - Date filters, saved presets, and export options.
  - AJAX-powered interactive dashboard with PHP/MySQL backend.

---

## 4. **Workspace Manager Agent**
**Role**: Manage multiple ad accounts per user agency.
- **Responsibilities**:
  - Enable workspace-based segmentation.
  - Ensure secure, scoped data access.
  - Support linking/disconnecting ad accounts dynamically.

---

## 5. **User Authentication & Role Agent**
**Role**: Handle user sessions, permissions, and data segregation.
- **Database schema**: Refer to `users` table (see schema in `users table in the database.jpg`).
- **Roles Supported**:
  - Admin (full access)
  - Agency Manager (workspace control)
  - Analyst (report access only)

---

## 6. **Frontend Agent**
**Role**: Render dynamic UI/UX components using:
- **Tech Stack**:
  - HTML, CSS, AJAX
  - Custom JavaScript integrations for visual reports
  - Realtime filtering, sorting, and visualization

---

## Final Notes
All agents follow the principles of modularity, reusability, and scalability, making it easy to plug in new data sources or metrics with minimal effort.
