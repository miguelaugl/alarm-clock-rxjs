import React, { useState, useEffect } from 'react';
import { interval } from 'rxjs';
import { takeUntil, takeWhile, startWith, scan } from 'rxjs/operators';

import './App.css';

const observable$ = interval(1000).pipe(
  startWith(5),
  scan(time => time - 1),
  takeWhile(time => time > 0)
);

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
    </>
  );
}

export default App;
