

$(function () {
    //"use strict";
    let cuurentseller={
        id:101
    }
    orders=JSON.parse(localStorage.getItem("orders"));
    console.log(orders);
    sellerorders=orders.filter((order)=>order.products
                       .find((product)=>product.seller_id==cuurentseller.id));
    console.log(sellerorders);
   // let ordersPerMonth = {}; 
    let counter = 0;
    let ordersallmonths = new Array(12).fill(0); 
    let salesallmonths = new Array(12).fill(0); 
    let profitallmonths= new Array(12).fill(0);
    let totalSales=0;
    let totalprofit=0;
if (sellerorders && sellerorders.length > 0) {
    for (let j = 0; j < sellerorders.length; j++) {
        let dateParts = sellerorders[j].time.split("-");
        let month = parseInt(dateParts[1], 10);
        if (month >= 1 && month <= 12) {
            ordersallmonths[month - 1]++;
            let ordertotalprice=0;
            let ordertotalprofit=0;
            for(let i=0;i<sellerorders[j].products.length;i++){
                if(sellerorders[j].products[i].seller_id==cuurentseller.id){
                ordertotalprice+=(sellerorders[j].products[i].price)*sellerorders[j].products[i].quantitiy;                ;
                ordertotalprofit+=(sellerorders[j].products[i].price-orders[j].products[i].cost_price)*sellerorders[j].products[i].quantitiy;
                }
            }
            salesallmonths[month-1]+=ordertotalprice;
            profitallmonths[month-1]+=ordertotalprofit;

            counter++;
        }
    }
    totalSales = salesallmonths.reduce((sum, value) => sum + value, 0);
    totalprofit= profitallmonths.reduce((sum,value)=> sum + value,0);
} else {
    console.log("No orders found ");
}

console.log(ordersallmonths);
console.log(salesallmonths);
console.log(profitallmonths);

let deliverdorders=0;
let penddingorders=0;
let inwayorders=0;
let totalorders=sellerorders.length;
for(let i=0;i<sellerorders.length;i++){
    if(sellerorders[i].status=="delivered"){
        deliverdorders++;
    }else if(sellerorders[i].status=="pendding"){
        penddingorders++;
    }else if(sellerorders[i].status=="inway"){
        inwayorders++;
    }
    
}
let statusorders=[deliverdorders,penddingorders,inwayorders];

let deliveredpercent=(deliverdorders*100/(orders.length)).toFixed(0);
let penddingpercent=(penddingorders*100/(orders.length)).toFixed(0);
let inwaypercent=(inwayorders*100/(orders.length)).toFixed(0);

const products=JSON.parse(localStorage.getItem("products"));
console.log(products);
for(let i=0;i<products.length;i++){
    if(products[i].seller_id==cuurentseller.id){
const tr=document.createElement("tr");
tr.innerHTML=`     <td>
                        <div class="">
                          <h6 class="mb-0">${products[i].id}</h6>
                          
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center flex-row gap-3">
                          <div class="">
                            <img src=${products[i].image} width="35" alt="">
                          </div>
                          <div class="">
                            <h6 class="mb-0">${products[i].title}</h6>
                            <p class="mb-0"></p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="card-lable  text-success >
                          <p class="text-success mb-0 fs-100">${products[i].price}</p>
                        </div>
                      </td>
                      <td>
                        <h5 class="mb-0">${products[i].category}</h5>
                      </td>
                      <td>
                        <h5 class="mb-0">${products[i].solded}</h5>
                      </td>
    `
document.querySelector("#producttbody").append(tr);
    }
}

const users=JSON.parse(localStorage.getItem("users"));
console.log(sellerorders);
for(let i=0;i<sellerorders.length;i++){
    let orderprice=0;
    for(let j=0;j<sellerorders[i].products.length;j++){
        console.log(sellerorders[i].products[j].price)
        orderprice+=sellerorders[i].products[j].price *sellerorders[i].products[j].quantitiy;
    }
    let customer;
    for(let j=0;j<users.length;j++){
        if(sellerorders[i].user_id==users[j].id){
            customer=users[j].name;
        }
    }

const tr=document.createElement("tr");
tr.innerHTML=`     <td>
                        <div class="">
                          <h6 class="mb-0">${orders[i].order_id}</h6>
                          
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center flex-row gap-3">
                          <div class="">
                            <img src= width="35" alt="">
                          </div>
                          <div class="">
                            <h6 class="mb-0">${customer}</h6>
                            <p class="mb-0"></p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="card-lable  text-success >
                          <p class="text-success mb-0 fs-100">${orderprice}</p>
                        </div>
                      </td>
                      <td>
                        <h5 class="mb-0">${orders[i].status}</h5>
                      </td>
                      <td>
                        <h5 class="mb-0">${orders[i].time}</h5>
                      </td>
    `
document.querySelector("#ordertbody").append(tr);
}


 // chart 1
 var options = {
    series: [{
        name: "Total orders",
        data: ordersallmonths
    }],
    chart: {
        //width:150,
        height: 60,
        type: 'area',
        sparkline: {
            enabled: !0
        },
        zoom: {
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: 1.5,
        curve: "smooth"
      },
      fill: {
        type: 'gradient',
        gradient: {
            shade: 'dark',
            gradientToColors: ['#0d6efd'],
            shadeIntensity: 1,
            type: 'vertical',
            opacityFrom: 0.7,
            opacityTo: 0.0,
            //stops: [0, 100, 100, 100]
        },
    },
    colors: ["#0d6efd"],
    tooltip: {
        theme: "dark",
        fixed: {
            enabled: !1
        },
        x: {
            show: !1
        },
        y: {
            title: {
                formatter: function (e) {
                    return ""
                }
            }
        },
        marker: {
            show: !1
        }
    },
    
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    }
};

document.querySelector("#Totalorders").innerText=counter;
var chart = new ApexCharts(document.querySelector("#chart1"), options);
chart.render();




 // chart 2

 var options = {
    series: [{
        name: "Orders",
        data: salesallmonths
    }],
    chart: {
        //width:150,
        height: 60,
        type: 'area',
        sparkline: {
            enabled: !0
        },
        zoom: {
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: 1.5,
        curve: "smooth"
      },
      fill: {
        type: 'gradient',
        gradient: {
            shade: 'dark',
            gradientToColors: ['#17ad37'],
            shadeIntensity: 1,
            type: 'vertical',
            opacityFrom: 0.7,
            opacityTo: 0.0,
            //stops: [0, 100, 100, 100]
        },
    },
    colors: ["#98ec2d"],
    tooltip: {
        theme: "dark",
        fixed: {
            enabled: !1
        },
        x: {
            show: !1
        },
        y: {
            title: {
                formatter: function (e) {
                    return ""
                }
            }
        },
        marker: {
            show: !1
        }
    },
    
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    }
};

document.querySelector("#totalesales").innerText=totalSales+"$";
var chart = new ApexCharts(document.querySelector("#chart2"), options);
chart.render();

//chart 3 main
var options = {
    series: [{
        name: "profit",
        data: profitallmonths
    }],
    chart: {
        //width:150,
        height: 160,
        type: 'bar',
        sparkline: {
            enabled: !0
        },
        zoom: {
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: 1,
        curve: 'smooth',
        color: ['transparent']
    },
    fill: {
        type: 'gradient',
        gradient: {
            shade: 'dark',
            gradientToColors: ['#7928ca'],
            shadeIntensity: 1,
            type: 'vertical',
            //opacityFrom: 0.8,
            //opacityTo: 0.1,
            //stops: [0, 100, 100, 100]
        },
    },
    colors: ["#ff0080"],
    plotOptions: {
        bar: {
            horizontal: false,
            borderRadius: 4,
            borderRadiusApplication: 'around',
            borderRadiusWhenStacked: 'last',
            columnWidth: '45%',
        }
    },

    tooltip: {
        theme: "dark",
        fixed: {
            enabled: !1
        },
        x: {
            show: !1
        },
        y: {
            title: {
                formatter: function (e) {
                    return ""
                }
            }
        },
        marker: {
            show: !1
        }
    },
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    }
};

document.querySelector("#totalprofit").innerText=totalprofit+"$";
var chart = new ApexCharts(document.querySelector("#chart9"), options);
chart.render();



 // chart 3
 var options = {
    series: [{
        name: "Orders",
        data: [47, 45, 74, 32, 56, 31, 44, 33, 45, 19]
    }],
    chart: {
        //width:150,
        height: 60,
        type: 'area',
        sparkline: {
            enabled: !0
        },
        zoom: {
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: 1.5,
        curve: "smooth"
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#2af598"],
          shadeIntensity: 1,
          type: "vertical",
          opacityFrom: 0.5,
          opacityTo: 0.1,
          stops: [0, 100, 100, 100]
        }
      },
      colors: ["#009efd"],
    tooltip: {
        theme: "dark",
        fixed: {
            enabled: !1
        },
        x: {
            show: !1
        },
        y: {
            title: {
                formatter: function (e) {
                    return ""
                }
            }
        },
        marker: {
            show: !1
        }
    },
    
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    }
};

var chart = new ApexCharts(document.querySelector("#chart3"), options);
chart.render();



 // chart 4
 var options = {
    series: [{
        name: "Orders",
        data: [35, 65, 47, 35, 44, 32, 27, 54, 44, 61]
    }],
    chart: {
        //width:150,
        height: 60,
        type: 'bar',
        sparkline: {
            enabled: !0
        },
        zoom: {
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: 1.5,
        curve: "smooth"
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#fe6225"],
          shadeIntensity: 1,
          type: "vertical",
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        }
      },
      colors: ["#ffc107"],
      plotOptions: {
        bar: {
            horizontal: false,
            borderRadius: 3,
            columnWidth: '48%',
        }
      },
    tooltip: {
        theme: "dark",
        fixed: {
            enabled: !1
        },
        x: {
            show: !1
        },
        y: {
            title: {
                formatter: function (e) {
                    return ""
                }
            }
        },
        marker: {
            show: !1
        }
    },
    
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','october','november','december'],
    }
};

var chart = new ApexCharts(document.querySelector("#chart4"), options);
chart.render();



    
    // chart 5
    var options = {
        series: [{
            name: "Sales",
            data: salesallmonths
        },
        {
            name: "profit",
            data: profitallmonths
        }],
        chart: {
            //width:150,
            foreColor: "#9ba7b2",
            height: 365,
            type: 'bar',
            toolbar: {
                show: !1,
            },
            sparkline: {
                enabled: !1
            },
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 4,
            curve: 'smooth',
            colors: ['transparent']
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                gradientToColors: ['#ffd200', '#00c6fb'],
                shadeIntensity: 1,
                type: 'vertical',
                //opacityFrom: 0.8,
                //opacityTo: 0.1,
                stops: [0, 100, 100, 100]
            },
        },
        colors: ['#ff6a00', "#005bea"],
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 4,
                borderRadiusApplication: 'around',
                borderRadiusWhenStacked: 'last',
                columnWidth: '55%',
            }
        },
        grid: {
            show: false,
            borderColor: 'rgba(0, 0, 0, 0.15)',
            strokeDashArray: 4,
        },
        tooltip: {
            theme: "dark",
            fixed: {
                enabled: !0
            },
            x: {
                show: !0
            },
            y: {
                title: {
                    formatter: function (e) {
                        return ""
                    }
                }
            },
            marker: {
                show: !1
            }
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct','Nov','Dec'],
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart5"), options);
    chart.render();



    // chart 6
    var options = {
        series: statusorders,
        chart: {
            height: 290,
            type: 'donut',
        },
        legend: {
            position: 'bottom',
            show: !1
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                gradientToColors: ['#ee0979', '#17ad37', '#ec6ead'],
                shadeIntensity: 1,
                type: 'vertical',
                opacityFrom: 1,
                opacityTo: 1,
                //stops: [0, 100, 100, 100]
            },
        },
        colors: ["#ff6a00", "#98ec2d", "#3494e6"],
        dataLabels: {
            enabled: !1
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "85%"
                }
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    height: 270
                },
                legend: {
                    position: 'bottom',
                    show: !1
                }
            }
        }]
    };
    
    document.querySelector("#penddingorder").innerText=penddingpercent+"%";
    document.querySelector("#deliveredorder").innerText=deliveredpercent+"%";
    document.querySelector("#inwayorder").innerText=inwaypercent+"%";
    document.querySelector("#totalorders").innerText=totalorders;
    var chart = new ApexCharts(document.querySelector("#chart6"), options);
    chart.render();



 // chart 7
 var options = {
    series: [{
        name: "Orders",
        data: [25, 66, 41, 59, 25, 44, 12, 36, 9, 21]
    }],
    chart: {
        //width:150,
        height: 210,
        type: 'bar',
        sparkline: {
            enabled: !0
        },
        zoom: {
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: 1.5,
        curve: "smooth"
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#ff0080"],
          shadeIntensity: 1,
          type: "vertical",
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        }
      },
      colors: ["#7928ca"],
      plotOptions: {
        bar: {
            horizontal: false,
            borderRadius: 3,
            columnWidth: '48%',
        }
      },
    tooltip: {
        theme: "dark",
        fixed: {
            enabled: !1
        },
        x: {
            show: !1
        },
        y: {
            title: {
                formatter: function (e) {
                    return ""
                }
            }
        },
        marker: {
            show: !1
        }
    },
    
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    }
};

var chart = new ApexCharts(document.querySelector("#chart7"), options);
chart.render();




    // chart 8
    var options = {
        series: [78],
        chart: {
            height: 260,
            type: 'radialBar',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 225,
                hollow: {
                    margin: 0,
                    size: '80%',
                    background: 'transparent',
                    image: undefined,
                    imageOffsetX: 0,
                    imageOffsetY: 0,
                    position: 'front',
                    dropShadow: {
                        enabled: false,
                        top: 3,
                        left: 0,
                        blur: 4,
                        opacity: 0.24
                    }
                },
                track: {
                    background: 'rgba(255, 255, 255, 0.12)',
                    strokeWidth: '67%',
                    margin: 0, // margin is in pixels
                    dropShadow: {
                        enabled: false,
                        top: -3,
                        left: 0,
                        blur: 4,
                        opacity: 0.35
                    }
                },

                dataLabels: {
                    show: true,
                    name: {
                        offsetY: -10,
                        show: false,
                        color: '#888',
                        fontSize: '17px'
                    },
                    value: {
                        offsetY: 10,
                        color: '#111',
                        fontSize: '24px',
                        show: true,
                    }
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: 'horizontal',
                shadeIntensity: 0.5,
                gradientToColors: ['#005bea'],
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100]
            }
        },
        colors: ["#98ec2d"],
        stroke: {
            lineCap: 'round'
        },
        labels: ['Total Orders'],
    };

    var chart = new ApexCharts(document.querySelector("#chart8"), options);
    chart.render();



    // chart 9
    


});