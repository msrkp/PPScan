# PPScan


Client Side Protype pollution Scanner

<!-- 

<img src="https://github.com/msrkp/PPScan/blob/main/images/example1.png" width="500"/>


<img src="https://github.com/msrkp/PPScan/blob/main/images/example0.png" width="500"/> -->


### How to use?
<ol>
    <li>Clone the repo</li>
    <li>Install addon
    
   * In chrome,
   * Go to More Tools -> Extenstions 
   * Enable Developer Mode 
   * Click on "Load unpacked" and select the cloned repo folder. 

  </li> 
  <li>Visit the websites you want to test</li>
</ol>


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

