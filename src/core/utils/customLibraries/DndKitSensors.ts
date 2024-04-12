import {
    MouseSensor as DndKitMouseSensor,
    TouchSensor as DndKitTouchSensor
} from '@dnd-kit/core'
import React from 'react'

// Block DnD event propagation if element have "data-no-dnd" attribute
const handler = ({ nativeEvent: event }: React.MouseEvent | React.TouchEvent) => {
    let cur = (event.target as HTMLElement)
    while (cur) {
        if (cur.dataset && cur.dataset.noDnd) {
            return false
        }
        cur = cur.parentElement
    }
    return true
}

export class MouseSensor extends DndKitMouseSensor {
    static activators = DndKitMouseSensor.activators.concat([{ eventName: 'onMouseDown', handler }])
}

export class TouchSensor extends DndKitTouchSensor {
    static activators = DndKitTouchSensor.activators.concat([{ eventName: 'onTouchStart', handler }])
}
