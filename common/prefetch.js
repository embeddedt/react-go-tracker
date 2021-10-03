import fetcher from '~/common/fetcher';
import { mutate, cache } from 'swr';

function prefetch(path) {
    if(!cache.has(path))
        mutate(path, fetcher(path));
}
export default prefetch;