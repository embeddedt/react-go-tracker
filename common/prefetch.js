import fetcher from '~/common/fetcher';
import { mutate } from 'swr';

function prefetch(path) {
    mutate(path, fetcher(path));
}
export default prefetch;