// Overall
var list = d3.select('#description')
            .style('margin-left','15vw')
            .style('margin-right','15vw')
            .append('ul')
            .style('font-size', '2rem')
            .style('margin-block-start', '0.5rem')
            .style('margin-block-end', '0.5rem');


// Part 1
var part1 = list.append('li').text('操作說明').style('padding-bottom', '1rem')
                .append('ol').style('padding-left','2rem').style('font-size','1.2rem');
part1.append('li').append('p').text('點選任一個節點，可以看到該年份中的資訊（堆疊長條圖）');
part1.append('li').append('p').text('長條圖可以選擇要以分成年齡來看還是以分成性別來看（預設是以年齡），可以從上方按鈕選取別的，或是回到原本的折線圖');

// Part 2
list.append('li').text('設計說明').style('padding-bottom', '1rem')
    .append('p').text('主要想呈現從2014到2021的失業率變化，所以用折線圖來呈現趨勢變化。在每年的失業率當中也可以從不同角度去分析，這邊想看在各個年齡層以及不同線別當中的失業人口跟就業人口的比例，因此選用堆疊的長條圖。每個年份當中都可以看到該年的堆疊長條圖，可以選擇要以年齡來看還是以性別來看，長條圖中會先呈現每個年齡區段就業人口，然後堆疊上失業人口，就可以很清楚地看到在這個分類中失業人口跟就業人口的比例會是如何。');

// Part 3
list.append('li').text('資料來源').style('padding-bottom', '1rem')
    .append('p')
    .append('a').text('中華民國統計資訊網')
                .attr('href', 'https://www.stat.gov.tw/ct.asp?xItem=37135&ctNode=517&mp=4')
                .attr('target','_blank');


d3.select('#description').selectAll('p')
                        .style('padding-left','1rem')
                        .style('font-size','1.2rem')
                        .style('margin-block-start','0.5em')
                        .style('margin-block-end','0.5em');
