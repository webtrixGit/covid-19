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

	$.getJSON('data/data-20-april-21.json', function(jd) {

		$.each(jd, function(key,value){
			__date = value.date;
			preparedVaccinationDetails(key,value);
			preparedDailyTests(key,value);
			preparedHotDetails(key,value);			
		});
	});
	
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

		//alert(__hot_details.test_positive_rate +""+ )
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
		
	}
	
	
});