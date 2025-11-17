devvictrix@mark-i:~/personal/projects/thundering-herd-problem$ k6 run --vus 500 --duration 5m load-testing/load-test.js

         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 

     execution: local
        script: load-testing/load-test.js
        output: -

     scenarios: (100.00%) 1 scenario, 500 max VUs, 5m30s max duration (incl. graceful stop):
              * default: 500 looping VUs for 5m0s (gracefulStop: 30s)

INFO[0000] Setting up test environment... Targeting Event ID: 1  source=console
INFO[0303] Test completed.                               source=console


  █ THRESHOLDS 

    errors
    ✓ 'rate<0.05' rate=0.00%

    http_req_duration
    ✓ 'p(95)<800' p(95)=11.36ms


  █ TOTAL RESULTS 

    checks_total.......: 74850   247.028571/s
    checks_succeeded...: 100.00% 74850 out of 74850
    checks_failed......: 0.00%   0 out of 74850

    ✓ booking successful (201) or seat taken (409)

    CUSTOM
    errors.........................: 0.00%  0 out of 74850

    HTTP
    http_req_duration..............: avg=11.35ms  min=744.23µs med=3.22ms   max=1.6s  p(90)=7.25ms p(95)=11.36ms
      { expected_response:true }...: avg=738.61ms min=7.24ms   med=945.48ms max=1.6s  p(90)=1.35s  p(95)=1.51s  
    http_req_failed................: 99.33% 74350 out of 74850
    http_reqs......................: 74850  247.028571/s

    EXECUTION
    iteration_duration.............: avg=2.01s    min=1s       med=2s       max=4.63s p(90)=3s     p(95)=3s     
    iterations.....................: 74850  247.028571/s
    vus............................: 4      min=4              max=500
    vus_max........................: 500    min=500            max=500

    NETWORK
    data_received..................: 24 MB  81 kB/s
    data_sent......................: 13 MB  44 kB/s




running (5m03.0s), 000/500 VUs, 74850 complete and 0 interrupted iterations
default ✓ [======================================] 500 VUs  5m0s