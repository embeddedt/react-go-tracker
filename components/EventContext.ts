
import { createContext, useContext, useEffect } from 'react';
import type { Emitter, EventType, Handler } from 'mitt';

const EventContext = createContext<Emitter>(null);

const useEmitterContext = () => useContext(EventContext);

function useEventHandler<T = any>(event: EventType, handler: Handler<T>, extraDeps?: any[]): void {
    const eventBus = useEmitterContext();
    useEffect(() => {
        eventBus.on(event, handler);
        return () => {
            eventBus.off(event, handler);
        }
    }, [ eventBus, event, handler ].concat(extraDeps || []));
}

export { EventContext, useEmitterContext, useEventHandler }; 