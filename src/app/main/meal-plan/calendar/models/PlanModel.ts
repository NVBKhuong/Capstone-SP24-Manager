import _ from '@lodash';
import { DeepPartial } from 'react-hook-form';
import formatISO from 'date-fns/formatISO';
import { PlanType } from '../types/PlanType';

/**
 * The event model.
 */
const PlanModel = (data?: DeepPartial<PlanType>): DeepPartial<PlanType> =>
	_.defaults(data || {}, {
		id: _.uniqueId(),
		from: formatISO(new Date()),
		to: formatISO(new Date()),
	});

export default PlanModel;
