var draw = false;

init(current_dat);

$("#current").click( function()
  {
    table.destroy();
    init(current_dat);
    $("#label").html();
    $("#label").html('Current');

  }
);

$("#remedial").click( function()
  {
    table.destroy();
    init(future_dat);
    $("#label").html();
    $("#label").html('Remedial');
  }
);


/**
 * FUNCTIONS
 */

 var table;

function init(x) {
  // initialize DataTables
  table = $("#dt-table").DataTable({
    destroy: true,
    length: 18,
    paging: false,
    data: x,
    columns: [
      { "data": "district" },
      { "data": "trumpp" },
      { "data": "clintonp" },
      { "data": "toomeyp" },
      { "data": "mcgintyp" },
      { "data": "clintonper" },
      { "data": "trumpperc"},
      { "data": "clintdiff"}
    ]}
  );
  // get table data
  var tableData = getTableData(table);
  // create Highcharts
  createHighcharts(tableData);
  // table events
  setTableEvents(table);
}

function getTableData(table) {
  var dataArray = [],
      districtArray = [],
      clintonArray = [],
      trumpArray = [];

  // loop table rows
  table.rows({ search: "applied" }).every(function () {
    var data = this.data();
    districtArray.push(data.district);
    clintonArray.push(data.clintonper);
    trumpArray.push(data.trumpperc);
  });

  // store all data in dataArray
  dataArray.push(districtArray, clintonArray, trumpArray);

  return dataArray;
}

function createHighcharts(data) {
  Highcharts.setOptions({
    lang: {
      thousandsSep: ","
    }
  });

  Highcharts.chart("chart", {
    title: {
      text: "PA 2016 Election Results"
    },
    subtitle: {
      text: "% Vote per Presidential Candidate"
    },
    xAxis: [{
      categories: data[0],
      title: { text: "Current PA Congressional Districts"},
      labels: {
        rotation: -45
      }
    }],
    yAxis: [{
      // first yaxis
      title: {
        text: "% Vote per Candidate"
      }
    },
    // {
    //   // secondary yaxis
    //   title: {
    //     text: "Density (P/Km²)"
    //   },
    //   min: 0,
    //   opposite: true
    // }
  ],
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: true,
                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
            }
        }
    },
    series: [{
      name: "clinton",
      color: "#0071A7",
      type: "column",
      data: data[1],
      // tooltip: {
      //   valueSuffix: " M"
      // }
    }, {
      name: "trump",
      color: "#FF404E",
      type: "column",
      data: data[2],
      // yAxis: 1
    }],
    tooltip: {
      shared: true
    },
    legend: {
      backgroundColor: "#ececec",
      shadow: true
    },
    credits: {
      enabled: false
    },
    noData: {
      style: {
        fontSize: "16px"
      }
    }
  });
}

function setTableEvents(table) {
  // listen for page clicks
  table.on("page", function () {
    draw = true;
  });

  // listen for updates and adjust the chart accordingly
  table.on("draw", function () {
    if (draw) {
      draw = false;
    } else {
      var tableData = getTableData(table);
      createHighcharts(tableData);
    }
  });
}
