## Revised NestJS Implementation Plan (Prototype Phase)

### 1. **Technology Stack Adjustment**
เราจะใช้ **NestJS** และ **Redis** เป็นหัวใจหลักในการทำ Prototype เพื่อพิสูจน์ว่า Core Booking Logic สามารถรองรับ High Concurrency ได้จริง โดยจะ **จำลอง Waiting Room ผ่าน Load Testing Scripts** และตัดส่วนที่ไม่จำเป็นเช่น Payment, Kafka, Logging และ Unit Tests ออกทั้งหมดใน Phase นี้

### 2. **NestJS App Module Structure**
โครงสร้างยังคงเป็นแบบ Monolith เพื่อความรวดเร็วในการพัฒนา

```mermaid
graph TD
    A[app.controller.ts] --> B[app.service.ts]
    B --> C[Redis Service]
    B --> E[Prisma Service] // (PostgreSQL)
    
    F[User Management] --> A
    G[Event Management] --> A
    H[Seat Management] --> A
    I[Booking Service (Hotspot)] --> A
    K[Waiting Room (Mock)] --> A
    
    C --> L[Seat Locking]
```

### 3. **Critical Implementation Components**

#### **Redis Integration in NestJS**
- **Seat Locking**: **ส่วนที่สำคัญที่สุด** ใช้คำสั่ง Atomic `SETEX` เพื่อจองที่นั่งชั่วคราว (Hold)

#### **Database Schema** (No Change)
- **PostgreSQL**: สำหรับข้อมูล User, Event, และ Booking ที่จองสำเร็จ
- **Redis**: สำหรับสถานะที่นั่งแบบ Real-time

### 4. **Endpoint Implementation Plan**

#### **Endpoints ที่ต้อง Implement Logic จริง (Focus)**
```
GET    /api/events/:id      - Event details
GET    /api/seats/available   - Available seats for an event
POST   /api/bookings          - **(Hotspot)** Create booking (hold seat)
```
#### **Endpoints ที่เป็น Mock หรือมี Logic แบบง่ายๆ**
```
POST   /api/users/login        - (Mock) Return a dummy user
GET    /waiting-room          - (Mock) Return { "status": "proceed_to_booking" }
```
### 5. **Implementation Order (Prototype Phase)**
1.  อัปเดต `docker-compose.yml` เพื่อเพิ่ม Redis
2.  อัปเดต Prisma schema สำหรับโมเดลที่เกี่ยวข้อง
3.  สร้าง Redis service integration ใน NestJS (เน้น `SETEX`)
4.  Implement Endpoint ที่เป็น **Hotspot** คือ `POST /api/bookings` ให้มี Logic การจองที่นั่งใน Redis ที่ถูกต้อง
5.  Implement Endpoint อื่นๆ ที่จำเป็นต่อการทดสอบ (เช่น `GET /api/seats/available`)
6.  สร้าง **Load Testing Scripts (k6)** เพื่อยิงไปที่ `POST /api/bookings` โดยตรง และค่อยๆ เพิ่ม Load เพื่อหาขีดจำกัดของระบบ

---
แนวทางนี้จะช่วยให้เราประหยัดเวลาในการพัฒนาส่วนที่ไม่ใช่หัวใจของปัญหา และสามารถพิสูจน์สมมติฐานที่สำคัญที่สุดได้เร็วขึ้นมากครับ