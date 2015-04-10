﻿$(function(){
	var nodes = [];
	var len = $("#Column .colA").length;
	for(var j = 0; j < len; j++){
		var data = $("#col"+j+" .rowData");
		for(var i = 0; i < data.length; i++){
			var text = data[i].innerHTML;
			var temp = {name:text, group:j};
			//console.log(temp);
			nodes.push(temp);
		}
	}

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
	
	for(var i = 0; i < nodes.length; i++){
		for(var j = i+1; j < nodes.length; j++){
			if( hasRelation(nodes[i].name, nodes[j].name) ){
				var tempE = {source:i, target:j};
				edges.push(tempE);
			}
		}
	}

	var force = d3.layout.force()
					.nodes(nodes)
					.links(edges)
					.size([800,500])
					.linkDistance(100)
					.charge([-500])
					.start();

	var svg = d3.select("#d3")
				.append("svg")
				.attr("width",800)
				.attr("height",500);
	

	
	var svg_edges = svg.selectAll("line")
							.data(edges)
							.enter()
							.append("line")
							.attr("stroke","#ccc")
							.attr("stroke-width",1)
							/* .on("mouseover",function(d,i){
								d3.select(this)
									.attr("stroke","red")
									.attr("stroke-width",3);
							})
							.on("mouseout",function(d,i){
								d3.select(this)
									.attr("stroke","#ccc")
									.attr("stroke-width",1);
							}) */;
	//console.log(edges);	
	var color = d3.scale.category20();
				
	function reset(){
		svg_nodes.each(function(d){
			d.fixed = false;
		})
		var circles = svg.selectAll("circle")
							.attr("r", 10)
							.attr("fill", function(d, i){
								return color(d.group);
							})
							.attr("clicked","false");
		var eds = d3.selectAll("line")
					.attr("stroke","#ccc")
					.attr("stroke-width",1);
	}
	
	function highLightLine(name){
		//console.log(name);
		//console.log(svg_edges);
		for(var i = 0; i < edges.length; i++){
			//console.log(edges[i]);
			if(edges[i].source.name == name || edges[i].target.name == name){
				//console.log(edges[i]);
				//var e = d3.selectAll("line");
				d3.select(svg_edges[0][i])
					.attr("stroke","red")
					.attr("stroke-width",3);
				//console.log(e[0][i]);
				//console.log(e.length);
				//console.log("e:"+e);
			}
		}
	}
	var svg_nodes = svg.selectAll("circle")
							.data(nodes)
							.enter()
							//.append("g")
							.append("circle")
							.attr("r",10)
							.attr("clicked","false")
							.attr("fill",function(d,i){
								return color(d.group);
							})
							.on("click",function(d,i){
								var cir = d3.select(this);
								//console.log(cir.attr("clicked"));
								if(cir.attr("clicked") == "false"){
									reset();
									cir.transition()
										.duration(500)
										.attr("r",20)
										.attr("fill","red")
										.attr("clicked","true");
									d.fixed = true;
									d.x = d.px = 400;
									d.y = d.py = 250;
									highLightLine(d.name);
								}else{
									//reset();
								}	
								console.log("click before");
								force.start();
								console.log("click after");
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
	
	force.on("tick", function(){
		console.log('current tick....')
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