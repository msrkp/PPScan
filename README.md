# PPScan


Client Side Protype pollution Scanner

<!-- 

<img src="https://github.com/msrkp/PPScan/blob/main/images/example1.png" width="500"/>


<img src="https://github.com/msrkp/PPScan/blob/main/images/example0.png" width="500"/> -->


### How to use?
* Clone the repo
* Temporaty install
   * In Firefox, go to `about:debugging#/runtime/this-firefox`
   * Click on "Load temporaty add-on" and select `manifest.json` from the cloned repo folder. 
* Persistent install
  * Build `npm install --global web-ext` & `web-ext build` or `npx web-ext build`
  * After executing commands, an extension file should appear in ./web-ext-artifacts/ppscan-{Version number}.zip 
  * To install an extension from a file, switch `xpinstall.signatures.required parameter` to `false` in Firefox on `about:config` page.
  * Click "Install add-on from file" on `about:addons` page and select ppscan-{Version number}.zip 
* Visit the websites you want to test

It only checks for vulnerable location parsers.

### Examples
1. https://msrkp.github.io/pp/1.html
2. https://msrkp.github.io/pp/2.html



### Why window mode?
Window mode is useful when the application uses frame busting.
#### Example
https://msrkp.github.io/pp/3.html

#### Note
If, you see XFO or CSP errors reload the extension. 
Extension tested on chrome version 86.

### Found PP? What's Next?
Check for the gadgets here https://github.com/BlackFan/client-side-prototype-pollution

