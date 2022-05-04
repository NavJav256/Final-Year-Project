# Final-Year-Project

## To run code for the board, segger embedded studio is needed. <br/> <br/>
1: Take sdk folder from board folder <br/>
2: place sdk folder in C drive <br/>
3: open the sdk folder -> examples -> ble_peripheral -> ble_app_blinky -> pca10056 -> s140 -> ses <br/>
4: open the .emproject file <br/>
5: build the code, plug in the board via usb micro, erase existing code on the board, download the new code onto the board <br/>
6: repeat for each board if multiple <br/>

## To run code for the app, nodejs is required <br/> <br/>
1: Open visual studio code, select open folder and open the folder called App <br/>
2: Open a terminal within this directory <br/>
3: Run '$ npm install' <br/>
4: Run '$ npm start' <br/>

Note: Bluetooth does not work on simulators. Testing on personal devices can be done, but depending on device can be complicated.
