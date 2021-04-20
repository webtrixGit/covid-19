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

});