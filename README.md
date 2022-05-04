# Final-Year-Project

To run code for the board, segger embedded studio is needed.
1: Take sdk folder from board folder
2: place sdk folder in C drive
3: open the sdk folder -> examples -> ble_peripheral -> ble_app_blinky -> pca10056 -> s140 -> ses
4: open the .emproject file
5: build the code, plug in the board via usb micro, erase existing code on the board, download the new code onto the board
6: repeat for each board if multiple

To run code for the app, nodejs is required
1: Open visual studio code, select open folder and open the folder called App
2: Open a terminal within this directory
3: Run '$ npm install'
4: Run '$ npm start'

Note: Bluetooth does not work on simulators. Testing on personal devices can be done, but depending on device can be complicated.