devvictrix@mark-i:~/personal/projects/thundering-herd-problem$ k6 run --vus 1000 --duration 10m tests/load-test/thundering-herd-problem.js

         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 

     execution: local
        script: tests/load-test/thundering-herd-problem.js
        output: -

     scenarios: (100.00%) 1 scenario, 1000 max VUs, 10m30s max duration (incl. graceful stop):
              * default: 1000 looping VUs for 10m0s (gracefulStop: 30s)

INFO[0000] Setting up test environment... Targeting Event ID: 1  source=console
INFO[0603] Test completed.                               source=console


  █ THRESHOLDS 

    errors
    ✓ 'rate<0.05' rate=0.00%

    http_req_duration
    ✓ 'p(95)<800' p(95)=12.44ms


  █ TOTAL RESULTS 

    checks_total.......: 298423  494.880009/s
    checks_succeeded...: 100.00% 298423 out of 298423
    checks_failed......: 0.00%   0 out of 298423

    ✓ booking successful (201) or seat taken (409)

    CUSTOM
    errors.........................: 0.00%  0 out of 298423

    HTTP
    http_req_duration..............: avg=13.18ms min=346.67µs med=3ms   max=3.87s p(90)=8.92ms p(95)=12.44ms
      { expected_response:true }...: avg=1.89s   min=8.78ms   med=2.13s max=3.84s p(90)=3.06s  p(95)=3.25s  
    http_req_failed................: 99.83% 297923 out of 298423
    http_reqs......................: 298423 494.880009/s

    EXECUTION
    iteration_duration.............: avg=2.01s   min=1s       med=2s    max=6.88s p(90)=3s     p(95)=3s     
    iterations.....................: 298423 494.880009/s
    vus............................: 24     min=24               max=1000
    vus_max........................: 1000   min=1000             max=1000

    NETWORK
    data_received..................: 97 MB  161 kB/s
    data_sent......................: 54 MB  89 kB/s




running (10m03.0s), 0000/1000 VUs, 298423 complete and 0 interrupted iterations
default ✓ [======================================] 1000 VUs  10m0s