
import { createContext, useContext, useEffect } from 'react';
import type { Emitter, EventType, Handler } from 'mitt';

const EventContext = createContext<Emitter>(null);

const useEmitterContext = () => useContext(EventContext);

/**
 * Helper hook for React components to attach to an event when mounted and detach when unmounted.
 * @param event Event to attach to
 * @param handler Callback for event
 * @param extraDeps Extra dependencies to rerun the hook on
 */
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