### บทสรุปการประเมิน

จากการวิเคราะห์ Flow การทำงานที่ระบุในเอกสาร โดยเฉพาะส่วนของ Waiting Room ผมประเมินว่า RPS ที่ **Booking Service (`POST /api/bookings`)** ของเราต้องรับมือให้ได้จะอยู่ที่ประมาณ **2,000 - 5,000 RPS** ในช่วงเวลาที่พีคที่สุด (Peak Burst) ครับ

---

### หลักการและข้อสมมติฐานในการประเมิน

การคำนวณนี้อิงตามข้อมูลและข้อสมมติฐานที่สมเหตุสมผลที่สุดจากเอกสาร `requirements/business.md`:

1.  **จุดที่ต้องโฟกัส (The Hotspot):** เราจะคำนวณ RPS ที่เข้ามายัง `Booking Service` เท่านั้น เพราะนี่คือบริการที่ต้องรับภาระงานหนักที่สุด ไม่ใช่จำนวนคนทั้งหมด 1 ล้านคนที่รออยู่ข้างนอก
2.  **กุญแจสำคัญคือ Waiting Room:** เอกสารระบุว่า *"Waiting Room ทยอยปล่อยคนเข้าเว็บทีละ 10,000 คน"* นี่คือตัวเลขที่สำคัญที่สุดในการคำนวณของเรา
3.  **พฤติกรรมผู้ใช้ (User Behavior):** หลังจากผู้ใช้ 10,000 คนถูกปล่อยเข้ามาแล้ว พวกเขาจะไม่กดจองพร้อมกันในมิลลิวินาทีเดียวกัน จะมีช่วงเวลาสั้นๆ ที่ใช้ในการมองหาที่นั่งและตัดสินใจกดจอง เราจะเรียกช่วงเวลานี้ว่า **"หน้าต่างเวลาที่ผู้ใช้ลงมือ" (Action Window)**

---

### การคำนวณ RPS ในช่วงเวลาที่พีคที่สุด (Peak Burst RPS)

เราจะคำนวณโดยใช้สูตร: `RPS = (จำนวนผู้ใช้ที่ถูกปล่อยเข้ามา) / (Action Window)`

#### สถานการณ์สมจริง (Realistic Case): **Action Window = 5 วินาที**
*   **สมมติฐาน:** หลังจากหน้าเว็บโหลดเสร็จ ผู้ใช้ส่วนใหญ่จะใช้เวลาคิดและคลิกจองครั้งแรกภายใน 5 วินาทีแรก
*   **การคำนวณ:** `10,000 users / 5 seconds` = **2,000 RPS**

#### สถานการณ์เลวร้ายที่สุด (Worst-Case Spike): **Action Window = 2 วินาที**
*   **สมมติฐาน:** ผู้ใช้เตรียมพร้อมมาอย่างดีและคลิกจองอย่างรวดเร็วที่สุด ทำให้ request ทั้งหมดถูกส่งเข้ามาในช่วงเวลาแค่ 2 วินาที
*   **การคำนวณ:** `10,000 users / 2 seconds` = **5,000 RPS**

---

### **Validation Through Testing (As of Nov 17, 2025)**

The theoretical capacity estimates have now been validated through rigorous load testing.

-   **Proven Capacity:** The system has successfully sustained a load of **2,447 RPS** with zero errors.
-   **Resources:** This was achieved using a single `nestjs` container allocated **2 CPU cores and 2GB of memory**.
-   **Conclusion:** The test results confirm that the system architecture successfully meets and exceeds the "Realistic Case" (2,000 RPS) requirement. The initial capacity planning was accurate, and the system is performing as designed. To reach the "Worst-Case Spike" of 5,000 RPS, the next logical step is horizontal scaling.

---

### คำแนะนำของ Architect

**ระบบของเราต้องถูกออกแบบมาให้ "รอด" จาก Peak Burst ให้ได้โดยไม่ล่ม** และสามารถทำงานต่อเนื่องภายใต้ Sustained RPS ได้

ดังนั้น เป้าหมายในการทำ Performance Test ของเราควรตั้งไว้ที่ **การรองรับให้ได้ 5,000 RPS อย่างมีเสถียรภาพ** ซึ่งเป็นการเตรียมพร้อมสำหรับสถานการณ์ที่เลวร้ายที่สุดตามข้อมูลที่เรามี

*   **เป้าหมาย 10k RPS ที่คุณตั้งไว้ก่อนหน้านี้ถือว่ายอดเยี่ยมมาก** และเป็นเป้าหมายที่ดีหากต้องการสร้างระบบที่มี Headroom เหลือเฟือ
*   **แต่เป้าหมายขั้นต่ำที่ "ต้องทำให้ได้"** ตาม requirement ที่เรามี คือ **5,000 RPS** ครับ