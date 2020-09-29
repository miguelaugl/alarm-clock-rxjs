import React, { useState, useEffect } from 'react';
import { interval, of, concat, Subject } from 'rxjs';
import {
  takeUntil,
  takeWhile,
  startWith,
  scan,
  repeatWhen,
  share,
  filter,
} from 'rxjs/operators';

import './App.css';

const countdown$ = interval(1000).pipe(
    startWith(5),
    scan(time => time - 1),
    takeWhile(time => time > 0),
  ).pipe(share());

const action$ = new Subject();
const snooze$ = action$.pipe(filter(action => action === 'soneca'));
const dismiss$ = action$.pipe(filter(action => action === 'desativar'));

const snoozeableAlarm$ = concat(countdown$, of('Wake up')).pipe(
  repeatWhen(() => snooze$)
);

const observable$ = concat(snoozeableAlarm$.pipe(
  takeUntil(dismiss$)
), of('Have a nice day! 🐳'));

function App() {
  const [state, setState] = useState();

  useEffect(() => {
    const sub = observable$.subscribe(setState);

    return () => sub.unsubscribe();
  }, []);

  return (
    <>
      <h1>Alarme</h1>
      <h1>{state}</h1>
      <section>
        <button onClick={() => action$.next('soneca')}>Soneca</button>
        <button onClick={() => action$.next('desativar')}>Desativar</button>
      </section>
    </>
  );
}

export default App;
