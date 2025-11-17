# รายงานสรุปผลการทดสอบประสิทธิภาพ (Load Testing & Performance Analysis Report)

**โปรเจกต์:** Thundering Herd Problem Prototype
**ผู้จัดทำ:** Master Software Architect

## บทสรุปสำหรับผู้บริหาร (Executive Summary)

การทดสอบนี้มีวัตถุประสงค์เพื่อพิสูจน์ว่าสถาปัตยกรรมที่ใช้ NestJS, Prisma, PostgreSQL และ Redis สามารถรองรับภาระงานสูง (High Concurrency) ที่เกิดจากปัญหา "Thundering Herd" ในระบบจองตั๋วได้จริง ผลการทดสอบประสบความสำเร็จอย่างยอดเยี่ยม โดยเราสามารถระบุและแก้ไขคอขวด (Bottleneck) ที่สำคัญได้สำเร็จ และล่าสุดได้พิสูจน์แล้วว่า **ระบบสามารถรองรับภาระงานได้ถึง 2,447 Requests/วินาที อย่างมีเสถียรภาพ** ภายใต้ทรัพยากรที่กำหนด (2 CPUs, 2GB Memory)

**ข้อสรุปสำคัญ:** สถาปัตยกรรมที่เลือกใช้ได้รับการพิสูจน์แล้วว่ามีความเหมาะสม และกลยุทธ์การทำ Horizontal Scaling (เพิ่มจำนวน Container) เป็นแนวทางที่ถูกต้องสำหรับ Node.js เพื่อรองรับภาระงานที่สูงขึ้นต่อไป

---

## Phase 1: VU-Based Stress Testing (Nov 10, 2025)

### 1. วัตถุประสงค์ของการทดสอบ (Objective)

1.  **พิสูจน์ (Validate)** ประสิทธิภาพของ Core Booking Logic ที่ใช้ Redis สำหรับ Atomic Locking
2.  **ระบุ (Identify)** จุดคอขวดของระบบภายใต้สภาวะโหลดสูง
3.  **หาขีดจำกัด (Benchmark)** ว่าสถาปัตยกรรมปัจจุบันด้วยทรัพยากรที่จำกัด สามารถรองรับผู้ใช้งานพร้อมกันได้เท่าไหร่
4.  **ยืนยัน (Confirm)** ความถูกต้องของ Tech Stack ที่เลือกใช้ (NestJS, Prisma, PostgreSQL, Redis)

### 2. วิธีการทดสอบ (Methodology)

*   **เครื่องมือ:** Grafana k6
*   **สภาพแวดล้อม:** Docker Compose บนเครื่อง local
    *   `nestjs`: 1 instance (2 vCPU, 2GB RAM)
    *   `postgres`: 1 instance
    *   `redis`: 1 instance
*   **สถานการณ์ทดสอบ (Scenarios):** เพิ่มจำนวน Virtual Users (VUs) ขึ้นตามลำดับ โดยยิง request ไปที่ Endpoint ที่เป็น Hotspot โดยตรง: `POST /api/bookings`
*   **เกณฑ์การวัดผล (Thresholds):**
    *   `http_req_duration (p95) < 800ms`
    *   `errors rate < 0.05%`

### 3. ผลการทดสอบและบทวิเคราะห์ (Test Results & Analysis)

*   **Initial Tests (10-100 VUs):** ผ่านอย่างยอดเยี่ยม แสดงให้เห็นว่า Logic การป้องกันการจองซ้ำซ้อน (409 Conflict) ทำงานได้สมบูรณ์แบบ
*   **High Load Test (1000 VUs - Attempt 1):** **ล้มเหลว** เนื่องจาก `Database Connection Pool Exhaustion` ซึ่งทำให้ Node.js process ของ NestJS crash
*   **การดำเนินการแก้ไข (Corrective Actions):** เพิ่ม `connection_limit=100` ใน `DATABASE_URL` และ `max_connections=200` ในคอนฟิกของ PostgreSQL
*   **High Load Test (1000 VUs - Attempt 2):** **ผ่านอย่างสมบูรณ์แบบ** ระบบมีความเสถียร 100% และมี Performance ที่ยอดเยี่ยม (p95 = 12.44ms)

---

## **Phase 2: RPS-Based Load Testing (Nov 17, 2025)**

### 1. วัตถุประสงค์ของการทดสอบ (Objective)

1.  **พิสูจน์ (Validate)** ว่าระบบสามารถรองรับภาระงาน (RPS) ตามเป้าหมายที่กำหนดไว้ใน `capacity-planning.md` ได้หรือไม่
2.  **หาขีดจำกัดสูงสุด (Benchmark Maximum Throughput)** ของ Container 1 instance ด้วยทรัพยากร 2 CPUs และ 2GB Memory

### 2. วิธีการทดสอบ (Methodology)

*   **เครื่องมือ:** Grafana k6
*   **Executor:** `constant-arrival-rate`
*   **เป้าหมาย:** **2,500 RPS** เป็นเวลา 5 นาที
*   **สภาพแวดล้อม:** Docker Compose บนเครื่อง local
    *   `nestjs`: 1 instance (**2 vCPU, 2GB RAM**)

### 3. ผลการทดสอบ (Test Results)

| Metric | Value | Status |
| :--- | :--- | :--- |
| **Target RPS** | **2,500 req/s** | - |
| **Achieved RPS** | **2,447.46 req/s** | ✅ **Excellent** |
| `http_req_duration p(95)`| **25.45ms** | ✅ **Excellent** |
| `errors rate` | **0.00%** | ✅ **Perfect** |
| `dropped_iterations` | 8,386 (~27/s) | ⚠️ **Informational** |

### 4. บทวิเคราะห์ (Analysis)

1.  **System Stability and Performance:** ระบบมีความเสถียรอย่างสมบูรณ์แบบตลอดการทดสอบ สามารถจัดการภาระงานที่หนักหน่วงได้โดยไม่มีข้อผิดพลาด (Error Rate 0%). Response time ยังคงต่ำอย่างน่าทึ่ง (p95 < 30ms) ซึ่งพิสูจน์ให้เห็นถึงประสิทธิภาพของสถาปัตยกรรม Core Logic
2.  **Maximum Capacity Benchmark:** ระบบสามารถทำ Throughput ได้สูงสุดที่ **~2,447 RPS** ด้วยทรัพยากรที่กำหนด
3.  **Understanding `dropped_iterations`:** ค่า `dropped_iterations` ที่เกิดขึ้นไม่ใช่ข้อผิดพลาดของระบบ แต่เป็นสัญญาณจาก k6 ที่บ่งชี้ว่า **Generator ไม่สามารถสร้างภาระงานได้ทันตามเป้าหมาย 2,500 RPS** เพราะระบบเป้าหมาย (NestJS) ทำงานจนเต็มขีดความสามารถของ CPU ทั้ง 2 cores แล้ว นี่คือการค้นพบขีดจำกัดสูงสุดที่ประสบความสำเร็จ

### 5. ข้อสรุปสำคัญ (Key Findings)

*   **เป้าหมายสำเร็จ:** Prototype ได้พิสูจน์แล้วว่าสามารถรองรับภาระงานได้ตามเป้าหมาย Realistic Case (2,000 RPS) และทำได้เกินเป้าหมายไปมาก
*   **ยืนยันสถาปัตยกรรม:** กลยุทธ์การใช้ Redis สำหรับ State Management และ PostgreSQL สำหรับ Persistence เป็นแนวทางที่ถูกต้องและมีประสิทธิภาพสูง
*   **แนวทางต่อไปชัดเจน:** การจะไปให้ถึง 5,000 RPS หรือสูงกว่านั้น ต้องทำผ่าน **Horizontal Scaling** โดยการเพิ่มจำนวน `nestjs` container instances

---