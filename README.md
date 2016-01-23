Overtimer
=========

A small OSX MenuBar / Win SystemTray app that calculates overtime based on time entries on letsfreckle.com.
   

Usage
-----

- ```git clone https://github.com/sissbruecker/overtimer```
- Copy *src/app/config.template.js* to *src/app/config.js*
- Configure *src/app/config.js*:
  - Enter your freckle sub-domain and API token
  - Set your work-days / work-time per day
- ```bower install```
- ```npm install```
- ```grunt```
- Executables are generated in *build/overtimer*

Notes on overtime calculation
-----

- If there is **at least one time entry on a work-day**, overtimer adds -(worktime/day) to your daily work total
- It then adds all time entries for that day to the daily total
- If there is **no time entry on a work-day**, overtimer will assume it's a holiday or that you took the day off and does not reduce your daily total
- To **use overtime** you need to have at least on time entry (even if its 0 hours), otherwise overtimer does not reduce your daily total
- If there are time entries on non work-days (e.g. weekends), overtimer just adds them to your daily total, but does not reduce your daily total