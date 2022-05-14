import { Fragment, ChangeEventHandler } from 'react';

type renderRadioInputsProps = {
    name: string
    , values: string[]
    , onChangeMethod: ChangeEventHandler<HTMLInputElement>
    , required: boolean
};

export function renderRadioInputs({ name, values, onChangeMethod, required } : renderRadioInputsProps) {
    return values.map((value : string) => {
        return (
            <Fragment key={value}>
                <input type='radio' name={name} onChange={onChangeMethod} value={value} id={value} required={required} />
                <label htmlFor={value}>{value}</label><br />
            </Fragment>
        );
    });
}
