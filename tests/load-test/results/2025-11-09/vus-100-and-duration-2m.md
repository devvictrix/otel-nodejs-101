devvictrix@mark-i:~/personal/projects/thundering-herd-problem$ k6 run --vus 100 --duration 2m load-test
ing/load-test.js

         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 

     execution: local
        script: load-testing/load-test.js
        output: -

     scenarios: (100.00%) 1 scenario, 100 max VUs, 2m30s max duration (incl. graceful stop):
              * default: 100 looping VUs for 2m0s (gracefulStop: 30s)
INFO[0123] Test completed.                               source=console


  █ THRESHOLDS 

    errors
    ✓ 'rate<0.05' rate=0.00%

    http_req_duration
    ✓ 'p(95)<800' p(95)=18.7ms


  █ TOTAL RESULTS 

    checks_total.......: 6050    49.192357/s
    checks_succeeded...: 100.00% 6050 out of 6050
    checks_failed......: 0.00%   0 out of 6050

    ✓ booking successful (201) or seat taken (409)

    CUSTOM
    errors.........................: 0.00%  0 out of 6050

    HTTP
    http_req_duration..............: avg=13.15ms  min=1.26ms med=3.57ms  max=669.27ms p(90)=11.61ms  p(95)=18.7ms  
      { expected_response:true }...: avg=100.15ms min=7.81ms med=18.44ms max=669.27ms p(90)=431.93ms p(95)=520.05ms
    http_req_failed................: 91.73% 5550 out of 6050
    http_reqs......................: 6050   49.192357/s

    EXECUTION
    iteration_duration.............: avg=2s       min=1s     med=2s      max=3.67s    p(90)=3s       p(95)=3s      
    iterations.....................: 6050   49.192357/s
    vus............................: 1      min=1            max=100
    vus_max........................: 100    min=100          max=100

    NETWORK
    data_received..................: 2.0 MB 16 kB/s
    data_sent......................: 1.1 MB 8.8 kB/s




running (2m03.0s), 000/100 VUs, 6050 complete and 0 interrupted iterations
default ✓ [======================================] 100 VUs  2m0s