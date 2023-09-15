import { MdShowChart } from 'react-icons/md';
import { SetModal } from '../types/ClientsType'

const setModal = (show: boolean): SetModal => {
    return {
        type: 'SET_MODAL',
        payload: show,
    };
};

const exportDefault = {
    setModal
}

export default exportDefault
