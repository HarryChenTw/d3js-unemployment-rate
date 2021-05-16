var margin = ({top: 50, right: 200, bottom: 70, left: 200});
var height = 400;
var width = 1000;
var color = ['#6a91b9','#b54f5f'];

Promise.all([
    d3.csv("data/unemployment_rate.csv"),
    d3.csv("data/by_age.csv"),
    d3.csv("data/by_gender.csv")
]).then(function(data) {
    console.log(data);
    // Title
    title = d3.select('#title')
              .style('height','10vh')
              .style('width', '100vw')
              .append('h1')
              .style('text-align', 'center')
              .style('font-size', '3rem')
              .text('失業率');

    // Chart
    whole_chart_part = d3.select('div#chart_part');
                            //.style('background-color','#bbc2d3');
    svg = d3.select('div#chart_part')
          .append('svg')
          .attr("viewBox", [0, 0, width, height]);
    xAxisSvg = svg.append('g').attr('id','xAxis');
    yAxisSvg = svg.append('g').attr('id','yAxis');
    xAxisLable = svg.append('text').attr('id','xAxisLabel');
    yAxisLable = svg.append('text').attr('id','yAxisLabel');
    svg.append('g').attr('id','chartLabel');
    svg.append('g').attr('id','btn');
    // plot chart
    line_chart(data);
});

async function line_chart(data){
    var all_data = data
    var data = data[0]
    var color = '#257e62';

    var xScale = await d3.scaleBand()
                        .domain(data.map((d) => d['Year']))
                        .range([margin.left, width - margin.right])
                        .round(true);
    var yScale = await d3.scaleLinear()
                   .domain([3, d3.max(data, function(d){ return Number(d['Unemployment Rate']);}) +1])
                   .range([height - margin.bottom, margin.top]);

    // Title part
    title.transition().text('失業率');


    // Axis Part
    var xAxis = g => g
             .attr("transform", `translate(0,${height - margin.bottom})`)
             .call(d3.axisBottom(xScale))
             .attr("font-size", "14px");
    var yAxis = g => g
              .attr("transform", `translate(${margin.left},0)`)
              .call(d3.axisLeft(yScale))
              .attr("font-size", "14px");
    xAxisSvg.attr("transform", `translate(0,${height})`)
            .transition().duration(750).call(await xAxis);
    yAxisSvg.attr("transform", `translate(${margin.left/2},0)`)
            .transition().duration(750).call(await yAxis);


    // Axis Label Part
    var x_label_text = '年(西元)'
    var y_label_text = '失業率(%)'
    var xLabel = text => text
                .text(x_label_text)
                .attr('style','text-anchor:end; font-size: 14px')
                .attr("transform", `translate(${width - margin.right},${height - margin.bottom/3})`);
    var yLabel = text => text
                .text(y_label_text)
                .attr('style','text-anchor:end; font-size: 14px')
                .attr("transform", `translate(${margin.left*3/4},${margin.top}) rotate(-90)`);
    xAxisLable.attr("transform", `translate(${width - margin.right},${height})`)
              .transition().duration(750).call(await xLabel);
    yAxisLable.attr("transform", `translate(${margin.left/2},${margin.top}) rotate(-90)`)
              .transition().duration(750).call(await yLabel);

    // Line Part
    await svg.select("#chart").remove();
    var line = await d3.line()
                        .x((d) => xScale(d['Year']))
                        .y((d) => yScale(d['Unemployment Rate']))
    svg.append('path')
      .attr('id', 'chart')
      .attr("transform", `translate(${xScale.bandwidth() / 2},0)`)
      .transition().duration(750)
      .attr('d', line(data))
      .attr('fill', 'none')
      .attr('stroke-width',5)
      .attr('stroke', color);

    var circles = svg.append('g')
                    .attr('id', 'chart')
                    .attr("transform", `translate(${xScale.bandwidth() / 2},0)`)
                    .selectAll('circle')
                    .data(data)
                    .enter().append('circle')
                      .attr("cx", d=> xScale(d['Year']))
                      .attr("cy", d=> yScale(d['Unemployment Rate']))
                      .attr('id', d=>d['Year']);
    circles.transition().duration(750).attr("r", "8");
    circles.on('mouseover', function(d, i){
        d3.select(this).transition().attr("r", "15");
    }).on('mouseout', function(d, i){
        d3.select(this).transition().attr("r", "8");
    }).on('click', function(d, i){
        age_bar_chart(all_data, d.target.id);
    });

    // Chart Label
    await d3.select('#chartLabel').remove()
    svg.append('g').attr('id','chartLabel')

    // Button Label
    await d3.select('#btn').remove()
    svg.append('g').attr('id','btn')
};

async function age_bar_chart(data, year){
    var all_data = data
    var data  = data[1]
    // filter out target data
    data_target = new Array();
    data_target.columns = data.columns;
    for(var i in data){
        if(data[i]['Year'] == year){
            data_target.push(data[i]);
        }
    };
    data = await data_target;

    var xScale = await d3.scaleBand()
        .domain(data.map(d => d['Age']))
        .range([margin.left, width - margin.right])
        .padding(0.2);
    var yScale = await d3.scaleLinear()
      .domain([0, d3.max(data, function(d){ return Number(d['Employment'])+Number(d['Unemployment']);} )]).nice()
      .range([height - margin.bottom, margin.top]);

    // Title part
    title.transition().text(`${year}年的就業及失業人數`);

    // Axis Part
    var xAxis = g=>g
         .call(d3.axisBottom(xScale).tickSizeOuter(0))
         .attr("font-size", "14px");
    var yAxis = g => g
         .attr("transform", `translate(${margin.left},0)`)
         .call(d3.axisLeft(yScale))
         .attr("font-size", "14px");
     xAxisSvg.transition().duration(750).call(await xAxis);
     yAxisSvg.transition().duration(500).call(await yAxis);


     // Axis Label Part
     var x_label_text = '年齡區段'
     var y_label_text = '人數(千人)'
     var xLabel = text => text
                 .text(x_label_text)
                 .attr('style','text-anchor:end; font-size: 14px')
                 .attr("transform", `translate(${width - margin.right},${height - margin.bottom/3})`);
     var yLabel = text => text
                 .text(y_label_text)
                 .attr('style','text-anchor:end; font-size: 14px')
                 .attr("transform", `translate(${margin.left*3/4 -10},${margin.top}) rotate(-90)`);
     xAxisLable.transition().duration(750).call(await xLabel);
     yAxisLable.transition().duration(750).call(await yLabel);


     // first delete original bar, then build new
     await svg.selectAll("#chart").remove();
     var subgroups_age = await data.columns.slice(1,3);
     var stackedData_age = await d3.stack()
      .keys(subgroups_age)(data);
     var color_trans = await d3.scaleOrdinal()
                              .domain(subgroups_age)
                              .range(color);
     svg.append('g')
          .attr('id','chart')
          .selectAll("g")
          // Enter in the stack data = loop key per key = group per group
          .data(stackedData_age)
          .enter().append("g")
          .attr("fill", function(d){ return color_trans(d.key); })
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(function(d) {return d;})
            .enter().append("rect")
            .attr('x', d => xScale(d.data['Age']))
            .attr('y', d => yScale(0))
            .attr("width", xScale.bandwidth())
            .attr("class", 'bar')
            .transition().duration(750)
            .attr('y', d => yScale(d[1]))
            .attr("height", d => yScale(d[0]) - yScale(d[1]));

      // Chart Label Part
      // this part is operate manually, looking for a automatic method
      var label_width = 15;
      var label_height = 15;
      var space = 3;
      await d3.select('#chartLabel').remove()
      var chartLable = await svg.append('g').attr('id','chartLabel');
      chartLable.append('rect')
                .attr("transform", `translate(${width*2/3},${margin.top - label_height})`)
                .attr('fill',color[0])
                .attr('width',label_width)
                .attr('height',label_height);
      chartLable.append('text').text('就業人數')
                .attr('style','text-anchor: start; font-size: 14px')
                .attr("transform", `translate(${width*2/3 + label_width + space},${margin.top - 2})`);
      chartLable.append('rect')
                .attr("transform", `translate(${width*2/3 + label_width + 70},${margin.top - label_height})`)
                .attr('fill',color[1])
                .attr('width',label_width)
                .attr('height',label_height);
      chartLable.append('text').text('失業人數')
                .attr('style','text-anchor: start; font-size: 14px')
                .attr("transform", `translate(${width*2/3 + label_width + 70 + label_width + space},${margin.top - 2})`);

      // Button Part
      var btn_width = 50;
      var btn_height = 30;
      var btn_hmargin = 15;
      var btn_vmargin = 15;
      var btn_style = 'fill:None; stroke-width:1.5; stroke:rgb(0,0,0)';
      d3.select('#btn').remove()
      svg.append('g').attr('id', 'btn')
      var btn = d3.select('#btn');
      var age_btn = btn.append('g').attr('id','age_btn');
      age_btn.append('rect')
              .attr('x', margin.left + btn_hmargin).attr('y', btn_vmargin)
              .attr('width', btn_width).attr('height', btn_height)
              .attr('style', 'fill : rgb(0,0,0)');
      age_btn.append('text').text('年齡')
              .attr('x', margin.left + btn_hmargin + btn_width/5).attr('y', btn_vmargin+btn_height*2/3)
              .attr('font-size', 14).attr('fill', 'rgb(255,255,255)');

      var gender_btn = btn.append('g').attr('id','gender_btn');
      gender_btn.append('rect')
              .attr('x', margin.left + btn_hmargin*2 + btn_width).attr('y', btn_vmargin)
              .attr('width', btn_width).attr('height', btn_height)
              .attr('style', btn_style);
      gender_btn.append('text').text('性別')
              .attr('x', margin.left + btn_width/5 + btn_hmargin*2 + btn_width).attr('y', btn_vmargin+btn_height*2/3)
              .attr('font-size', 14).attr('fill', 'rgb(0,0,0)');

      var back_btn = btn.append('g').attr('id','back_btn');
      back_btn.append('rect')
              .attr('x', margin.left + btn_hmargin*3 + btn_width*2).attr('y', btn_vmargin)
              .attr('width', btn_width).attr('height', btn_height)
              .attr('style', btn_style);
      back_btn.append('text').text('BACK')
              .attr('x', margin.left + btn_width/8 + btn_hmargin*3 + btn_width*2).attr('y', btn_vmargin+btn_height*2/3)
              .attr('font-size', 14).attr('fill', 'rgb(0,0,0)');

      gender_btn.on('mouseover', function(d, i){
          d3.select(this).select('rect').transition().attr("style", "fill:rgb(0,0,0)");
          d3.select(this).select('text').transition().duration(100).attr('fill', 'rgb(255,255,255)');
        }).on('mouseout', function(d, i){
            d3.select(this).select('rect').transition().attr("style", btn_style);
            d3.select(this).select('text').transition().attr('font-size', 14).attr('fill', 'rgb(0,0,0)');
        }).on('click', function(d, i){
          gender_bar_chart(all_data, year);
      });
      back_btn.on('mouseover', function(d, i){
          d3.select(this).select('rect').transition().attr("style", "fill:rgb(0,0,0)");
          d3.select(this).select('text').transition().duration(100).attr('fill', 'rgb(255,255,255)');
        }).on('mouseout', function(d, i){
            d3.select(this).select('rect').transition().attr("style", btn_style);
            d3.select(this).select('text').transition().attr('font-size', 14).attr('fill', 'rgb(0,0,0)');
        }).on('click', function(d, i){
          line_chart(all_data);
      });
};

async function gender_bar_chart(data, year){
  var all_data = data
  var data  = data[2]
  // filter out target data
  data_target = new Array();
  data_target.columns = data.columns;
  for(var i in data){
      if(data[i]['Year'] == year){
          data_target.push(data[i]);
      }
  };
  data = await data_target;

  var xScale = await d3.scaleBand()
      .domain(data.map(d => d['Gender']))
      .range([margin.left, width - margin.right])
      .padding(0.5);
  var yScale = await d3.scaleLinear()
    .domain([0, d3.max(data, function(d){ return Number(d['Employment'])+Number(d['Unemployment']);} )]).nice()
    .range([height - margin.bottom, margin.top]);

  // Title part
  title.transition().text(`${year}年的就業及失業人數`);

  // Axis Part
  var xAxis = g=>g
       .call(d3.axisBottom(xScale).tickSizeOuter(0))
       .attr("font-size", "14px");
  var yAxis = g => g
       .attr("transform", `translate(${margin.left},0)`)
       .call(d3.axisLeft(yScale))
       .attr("font-size", "14px");
   xAxisSvg.transition().duration(750).call(await xAxis);
   yAxisSvg.transition().duration(500).call(await yAxis);


   // Axis Label Part
   var x_label_text = '性別'
   var y_label_text = '人數(千人)'
   var xLabel = text => text
               .text(x_label_text)
               .attr('style','text-anchor:end; font-size: 14px')
               .attr("transform", `translate(${width - margin.right},${height - margin.bottom/3})`);
   var yLabel = text => text
               .text(y_label_text)
               .attr('style','text-anchor:end; font-size: 14px')
               .attr("transform", `translate(${margin.left*3/4 -10},${margin.top}) rotate(-90)`);
   xAxisLable.transition().duration(750).call(await xLabel);
   yAxisLable.transition().duration(750).call(await yLabel);


   // first delete original bar, then build new
   await svg.selectAll("#chart").remove();
   var subgroups_age = await data.columns.slice(1,3);
   var stackedData_age = await d3.stack()
    .keys(subgroups_age)(data);
   var color_trans = await d3.scaleOrdinal()
                            .domain(subgroups_age)
                            .range(color);
   svg.append('g')
        .attr('id','chart')
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData_age)
        .enter().append("g")
        .attr("fill", function(d){ return color_trans(d.key); })
          .selectAll("rect")
          // enter a second time = loop subgroup per subgroup to add all rectangles
          .data(function(d) {return d;})
          .enter().append("rect")
          .attr('x', d => xScale(d.data['Gender']))
          .attr('y', d => yScale(0))
          .attr("width", xScale.bandwidth())
          .attr("class", 'bar')
          .transition().duration(750)
          .attr('y', d => yScale(d[1]))
          .attr("height", d => yScale(d[0]) - yScale(d[1]));

    // Chart Label Part
    // this part is operate manually, looking for a automatic method
    var label_width = 15;
    var label_height = 15;
    var space = 3;
    await d3.select('#chartLabel').remove()
    var chartLable = await svg.append('g').attr('id','chartLabel');
    chartLable.append('rect')
              .attr("transform", `translate(${width*2/3},${margin.top - label_height})`)
              .attr('fill',color[0])
              .attr('width',label_width)
              .attr('height',label_height);
    chartLable.append('text').text('就業人數')
              .attr('style','text-anchor: start; font-size: 14px')
              .attr("transform", `translate(${width*2/3 + label_width + space},${margin.top - 2})`);
    chartLable.append('rect')
              .attr("transform", `translate(${width*2/3 + label_width + 70},${margin.top - label_height})`)
              .attr('fill',color[1])
              .attr('width',label_width)
              .attr('height',label_height);
    chartLable.append('text').text('失業人數')
              .attr('style','text-anchor: start; font-size: 14px')
              .attr("transform", `translate(${width*2/3 + label_width + 70 + label_width + space},${margin.top - 2})`);

    // Button Part
    var btn_width = 50;
    var btn_height = 30;
    var btn_hmargin = 15;
    var btn_vmargin = 15;
    var btn_style = 'fill:None; stroke-width:1.5; stroke:rgb(0,0,0)';
    d3.select('#btn').remove()
    svg.append('g').attr('id', 'btn')
    var btn = d3.select('#btn');
    var age_btn = btn.append('g').attr('id','age_btn');
    age_btn.append('rect')
            .attr('x', margin.left + btn_hmargin).attr('y', btn_vmargin)
            .attr('width', btn_width).attr('height', btn_height)
            .attr('style', btn_style);
    age_btn.append('text').text('年齡')
            .attr('x', margin.left + btn_hmargin + btn_width/5).attr('y', btn_vmargin+btn_height*2/3)
            .attr('font-size', 14).attr('fill', 'rgb(0,0,0)');

    var gender_btn = btn.append('g').attr('id','gender_btn');
    gender_btn.append('rect')
            .attr('x', margin.left + btn_hmargin*2 + btn_width).attr('y', btn_vmargin)
            .attr('width', btn_width).attr('height', btn_height)
            .attr('style', 'fill : rgb(0,0,0)');
    gender_btn.append('text').text('性別')
            .attr('x', margin.left + btn_width/5 + btn_hmargin*2 + btn_width).attr('y', btn_vmargin+btn_height*2/3)
            .attr('font-size', 14).attr('fill', 'rgb(255,255,255)');

    var back_btn = btn.append('g').attr('id','back_btn');
    back_btn.append('rect')
            .attr('x', margin.left + btn_hmargin*3 + btn_width*2).attr('y', btn_vmargin)
            .attr('width', btn_width).attr('height', btn_height)
            .attr('style', btn_style);
    back_btn.append('text').text('BACK')
            .attr('x', margin.left + btn_width/8 + btn_hmargin*3 + btn_width*2).attr('y', btn_vmargin+btn_height*2/3)
            .attr('font-size', 14).attr('fill', 'rgb(0,0,0)');

    age_btn.on('mouseover', function(d, i){
        d3.select(this).select('rect').transition().attr("style", "fill:rgb(0,0,0)");
        d3.select(this).select('text').transition().duration(100).attr('fill', 'rgb(255,255,255)');
      }).on('mouseout', function(d, i){
          d3.select(this).select('rect').transition().attr("style", btn_style);
          d3.select(this).select('text').transition().attr('font-size', 14).attr('fill', 'rgb(0,0,0)');
      }).on('click', function(d, i){
        age_bar_chart(all_data,year);
    });
    back_btn.on('mouseover', function(d, i){
        d3.select(this).select('rect').transition().attr("style", "fill:rgb(0,0,0)");
        d3.select(this).select('text').transition().duration(100).attr('fill', 'rgb(255,255,255)');
      }).on('mouseout', function(d, i){
          d3.select(this).select('rect').transition().attr("style", btn_style);
          d3.select(this).select('text').transition().attr('font-size', 14).attr('fill', 'rgb(0,0,0)');
      }).on('click', function(d, i){
        line_chart(all_data);
    });
};
