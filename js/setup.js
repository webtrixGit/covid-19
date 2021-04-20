$(document).ready(function(){

    var cases       = null;
    AOS.init();
    $('.top-numbers-header').owlCarousel({
        loop:false,
        nav: false,
        margin:2,
        responsiveClass:true,
        responsive:{
            0:{
                items:2,
                dots:true,
            },
            600:{
                items:3,
                dots:true,
            },
            1000:{
                items:6,
            }
        }
    });

    var ctx = $("#myTesting");
    var mystat = new Chart(ctx,{
        type: "line",
        data: {
        labels: ["21 March 21", "28 March 21","01 Apr 21","04 Apr 21","08 Apr 21","15 Apr 21","17 Apr 21"],
        datasets: [{
            label: 'Positive Rate',
            data: [22.43,26.51,19.84,35.02,29.71,24.61,24.5],
             backgroundColor: [
              '#f4765c',
              '#f98f76',
              '#fda791',
              '#feb39f',
              '#ffcabc'
            ],
            hoverOffset: 4
          }]
        },
        options: {
        responsive:true,
        maintainAspectRatio:true,
        },
        plugins: {
          legend: {
            display:true,
            position: 'bottom',
            align:'left'
          },
        },
        });

    $(window).scroll(function (event) {
    var scroll = $(window).scrollTop();
    var offset = $(".page-body").offset();
    if( 25 < scroll){
        $(".page-header").addClass("scroll");
        //$(".page-header").addClass("sticky");
    }else{
        $(".page-header").removeClass("scroll");
        $//(".page-header").removeClass("sticky");
    }

    });
    $('#accordionExample').on('show.bs.collapse', function (e) {
       //console.log($(e.currentTarget).attr("data-target"));
       dataHandler.init();
    });
    
    /*$("#pieCases").on("click",function(){
     mypie.data =  {labels: ["Male (70%)","Female (30%)"],datasets: [{ label: 'Total Cases', data: [103208,24821], backgroundColor: [ '#FC5563', '#FFBA35',],hoverOffset: 4 }] } ;
     mypie.update();

     mypieAge.data = { labels: ["0-14 (20%)", "15-29 (30%)","30-44 (25%)","45 - 59 (20%)","60+ (30%)"], datasets: [{ label: 'Total Cases', data: [28874,82448,78687,69944,84076], backgroundColor: [ '#f4765c','#f98f76','#fda791','#feb39f','#ffcabc' ], hoverOffset: 4 }] }
     mypieAge.update();
    });
    $("#pieHospitalizations").on("click",function(){
     mypie.data =  {labels: ["Male (70%)","Female (30%)"],datasets: [{ label: 'Total Hospitalizations', data: [33052,14164], backgroundColor: [ '#FC5563', '#FFBA35',],hoverOffset: 4 }] } ;
     mypie.update();

     mypieAge.data = { labels: ["0-14 (20%)", "15-29 (30%)","30-44 (25%)","45 - 59 (20%)","60+ (30%)"], datasets: [{ label: 'Total Hospitalizations', data: [120,336,3800,12344,30616], backgroundColor: [ '#f4765c','#f98f76','#fda791','#feb39f','#ffcabc' ], hoverOffset: 4 }] }
     mypieAge.update();

    })
    $("#pieCriticalCases").on("click",function(){
     mypie.data =  {labels: ["Male (70%)","Female (30%)"],datasets: [{ label: 'Total Critical Cases', data: [8263,3541], backgroundColor: [ '#FC5563', '#FFBA35',],hoverOffset: 4 }] } ;
     mypie.update();

     mypieAge.data = { labels: ["0-14 (20%)", "15-29 (30%)","30-44 (25%)","45 - 59 (20%)","60+ (30%)"], datasets: [{ label: 'Total Critical Cases', data: [30,84,950,3086,7654], backgroundColor: [ '#f4765c','#f98f76','#fda791','#feb39f','#ffcabc' ], hoverOffset: 4 }] }
     mypieAge.update();

    })

    $("#pieDeaths").on("click",function(){
     mypie.data =  {labels: ["Male (70%)","Female (30%)"],datasets: [{ label: 'Total Deaths', data: [3490,1719], backgroundColor: [ '#FC5563', '#FFBA35',],hoverOffset: 4 }] } ;
     mypie.update();

     mypieAge.data = { labels: ["0-14 (20%)", "15-29 (30%)","30-44 (25%)","45 - 59 (20%)","60+ (30%)"], datasets: [{ label: 'Total Deaths', data: [15,42,475,1543,3827], backgroundColor: [ '#f4765c','#f98f76','#fda791','#feb39f','#ffcabc' ], hoverOffset: 4 }] }
     mypieAge.update();

    })*/

    var dataHandler = {
        baseUrl: 'data/',
        puneMap: {
            url: 'pune-electoral-wards_current.geojson',
            data: null,
            dataTransform: function (data) {
                if (data && data.features) {
                    dataHandler.puneMap.data = data.features;
                    dataHandler.load('cases');
                }
            }
        },
        cases: {
            url: 'C-1-ward_map.csv',
            data: null,
            tableData:null,
            dataTransform: function (error, data) {
                if (error) handleErrors('cases', error);
                if (data) {
  
                    dataHandler.cases.data = [];
                    dataHandler.cases.tableData = [];
                    for (var i = 0, len = __cityMapData.length; i < len; i++) {
                        dataHandler.cases.data.push(
                            {
                                wardNo      : +(__cityMapData[i]['ward']),
                                name        : __cityMapData[i]['ward_name'],
                                total       : +__cityMapData[i]['total_case'],
                                active      : +__cityMapData[i]['total_new_case'],
                            }
                            );
                        
                    }
                    for (var i = 0, len = __cityMapDataList.length; i < len; i++) {

                        dataHandler.cases.tableData.push(
                            {
                                Ward_Office_Name: __cityMapDataList[i]['ward_name'],
                                total_Cases       : ++__cityMapDataList[i]['total_case'],
                                Total_New_Cases      : +__cityMapDataList[i]['total_new_case'],
                            }
                        );
                    }
                    
                    $("#covid-active").empty();
                    createTable("covid-active",dataHandler.cases.tableData,'old');
                    dataHandler.cases.data.sort(function(a, b) { return a.wardNo > b.wardNo ? 1 : -1; });
                    $(".activeCasesChart").empty();
                    cases = CityMap().init('cases1', 'total', true, '#511D5C', "test").createMap(dataHandler.puneMap.data, dataHandler.cases.data, ['zone', 'name', 'total', 'active', 'recovered', 'deaths']);
                }
            }
        },
        init: function () {
            this.getUrl.bind(this);
            this.load.bind(this);
            this.load('puneMap');
        },
        getUrl: function (id) {
            return this.baseUrl + this[id].url;
        },
        load: function (id) {
            id = id || 'default';
            switch (id) {
                case 'puneMap':
                    d3.json(this.getUrl('puneMap'), this['puneMap'].dataTransform)
                    break;
                default:
                    d3.csv(this.getUrl(id), this[id].dataTransform);
                    break;
            }
        }
    };
    dataHandler.init();
    $(window).on('resize', function(evt) {
        dataHandler.init();
    });
    


var CityMap = function (h) {
    h = h || .64;

    var wW = d3.select('body').node().getBoundingClientRect().width;
    if(wW < 400) {
        h = 1.1;
    } else if(wW < 600) {
        h = .9;
    } else if(wW < 1200) {
        h = .8;
    }

    var mapObj = {
        h: h,
        tooltip: null,
        wrapper: null,
        svg: null,
        baseGroup: null,
        data: null,
        width: null,
        height: null,
        color: null,
        activeType: null,
        init: function (id, activeType, typeControls, color, titles, isSmall, wrapperClass) {
            var selectedId = d3.select('#' + id);
            this.isSmall = isSmall || false;
            wrapperClass = wrapperClass || '.chart-box';

            this.color = color || '#eee';
            this.titles = titles;
            this.id = id;

            this.wrapper = selectedId.select(wrapperClass);
            this.tooltip = selectedId.select('.data-wiz .color');
            this.width = parseInt($('#' + id).find('.chart-box').width());
            this.height = parseInt(this.width * h);

            this.activeType = activeType;

            if(typeControls) {
                this.typeControls = selectedId.select('.type-control').selectAll('button');
                // this.typeControlsClick.bind(this);
            }

            this.createSvg.bind(this);
            this.setBaseGroup.bind(this);
            this.setSize.bind(this);
            this.createMap.bind(this);
            this.getScale.bind(this);
            this.updateColor.bind(this);
            this.updateTitles.bind(this);

            this.createSvg().setSize().setBaseGroup();
            return this;
        },
        getScale: function () {
            if (this.width < 330) {
                return 70000;
            } else if (this.width < 400) {
                return 72000;
            } else if (this.width < 600) {
                return 106000;
            } else {
                return 110000;
            }
        },
        createSvg: function () {
            this.svg = this.wrapper.append('svg');
            return this;
        },
        setBaseGroup: function () {
            this.baseGroup = this.svg.append('g').attr('class', 'baseGroup');
            return this;
        },
        setSize: function () {
            this.svg.attr('width', this.width).attr('height', this.height);
            return this;
        },
        createMap: function (areaData, data, addHoverData) {
            var that = this;
            this.data = data;

            var min = d3.min(data, function (d) { return +d[that.activeType]; });
            var max = d3.max(data, function (d) { return +d[that.activeType]; });
            var opacityRange = d3.scaleLinear().domain([min, max]).range([20, 100]);

            this.group = this.baseGroup.selectAll("g").data(areaData).enter().append("g");
            var translateX = this.width < 769 ? this.width / 2 - 12 : this.width / 2 - 30;
            var projection = d3.geoMercator().scale(this.getScale()).center([73.856255, 18.516726]).translate([translateX, this.height / 2]);
            var path = d3.geoPath().projection(projection);
            this.prabhags = this.group.append("path").attr("d", path).style('opacity', function (d, i) { return opacityRange(data[i][that.activeType]) / 100; }).style('fill', that.color);
            if (addHoverData.length > 0) {
                for (var i = 0, len = addHoverData.length; i < len; i++) {
                    this.prabhags.attr("data-" + addHoverData[i], function (d, j) { return data[j][addHoverData[i]]; });
                }
            }
            
            this.prabhags.on('mouseenter', function() { that.showTooltip(this, that); });
            this.prabhags.on('click', function() { that.showTooltip(this, that); });
            this.prabhags.on('mouseleave', function() { that.hideTooltip(this, that); });
            if(this.typeControls) {
                this.typeControls.on('click', function(evt) { that.typeControlsClick(this, that); });
            }
            return this;
        },
        updateColor: function() {
            var that = this;
            var min = d3.min(this.data, function (d) { return +d[that.activeType]; });
            var max = d3.max(this.data, function (d) { return +d[that.activeType]; });
            var opacityRange = d3.scaleLinear().domain([min, max]).range([20, 100]);
            this.prabhags.style('opacity', function (d, i) { return opacityRange(that.data[i][that.activeType]) / 100; }).style('fill', that.color);
        },
        typeControlsClick: function(ye, wo) {
            var d3this = d3.select(ye);
            var type = d3this.attr('data-type');
            if(type !== wo.activeType) {
                wo.typeControls.classed('selected', false);
                d3this.classed('selected', true);
                wo.activeType = type;
                wo.updateColor();
                wo.updateTitles();
            }
        },
        showTooltip: function(ye, wo) {
            ye = d3.select(ye);
            if(!wo.tooltip.classed('active')) {
                wo.tooltip.classed('active', true);
                wo.tooltip.select('p').text(ye.attr('data-name'));
                wo.tooltip.select('h1').text(ye.attr('data-' + wo.activeType));
            }
        },
        hideTooltip: function(ye, wo) {
            if(wo.tooltip.classed('active')) {
                wo.tooltip.classed('active', false);
                wo.tooltip.select('p').text('');
                wo.tooltip.select('h1').text('');
            }
        },
        updateTitles: function() {
            if (this.titles && this.titles[this.activeType]) {
                console.log(this.id);
                if(this.titles[this.activeType].heading) {
                    $('#' + this.id).find('header h1').text(this.titles[this.activeType].heading);
                }
                if(this.titles[this.activeType].sub) {
                    $('#' + this.id).find('header h1').text(this.titles[this.activeType].sub);
                }
            }
        }
    };
    return mapObj;
}


});