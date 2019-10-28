import React, { useState, useEffect } from 'react'
import ReactHighcharts from 'react-highcharts'
import * as Highcharts from 'highcharts'
import { useSelector } from 'react-redux'
import { RootState } from '../modules'

interface HighchartProps {
  config: Highcharts.Options
}

function Highchart({ config }: HighchartProps) {
  const dark = useSelector((state: RootState) => state.theme.dark)
  const [defaultTheme, setDefaultTheme] = useState<Highcharts.Options>({})
  const [darkTheme, setDarkTheme] = useState<Highcharts.Options>({
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
    console.log('dark:', dark)
    if (!dark) {
      setDefaultTheme({
        colors: [
          '#5f98cf',
          '#434348',
          '#49a65e',
          '#f45b5b',
          '#708090',
          '#b68c51',
          '#397550',
          '#c0493d',
          '#4f4a7a',
          '#b381b3'
        ],
        chart: {},
        title: config.title,
        subtitle: {},
        xAxis: config.xAxis,
        yAxis: config.yAxis,
        tooltip: {},
        plotOptions: config.plotOptions,
        legend: {},
        credits: {},
        labels: {},
        drilldown: {},
        navigation: {},
        series: config.series
      })
    } else {
      setDefaultTheme({
        colors: config.colors ? config.colors : darkTheme.colors,
        chart: darkTheme.chart,
        title: {
          ...JSON.parse(JSON.stringify(config.title)),
          ...JSON.parse(JSON.stringify(darkTheme.title))
        },
        subtitle: darkTheme.subtitle,
        xAxis: {
          ...JSON.parse(JSON.stringify(config.xAxis)),
          ...JSON.parse(JSON.stringify(darkTheme.xAxis))
        },
        yAxis: {
          ...config.yAxis,
          ...darkTheme.yAxis
        },
        tooltip: darkTheme.tooltip,
        plotOptions: {
          ...JSON.parse(JSON.stringify(config.plotOptions)),
          ...JSON.parse(JSON.stringify(darkTheme.plotOptions))
        },
        legend: darkTheme.legend,
        credits: darkTheme.credits,
        labels: darkTheme.labels,
        drilldown: darkTheme.drilldown,
        navigation: darkTheme.navigation,
        series: config.series
      })
    }
    // eslint-disable-next-line
  }, [dark])
  return <ReactHighcharts config={defaultTheme} />
}

export default Highchart