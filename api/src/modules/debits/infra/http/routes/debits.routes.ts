import { Router } from 'express';

import DebitsRepository from '@modules/debits/infra/typeorm/repositories/DebitsRepository';
import CreateDebitService from '@modules/debits/services/CreateDebitService';
import UpdateDebitService from '@modules/debits/services/UpdateDebitService';
import DeleteDebitService from '@modules/debits/services/DeleteDebitService';

const debitsRouter = Router();

debitsRouter.get('/', async (request, response) => {
  const { client_id } = request.query;

  const debitsRepository = new DebitsRepository();
  const debits = await debitsRepository.findAll(String(client_id));

  return response.json(debits);
});

debitsRouter.get('/:client_id', async (request, response) => {
  const { client_id }: number = request.params;
  const debitsRepository = new DebitsRepository();
  const debits = await debitsRepository.findByClient(client_id);

  return response.json(debits);
});

debitsRouter.get('/id/:id', async (request, response) => {
  const { id }: string = request.params;
  const debitsRepository = new DebitsRepository();
  const debits = await debitsRepository.findById(id);

  return response.json(debits);
});

debitsRouter.post('/', async (request, response) => {
  const { client_id, client_name, reason, date, amount } = request.body;

  const debitsRepository = new DebitsRepository();
  const createDebit = new CreateDebitService(debitsRepository);

  const debit = await createDebit.execute({
    client_id,
    client_name,
    reason,
    date,
    amount,
  });

  return response.json(debit);
});

debitsRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const { client_id, client_name, reason, date, amount } = request.body;

  const debitsRepository = new DebitsRepository();
  const updateDebit = new UpdateDebitService(debitsRepository);

  const debit = await updateDebit.execute({
    id,
    client_id,
    client_name,
    reason,
    date,
    amount,
  });

  return response.json(debit);
});

debitsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const { client_id }: number = request.query;

  const debitsRepository = new DebitsRepository();
  const deleteDebit = new DeleteDebitService(debitsRepository);

  const debit = await deleteDebit.execute({
    id,
    client_id,
  });

  return response.json(debit);
});

export default debitsRouter;
