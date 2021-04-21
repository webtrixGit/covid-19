var __cityMapData = [];
var __cityMapDataList = [];
var __gov_hospital_use_Details = [];
var __medicine_use_Details = [];
var __vaccination_Details = [];
var __demographic_Details = [];
var __controlling_spread = [];
var __demographic_Details_All=[];
var __demographic_Details_MF=[];
var __comorbidity_Details=[];
var __vaccination_DetailsWeek=[];
var __date="";
var _yesterday_active = 54696;
var _yesterday_deaths = 54;
var _yesterday_recovered = 310965;
var _yesterday_positive_rate =21.96;
var _yesterday_vcc = 691927;
var _WeeklyDate = "16 April 21";



function createTable(el,data,type){
        if(type == "new"){
            
            var tableHeader = '';
            var tableHeaderStcik = '<thead class="stickyHeader"><tr>';
            var tableRow = "";
            $.each(data,function(index,value){
                tableRow = "<tr scope='row'>";
                if(tableHeader == ""){
                    if(tableHeaderStcik !=""){
                        tableHeader = tableHeader + tableHeaderStcik;
                    }
                    $.each(value,function(index,value){
                        var title = value.title.replaceAll("_"," ");
                        tableHeader = tableHeader + "<th class='tableHeader' scope='col'>"+title+"<th>";
                    });
                    tableHeaderStcik = "";
                    tableHeader = tableHeader + "</tr></thead>";
                    $("."+el).append(tableHeader);
                }

                $.each(value,function(index,value){
                    if(value.count == "Not Available" || value.count == undefined || value.count == ""){
						tableRow = tableRow + "<td>0<td>";
                    }else{
                    	tableRow = tableRow + "<td>"+value.count+"<td>";
                	}
                });
                tableRow = tableRow+ "</tr>";
                $("."+el).append(tableRow);
            });

        }else{
        
            //covid-active
            // table header 
            var tableHeader = '';
            var tableHeaderStcik = '<thead class="stickyHeader"><tr>';
            var tableRow = "";
            $.each(data,function(index,value){
                tableRow = "<tr scope='row'>";
                if(tableHeader == ""){
                    if(tableHeaderStcik !=""){
                        tableHeader = tableHeader + tableHeaderStcik;
                    }
                    $.each(value,function(index,value){
                        var title = index.replaceAll("_"," ");
                        tableHeader = tableHeader + "<th class='tableHeader' scope='col'>"+title+"<th>";
                    });
                    tableHeaderStcik = "";
                    tableHeader = tableHeader + "</tr></thead>";
                    $("."+el).append(tableHeader);
                }

                $.each(value,function(index,value){
                    if(value == "Not Available" || value == undefined || value == ""){
						tableRow = tableRow + "<td>0<td>";
                    }else{
                    	tableRow = tableRow + "<td>"+value+"<td>";
                	}
                    //tableRow = tableRow + "<td>"+value+"<td>";
                });
                tableRow = tableRow+ "</tr>";
                $("."+el).append(tableRow);
            });
        }
        
    }

$(document).ready(function(){

	var __cityMapObj = {
		ward_office:{},
		total_cases:{},
		total_active:{},
		total_recovered:null,
		gorth_rate:null,
		total_deaths:null
	};

	var __hot_details = {
		total_cases:null,
		total_active:null,
		total_recovered:null,
		total_deaths:null,
		total_positive_rate:null,
		total_vulnerable:null
	}
	var __daily_test_details = {
		total_tests:null,
		tests_per_million:null,
		total_positive_tests:null,
		total_critical:null,
		days_to_double:null,
		daily_cases:null,
		daily_deaths:null,
		daily_tests:null,
		daily_RTPCR:null,
		daily_RAT:null,
	}

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
                                total_Cases       : +__cityMapDataList[i]['total_case'],
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
    $('#accordionExample').on('show.bs.collapse', function (e) {
       //console.log($(e.currentTarget).attr("data-target"));
       dataHandler.init();
    });

	var ctx = $("#myTesting");
    var mystat = new Chart(ctx,{
        type: "line",
        data: {
        labels: ["21 March 21", "28 March 21","01 Apr 21","04 Apr 21","08 Apr 21","15 Apr 21","16 Apr 21","17 Apr 21","18 Apr 21","19 Apr 21","20 Apr 21"],
        datasets: [{
            label: 'Test Positive Rate',
            data: [22.43,26.51,19.84,35.02,29.71,24.61,22.8,24.5,26.7,21.95,25.4],
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


	var ctx = $("#ageAnalysis");
    var mypieAge = new Chart(ctx,{
        type: "pie",
        data: {
        labels: ["0-19 (20%)", "20-39 (30%)","40-59 (25%)","60+ (20%)"],
        datasets: [{
            label: 'Total Cases',
            data: [1,1,1,1],
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

   	var ctx = $("#myVaccinations");
    
    

    
    var myTesting = new Chart(ctx,{
        type: "bar",
        data: {
        labels: ["Health Care Workers","Frontline workers"],
        datasets: [{
            label: '1st Dose',
            data: [58,63,70,60],
            backgroundColor: "#7DB839"
          },
          {
            label: '2st Dose',
            data: [20,14,10,35],
            backgroundColor: "#4b840b"
          },
          {
            label: 'Pending for Vaccination',
            data: [22,23,20,5],
            backgroundColor: "#ccc"
          }
        ]
        },
        options: {
        responsive:true,
        maintainAspectRatio:true,
        indexAxis: 'y',
        min:0,
        max:100,
        scales: {
          x: {
            stacked: true,
            
          },
          y: {
            stacked: true,
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
                display: true,
                text: 'Health Care and Front Line Workers'
            }
        }
      },
        });

    var ctx2 = $("#myVaccinationsOther");
    var myTesting2 = new Chart(ctx2,{
        type: "bar",
        data: {
        labels: ["Senior Citizens (60+)","45 - 59 yers old"],
        datasets: [{
            label: '1st Dose',
            data: [58,63],
            backgroundColor: "#7DB839"
          },
          {
            label: '2st Dose',
            data: [20,14],
            backgroundColor: "#4b840b"
          },
        ]
        },
        options: {
        responsive:true,
        maintainAspectRatio:true,
        indexAxis: 'y',
        min:0,
        max:100,
        scales: {
          x: {
            stacked: true,
            /*suggestedMin:0,
            suggestedMax: 100,*/
          },
          y: {
            stacked: true,
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          labels:{
            render: 'percentage',
                    showActualPercentages: true
                },
          title: {
                display: true,
                text: '60+ and 45-59 Years Population'
            }
        }
      },
        });


    

	var pieData = {labels: ["Male (70%)","Female (30%)","Transgenders(1%)"],datasets: [{ label:['Male','Female','Transgenders'], data: [103208,24821,1], backgroundColor: [ '#FC5563', '#FFBA35','##ff8826'],hoverOffset: 4 }] };
    var ctx = $("#genderAnalysis");
    var mypie = new Chart(ctx,{
        type: "pie",
        data: pieData,
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
          tooltips: {
		    enabled: true
		  },
          datalabels: {
		      formatter: (value, ctx) => {

		        let sum = ctx.dataset._meta[0].total;
		        let percentage = (value * 100 / sum).toFixed(2) + "%";
		        return percentage;


		      },
		      color: '#fff',
		    },
        },
        });
    //read data
    //
	$.getJSON('data/data-20-april-21.json', function(jd) {

		$.each(jd, function(key,value){
			__date = value.date;
			
			
			preparedMapData(key,value);
			preparedHotDetails(key,value);
			preparedHealthCareDetails(key,value);
			preparedDailyTests(key,value);
			preparedVaccinationDetails(key,value);
			preparedDemographic(key,value);
			controllingSpread(key,value);
			comorbidityDetails(key,value);
			
		});
		
		createTable("infrastructure-use",__gov_hospital_use_Details,'new');
		createTable("vaccinations-active",__vaccination_Details,'new');
		createTable("vaccinations-active-details",__vaccination_DetailsWeek,'new');
		$(".todayDate").html(__date);
        $(".WeeklyDate").html(_WeeklyDate);
        
	    createTable("infrastructure-use-2",__medicine_use_Details,'new');
	    createTable("ControllingSpread",__controlling_spread,'old');
	    createTable("ComorbidityDetails",__comorbidity_Details,'old');

	});


	function preparedMapData(key,value){

		var wardMapping = {"Ward_1_Name":{"number":"8,9"},
							"Ward_2_Name":{"number":"17,18,19"},
							"Ward_3_Name":{"number":"28,36,37"},
							"Ward_4_Name":{"number":"35,39,40,42"},
							"Ward_5_Name":{"number":"20,21"},
							"Ward_6_Name":{"number":"22,26,23,42"},
							"Ward_7_Name":{"number":"15,16,29"},
							"Ward_8_Name":{"number":"38,41,42"},
							"Ward_9_Name":{"number":"10,11,12"},
							"Ward_10_Name":{"number":"3,4,5,42"},	
							"Ward_11_Name":{"number":"7,14"},
							"Ward_12_Name":{"number":"30,33,42"},
							"Ward_13_Name":{"number":"24,25,27"},
							"Ward_14_Name":{"number":"13,31,32,42"},
							"Ward_15_Name":{"number":"1,2,6"}};

		

			for (var i = 1; i <= 15; i++) {

				var name = "Ward_"+i+"_Name";
				var totalNewCase = "Ward_"+i+"_New";
				var totalCase = "Ward_"+i+"_total";

				console.log(wardMapping[name]);
				if( wardMapping[name] != undefined){
					$.each(wardMapping[name],function(ind,val){
						
						if(ind == "number"){
							var tot = val.split(",");
							for (var m = 0; m < tot.length; m++) {
								__cityMapData.push({"ward":tot[m],"ward_key":name,"ward_name":value[name],"total_new_case":value[totalNewCase],"total_case":value[totalCase]});
							}
						}
					});
				}
				__cityMapDataList.push({"ward_name":value[name],"total_new_case":value[totalNewCase],"total_case":value[totalCase]});
			}
		
		
		console.log(__cityMapData);
	}
	function preparedHotDetails(key,value){
		__hot_details.total_cases = value.total_cases;
		__hot_details.total_active = value.total_active;
		__hot_details.total_recovered = value.total_recovered;
		__hot_details.total_deaths = value.total_deaths;
		__hot_details.test_positive_rate = value.test_positive_rate;

		var el = document.querySelector('#total-num-new');
		if(el != null){
	    	var od = new Odometer({ el: el, value: 0, theme: 'minimal' });
	    	od.update(__hot_details.total_cases);
	    }

	    var el2 = document.querySelector('#active-num-new');
	    if(el2 != null){
		    var od2 = new Odometer({ el: el2, value: 0, theme: 'minimal' });
		    od2.update(__hot_details.total_active);
		}

	    var el3 = document.querySelector('#recoveries-num-new');
	    if(el3 != null){
		    var od3 = new Odometer({ el: el3, value: 0, theme: 'minimal' });
		    od3.update(__hot_details.total_recovered);
		}

			
		var totRecoverdGroth = parseInt(__hot_details.total_recovered) - parseInt(_yesterday_recovered)
		

		var elr= document.querySelector('#recoveries-num-Case');
		if(elr != null){
		    var odr = new Odometer({ el: elr, value: 0, theme: 'minimal' });
		    odr.update(totRecoverdGroth);
		}


	    var PosRateArrow = (parseFloat(__hot_details.test_positive_rate.replace("%")) - parseFloat(_yesterday_positive_rate)).toFixed(2);
        if(PosRateArrow > 0 ){

            $("#positivityRateCont").addClass("red");
            $("#positivityRateCont").find(".activeArrow").html("arrow_upward");
        }else{
            alert("up");
            $("#positivityRateCont").addClass("green");
            $("#positivityRateCont").find(".activeArrow").html("arrow_downward");
        }
        $("#positivityRate-per").html(PosRateArrow+"%");
 
	    
	    var el4 = document.querySelector('#deaths-num-new');
	    if(el4 != null){
		    var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
		    od4.update(__hot_details.total_deaths);
		}

	    var el4 = document.querySelector('#positivityRate');
	    if(el4 != null){
		    var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
		    od4.update(__hot_details.test_positive_rate);
		}
        var totalActToday = parseInt(value.total_active) -parseInt(_yesterday_active);
        var el4 = document.querySelector('#active-num-new-per');
        if(el4 != null){
            var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
            od4.update( parseInt(totalActToday));
        }
        
        if( totalActToday < 0){
            $("#activeNumnew-per").find(".activeArrow").html("arrow_downward");
            $("#activeNumnew-per").removeClass("red");
            $("#activeNumnew-per").addClass("green");
        }else{
            $("#activeNumnew-per").find(".activeArrow").html("arrow_upward");
            $("#activeNumnew-per").removeClass("green");
            $("#activeNumnew-per").addClass("red");
        }
        
	    
	    var perLastActive = (parseInt(value.total_active) * 100  / parseInt(__hot_details.total_cases)).toFixed(2);
	    $(".active-Case-Per").html(perLastActive);

	    var perLastRe = (parseInt(__hot_details.total_recovered) * 100  / parseInt(__hot_details.total_cases)).toFixed(2);
	    $(".recovered-Case-Per").html(perLastRe);

	    /*var el4 = document.querySelector('#recoveries-num-new-per');
	    var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
	    od4.update(value.test_positive_rate);*/

	    var el4 = document.querySelector('#deaths-num-new-per');
	    if(el4 != null){
		    var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
		    od4.update(parseInt(value.daily_deaths));
		}

	    


	    var perLastDeaths = (parseInt(value.total_deaths) * 100 / parseInt(__hot_details.total_cases) ).toFixed(2);
	    $(".deaths-Case-Per").html(perLastDeaths);
	    
	    if(parseInt(value.daily_deaths)  > 0 ){
	    	$(".deathsArrow").html("arrow_upward");
	    	$(".deathsArrow").parent(".counts-graph").addClass("red");
			$(".deathsArrow").parent(".counts-graph").removeClass("green");
	    }else{
	    	$(".deathsArrow").html("arrow_upward");
	    	$(".deathsArrow").parent(".counts-graph").removeClass("red");
	    	$(".deathsArrow").parent(".counts-graph").addClass("green");
	    }

	    /*var el4 = document.querySelector('#vaccinated');
	    var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
	    od4.update(456687);	*/
	}

	function preparedHealthCareDetails(key,value){

		//__gov_hospital_use_Details.push({Parameters:"Total Govt. Hospital Beds For COVID-19","Total":value.Total_govt_beds,"Vacant":value.Vacant_beds});
		__gov_hospital_use_Details.push( { header :{title:"Type",count:"Total Hospital Beds For COVID-19"},
		total_beds : {title:"Total Beds",count:value.Total_govt_beds},
		vacant_beds : {title:"Vacant Beds",count:value.Vacant_beds}});

		__gov_hospital_use_Details.push( { header :{title:"Type",count:"Beds with Oxygen"},
		total_beds : {title:"Total Beds",count:value.Total_with_O2},
		vacant_beds : {title:"Vacant Beds",count:value.Vacant_with_O2}});

		__gov_hospital_use_Details.push({ header :{title:"Type",count:"Beds without Oxygen"},
		total_beds : {title:"Total Beds",count:value.Total_without_O2},
		vacant_beds : {title:"Vacant Beds",count:value.Vacant_without_O2}});

		__gov_hospital_use_Details.push( { header :{title:"Type",count:"ICU Beds with Ventilator"},
		total_beds : {title:"Total Beds",count:value.Total_ICU_with_ventilator},
		vacant_beds : {title:"Vacant Beds",count:value.Vacant_ICU_with_ventilator}});

		__gov_hospital_use_Details.push( { header :{title:"Type",count:"ICU Beds without Ventilator"},
		total_beds : {title:"Total Beds",count:value.Total_ICU_without_ventilator},
		vacant_beds : {title:"Vacant Beds",count:value.Vacant_ICU_without_ventilator}});

		__gov_hospital_use_Details.push( { header :{title:"Type",count:"Care center Beds"},
		total_beds : {title:"Total Beds",count:value.Total_CCC_beds},
		vacant_beds : {title:"Vacant Beds",count:value.Vacant_CCC_beds}});
		
		__medicine_use_Details.push({ header :{title:"Type",count:"Healthcare facilities"},
		total_beds : {title:"Government",count:value.HealthFacility_govt_vacc},
		vacant_beds : {title:"Private",count:value.HealthFacility_private_vacc},
		active_case_using : {title:" 24x7",count:value.HealthFacility_247_vacc}});
	}

	function preparedDailyTests(key,value)
	{
		__daily_test_details.total_tests = value.total_tests;
		__daily_test_details.tests_per_million = value.tests_per_million;
		__daily_test_details.total_positive_tests = value.total_positive_tests_daily;
		__daily_test_details.total_critical = value.total_critical;
		__daily_test_details.days_to_double = value.days_to_double;
		__daily_test_details.daily_cases = value.daily_cases;
		__daily_test_details.daily_deaths = value.daily_deaths;
		__daily_test_details.daily_tests = value.daily_tests;
		__daily_test_details.daily_RTPCR = value.daily_RTPCR;
		__daily_test_details.daily_RAT = value.daily_RAT;

		__daily_test_details.total_home_quarantine = value.total_home_quarantine;

		__daily_test_details.total_active_in_hospital = value.total_active_in_hospital;
		__daily_test_details.total_active_in_ccc = value.total_active_in_ccc;


		var totalDetails = parseInt(__daily_test_details.total_home_quarantine) + parseInt(__daily_test_details.total_active_in_hospital) + parseInt(__daily_test_details.total_active_in_ccc);
		var homeQuarantinePre = parseInt(__daily_test_details.total_home_quarantine) * 100 / totalDetails;
		var inHospitalsPre = parseInt(__daily_test_details.total_active_in_hospital) * 100 / totalDetails;
		var inCCCPre = parseInt(__daily_test_details.total_active_in_ccc) * 100 / totalDetails;

		var el4 = document.querySelector('#homeQuarantinePre');
		if(el4 != null){
		    var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
		    od4.update(homeQuarantinePre);
		}

	    var el4 = document.querySelector('#inHospitalsPre');
	    if(el4 != null){
		    var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
		    od4.update(inHospitalsPre);
		}

	    var el4 = document.querySelector('#inCCCPre');
	    if(el4 != null){
		    var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
		    od4.update(inCCCPre);
		}


		var el4 = document.querySelector('#homeQuarantine');
		if(el4 != null){
			var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
		    od4.update(__daily_test_details.total_home_quarantine);
		}

	    var el4 = document.querySelector('#inHospitals');
	    if(el4 != null){
		    var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
		    od4.update(__daily_test_details.total_active_in_hospital);
		}

	    var el4 = document.querySelector('#inCCC');
	    if(el4 != null){
		    var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
		    od4.update(__daily_test_details.total_active_in_ccc);
		}

	    var el4 = document.querySelector('#CumulativeTest');
	    if(el4 != null){
		    var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
		    od4.update(__daily_test_details.total_tests);
		}

	    /*var el4 = document.querySelector('#lastWeekTest');
	    var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
	    od4.update(166815);*/
	    var totTest = parseInt(__daily_test_details.daily_RTPCR) + parseInt(__daily_test_details.daily_RAT);

	    var el4 = document.querySelector('#testConduct');
	    if(el4 != null){
		    var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
		    od4.update(totTest);
		}

	    var el4 = document.querySelector('#RTPCRTest');
	    if(el4 != null){
		    var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
		    od4.update(__daily_test_details.daily_RTPCR);
		}

	    var el4 = document.querySelector('#antigenTest');
	    if(el4 != null){
		    var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
		    od4.update(__daily_test_details.daily_RAT);
		}

	    var el4 = document.querySelector('#positiveTest');
	    {
		    var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
		    od4.update(__daily_test_details.total_positive_tests);
		}

	    var rate = value.test_positive_rate.replace("%");
	    var el4 = document.querySelector('#positiveRate');
	    if(el4 != null){
		    var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
		    od4.update(parseInt(rate));
		}
    
	}

	function preparedVaccinationDetails(key,value)
	{
		var pendingHCW = parseInt(value.Total_HCW) - ( parseInt(value.HCW_1dose_cum) +parseInt(value.HCW_2dose_cum)) ;
		__vaccination_Details.push({ header :{title:"Population",count:"Health Care Workers"},
		first_dose : {title:"1st Dose",count:value.HCW_1dose_cum},
		second_dose : {title:"2nd Dose",count:value.HCW_2dose_cum}});

		var pendingFLW = parseInt(value.Total_FLW) - ( parseInt(value.FLW_1dose_cum) +parseInt(value.FLW_2dose_cum)) ;
		__vaccination_Details.push({ header :{title:"Population",count:"Front Line Workers"},
		first_dose : {title:"1st Dose",count:value.FLW_1dose_cum},
		second_dose : {title:"2nd Dose",count:value.FLW_2dose_cum}});

		var pending60_plus = parseInt(value.Total_60plus) - ( parseInt(value._60plus_1dose_cum) +parseInt(value._60plus_1dose_cum)) ;
		__vaccination_Details.push({ header :{title:"Population",count:"Senior Citizens (60+)"},
		first_dose : {title:"1st Dose",count:value._60plus_1dose_cum},
		second_dose : {title:"2nd Dose",count:value._60plus_2dose_cum}});

		var pending45 = parseInt(value.Total_45to59) - ( parseInt(value._60plus_1dose_cum) +parseInt(value._45to59_2dose_cum)) ;
		__vaccination_Details.push({ header :{title:"Population",count:"45 To 59 Years Old"},
		first_dose : {title:"1st Dose",count:value._45to59_1dose_cum},
		second_dose : {title:"2nd Dose",count:value._45to59_2dose_cum}
		});
		//pending : {title:"Pending For Vaccination",count:pending45}
		
		var total1Dose = parseInt(value.HCW_1dose_cum) + parseInt(value.FLW_1dose_cum) + parseInt(value._60plus_1dose_cum) + parseInt(value._45to59_1dose_cum);
		var total2Dose = parseInt(value.HCW_2dose_cum) + parseInt(value.FLW_2dose_cum) + parseInt(value._60plus_2dose_cum) + parseInt(value._45to59_2dose_cum);
		
		
		var _h_1DoseHCWper = (parseInt(value.HCW_1dose_cum) * 100 / value.Total_HCW );
		var _h_2DoseHCWper = (parseInt(value.HCW_2dose_cum) * 100 / value.Total_HCW );
		var _f_1DoseHCWper = (parseInt(value.FLW_1dose_cum) * 100 / value.Total_FLW );
		var _f_2DoseHCWper = (parseInt(value.HCW_2dose_cum) * 100 / value.Total_FLW);
		

		
		
		var __vaccination_1dose=[],__vaccination_2dose=[],__vaccination_1doseOther=[],__vaccination_2doseOther=[];

		var totalVacc = parseInt(total1Dose) +parseInt(total2Dose);
		preparedVaccinationDetailsWeek(totalVacc,total1Dose,total2Dose);
		var el4 = document.querySelector('#vaccinated');
		if(el4 != null){
		    var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
		    od4.update(totalVacc);
		}

	    var vccDiff = totalVacc - _yesterday_vcc;
        if(totalVacc > _yesterday_vcc ){
            $("#VCCContDiff").addClass("green");
            $("#vaccinatedCont").find(".activeArrow").html("arrow_upward");
        }else{
            $("#VCCContDiff").addClass("red");
            $("#vaccinatedCont").find(".activeArrow").html("arrow_downward");
        }
    
        var el4 = document.querySelector('#VCCContDiffPer');
        if(el4 != null){
            var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
            od4.update(vccDiff);
        }


	    var el4 = document.querySelector('#totalVacc');
	    if(el4 != null){
		    var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
		    od4.update(totalVacc);
		}

	    var el4 = document.querySelector('#firstDose');
	    if(el4 != null){
		    var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
		    od4.update(total1Dose);
		}

	    var el4 = document.querySelector('#secondDose');
	    if(el4 != null){
		    var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
		    od4.update(total2Dose);
		}
	    


		/*__vaccination_1dose.push(_h_1DoseHCWper);
		__vaccination_1dose.push(_f_1DoseHCWper);
		
		__vaccination_2dose.push(_h_2DoseHCWper);
		__vaccination_2dose.push(_f_2DoseHCWper);
	*/
		__vaccination_1dose.push(value.HCW_1dose_cum);
		__vaccination_1dose.push(value.FLW_1dose_cum);
		
		__vaccination_2dose.push(value.HCW_2dose_cum);
		__vaccination_2dose.push(value.FLW_2dose_cum);
		console.log(__vaccination_1dose);
		
		__vaccination_1doseOther.push(parseInt(value._60plus_1dose_cum));
		__vaccination_1doseOther.push(parseInt(value._45to59_1dose_cum));

		__vaccination_2doseOther.push(parseInt(value._60plus_2dose_cum));
		__vaccination_2doseOther.push(parseInt(value._45to59_2dose_cum));


		myTesting.data =  {
        labels: ["Health Care Workers","Frontline workers"],
        datasets: [{
            label: '1st Dose',
            data: __vaccination_1dose,
            backgroundColor: "#7DB839"
          },
          {
            label: '2st Dose',
            data: __vaccination_2dose,
            backgroundColor: "#4b840b"
          },
        ]
        } ;
     	myTesting.update();

     	myTesting2.data =  {
        labels: ["Senior Citizens (60+)","45 - 59"],
        datasets: [{
            label: '1st Dose',
            data: __vaccination_1doseOther,
            backgroundColor: "#7DB839"
          },
          {
            label: '2st Dose',
            data: __vaccination_2doseOther,
            backgroundColor: "#4b840b"
          },
        ]
        } ;
     	myTesting2.update();

	}
	function preparedVaccinationDetailsWeek(totalDose,totalFistDose,totalSecondDose){

		
		/*__vaccination_DetailsWeek.push({ header :{title:"Parameter",count:"16 Apr 2021"},
			total_dose : {title:"Total Vaccinations",count:""},
			first_dose : {title:"1st Dose",count:totalFistDose},
			second_dose : {title:"2nd Dose",count:totalSecondDose},
		});*/

		__vaccination_DetailsWeek.push({ header :{title:"Parameter",count:__date},
			total_dose : {title:"Total Vaccinations",count:totalDose},
			first_dose : {title:"1st Dose",count:totalFistDose},
			second_dose : {title:"2nd Dose",count:totalSecondDose},
		});



	}
	function preparedDemographic(key,value){
		
		__demographic_Details_All.push(parseInt(value.deaths_0_14_male)+parseInt(value.deaths_0_14_female));
		__demographic_Details_All.push(parseInt(value.deaths_15_29_male)+parseInt(value.deaths_15_29_female));
		__demographic_Details_All.push(parseInt(value.deaths_30_44_male)+parseInt(value.deaths_30_44_female));
		__demographic_Details_All.push(parseInt(value.deaths_60_male)+parseInt(value.deaths_60_female));
		
		__demographic_Details_MF.push(parseInt(value.deaths_0_14_male)+parseInt(value.deaths_15_29_male)+parseInt(value.deaths_30_44_male)+parseInt(value.deaths_60_male));
		__demographic_Details_MF.push(parseInt(value.deaths_0_14_female)+parseInt(value.deaths_15_29_female)+parseInt(value.deaths_30_44_female)+parseInt(value.deaths_60_female));
		__demographic_Details_MF.push(parseInt(value.total_transgender_deaths));
		var totCo = __demographic_Details_All.reduce((a, b) => a + b, 0);
		var _0_to_20_Per = (__demographic_Details_All[0] * 100 / totCo ).toFixed(2);
		var _15_to_29_Per = (__demographic_Details_All[1] * 100 / totCo ).toFixed(2);
		var _30_to_44_Per = (__demographic_Details_All[2] * 100 / totCo ).toFixed(2);
		var _60_Per = (__demographic_Details_All[3] * 100 / totCo ).toFixed(2);
		mypieAge.data = { labels: ["0-19 ("+_0_to_20_Per+"%)", "20-39 ("+_15_to_29_Per+"%)","40-59 ("+_30_to_44_Per+"%)","60+ ("+_60_Per+"%)"], datasets: [{ label: 'Total Cases', data: __demographic_Details_All, backgroundColor: [ '#f4765c','#f98f76','#fda791','#feb39f','#ffcabc' ], hoverOffset: 4 }] }
     	mypieAge.update();

     	var totalPo = __demographic_Details_MF.reduce((a, b) => a + b, 0);
     	var malePer = (__demographic_Details_MF[0] * 100 / totalPo).toFixed(2);
     	var FemalePer = (__demographic_Details_MF[1] * 100 / totalPo).toFixed(2);
     	var transPer = (__demographic_Details_MF[2] * 100 / totalPo).toFixed(2);
     	mypie.data =  {labels: ["Male ("+malePer+"%)","Female ("+FemalePer+"%)","Transgenders ("+transPer+")"],datasets: [{data: __demographic_Details_MF, backgroundColor: ['#FC5563', '#FFBA35','#ff8826'],hoverOffset: 4 }] } ;
     	mypie.update();
		//__demographic_Details.push();
	}
	function controllingSpread(key,value){
		__controlling_spread.push({"Comorbidity_Classification":"Total Contact tracing(Today)","Numbers":value.Total_Traced_cum},
			{Parameters:"Total Contact tracing done( Last 48 hrs)","Numbers":value.Total_Traced_48hr},
			{Parameters:"Total High RISK Contact tracing done","Numbers":value.Total_HighRisk_cum},
			{Parameters:"Total High RISK Contact tracing done( Last 48 hrs)","Numbers":value.Total_HighRisk_48hr},
			{Parameters:"Total low RISK  Contact tracing done","Numbers":value.Total_LowRisk_cum},
			{Parameters:"Total low RISK  Contact tracing done( Last 48 hrs)","Numbers":value.Total_LowRisk_48hr},
			{Parameters:"CT Ratio","Numbers":value.CT_Ratio},
			{Parameters:"Total Microcontainment Zones","Numbers":value.Microcontainment_zones},
			{Parameters:"Total Microcontainment Buildings","Numbers":value.Microcontainment_Buildings},
			{Parameters:"Total Microcontainment Societies","Numbers":value.Microcontainment_Societies},
			{Parameters:"Total Microcontainment Others","Numbers":value.Microcontainment_Others}
			);
	}

	function comorbidityDetails(key,value){

		//deaths_total_comorbidity
		__comorbidity_Details.push({Parameters:"Comorbidity classification","% deaths":value.deaths_total_comorbidity},
			{Parameters:"Total deaths caused due to Comorbidities","Numbers":value.deaths_total_comorbidity},
			{Parameters:"Hypertension","Numbers":value.deaths_comorb_HTN},
			{Parameters:"DM","Numbers":value.deaths_comorb_DM},
			{Parameters:"Obesity","Numbers":value.deaths_comorb_Obsesity},
			{Parameters:"IHD","Numbers":value.deaths_comorb_IHD},
			{Parameters:"CKD/AKI","Numbers":value.deaths_comorb_CKD_AKI},
			{Parameters:"Immuno","Numbers":value.deaths_comorb_IMMUNOCOMPR},
			{Parameters:"COPD","Numbers":value.deaths_comorb_COPD},
			{Parameters:"Liver","Numbers":value.deaths_comorb_LIVERDISEASE},
			{Parameters:"Hypo/Hyper","Numbers":value.deaths_comorb_HYPOHYPERTHYROID},
			{Parameters:"TBMTDR","Numbers":value.deaths_comorb_TBMTDR},
			{Parameters:"MODS","Numbers":value.deaths_comorb_MODS},
			{Parameters:"MULTIPLE","Numbers":value.deaths_comorb_MULTIPLE},
			{Parameters:"Total deaths of transgenders","Numbers":value.total_transgender_deaths},
			);
	}


    
    


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
	







	//console.log(__gov_hospital_use_Details);
	
});