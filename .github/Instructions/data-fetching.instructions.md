---
description: Read this file to understand how to fetch data in the project.
---

# Data Fetching Guidelines
 This document outlines the best practices and guidelines for fetching data in our next.js application. adhering to these guidelines will ensure consistency, maintainability, and optimal performance across the codebase.

 ## 1. Use server components for data fetching

 In Next.js, ALWAYS use server components for data fetching. NEVER use client Components to fetch data.

 ## 2. Data Fetching methods

 ALWAYS use the helper functions in the /data directory to fetch data. NEVER fetch data directly in your components. 
 ALL helper functions in the /data directory should use Drizzle ORM to interact with the database. NEVER use raw SQL queries or other database libraries.
 