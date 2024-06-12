
import React from 'react'
import ReactApexChart from 'react-apexcharts'
import ApiLoadingOverlay from '~/components/Common/ApiLoadingOverlay'

export interface TimelineCharstProps {
    listBoardInfo: any
}

interface ChartData {
    series: number[]
    labels: string[]
}

const buildTimeLineChartData = (listBoardInfo: any): ChartData => {
    const series: number[] = []
    const labels: string[] = []

    listBoardInfo.map((boardInfo: any) => {
        const boardName = boardInfo.title
        let countTotalTask = 0
        let countTotalFinishedTask = 0
        let isHaveAnyTask = false

        boardInfo?.columns.map((column: any) => {
            let countCard = 0
            let countFinsihedCard = 0

            let isHaveTask = false
            column?.cards.map((card: any) => {
                if (!card.fromDate || !card.deadlineDate) return
                isHaveTask = true
                countCard++
                if (card.workingStatus === 1) {
                    countFinsihedCard++
                }
            })

            if (isHaveTask) {
                isHaveAnyTask = true
                countTotalTask += countCard
                countTotalFinishedTask += countFinsihedCard
            }
        })

        if (isHaveAnyTask) {
            const percent = Math.round((countTotalFinishedTask / countTotalTask) * 100)
            series.push(percent)
            labels.push(boardName)
        }
    })

    return {
        series,
        labels
    } as ChartData
}

const TaskWorkingStatusByBoardChart: React.FC<TimelineCharstProps> = ({ listBoardInfo }) => {
    const [data, setData] = React.useState(null)

    const buildData = async () => {

        const chartData = await buildTimeLineChartData(listBoardInfo)

        setData({
            series: chartData.series,
            options: {
                chart: {
                    height: 350,
                    type: 'radialBar'
                },
                plotOptions: {
                    radialBar: {
                        dataLabels: {
                            name: {
                                fontSize: '22px'
                            },
                            value: {
                                fontSize: '16px'
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                formatter: function (w: any) {
                                    const series = w?.config?.series
                                    const avg = parseFloat((series.reduce((a: number, b: number) => a + b, 0) / series.length).toFixed(2));
                                    return `${avg}%`
                                }
                            }
                        }
                    }
                },
                labels: chartData.labels
            }
        })
    }

    React.useEffect(() => {
        if (!listBoardInfo) return
        buildData()
    }, [listBoardInfo])

    if (!data) {
        return (
            <ApiLoadingOverlay />
        )
    }

    return (
        <ReactApexChart options={data.options} series={data.series} type="radialBar" height={350} />
    )
}

export default TaskWorkingStatusByBoardChart