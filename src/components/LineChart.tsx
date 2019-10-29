import React, { useState, useEffect } from 'react'
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useSelector } from 'react-redux'
import { RootState } from '../modules'

interface HighchartProps {
  config: Highcharts.Options
}

const LineChart = ({ config }: HighchartProps) => {
  const dark = useSelector((state: RootState) => state.theme.dark)
  const [defaultTheme, setDefaultTheme] = useState<Highcharts.Options>({})
  const darkTheme: Highcharts.Options = {
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
      },
      text: ''
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
      line: {
        animation: false
      },
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
  }

  useEffect(() => {
    if (!dark) {
      console.log('dark false', dark)
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
        chart: {
          backgroundColor: '#fff',
          plotBorderColor: '#335cad'
        },
        title: {
          text: ''
        },
        subtitle: {},
        xAxis: {
          ...config.xAxis,
          gridLineColor: '#e6e6e6',
          labels: {
            style: {
              color: '#333'
            }
          },
          lineColor: '#e6e6e6',
          minorGridLineColor: '#f2f2f2',
          tickColor: '#f2f2f2',
          title: {
            style: {
              color: '#666'
            }
          }
        },
        yAxis: {
          ...config.yAxis,
          gridLineColor: '#e6e6e6',
          labels: {
            style: {
              color: '#666'
            }
          },
          lineColor: '#e6e6e6',
          minorGridLineColor: '#f2f2f2',
          tickColor: '#ccebe6',
          title: {
            style: {
              color: '#666'
            }
          }
        },
        tooltip: {
          backgroundColor: '#F0F0F3',
          style: {
            color: '#rgba(0, 0, 0, 0.85)'
          }
        },
        plotOptions: {
          line: {
            animation: false
          }
        },
        legend: {
          itemStyle: {
            color: '#666'
          },
          itemHoverStyle: {
            color: '#222'
          },
          itemHiddenStyle: {
            color: '#e6e6e6'
          },
          title: {
            style: {
              color: '#666'
            }
          }
        },
        credits: {},
        drilldown: {},
        navigation: {},
        series: config.series
      })
    } else {
      console.log('dark true', dark)
      setDefaultTheme({
        colors: config.colors ? config.colors : darkTheme.colors,
        chart: config.chart
          ? {
              ...JSON.parse(JSON.stringify(config.chart)),
              ...JSON.parse(JSON.stringify(darkTheme.chart))
            }
          : darkTheme.chart,
        title: config.title
          ? {
              ...JSON.parse(JSON.stringify(config.title)),
              ...JSON.parse(JSON.stringify(darkTheme.title))
            }
          : darkTheme.title,
        subtitle: darkTheme.subtitle,
        xAxis: config.xAxis
          ? {
              ...JSON.parse(JSON.stringify(config.xAxis)),
              ...JSON.parse(JSON.stringify(darkTheme.xAxis))
            }
          : darkTheme.xAxis,
        yAxis: config.yAxis
          ? {
              ...config.yAxis,
              ...darkTheme.yAxis
            }
          : darkTheme.yAxis,
        tooltip: config.tooltip
          ? {
              ...JSON.parse(JSON.stringify(config.tooltip)),
              ...JSON.parse(JSON.stringify(darkTheme.tooltip))
            }
          : darkTheme.tooltip,
        plotOptions: config.plotOptions
          ? {
              ...JSON.parse(JSON.stringify(config.plotOptions)),
              ...JSON.parse(JSON.stringify(darkTheme.plotOptions))
            }
          : darkTheme.plotOptions,
        legend: darkTheme.legend,
        credits: darkTheme.credits,
        drilldown: darkTheme.drilldown,
        navigation: darkTheme.navigation,
        series: config.series
      })
    }
    // eslint-disable-next-line
  }, [dark])
  return <HighchartsReact highcharts={Highcharts} options={defaultTheme} />
}

export default LineChart
