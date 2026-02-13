---
title: "Esp32 Rust Adventures"
date: 2025-08-26T15:50:06-04:00
draft: true
---

Exploring the world of ESP32 and Rust
I'm always doing stuff. I ought to document it more and share it in hopes of inspiring other people to follow their dreams with discipline and writing. I find it reassuring when you hit a few milestones on a project and are able to look back and observe what you and your mind have been able to accomplish with focus, curiosity and dedication.

I been making fruit wine with my father for the past two years. He takes of the brewing, I take care of the bottling.  <Out of the hobby> I've been working on a few projects to improve the wine making process. Such as starting a photo log, I even asked an LLM how to start a proper notebook but never got around it(here's the chat). It got me thinking What if I take the temperature of the storage rooms using one of the inexpensive ESP32 chips that have WiFi. Here's how I went about it:
PLan:
1. Buy an inexpensive ESP32 toolkit(Insert affiliate link). That way you get a few useful things like a breadboard.
2. Start easy with the provided examples. Very easy to do, used Arduino IDE.
3. Tried a few mix of temperature project and mini OLED project using PlatformIO. Very interesting technlogy that brings embedded microcontrollers to vscode and moderm times.
4. The libraries feel rather clunky and limited. So I decided to try embedded Rust.
5. Found these amazing books:
6. And the found a gem that just hit my spot. I was about to Give up when I thankfully found this. Could be improved with containers setup for  a exact replica API. For me, it worked cause i was close enough but basically had to join the rust embedded matrix chat to fix a few issues: Here's the link to that project.
7. Yes, LLMs are awesome but have you heard that using embassy you need no OS. That is powerful innovation in the embedded world. It allows a driven maker to a new avenue to create.
8. I came to the realization(probably at betwwen step 3 and 4) that we actually don't need a webserver. Just some sort of publish/suscribe architecture where each esp32 is able to send the data to a central location. Ideally, this packets would be sent using mTLS or even wireguard. Rust enables all this possiblities for me. I thought a central agent using my old My RaspberryPi 3 Model would be the best bet. But the Pie is showing it's age, it won't connect to wifi. So I'm thinking about buying a new model but they are kind of expensive(and overpowered). What if somehow this could all be solve with ESP32s working together each sending temp, each sharing little bits of data between each other(maybe zigbee, need to look into that)
~for the simple stuff that I
want to accomplish~. Taking temperature and humidity measurements and sending them securely to a timeseries DB.

# September
