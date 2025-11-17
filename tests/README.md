<!-- tests/README.md -->

แน่นอนครับ การทดสอบต่อเพื่อหาขีดจำกัดสูงสุดของระบบ (Ultimate Breaking Point) เป็นขั้นตอนที่ถูกต้องและน่าตื่นเต้นมากครับ

ในฐานะ Master Architect ผมได้เพิ่มสถานการณ์ทดสอบที่หนักขึ้นเข้าไปในไฟล์ `tests/README.md` เพื่อให้เราสามารถผลักดันระบบไปสู่ขีดจำกัดต่อไปได้ โดยจะเน้นไปที่การเพิ่มจำนวนผู้ใช้ (VUs) ให้สูงขึ้นไปอีก และเพิ่มสถานการณ์จำลองการเข้าใช้งานแบบ "กระชาก" (Spike Test) ซึ่งเหมือนกับสถานการณ์จริงตอนเปิดขายตั๋วมากที่สุด

นี่คือไฟล์ `tests/README.md` ฉบับสมบูรณ์ที่คุณสามารถนำไปใช้ได้เลยครับ

---

### **ไฟล์: `tests/README.md` (ฉบับอัปเดต)**

# Load Testing Scenarios

This file contains the sequence of `k6` commands to progressively stress test the system.

### Phase 1: Baseline & Initial Scaling (Completed)

These tests validate the basic stability and performance of the architecture.

```bash
# Test with minimal load first (Baseline)
k6 run --vus 10 --duration 30s tests/load-test/thundering-herd-problem.js

# Test with 100 VUs
k6 run --vus 100 --duration 2m tests/load-test/thundering-herd-problem.js

# Test with 500 VUs
k6 run --vus 500 --duration 5m tests/load-test/thundering-herd-problem.js

# Test with 1000 VUs (monitor system resources closely)
k6 run --vus 1000 --duration 10m tests/load-test/thundering-herd-problem.js
```

---

### Phase 2: High-Volume Stress Testing (New)

After tuning the connection pools, these tests aim to find the next bottleneck, which could be CPU saturation on the NestJS container, Redis performance limits, or I/O limits on the database.

**During these tests, it is critical to monitor `docker stats` in a separate terminal.**

```bash
# Test with 1500 VUs
k6 run --vus 1500 --duration 10m tests/load-test/thundering-herd-problem.js

# Test with 2000 VUs (Expect potential resource saturation)
k6 run --vus 2000 --duration 10m tests/load-test/thundering-herd-problem.js (~1000 RPS)
```

---

### Phase 3: Spike Test (Advanced Scenario)

This test simulates the most realistic scenario: a massive, sudden surge of users at the exact moment sales open. It tests the system's ability to handle a sudden "shock" without crashing.

The `stages` option in k6 is used to define the ramp-up and ramp-down periods.

```bash
# Spike Test: Ramp up to 2500 VUs in 10s, hold for 1m, then ramp down
k6 run --stage 10s:2500,1m:2500,10s:0 tests/load-test/thundering-herd-problem.js
```

---

### สิ่งที่เรากำลังมองหาใน Phase 2 & 3:

*   **CPU Saturation:** CPU ของ `nestjs` container วิ่งค้างที่ 100% หรือไม่?
*   **Response Time Degradation:** `http_req_duration (p95)` เริ่มเพิ่มขึ้นอย่างมีนัยสำคัญหรือไม่?
*   **Redis/Postgres Performance:** `docker stats` แสดงให้เห็นว่า `redis` หรือ `postgres` เริ่มใช้ CPU/Memory สูงผิดปกติหรือไม่?

ข้อมูลจากรอบนี้จะบอกเราว่า "คอขวดถัดไป" คืออะไร และเราควรจะเริ่มทำ **Horizontal Scaling** (การเพิ่มจำนวน NestJS container) ณ จุดไหนครับ