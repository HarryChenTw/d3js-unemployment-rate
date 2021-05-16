# d3js-data-visualization-unemployment-rate
This is a **interactive website** visualizing unemployment rate in Taiwan using Javascript library d3js.


## Website Present
### 1. At first, it contains a line chart 
This line chart represent the trend of unemployment rate during 2014 - 2021.
![1](/website-gif/1.gif) 

### 2.  Click any node in line chart
It will zoom in to a detail view in the selected year which is a stacked bar chart. Here present the the distribution of population by age for both Employment and Unemployment. 
![2](/website-gif/2.gif) 
### 3. Click the button above
You can change the view either by age or by gender. Or you can just click **back** button to get back to original line chart. 
![3](/website-gif/3.gif) 
![4](/website-gif/4.gif) 
## Dependency
* d3js v6
```
<script src="https://d3js.org/d3.v6.js"></script>
```

## Data Acquisition
Data is download from [National Statistics, ROC](https://www.stat.gov.tw/ct.asp?xItem=37135&ctNode=517&mp=4), and process manually to target .json format.
