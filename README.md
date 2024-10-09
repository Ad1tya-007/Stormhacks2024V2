# CI/CDfy

## Overview
CI/CDfy is an intelligent tool designed to continuously monitor the health of CI/CD pipelines and related infrastructure. It provides insights, alerts for build failures, and AI-driven suggestions to optimize build times, deployment processes, and overall pipeline efficiency. The goal is to automate key DevOps tasks, allowing engineering teams to work more effectively and reduce manual troubleshooting.

## Key Features
* Real-Time Monitoring: Continuously tracks the health and performance of CI/CD pipelines.
* AI-Powered Insights: Uses AI to analyze build logs, detect bottlenecks, and recommend improvements to speed up builds and reduce failures.
* Failure Alerts: Sends alerts for build failures and pipeline issues directly to team Slack channels.
* Task Automation: Automatically creates Jira tasks for build failures, improving communication and tracking.
* Historical Performance Analysis: Tracks and displays historical build times, error rates, and other key metrics for trend analysis.

## Tech Stack
* Frontend - Nextjs
* APIs used
  * Github Octokit
  * Slack
  * Jira
  * OpenAI
  * Supabase ( Github oauth )

## Installation
For this to work you need a .env.local in which you should have Supabase **URL** and **ANONYMOUS_KEY**.
You get these keys when you create a supabase project.

## Team Members
* Aditya Kulkarni - https://github.com/Ad1tya-007
* Jung-Hyun Andrew Kim - https://github.com/JH-A-Kim
* Kevin Sugeng - https://github.com/kevinss09

## Conclusion
This project was done in Stormhacks 2024 V2 (24 hour hackathon).




