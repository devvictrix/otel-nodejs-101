devvictrix@mark-i:~/personal/projects/thundering-herd-problem$ k6 run --vus 10 --duration 30s load-testing/load-test.js

         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 

     execution: local
        script: load-testing/load-test.js
        output: -

     scenarios: (100.00%) 1 scenario, 10 max VUs, 1m0s max duration (incl. graceful stop):
              * default: 10 looping VUs for 30s (gracefulStop: 30s)

INFO[0000] Setting up test environment... Targeting Event ID: 1  source=console
INFO[0032] Test completed.                               source=console


  █ THRESHOLDS 

    errors
    ✓ 'rate<0.05' rate=0.00%

    http_req_duration
    ✓ 'p(95)<800' p(95)=75.82ms


  █ TOTAL RESULTS 

    checks_total.......: 157     4.856054/s
    checks_succeeded...: 100.00% 157 out of 157
    checks_failed......: 0.00%   0 out of 157

    ✓ booking successful (201) or seat taken (409)

    CUSTOM
    errors.........................: 0.00%  0 out of 157

    HTTP
    http_req_duration..............: avg=17.95ms min=1.59ms med=14.08ms max=84.64ms p(90)=22.69ms p(95)=75.82ms
      { expected_response:true }...: avg=20.03ms min=7.83ms med=15.14ms max=84.64ms p(90)=23.87ms p(95)=77.06ms
    http_req_failed................: 13.37% 21 out of 157
    http_reqs......................: 157    4.856054/s

    EXECUTION
    iteration_duration.............: avg=1.98s   min=1s     med=2.01s   max=3.08s   p(90)=3.01s   p(95)=3.02s  
    iterations.....................: 157    4.856054/s
    vus............................: 2      min=2         max=10
    vus_max........................: 10     min=10        max=10

    NETWORK
    data_received..................: 55 kB  1.7 kB/s
    data_sent......................: 28 kB  864 B/s




running (0m32.3s), 00/10 VUs, 157 complete and 0 interrupted iterations
default ✓ [======================================] 10 VUs  30s