import moment from 'moment'
import React from 'react'
import ReactApexChart from 'react-apexcharts'
import ApiLoadingOverlay from '~/components/Common/ApiLoadingOverlay'

export interface Series {
    name: string // column title
    data: SeriesData[]
}

export interface SeriesData {
    x: string // task title
    y: any[] // start and end date
}

const options = {
    chart: {
        height: 1000,
        type: 'rangeBar',
        width: 1000
    },
    plotOptions: {
        bar: {
            horizontal: true,
            barHeight: '90%'
        }
    },
    dataLabels: {
        enabled: true,
        formatter: function (val: any) {
            const a = moment(val[0])
            const b = moment(val[1])
            const diff = b.diff(a, 'days')
            return diff + (diff > 1 ? ' days' : ' day')
        }
    },
    xaxis: {
        type: 'datetime'
    },
    stroke: {
        width: 1
    },
    fill: {
        type: 'solid',
        opacity: 0.6
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left'
    }
}

export interface TimelineCharstProps {
    boardInfo: any
}

const buildTimeLineChartData = (boardInfo: any): Series[] => {
    const series: Series[] = []

    // sort columns by boardInfo.columnOrderIds (id,id,id)
    const sortedColumns = [...boardInfo.columns].sort((a: any, b: any) => {
        return boardInfo.columnOrderIds.indexOf(a.id) - boardInfo.columnOrderIds.indexOf(b.id)
    })

    sortedColumns?.map((column: any) => {
        const name = column.title

        const seriesData: SeriesData[] = []

        // sort cards by column.cardOrderIds (id,id,id)
        const sortedCards = [...column.cards].sort((a: any, b: any) => {
            return column.cardOrderIds.indexOf(a.id) - column.cardOrderIds.indexOf(b.id)
        })

        sortedCards?.map((card: any) => {
            const members = card.members.map((member: any) => member.fullName).join(', ')

            if (!card.fromDate || !card.deadlineDate) return

            const data: SeriesData = {
                x: `${card.title} by ${members}`,
                y: [new Date(card.fromDate).getTime(), new Date(card.deadlineDate).getTime()]
            }

            seriesData.push(data)
        })

        const serie: Series = {
            name: name,
            data: seriesData
        }

        series.push(serie)
    })

    return series
}

const TaskTimelineChart: React.FC<TimelineCharstProps> = ({ boardInfo }) => {
    const [data, setData] = React.useState(null)

    const buildData = async () => {

        const series = await buildTimeLineChartData(boardInfo)

        setData({
            series: series,
            options: options
        })
    }

    React.useEffect(() => {
        if (!boardInfo) return
        buildData()
    }, [boardInfo])

    if (!data) {
        return (
            <ApiLoadingOverlay />
        )
    }

    return (
        <ReactApexChart options={data.options} series={data.series} type="rangeBar" height={'94%'} width={'100%'} />
    )
}

export default TaskTimelineChart