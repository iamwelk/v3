﻿$(function(){
	var data = $("#Column .rowData");
	var nodes = [];
	for(var i = 0; i < data.length; i++){
		var text = data[i].innerHTML;
		data[i] = text;
		var temp = {name:text};
		nodes.push(temp);
	}
	//console.log(data.length);
	//console.log(nodes);
	var edges = [];
	var relationShip = [
		{"姓名":"张三", "产品":"P1"},
		{"姓名":"张三", "技能":"前端"},
		{"姓名":"李四", "产品":"P3"},
		{"姓名":"李四", "产品":"P4"},
		{"姓名":"李四", "技能":"后台"},
		{"姓名":"李四", "技能":"数据库"},
		{"姓名":"王五", "产品":"P2"},
		{"姓名":"王五", "产品":"P4"},
		{"姓名":"王五", "产品":"P5"},
		{"姓名":"王五", "技能":"交互"},
		{"姓名":"王五", "技能":"设计"},
		{"姓名":"张三", "部门":"D1"},
		{"姓名":"李四", "部门":"D2"},
		{"姓名":"王五", "部门":"D3"},
		{"产品":"大数据平台", "数据":"广告数据"},
		{"产品":"大数据平台", "功能":"数据集中存储"},
		//{"所属部门":"D4","人员姓名":"louwk"},
		{"姓名":"张三","产品":"大数据平台"},
		{"产品":"大数据平台", "部门":"D2"}
		//{"产品":"P5","功能":"Web优化"},
		//{"产品":"P6","功能":"Web优化"},
		//{"产品":"P7","功能":"Web优化"},
		//{"产品":"P8","功能":"Web优化"},
		//{"产品":"P9","功能":"Web优化"},
		//{"产品":"P10","功能":"Web优化"},
		//{"产品":"P11","功能":"Web优化"},
		//{"产品":"P12","功能":"Web优化"},
		//{"产品":"P13","功能":"Web优化"},
		//{"产品":"P14","功能":"Web优化"},
		//{"产品":"P15","功能":"Web优化"}
		
		//{"key1":"value1"}
	];
	
	function hasRelation(str1, str2){
		for(var i = 0; i < relationShip.length; i++){
			var arrayOfValue = [];
			for(key in relationShip[i]){				
				arrayOfValue.push(relationShip[i][key]);
			}			
			if((arrayOfValue.indexOf(str1) !== -1) && (arrayOfValue.indexOf(str2) !== -1)){	
				return true;
			}
		}
		return false;
	}
	
	for(var i = 0; i < data.length; i++){
		for(var j = i+1; j < data.length; j++){
			if( hasRelation(data[i], data[j]) ){
				var tempE = {source:i, target:j};
				edges.push(tempE);
				//console.log(data[i] +" "+data[j]);
				//console.log("source:"+tempE.source+" target:"+tempE.target);
			}
		}
	}
	//console.log(edges);
	var force = d3.layout.force()
					.nodes(nodes)
					.links(edges)
					.size([1000,500])
					.linkDistance(300)
					.charge([-200])
					.start();

	var svg = d3.select("#d3")
				.append("svg")
				.attr("width",800)
				.attr("height",500);
	
	//var group = svg.append("g");	
	
	var svg_edges = svg.selectAll("line")
							.data(edges)
							.enter()
							.append("line")
							.style("stroke","#ccc")
							.style("stroke-width",1);
		
	var color = d3.scale.category20();
				
	//var g = svg.append("g");
	var svg_nodes = svg.selectAll("circle")
							.data(nodes)
							.enter()
							//.append("g")
							.append("circle")
							.attr("r",10)
							.style("fill",function(d,i){
								return color(i);
							})
							.call(force.drag);
	
	var node_text = svg.selectAll(".nodetext")
						.data(nodes)
						.enter()
						.append("text")
						.attr("class","nodetext")
						.attr("dx", -20)
						.attr("dy", 20)
						.text(function(d){
							return d.name;
						});
	 /* var text = svg_nodes.append("text")
						.attr("dx", 8)
						.attr("dy", 3)
						.attr("width", 5)
						.attr("height", 5)
						.attr("fill","black")
						.text(function(d){
							//console.log(d.name);
							return d.name;
						});  */
	//console.log(text[0][1].innerHTML);
	force.on("tick", function(){
		
		svg_edges.attr("x1",function(d){ return d.source.x; });
		svg_edges.attr("y1",function(d){ return d.source.y; });
		svg_edges.attr("x2",function(d){ return d.target.x; });
		svg_edges.attr("y2",function(d){ return d.target.y; });
				 
		svg_nodes.attr("cx",function(d){ return d.x; });
		svg_nodes.attr("cy",function(d){ return d.y; });
		
		node_text.attr("x",function(d){ return d.x; });
		node_text.attr("y",function(d){ return d.y; });
	});
});