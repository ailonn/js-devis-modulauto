
import { Fragment, useState } from 'react';
import { renderRadioInputs } from './input_render.component';
import { DateTime } from 'luxon';

export type FormData = {
    km: number,
    cat: string,
    start: DateTime,
    end: DateTime
};

export function Form(props: { applyResult: Function }) {
    const { applyResult } = props;
    const [inputs, setInputs] = useState<FormData>({
        km: 10
        , cat: 'A'
        , start: DateTime.now()
        , end: DateTime.now()
    })
    function onChange(event: any) {
        const { target: { name, value } } = event;
        if (name === 'end' || name === 'start') {
            setInputs(values => ({ ...values, [name]: DateTime.fromISO(value) }));
        } else {
            setInputs(values => ({ ...values, [name]: value }));
        }
    }
    function computeTravelCost() {
        if (applyResult) {
            applyResult(inputs);
        }
    }
    return (
        <Fragment>
            <p>Catégorie du véhicule:</p>
            {renderRadioInputs({ name: 'cat', values: ['A', 'B', 'C', 'D'], onChangeMethod: onChange, required: true })}
            <label htmlFor='km'>Kilomètres parcouru :</label>
            <br />
            <input id='km' type='number' name='km' min='0' step='1' onChange={onChange} defaultValue={inputs.km} />
            <br />
            <label htmlFor='startDate'>Date et heure de début :</label>
            <br />
            <input id='startDate' type='datetime-local' name='start' onChange={onChange} />
            <br />
            <label htmlFor='endDate'>Date et heure de retour du véhicule :</label>
            <br />
            <input id='endDate' type='datetime-local' name='end' onChange={onChange} />
            <br />
            <input type='button' value='Calculer' onClick={() => computeTravelCost()} />
            <br />
        </Fragment>
    );
}

