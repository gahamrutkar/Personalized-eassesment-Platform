function getColor(value) {
  if (value <= 50) {
    return '#FF6384'; // Red color for values greater than or equal to 20
  } else {
    return '#00bfea'; // Blue color for values less than 20
  }
}
async function chart(){
  const location=window.location.href.split('/');
  var quizId=location[location.length-1];
  document.getElementById('topic').innerText="Topic: "+quizId;
  var Data=await(await fetch(`/api/resp/classReportData/${quizId}`)).json();

  if(Data.scores.length==0){
    window.alert('None of the students attempted the test yet.');
    window.history.back();
  }
  topStudents=Data['scores'].sort((a,b)=>{return b.ans.gainedPoints -  a.ans.gainedPoints});
  // console.log(topStudents);
  const ctx=document.getElementById('gnattChart');
  new Chart(ctx,{
    type:'bar',
    data:{
      labels: topStudents.map(obj=>obj.stud_id),
      datasets:[{
        label: '# gained points',
        data: topStudents.map(obj=>obj.ans.gainedPoints),
        borderWidth:1,
        backgroundColor:["#FF6384","#00bfea"]
      }]
    },
    options:{
      maintainAspectRatio: false,
      responsive: true,
      plugins:{
        title:{
          display:true,
          text:'Top performing students',
          font:{
            size: 18,
            weight: 'bold'
          }
        }
      },
      indexAxis: 'y',
      scales: {
        x:{
          title:{
            display:true,
            text:'Total score'
          },
          suggestedMax:topStudents[0].ans.totalPoints
        },
        y: {
          title:{
            display:true,
            text:"Student's username"
          },
          beginAtZero: true
        }
      }
    }
  });

  new Chart(document.getElementById('score'), {
    type: 'doughnut',
    data: {
      labels: ['Completed students','Remaining students'],
      datasets: [{
        data:[Data.scores.length,Data.totalStudents],
        borderWidth: 1,
        backgroundColor: ["#FF6384","rgb(231, 229, 229)"],
        label:'No. of students'
      }],
    },
    options:{
      plugins: {
        title: {
          display: true,
          text: 'Completed attempts',
          font: {
            size: 20,
            weight: 'bold'
          }
        }
      },
      cutout:'0%',
      radius: '90%',
    }
  });

  // Extract gained points from the array of objects
  var gainedPointsData = Data.scores.map(entry => entry.ans.gainedPoints);

  // Calculate the average gained points
  var totalGainedPoints = gainedPointsData.reduce((sum, points) => sum + points, 0);
  var averageGainedPoints = (totalGainedPoints / gainedPointsData.length).toFixed();

  document.getElementById('scoreNum2').innerText=averageGainedPoints+"/"+Data.scores[0].ans.totalPoints;
  
  new Chart(document.getElementById('doughnut'), {
    type: 'doughnut',
    data: {
      labels: ['Average score','Total score'],
      datasets: [{
        data:[averageGainedPoints,Data.scores[0].ans.totalPoints],
        borderWidth: 1,
        backgroundColor: ["#019EC3","rgb(231, 229, 229)"],
        label:'Score'
      }],
    },
    options:{
      plugins: {
        title: {
          display: true,
          text: 'Average score',
          font: {
            size: 20,
            weight: 'bold'
          }
        }
      },
      cutout:'85%',
      radius: '90%',
    }
  });
  document.getElementById('scoreNum').innerText=Data.scores.length+"/"+Data.totalStudents;
  
  // new Chart(document.getElementById('pattern'), {
  //   data: {
  //     labels: Object.keys(topStudents[0].pattern.expDiffPattern),
  //     datasets: [{
  //       type: 'line',
  //       label:`Top performer's (${topStudents[0].stud_id}'s) attempt pattern`,
  //       data: topStudents[0].pattern.attemptDiffPattern.map(obj=>obj.diff),
  //       borderWidth: 2,
  //       // backgroundColor: ["#FF6384","rgb(231, 229, 229)"],
  //       // label:'Points'
  //     },
  //     {
  //       type: 'line',
  //       label:'Expected attempt pattern',
  //       data: Object.values(topStudents[0].pattern.expDiffPattern),
  //       borderWidth: 3,
  //   }],
  //   },
  //   options:{
  //     maintainAspectRatio: false,
  //     responsive: true,
  //     plugins: {
  //       title: {
  //         display: true,
  //         text: `Top performer's (${topStudents[0].stud_id}'s) attempt pattern`,
  //         font: {
  //           size: 18,
  //           weight: 'bold'
  //         }
  //       },
  //       tooltip: {
  //         callbacks: {
  //           label: function (context) {
  //             var label = (context.dataset.label.replace('Your','Chosen').replace(' attempt pattern','')) || '';
  //             if (label) {
  //               label += ' difficulty: ';
  //             }
  //             label += context.formattedValue;
  //             return label;
  //           }
  //         }
  //       }
  //     },
  //     scales:{
  //       x:{
  //         title:{
  //           display:true,
  //           text:'Visit no.'
  //         }
  //       },
  //       y:{
  //         title:
  //         {
  //           display:true,
  //           text:'Difficulty'
  //         }
  //       }
  //     }
  //   }
  // });
  var gainedPointsData = Data.scores.map(entry => entry.ans.gainedPoints);

    // Calculate frequency for each gained points value
    var frequencyData = {};
    gainedPointsData.forEach(points => {
      frequencyData[points] = (frequencyData[points] || 0) + 1;
    });

    // Prepare data for Chart.js
    var chartLabels = Object.keys(frequencyData).map(String);
    var chartData = Object.values(frequencyData);

    var newCtx = document.getElementById('pattern').getContext('2d');

    var gainedPointsDistributionChart = new Chart(newCtx, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Gained Points Distribution Curve',
          borderColor: '#FF6384',
          backgroundColor: '#ff6b8b5b',
          data: chartData,
          fill: true,
        }]
      },
      options: {
        maintainAspectRatio:false,
        responsive:true,
        plugins:{
          title:{
            text:'Marks distribution',
            display:true,
            font: {
              size: 18,
              weight: 'bold'
            },
          }
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Gained Points'
            }
          },
          y: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'Frequency'
            }
          }
        }
      }
    });

  var topicAverages = {};

  Data['scores'].forEach(studentData => {
    for (const topic in studentData.confidence) {
      if (studentData.confidence.hasOwnProperty(topic) && studentData.confidence[topic] !== null) {
        if (!topicAverages[topic]) {
          topicAverages[topic] = { sum: 0, count: 0 };
        }
        topicAverages[topic].sum += studentData.confidence[topic];
        topicAverages[topic].count++;
      }
    }
  });

  // Calculate averages and store only averages in the topicAverages object
  for (const topic in topicAverages) {
    if (topicAverages.hasOwnProperty(topic)) {
      topicAverages[topic] = topicAverages[topic].sum / topicAverages[topic].count;
    }
  }

  console.log(topicAverages);

  let values=Object.values(topicAverages);
  new Chart(document.getElementById('bar'), {
    type: 'bar',
    data: {
      labels: Object.keys(topicAverages),
      datasets: [{
      label:'Confidence',
      data: values,
      backgroundColor: values.map(getColor), // Bar color
      borderWidth: 1 // Border width
  }]
    },
    options: {
      maintainAspectRatio:false,
      responsive:true,
      plugins: {
        title: {
          display: true,
          text: 'Sub-topic wise average confidence of students',
          font: {
            size: 18,
            weight: 'bold'
          },
          
        },
        legend:{
          display:true
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              var label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              label += context.formattedValue+'%';
              return label;
            }
          }
        }
        
      },
      responsive: true,
      scales: {
        x:{
          title:{
            display:true,
            text:'Topics'
          }
        },
        y: {
          beginAtZero: true,
          title:{
            display:true,
            text:'Confidence in %'
          }
        }
      }
    }
  });

};

chart();