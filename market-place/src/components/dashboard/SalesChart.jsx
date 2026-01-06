import React, { useState, useMemo, useCallback } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users } from 'lucide-react';

const SalesChart = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [chartType, setChartType] = useState('bar');
  const [hoveredBar, setHoveredBar] = useState(null);

  const timeRanges = useMemo(() => ({
    '7days': 'Last 7 Days',
    '30days': 'Last 30 Days',
    '90days': 'Last 3 Months',
    '1year': 'Last Year'
  }), []);

  // Generate dynamic data based on selected time range
  const generateChartData = useCallback(() => {
    const ranges = {
      '7days': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      '30days': ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      '90days': ['Jan', 'Feb', 'Mar'],
      '1year': ['Q1', 'Q2', 'Q3', 'Q4']
    };
    
    const baseSales = {
      '7days': 1000,
      '30days': 4000,
      '90days': 12000,
      '1year': 50000
    };

    const labels = ranges[timeRange];
    return labels.map((label) => {
      // Add some randomness to sales data
      const randomFactor = 0.8 + Math.random() * 0.4;
      const sales = Math.round(baseSales[timeRange] / labels.length * randomFactor);
      
      return {
        id: `${timeRange}-${label}`,
        label,
        sales,
        orders: Math.round(sales / 100 * (0.5 + Math.random())),
        customers: Math.round(sales / 50 * (0.3 + Math.random()))
      };
    });
  }, [timeRange]);

  // Use useMemo instead of useState + useEffect
  const chartData = useMemo(() => generateChartData(), [generateChartData]);

  const maxSales = Math.max(...chartData.map(d => d.sales));
  const totalSales = chartData.reduce((sum, data) => sum + data.sales, 0);
  const totalOrders = chartData.reduce((sum, data) => sum + data.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  
  // Calculate growth percentage (mock calculation)
  const growthPercentage = 15.3;

  const getBarColor = (sales) => {
    const percentage = (sales / maxSales) * 100;
    if (percentage > 80) return 'from-purple-500 to-pink-500';
    if (percentage > 60) return 'from-blue-500 to-purple-500';
    if (percentage > 40) return 'from-green-500 to-teal-500';
    return 'from-blue-400 to-cyan-400';
  };

  const stats = useMemo(() => [
    {
      id: 'total-sales',
      label: 'Total Sales',
      value: `$${totalSales.toLocaleString()}`,
      change: '+12.5%',
      icon: <DollarSign className="text-green-500" size={20} />,
      color: 'bg-gradient-to-r from-green-50 to-emerald-50',
      textColor: 'text-green-600'
    },
    {
      id: 'total-orders',
      label: 'Total Orders',
      value: totalOrders.toLocaleString(),
      change: '+8.2%',
      icon: <ShoppingBag className="text-blue-500" size={20} />,
      color: 'bg-gradient-to-r from-blue-50 to-cyan-50',
      textColor: 'text-blue-600'
    },
    {
      id: 'avg-order-value',
      label: 'Avg. Order Value',
      value: `$${avgOrderValue.toFixed(2)}`,
      change: '+5.7%',
      icon: <TrendingUp className="text-purple-500" size={20} />,
      color: 'bg-gradient-to-r from-purple-50 to-pink-50',
      textColor: 'text-purple-600'
    },
    {
      id: 'customer-growth',
      label: 'Customer Growth',
      value: `${growthPercentage}%`,
      change: '+3.1%',
      icon: <Users className="text-orange-500" size={20} />,
      color: 'bg-gradient-to-r from-orange-50 to-red-50',
      textColor: 'text-orange-600'
    }
  ], [totalSales, totalOrders, avgOrderValue, growthPercentage]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Sales Overview</h2>
            <p className="text-gray-600 mt-1">Track your sales performance</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Time Range Selector */}
            <div className="inline-flex rounded-lg border border-gray-200 p-1">
              {Object.entries(timeRanges).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTimeRange(key)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    timeRange === key
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Chart Type Toggle */}
            <div className="inline-flex rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  chartType === 'bar'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                type="button"
              >
                Bar
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  chartType === 'line'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                type="button"
              >
                Line
              </button>
            </div>

            {/* Export Button */}
            <button 
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              type="button"
            >
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 border-b border-gray-200">
        {stats.map((stat) => (
          <div 
            key={stat.id} 
            className={`${stat.color} p-4 rounded-xl border transition-transform hover:scale-105`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <h3 className={`text-2xl font-bold ${stat.textColor} mt-2`}>
                  {stat.value}
                </h3>
              </div>
              <div className="bg-white/50 p-2 rounded-lg">
                {stat.icon}
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className={`text-xs font-medium px-2 py-1 rounded ${
                stat.change.startsWith('+') 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {stat.change.startsWith('+') ? <TrendingUp size={12} className="inline mr-1" /> : <TrendingDown size={12} className="inline mr-1" />}
                {stat.change}
              </span>
              <span className="text-xs text-gray-500 ml-2">from last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Area */}
      <div className="p-6">
        {/* Y-axis labels and chart */}
        <div className="relative h-64">
          {/* Y-axis grid lines and labels */}
          <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
            {[100, 75, 50, 25, 0].map((percent) => (
              <div key={`y-axis-${percent}`} className="relative">
                <span>${Math.round(maxSales * percent / 100).toLocaleString()}</span>
                <div className="absolute right-0 top-1/2 w-full border-t border-gray-100 -translate-y-1/2"></div>
              </div>
            ))}
          </div>

          {/* Chart bars */}
          <div className="ml-12 h-full flex items-end space-x-2 lg:space-x-4">
            {chartData.map((data) => {
              const height = (data.sales / maxSales) * 100;
              const isHovered = hoveredBar === data.id;
              
              return (
                <div 
                key={data.id}
                className="flex-1 flex flex-col items-center group"
                role="button"
                tabIndex={0}
                onMouseEnter={() => setHoveredBar(data.id)}
                onMouseLeave={() => setHoveredBar(null)}
                onFocus={() => setHoveredBar(data.id)}
                onBlur={() => setHoveredBar(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setHoveredBar(data.id);
                    // You could add additional functionality here if needed
                  }
                }}
                aria-label={`View details for ${data.label}: $${data.sales.toLocaleString()} in sales, ${data.orders} orders, ${data.customers} customers`}
              >
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-10">
                      <div className="font-medium">${data.sales.toLocaleString()}</div>
                      <div className="text-gray-300 text-xs">
                        {data.orders} orders • {data.customers} customers
                      </div>
                    </div>
                  )}

                  {/* Bar */}
                  <div className="relative w-full">
                    <div
                      className={`w-full bg-gradient-to-t ${getBarColor(data.sales)} rounded-t-lg transition-all duration-300 group-hover:opacity-90 ${
                        isHovered ? 'shadow-lg' : ''
                      }`}
                      style={{ height: `${height}%` }}
                    >
                      {/* Animated shimmer effect on hover */}
                      {isHovered && (
                        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent animate-pulse"></div>
                      )}
                    </div>
                    
                    {/* Value label on bar */}
                    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-xs font-medium ${
                      height < 20 ? 'text-gray-700 -translate-y-1' : 'text-white'
                    }`}>
                      ${Math.round(data.sales / 1000)}k
                    </div>
                  </div>

                  {/* X-axis label */}
                  <div className="mt-2 text-xs text-gray-600 font-medium">
                    {data.label}
                  </div>
                  
                  {/* Additional metrics below label */}
                  <div className="mt-1 text-xs text-gray-400 space-y-0.5">
                    <div className="flex items-center justify-center">
                      <ShoppingBag size={10} className="mr-1" />
                      <span>{data.orders} orders</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Users size={10} className="mr-1" />
                      <span>{data.customers} customers</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Low Sales</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-teal-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Medium Sales</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">High Sales</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Peak Sales</span>
          </div>
        </div>

        {/* Time Range Summary */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <p className="text-gray-600">
                Showing data for <span className="font-bold">{timeRanges[timeRange].toLowerCase()}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {growthPercentage > 0 ? (
                  <span className="text-green-600">
                    <TrendingUp size={14} className="inline mr-1" />
                    {growthPercentage}% growth from previous period
                  </span>
                ) : (
                  <span className="text-red-600">
                    <TrendingDown size={14} className="inline mr-1" />
                    {Math.abs(growthPercentage)}% decline from previous period
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                type="button"
              >
                Detailed Report
              </button>
              <button 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                type="button"
              >
                Compare Periods
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;