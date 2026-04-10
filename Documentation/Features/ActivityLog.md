# Activity Tracking Feature Plan

## 📌 Feature Info

- **Name:** Activity Tracking
- **Version:** 2.0 (Optimized)

---

## 🎯 Objective

Allow users to log daily activities categorized into:

- Focused
- Maintenance
- Leisure

Enable efficient tracking, analytics, and long-term behavioral insights with optimized storage and fast queries.

---

## 🧠 Design Principles

- Store raw data (Activity) as immutable logs
- Use aggregated data (DailySummary) for fast reads
- Optimize for read-heavy analytics workloads
- Keep schema minimal and scalable

## 🗂️ Data Models

### 📝 Activity (Primary Log - Optimized)

- `_id`
- `u` → userRef (ObjectId)
- `t` → title (String)
- `c` → category (Number: 0 | 1 | 2)
- `d` → duration in minutes (Number)
- `dt` → date (Number: YYYYMMDD)
- `createdAt`

💡 Notes:

- Short keys reduce storage size
- Numeric category improves performance
- Flat structure ensures scalable queries

---

### 📊 DailySummary (Pre-Aggregated for Analytics)

- `_id`
- `u` → userId
- `dt` → date (YYYYMMDD)
- `f` → totalFocused (Number)
- `m` → totalMaintenance (Number)
- `l` → totalLeisure (Number)
- `total` → total time (Number)

💡 Purpose:

- Fast dashboard rendering
- Efficient chart generation
- Avoid heavy aggregation queries on raw logs

---

## ⚙️ Constants

```js
// Category mapping
CATEGORY = {
  0: "focused",
  1: "maintenance",
  2: "leisure",
};

// Reverse mapping (for inserts)
CATEGORY_MAP = {
  focused: 0,
  maintenance: 1,
  leisure: 2,
};
```

## 🔄 Core Flows

### ➕ Add Activity

- Validate input
- Convert category → numeric (CATEGORY_MAP)
- Insert into Activity collection
- Update DailySummary using $inc:

```js
$inc: {
  f: (if focused),
  m: (if maintenance),
  l: (if leisure),
  total: duration
}
```

## 📅 Fetch Daily Activities

### Query:

- by u + dt

## 📊 Fetch Analytics

### Use DailySummary:

- Daily trend → sort by dt
- Category breakdown → sum f, m, l

## ⚡ Indexing Strategy

### Activity indexes

- user + date
- user + category

### Summary Index

- user + date

```js
db.activity.createIndex({ u: 1, dt: 1 });
db.activity.createIndex({ u: 1, c: 1 });
db.dailySummary.createIndex({ u: 1, dt: 1 });
```
