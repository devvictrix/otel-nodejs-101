WARN[0376] Request Failed                                error="Post \"http://localhost:8080/api/bookings\": EOF"
WARN[0376] Request Failed                                error="Post \"http://localhost:8080/api/bookings\": EOF"
WARN[0376] Request Failed                                error="Post \"http://localhost:8080/api/bookings\": EOF"
WARN[0376] Request Failed                                error="Post \"http://localhost:8080/api/bookings\": EOF"
WARN[0376] Request Failed                                error="Post \"http://localhost:8080/api/bookings\": EOF"
WARN[0376] Request Failed                                error="Post \"http://localhost:8080/api/bookings\": EOF"
WARN[0376] Request Failed                                error="Post \"http://localhost:8080/api/bookings\": EOF"
WARN[0376] Request Failed                                error="Post \"http://localhost:8080/api/bookings\": EOF"
WARN[0376] Request Failed                                error="Post \"http://localhost:8080/api/bookings\": EOF"
WARN[0376] Request Failed                                error="Post \"http://localhost:8080/api/bookings\": EOF"
WARN[0376] Request Failed                                error="Post \"http://localhost:8080/api/bookings\": EOF"
WARN[0376] Request Failed                                error="Post \"http://localhost:8080/api/bookings\": EOF"
WARN[0376] Request Failed                                error="Post \"http://localhost:8080/api/bookings\": EOF"
INFO[0603] Test completed.                               source=console


  █ THRESHOLDS 

    errors
    ✓ 'rate<0.05' rate=0.18%

    http_req_duration
    ✓ 'p(95)<800' p(95)=79.11ms


  █ TOTAL RESULTS 

    checks_total.......: 288705 478.772284/s
    checks_succeeded...: 99.81% 288163 out of 288705
    checks_failed......: 0.18%  542 out of 288705

    ✗ booking successful (201) or seat taken (409)
      ↳  99% — ✓ 288163 / ✗ 542

    CUSTOM
    errors.........................: 0.18%  542 out of 288705

    HTTP
    http_req_duration..............: avg=56.05ms min=0s    med=4.73ms  max=9.22s    p(90)=27.53ms  p(95)=79.11ms 
      { expected_response:true }...: avg=57.81ms min=7.8ms med=31.56ms max=277.26ms p(90)=173.13ms p(95)=236.43ms
    http_req_failed................: 99.82% 288205 out of 288705
    http_reqs......................: 288705 478.772284/s

    EXECUTION
    iteration_duration.............: avg=2.08s   min=1s    med=2s      max=26.13s   p(90)=3s       p(95)=3.02s   
    iterations.....................: 288705 478.772284/s
    vus............................: 26     min=26               max=1000
    vus_max........................: 1000   min=1000             max=1000

    NETWORK
    data_received..................: 94 MB  156 kB/s
    data_sent......................: 52 MB  86 kB/s




running (10m03.0s), 0000/1000 VUs, 288705 complete and 0 interrupted iterations
default ✓ [======================================] 1000 VUs  10m0s