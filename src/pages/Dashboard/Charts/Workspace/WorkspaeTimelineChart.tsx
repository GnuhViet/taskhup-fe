import moment from 'moment'
import React from 'react'
import ReactApexChart from 'react-apexcharts'
import ApiLoadingOverlay from '~/components/Common/ApiLoadingOverlay'

export interface Series {
    data: SeriesData[]
}

export interface SeriesData {
    x: string // task title
    y: any[] // start and end date
    // fillColor: string // board color
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
    listBoardInfo: any
}

const buildTimeLineChartData = (listBoardInfo: any): Series[] => {
    const series: Series[] = []

    // oder board by start date
    // need to clone obj
    const sortedBoard = [...listBoardInfo]
        .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())


    sortedBoard.forEach((board: any) => {
        const data: SeriesData[] = []

        if (!board.startDate || !board.endDate) return

        data.push({
            x: board.title,
            y: [new Date(board.startDate).getTime(), new Date(board.endDate).getTime()]
            // fillColor: board.color // give random hex color
        })

        series.push({
            data: data
        })
    })

    return series
}

const WorkspaeTimelineChart: React.FC<TimelineCharstProps> = ({ listBoardInfo }) => {
    const [data, setData] = React.useState(null)

    const buildData = async () => {

        const series = await buildTimeLineChartData(listBoardInfo)

        setData({
            series: series,
            options: options
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
        <ReactApexChart options={data.options} series={data.series} type="rangeBar" height={'94%'} width={'100%'} />
    )
}

export default WorkspaeTimelineChart