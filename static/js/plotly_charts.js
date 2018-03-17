// Scatterplot
trace1 = {
  x: ['Automotive', 'Bars & Restaurants', 'Businesses & Tech', 'Education', 'Entertainment', 'Grocery Stores', 'Health & Wellness', 'Misc Retail', 'Other', 'Service Industry'], 
  y: [3.560040937, 3.472300184, 3.613380282, 3.990036232, 3.646175921, 3.674821878, 3.834377538, 3.609672601, 3.364590463, 3.762786596], 
  marker: {
    color: 'red', 
    line: {
      color: 'red', 
      width: 3
    }, 
    size: [8.63, 47.102, 4.817, 2.043, 19.468, 8.262, 24.893, 7.449, 4.099, 31.759], 
    sizesrc: 'j_dubbs:1:d5a0fc'
  }, 
  mode: 'markers', 
  name: 'Reviews', 
  type: 'scatter', 
  uid: '96226c', 
  xsrc: 'j_dubbs:1:0544c6', 
  ysrc: 'j_dubbs:1:abf1e1'
};
data = [trace1];
layout = {
  title: 'Average Category Rating', 
  xaxis: {
    autorange: true, 
    range: [-0.576365300566, 9.73879679852], 
    // title: 'Business Category', 
    type: 'category', 
    zeroline: false
  }, 
  yaxis: {
    autorange: true, 
    range: [3.32431931253, 4.03030738247], 
    title: '# of Stars', 
    type: 'linear', 
    zeroline: false
  }
};
Plotly.plot('plotly-bubble', {
  data: data,
  layout: layout
});

// Bar Chart
trace2 = {
  x: ['Automotive', 'Bars & Restaurants', 'Businesses & Tech', 'Education', 'Entertainment', 'Grocery Stores', 'Health & Wellness', 'Misc Retail', 'Other', 'Service Industry'], 
  y: [8630, 47102, 4817, 2043, 19468, 8262, 24893, 7449, 4099, 31759], 
  marker: {color: 'red'}, 
  name: 'Reviews', 
  type: 'bar', 
  uid: 'cbe158', 
  xsrc: 'j_dubbs:3:0b6a81', 
  ysrc: 'j_dubbs:3:938b39'
};
data = [trace2];
layout = {
  title: 'Total # of Reviews per Category', 
  xaxis: {
    autorange: true, 
    range: [-0.5, 9.5], 
    type: 'category', 
    zeroline: false
  }, 
  yaxis: {
    autorange: true, 
    range: [0, 49581.0526316], 
    type: 'linear',
    title: '# of Reviews', 
    zeroline: false
  }
};
Plotly.plot('plotly-bar', {
  data: data,
  layout: layout
});
