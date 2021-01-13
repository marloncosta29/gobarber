import { createConnections } from 'typeorm';

createConnections()
  .then(con => {
    console.log('bancos conectados');
  })
  .catch(error => console.log(error));
