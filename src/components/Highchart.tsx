import React, { useState, useEffect } from 'react'
import ReactHighcharts from 'react-highcharts'
import * as Highcharts from 'highcharts'

interface HighchartProps {
  config: Highcharts.Options
}

function Highchart({ config }: HighchartProps) {
  const [defaultTheme, setDefaultTheme] = useState<Highcharts.Options>({
    colors: [
      '#a6f0ff',
      '#70d49e',
      '#e898a5',
      '#007faa',
      '#f9db72',
      '#f45b5b',
      '#1e824c',
      '#e7934c',
      '#dadfe1',
      '#a0618b'
    ],
    chart: {
      backgroundColor: '#1f1f20',
      plotBorderColor: '#606063'
    },
    title: {
      style: {
        color: '#F0F0F3'
      }
    },
    subtitle: {
      style: {
        color: '#F0F0F3'
      }
    },
    xAxis: {
      gridLineColor: '#707073',
      labels: {
        style: {
          color: '#F0F0F3'
        }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      title: {
        style: {
          color: '#F0F0F3'
        }
      }
    },
    yAxis: {
      gridLineColor: '#707073',
      labels: {
        style: {
          color: '#F0F0F3'
        }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      title: {
        style: {
          color: '#F0F0F3'
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      style: {
        color: '#F0F0F3'
      }
    },
    plotOptions: {
      series: {
        dataLabels: {
          color: '#F0F0F3'
        },
        marker: {
          lineColor: '#333'
        }
      },
      boxplot: {
        fillColor: '#505053'
      },
      errorbar: {
        color: 'white'
      }
    },
    legend: {
      backgroundColor: 'transparent',
      itemStyle: {
        color: '#F0F0F3'
      },
      itemHoverStyle: {
        color: '#FFF'
      },
      itemHiddenStyle: {
        color: '#606063'
      },
      title: {
        style: {
          color: '#D0D0D0'
        }
      }
    },
    credits: {
      style: {
        color: '#F0F0F3'
      }
    },
    labels: {
      style: {
        color: '#707073'
      }
    },
    drilldown: {
      activeAxisLabelStyle: {
        color: '#F0F0F3'
      },
      activeDataLabelStyle: {
        color: '#F0F0F3'
      }
    },
    navigation: {
      buttonOptions: {
        symbolStroke: '#DDDDDD',
        theme: {
          fill: '#505053'
        }
      }
    }
  })

  useEffect(() => {
    setDefaultTheme({
      colors: config.colors ? config.colors : defaultTheme.colors,
      chart: defaultTheme.chart,
      title: {
        ...JSON.parse(JSON.stringify(config.title)),
        ...JSON.parse(JSON.stringify(defaultTheme.title))
      },
      subtitle: defaultTheme.subtitle,
      xAxis: {
        ...JSON.parse(JSON.stringify(config.xAxis)),
        ...JSON.parse(JSON.stringify(defaultTheme.xAxis))
      },
      yAxis: {
        ...config.yAxis,
        ...JSON.parse(JSON.stringify(defaultTheme.yAxis))
      },
      tooltip: defaultTheme.tooltip,
      plotOptions: {
        ...JSON.parse(JSON.stringify(config.plotOptions)),
        ...JSON.parse(JSON.stringify(defaultTheme.plotOptions))
      },
      legend: defaultTheme.legend,
      credits: defaultTheme.credits,
      labels: defaultTheme.labels,
      drilldown: defaultTheme.drilldown,
      navigation: defaultTheme.navigation,
      series: config.series
    })
    // eslint-disable-next-line
  }, [])
  return <ReactHighcharts config={defaultTheme} />
}

export default Highchart
