import { useState } from 'react';
import { Form, FormData } from './form.component';
import { segmentTravelDurationByArray } from './duration.logic';
import { splitDistance } from './distance.logic';
import { applyPrices } from './price.logic';

function Todo() {
    const todo: string[] = [
        'détail tarifaire',
        'comparaison abonné / non abonné',
        'appliqué réduction long trajet (> 5j 35% tarif horaire)'
        , 'test sur les prix'
        , 'mettre à jour le README'
    ];
    return <>
        TODO :<br />
        {
            todo.map((task) =>
                <>
                    - {task} < br />
                </>
            )
        }
    </>
}

function App() {
    const [result, applyResult] = useState<null | number>(null);

    function computeTravelCost(state: FormData) {
        const {
            km,
            cat,
            start,
            end,
            subscriber
        } = state;
        const distanceSorted = splitDistance(+km);
        const durationSorted = segmentTravelDurationByArray(start, end);
        const details = applyPrices(cat, subscriber, distanceSorted, durationSorted);
        applyResult(details.cost + 1.5);
        console.table({ ...details, cost: details.cost + 1.5 });
    }

    return (
        <div className="App">
            {Form({ applyResult: computeTravelCost })}
            {result ? `le voyage a couté : ${result} €` : null}
            {Todo()}
        </div>
    );
}

export default App;
