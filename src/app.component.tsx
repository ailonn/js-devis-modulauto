import { useState } from 'react';
import { Form, FormData } from './form.component';
import { segmentTravelDurationByArray } from './duration.logic';
import { splitDistance } from './distance.logic';
import { applyPrices, ModulAutoTravelCost } from './price.logic';

function Todo() {
    const todo: string[] = [
        'détail tarifaire - optionnel',
        'comparaison abonné / non abonné -- v1',
        'appliqué réduction long trajet (> 5j 35% tarif horaire)'
        , 'test sur les prix'
        , 'mettre à jour le README'
        , 'accessibilité'
        , 'reprendre le composant formulaire, il est quand même bien moche'
    ];
    return <>
        <br />
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
    const [result, applyResult] = useState<null | ModulAutoTravelCost>(null);

    function computeTravelCost(state: FormData) {
        const {
            km,
            cat,
            start,
            end
        } = state;
        const distanceSorted = splitDistance(+km);
        const durationSorted = segmentTravelDurationByArray(start, end);
        const details: ModulAutoTravelCost = applyPrices(cat, distanceSorted, durationSorted);
        applyResult(details);
        console.table(details);
    }

    return (
        <div className="App">
            {Form({ applyResult: computeTravelCost })}
            {result ? `le voyage a couté : ${result.subscriber.full} € pour un abonnée et ${result.unsubscriber.full} € pour un non abonnée.` : null}
            {Todo()}
        </div>
    );
}

export default App;
