trace1 = {
  x: ['Automotive', 'Bars & Restaurants', 'Business & Tech Services', 'Education', 'Entertainment & Leisure', 'Food & Grocery Stores', 'Health & Wellness', 'Misc Retail', 'Other', 'Service Industry'], 
  y: [8630, 47102, 4817, 2043, 19468, 8262, 24893, 7449, 4099, 31759], 
  marker: {color: 'red'}, 
  name: 'Reviews', 
  type: 'bar', 
  uid: 'cbe158', 
  xsrc: 'j_dubbs:3:0b6a81', 
  ysrc: 'j_dubbs:3:938b39'
};
data = [trace1];
layout = {
  title: 'Yelp Businesses: Number of Reviews', 
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
    zeroline: false
  }
};
Plotly.plot('plotly-div', {
  data: data,
  layout: layout
});