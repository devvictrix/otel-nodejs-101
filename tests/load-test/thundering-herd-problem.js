import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { randomIntBetween, randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// --- Metrics ---
// Custom metric to track genuine server errors (excluding 409 Conflict, which is expected)
export let errorRate = new Rate('errors');

// --- VU BASED TESTING ---
// export let options = {
//   stages: [
//     { duration: '10s', target: 100 },  // Ramp-up to 100 virtual users over 10s
//     { duration: '20s', target: 500 },  // Ramp-up to 500 virtual users over 20s
//     { duration: '30s', target: 1000 }, // Hold 1000 virtual users for 30s
//     { duration: '10s', target: 0 },    // Ramp-down
//   ],
//   thresholds: {
//     // 95% of requests should be faster than 800ms.
//     http_req_duration: ['p(95)<800'],
//     // The rate of genuine errors should be less than 5%.
//     errors: ['rate<0.05'],
//   },
// };

// ! RPS BASED TESTING !
export let options = {
  scenarios: {
    // กำหนดชื่อ scenario ว่า target_rps_test
    target_rps_test: {
      executor: 'constant-arrival-rate', // --- ใช้ executor ที่เน้น RPS ---

      // --- Configuration for 5,000 RPS ---
      rate: 2500,      // พยายามสร้าง request ใหม่ 5,000 ครั้ง
      timeUnit: '1s',    // ในทุกๆ 1 วินาที
      duration: '5m',    // ทดสอบเป็นเวลา 5 นาที
      preAllocatedVUs: 1000, // เตรียม VUs ไว้ล่วงหน้า
      maxVUs: 10000,      // และให้ k6 สร้าง VUs เพิ่มได้สูงสุดตามต้องการเพื่อไปให้ถึงเป้าหมาย
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<800'],
    errors: ['rate<0.05'],
  },
};

// --- Test Constants ---
const BASE_URL = 'http://localhost:8080';
const EVENT_ID = 1; // We will test a single event with ID 1
const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K']; // 10 Rows
const SEAT_PER_ROW = 50; // 50 Seats per row

// --- Setup ---
// This function runs once before the test starts.
// For a real test, you might pre-load users or fetch data here.
export function setup() {
  console.log('Setting up test environment... Targeting Event ID:', EVENT_ID);
  // Ensure that a User with ID matching the VU count exists. We'll simulate this.
  // The user ID will be the virtual user ID (__VU).
}

// --- Main Test Logic ---
// This function is the main loop for each Virtual User (VU).
export default function () {
  // 1. Generate a random seat for this user to attempt to book.
  // This simulates thousands of users trying to grab seats from the same pool.
  const randomSeat = `${randomItem(SEAT_ROWS)}${randomIntBetween(1, SEAT_PER_ROW)}`;

  // 2. Define the booking payload.
  // We use `__VU` which is a unique ID for each virtual user.
  const payload = JSON.stringify({
    userId: __VU,       // Each virtual user is a unique user
    eventId: EVENT_ID,
    seatNumber: randomSeat,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // 3. Send the POST request to the booking endpoint. This is our "hotspot".
  const res = http.post(`${BASE_URL}/api/bookings`, payload, params);

  // 4. Check the response.
  // A successful booking is HTTP 201 (Created).
  // An expected failure is HTTP 409 (Conflict) when two users try for the same seat.
  // Both are considered "correct" system behavior. Any other status is an error.
  const isCorrectBehavior = check(res, {
    'booking successful (201) or seat taken (409)': (r) => r.status === 201 || r.status === 409,
  });

  // 5. Add to our custom error rate ONLY if the behavior was incorrect.
  // This separates system failures from expected business logic conflicts.
  errorRate.add(!isCorrectBehavior);

  // Simulate user "think time" between attempts.
  sleep(randomIntBetween(1, 3));
}

// --- Teardown ---
export function teardown(data) {
  console.log('Test completed.');
}