import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

export const GasChart = ({ dataPoints, isDanger }) => {
  // Simple mocked chart using SVG
  const width = 300;
  const height = 150;
  const padding = 20;

  // We mock a curve since we don't have a real charting library that looks perfect out of the box
  // Let's generate a path based on dataPoints
  const maxVal = Math.max(...dataPoints, 2000);
  const minVal = 0;
  
  const stepX = (width - padding * 2) / (dataPoints.length - 1 || 1);
  
  const getY = (val) => height - padding - ((val - minVal) / (maxVal - minVal)) * (height - padding * 2);
  
  let d = `M ${padding} ${getY(dataPoints[0] || 0)}`;
  dataPoints.forEach((val, i) => {
    if (i > 0) {
      // Create a smooth curve
      const prevX = padding + (i - 1) * stepX;
      const prevY = getY(dataPoints[i - 1]);
      const currX = padding + i * stepX;
      const currY = getY(val);
      const cpX1 = prevX + stepX / 2;
      const cpX2 = currX - stepX / 2;
      d += ` C ${cpX1} ${prevY}, ${cpX2} ${currY}, ${currX} ${currY}`;
    }
  });

  const pathColor = isDanger ? '#FF4D4D' : '#2ECC71';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gas Level History</Text>
      <View style={styles.chartContainer}>
        <Svg width={width} height={height}>
          <Defs>
            <SvgLinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={pathColor} stopOpacity="0.3" />
              <Stop offset="1" stopColor={pathColor} stopOpacity="0.0" />
            </SvgLinearGradient>
          </Defs>
          
          <Path 
            d={`${d} L ${padding + (dataPoints.length - 1) * stepX} ${height - padding} L ${padding} ${height - padding} Z`} 
            fill="url(#grad)" 
          />
          <Path 
            d={d} 
            fill="none" 
            stroke={pathColor} 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          
          {dataPoints.map((val, i) => (
            <Circle 
              key={i}
              cx={padding + i * stepX} 
              cy={getY(val)} 
              r="4" 
              fill={pathColor} 
              stroke="#151e2f"
              strokeWidth="2"
            />
          ))}
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#151e2f',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: '#a0abc0',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    alignSelf: 'flex-start'
  },
  chartContainer: {
    width: 300,
    height: 150,
  }
});
