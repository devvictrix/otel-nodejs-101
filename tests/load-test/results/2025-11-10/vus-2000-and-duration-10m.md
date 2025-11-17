devvictrix@mark-i:~/personal/projects/thundering-herd-problem$ k6 run --vus 2000 --duration 10m tests/l
oad-test/thundering-herd-problem.js

         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 

     execution: local
        script: tests/load-test/thundering-herd-problem.js
        output: -

     scenarios: (100.00%) 1 scenario, 2000 max VUs, 10m30s max duration (incl. graceful stop):
              * default: 2000 looping VUs for 10m0s (gracefulStop: 30s)


INFO[0603] Test completed.                               source=console


  █ THRESHOLDS 

    errors
    ✓ 'rate<0.05' rate=0.00%

    http_req_duration
    ✓ 'p(95)<800' p(95)=18.45ms


  █ TOTAL RESULTS 

    checks_total.......: 593319  983.923349/s
    checks_succeeded...: 100.00% 593319 out of 593319
    checks_failed......: 0.00%   0 out of 593319

    ✓ booking successful (201) or seat taken (409)

    CUSTOM
    errors.........................: 0.00%  0 out of 593319

    HTTP
    http_req_duration..............: avg=22.62ms min=332.07µs med=3.39ms max=3.13s p(90)=11.7ms p(95)=18.45ms
      { expected_response:true }...: avg=1.38s   min=5.49ms   med=1.31s  max=2.49s p(90)=1.85s  p(95)=2s     
    http_req_failed................: 99.91% 592819 out of 593319
    http_reqs......................: 593319 983.923349/s

    EXECUTION
    iteration_duration.............: avg=2.02s   min=1s       med=2s     max=6.13s p(90)=3s     p(95)=3.01s  
    iterations.....................: 593319 983.923349/s
    vus............................: 103    min=103              max=2000
    vus_max........................: 2000   min=2000             max=2000

    NETWORK
    data_received..................: 193 MB 321 kB/s
    data_sent......................: 107 MB 177 kB/s




running (10m03.0s), 0000/2000 VUs, 593319 complete and 0 interrupted iterations
default ✓ [======================================] 2000 VUs  10m0s