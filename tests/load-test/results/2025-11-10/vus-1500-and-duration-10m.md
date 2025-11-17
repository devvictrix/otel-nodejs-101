devvictrix@mark-i:~/personal/projects/thundering-herd-problem$ k6 run --vus 1500 --duration 10m tests/load-test/thundering-herd-problem.js

         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 

     execution: local
        script: tests/load-test/thundering-herd-problem.js
        output: -

     scenarios: (100.00%) 1 scenario, 1500 max VUs, 10m30s max duration (incl. graceful stop):
              * default: 1500 looping VUs for 10m0s (gracefulStop: 30s)

INFO[0000] Setting up test environment... Targeting Event ID: 1  source=console
INFO[0603] Test completed.                               source=console


  █ THRESHOLDS 

    errors
    ✓ 'rate<0.05' rate=0.00%

    http_req_duration
    ✓ 'p(95)<800' p(95)=12.4ms


  █ TOTAL RESULTS 

    checks_total.......: 447966  742.864152/s
    checks_succeeded...: 100.00% 447966 out of 447966
    checks_failed......: 0.00%   0 out of 447966

    ✓ booking successful (201) or seat taken (409)

    CUSTOM
    errors.........................: 0.00%  0 out of 447966

    HTTP
    http_req_duration..............: avg=9.22ms min=328.94µs med=3.1ms max=2.08s p(90)=9.33ms p(95)=12.4ms
      { expected_response:true }...: avg=1.27s  min=4.92ms   med=1.29s max=2.08s p(90)=1.67s  p(95)=1.79s 
    http_req_failed................: 99.88% 447466 out of 447966
    http_reqs......................: 447966 742.864152/s

    EXECUTION
    iteration_duration.............: avg=2.01s  min=1s       med=2s    max=5.11s p(90)=3s     p(95)=3s    
    iterations.....................: 447966 742.864152/s
    vus............................: 16     min=16               max=1500
    vus_max........................: 1500   min=1500             max=1500

    NETWORK
    data_received..................: 146 MB 242 kB/s
    data_sent......................: 81 MB  134 kB/s




running (10m03.0s), 0000/1500 VUs, 447966 complete and 0 interrupted iterations
default ✓ [======================================] 1500 VUs  10m0s